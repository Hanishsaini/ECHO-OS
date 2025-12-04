import os
import openai
from typing import AsyncGenerator, List, Dict, Any
import json
from tenacity import retry, wait_exponential, stop_after_attempt

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            print("Warning: OPENAI_API_KEY not set. LLM features will fail.")
        self.client = openai.AsyncOpenAI(api_key=self.api_key)

    async def stream_chat(
        self, 
        messages: List[Dict[str, str]], 
        model: str = "gpt-4o-mini",
        temperature: float = 0.7
    ) -> AsyncGenerator[str, None]:
        """
        Streams chat completion from OpenAI.
        """
        try:
            stream = await self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                stream=True
            )

            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            print(f"Error in stream_chat: {e}")
            yield f"Error: {str(e)}"

    @retry(wait=wait_exponential(multiplier=1, min=4, max=10), stop=stop_after_attempt(3))
    async def get_chat_completion(
        self, 
        messages: List[Dict[str, str]], 
        model: str = "gpt-4o-mini"
    ) -> str:
        """
        Non-streaming chat completion with retries.
        """
        try:
            response = await self.client.chat.completions.create(
                model=model,
                messages=messages
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error in get_chat_completion: {e}")
            raise e

llm_service = LLMService()
