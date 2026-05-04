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
    questions_for_user: list[str] = Field(default=[], description="List of questions for the user to clarify or make decisions.")

def critique_plan(goal: str, plan: Plan, results: dict, interactions: list = None) -> tuple[bool, str, list[str]]:
    """Critiques the execution results against the original goal.
    
    Args:
        goal: The original user goal.
        plan: The plan that was executed.
        results: A dictionary of task results.
        interactions: Optional list of recorded interactions (questions/decisions).
        
    Returns:
        A tuple of (valid: bool, feedback: str, questions_for_user: List[str]).
    """
    load_env()
    client = genai.Client()
    
    plan_json = plan.model_dump_json(indent=2)
    results_str = "\n".join([f"- Task {k}: {v}" for k, v in results.items()])
    
    interactions_str = "None"
    if interactions:
        interactions_str = "\n".join([f"- {i['type'].upper()}: {i['description']}" for i in interactions])
    
    prompt = f"""
    You are the Critique Agent of a swarm.
    Your task is to validate if the execution results achieve the original user goal.
    
    User Goal: {goal}
    
    Plan executed:
    {plan_json}
    
    Execution Results:
    {results_str}
    
    Recorded Interactions (Questions/Decisions by Foreman):
    {interactions_str}
    
    Evaluate if the goal was successfully achieved.
    If not achieved, or if you need user clarification based on the recorded interactions, provide a list of specific questions for the user in the `questions_for_user` field.
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
    return critique.valid, critique.feedback, critique.questions_for_user
