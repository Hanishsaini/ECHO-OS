from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import os
import openai
from app.services.embedding_service import embed_texts, get_pinecone_client

class Agent(ABC):
    @abstractmethod
    async def run(self, input_text: str, context: Optional[Dict[str, Any]] = None) -> str:
        pass

class ResearchAgent(Agent):
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.pinecone = get_pinecone_client()
        self.index_name = os.getenv("PINECONE_INDEX")

    async def run(self, input_text: str, context: Optional[Dict[str, Any]] = None) -> str:
        # 1. Embed input
        embedding = embed_texts([input_text])[0]

        # 2. Retrieve relevant context from Pinecone
        index = self.pinecone.Index(self.index_name)
        results = index.query(
            vector=embedding,
            top_k=5,
            include_metadata=True
        )

        retrieved_texts = [match.metadata.get("text", "") for match in results.matches if match.metadata]
        context_str = "\n\n".join(retrieved_texts)

        # 3. Generate answer using LLM
        system_prompt = """You are a helpful research assistant. 
        Analyze the provided context and the user's question.
        Return your response in JSON format with the following keys:
        - summary: A detailed summary of the findings.
        - suggested_tasks: A list of actionable tasks based on the findings (list of strings).
        """
        user_prompt = f"Context:\n{context_str}\n\nQuestion: {input_text}"

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}
        )

        return response.choices[0].message.content

def run_agent(agent_name: str, payload: Dict[str, Any]) -> str:
    """
    Factory/Dispatcher to run an agent.
    """
    if agent_name == "research":
        agent = ResearchAgent()
        # In a real async app, we should await this. 
        # Since this is a synchronous wrapper, we might need to handle async properly 
        # or make run_agent async. For now, let's assume the caller handles async 
        # or we use a sync wrapper if needed. 
        # But wait, Agent.run is async. So run_agent should probably be async.
        raise NotImplementedError("Call the agent directly or make this async")
    else:
        raise ValueError(f"Unknown agent: {agent_name}")

async def run_agent_async(agent_name: str, input_text: str, context: Optional[Dict[str, Any]] = None) -> str:
    if agent_name == "research":
        agent = ResearchAgent()
        return await agent.run(input_text, context)
    else:
        raise ValueError(f"Unknown agent: {agent_name}")
