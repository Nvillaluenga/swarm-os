import os
from google import genai
from google.genai import types
from models import Plan
from architect import load_env
from pydantic import BaseModel, Field

class CritiqueResponse(BaseModel):
    """Structured response for the Critique Agent."""
    valid: bool = Field(..., description="True if the goal was achieved, False otherwise.")
    feedback: str = Field(..., description="Feedback or recommendations for replanning.")

def critique_plan(goal: str, plan: Plan, results: dict) -> tuple[bool, str]:
    """Critiques the execution results against the original goal.
    
    Args:
        goal: The original user goal.
        plan: The plan that was executed.
        results: A dictionary of task results.
        
    Returns:
        A tuple of (valid: bool, feedback: str).
    """
    load_env()
    client = genai.Client()
    
    plan_json = plan.model_dump_json(indent=2)
    results_str = "\n".join([f"- Task {k}: {v}" for k, v in results.items()])
    
    prompt = f"""
    You are the Critique Agent of a swarm.
    Your task is to validate if the execution results achieve the original user goal.
    
    User Goal: {goal}
    
    Plan executed:
    {plan_json}
    
    Execution Results:
    {results_str}
    
    Evaluate if the goal was successfully achieved.
    """
    
    from utils import call_with_retry
    response = call_with_retry(
        client.models.generate_content,
        model='gemini-3-flash-preview',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=CritiqueResponse,
        )
    )
    
    # Parse the JSON string into the CritiqueResponse Pydantic model
    critique = CritiqueResponse.model_validate_json(response.text)
    return critique.valid, critique.feedback
