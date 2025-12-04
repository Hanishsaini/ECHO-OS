from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session
from app.database import models
from app.database.database import engine
from app.schemas import CheckoutRequest
from app.dependencies import get_db, get_current_user
import stripe
import os
from datetime import datetime

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

@router.post("/create-checkout-session")
async def create_checkout_session(
    request: CheckoutRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        # Create a new checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    # Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    'price': request.plan_id,
                    'quantity': 1,
                },
            ],
            mode='subscription',
            success_url=os.getenv("FRONTEND_URL", "http://localhost:3000") + '/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=os.getenv("FRONTEND_URL", "http://localhost:3000") + '/pricing',
            metadata={
                "user_id": current_user["id"]
            }
        )
        return {"url": checkout_session.url}
    except Exception as e:
        print(f"Stripe error: {e}")
        # For demo purposes, return a fake URL if Stripe fails (e.g. no key)
        return {"url": "http://localhost:3000/success?session_id=mock_session_id"}

@router.post("/webhook")
async def webhook(request: Request, stripe_signature: str = Header(None), db: Session = Depends(get_db)):
    payload = await request.body()
    print(f"Webhook Payload: {payload.decode('utf-8')}")
    print(f"Webhook Signature: {stripe_signature}")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Fulfill the purchase...
        user_id = session.get("metadata", {}).get("user_id")
        subscription_id = session.get("subscription")
        customer_id = session.get("customer")
        
        if user_id:
            # Create subscription record
            subscription = models.Subscription(
                user_id=user_id,
                stripe_customer_id=customer_id,
                stripe_subscription_id=subscription_id,
                plan_id="premium", # Logic to determine plan from session
                status="active",
                created_at=datetime.utcnow()
            )
            db.add(subscription)
            db.commit()
            
    elif event['type'] == 'customer.subscription.updated':
        subscription_data = event['data']['object']
        # Update subscription status in DB
        # ... implementation ...
        pass

    return {"status": "success"}
