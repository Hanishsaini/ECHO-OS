import os
from typing import List, Dict, Any, Optional
import openai
from pinecone import Pinecone
import uuid

# Initialize clients
# Note: Ensure OPENAI_API_KEY and PINECONE_KEY are set in environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_pinecone_client():
    api_key = os.getenv("PINECONE_KEY")
    if not api_key:
        raise ValueError("PINECONE_KEY environment variable not set")
    
    # Check for PINECONE_ENV if using older indexes or specific regions
    env = os.getenv("PINECONE_ENV")
    if env:
        print(f"Using Pinecone environment: {env}")
        # Note: New Pinecone client typically doesn't need 'environment' in constructor 
        # unless using specific legacy setups, but we log it for verification.
        
    return Pinecone(api_key=api_key)

def embed_texts(texts: List[str], model: str = "text-embedding-3-small") -> List[List[float]]:
    """
    Generates embeddings for a list of texts using OpenAI.
    """
    if not texts:
        return []
    
    try:
        response = openai.embeddings.create(
            input=texts,
            model=model
        )
        return [data.embedding for data in response.data]
    except Exception as e:
        print(f"Error generating embeddings: {e}")
        raise

def upsert_vectors(
    vectors: List[List[float]], 
    metadata: List[Dict[str, Any]], 
    ids: Optional[List[str]] = None,
    index_name: Optional[str] = None
) -> int:
    """
    Upserts vectors into Pinecone.
    
    Args:
        vectors: List of embeddings (lists of floats).
        metadata: List of metadata dictionaries corresponding to vectors.
        ids: Optional list of IDs. If not provided, UUIDs will be generated.
        index_name: Optional index name. Defaults to PINECONE_INDEX env var.
        
    Returns:
        The count of upserted vectors.
    """
    if len(vectors) != len(metadata):
        raise ValueError("Vectors and metadata lists must have the same length")
    
    if ids and len(ids) != len(vectors):
        raise ValueError("IDs list must have the same length as vectors")
    
    idx_name = index_name or os.getenv("PINECONE_INDEX")
    if not idx_name:
        raise ValueError("PINECONE_INDEX environment variable not set and no index_name provided")
    
    pc = get_pinecone_client()
    index = pc.Index(idx_name)
    
    # Prepare items for upsert
    items_to_upsert = []
    for i, vector in enumerate(vectors):
        vector_id = ids[i] if ids else str(uuid.uuid4())
        items_to_upsert.append({
            "id": vector_id,
            "values": vector,
            "metadata": metadata[i]
        })
    
    # Batch upsert if necessary (Pinecone has limits, but for simplicity we upsert all)
    # For production, consider batching chunks of 100 or so.
    try:
        upsert_response = index.upsert(vectors=items_to_upsert)
        return upsert_response.upserted_count
    except Exception as e:
        print(f"Error upserting to Pinecone: {e}")
        raise
