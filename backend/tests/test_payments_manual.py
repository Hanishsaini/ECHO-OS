import sys
import os
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient

# Mock Stripe
sys.modules["stripe"] = MagicMock()
os.environ["STRIPE_SECRET_KEY"] = "test_key"
os.environ["STRIPE_WEBHOOK_SECRET"] = "test_secret"
os.environ["DATABASE_URL"] = "sqlite:///./test.db"

# Mock DB session
mock_db = MagicMock()

# Mock dependencies
from app.dependencies import get_db
from app.main import app

# Override dependencies
app.dependency_overrides[get_db] = lambda: mock_db

client = TestClient(app)

def test_payments():
    print("Testing payments endpoints...")
    
    # Mock Stripe Session.create
    mock_stripe = sys.modules["stripe"]
    mock_session = MagicMock()
    mock_session.url = "http://test-checkout-url"
    mock_stripe.checkout.Session.create.return_value = mock_session
    
    # Test POST /payments/create-checkout
    response = client.post(
        "/payments/create-checkout",
        json={"user_id": "test_user", "plan_id": "price_123"}
    )
    print(f"Checkout Status: {response.status_code}")
    print(f"Checkout Response: {response.json()}")
    assert response.status_code == 200
    assert response.json()["url"] == "http://test-checkout-url"
    
    # Mock Stripe Webhook
    mock_stripe.Webhook.construct_event.return_value = {
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "metadata": {"user_id": "test_user"},
                "subscription": "sub_123",
                "customer": "cus_123"
            }
        }
    }
    
    # Test POST /payments/webhook
    response = client.post(
        "/payments/webhook",
        json={"data": "test"}, # Payload doesn't matter as we mock construct_event
        headers={"Stripe-Signature": "test_sig"}
    )
    print(f"Webhook Status: {response.status_code}")
    print(f"Webhook Response: {response.json()}")
    assert response.status_code == 200
    
    # Verify DB add called
    mock_db.add.assert_called()
    mock_db.commit.assert_called()

if __name__ == "__main__":
    test_payments()
