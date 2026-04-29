import os
from google import genai
from google.genai import types
from models import Plan
from typing import List

def load_env():
    """Loads GEMINI_API_KEY from .env file if present."""
    env_path = ".env"
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                if line.startswith("GEMINI_API_KEY="):
                    key = line.split("=", 1)[1].strip()
                    os.environ["GEMINI_API_KEY"] = key
                    return True
    return False



def generate_plan(goal: str, available_tools: List[str]) -> Plan:
    """Generates a structured plan and staffing for the given goal.
    
    Args:
        goal: The user's objective.
        available_tools: A list of tool names that can be assigned to agents.
        
    Returns:
        A Plan object matching the Pydantic schema.
    """
    load_env()
    client = genai.Client()
    
    tools_str = "\n".join([f"- {t}" for t in available_tools])
    
    prompt = f"""
    You are the Lead Agent/Architect of a swarm.
    Break down the user's goal into tasks and define the specialized agents needed to complete them.
    
    User Goal: {goal}
    
    Available Tools that can be assigned to agents:
    {tools_str}
    
    Rules:
    1. Provide a short, descriptive title for the execution (3-5 words) in the 'title' field.
    2. Define the sub-agents needed (name, role, tools).
    3. Define the sequence of tasks, mapping each to a defined agent.
    4. Use ONLY tools from the available list.
    5. Ensure the plan is logical and leads to the fulfillment of the goal.
    """
    
    # Use structured output to guarantee a Plan object
    from utils import call_with_retry
    response = call_with_retry(
        client.models.generate_content,
        model='gemini-3-flash-preview',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=Plan,
        )
    )
    
    # Parse the JSON string into the Plan Pydantic model
    return Plan.model_validate_json(response.text)
