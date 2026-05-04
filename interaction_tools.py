from google.adk.tools import ToolContext
import os
import json
import datetime
from typing import Literal

async def record_interaction(type: Literal['question', 'decision'], description: str, tool_context: ToolContext) -> dict:
    """Records a point where the Foreman needs human input or made a decision.
    
    Args:
        type: The type of interaction ('question' or 'decision').
        description: The details of the question or decision.
    """
    from tools import SESSION_DIR
    
    if "interactions" not in tool_context.state:
        tool_context.state["interactions"] = []
        
    tool_context.state["interactions"].append({
        "type": type,
        "description": description,
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })
    
    # Update summary.json
    goal = tool_context.state.get("goal", "Unknown Goal")
    
    plan_path = os.path.join(SESSION_DIR, "plan.json")
    if os.path.exists(plan_path):
        with open(plan_path, "r") as f:
            plan_dict = json.load(f)
    else:
        plan_dict = {}
        
    flat_results = {}
    if "results" in tool_context.state:
        for k, v in tool_context.state["results"].items():
            flat_results[k] = v["output"]
            
    summary = {
        "goal": goal,
        "plan": plan_dict,
        "results": flat_results,
        "interactions": tool_context.state["interactions"],
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }
    
    summary_path = os.path.join(SESSION_DIR, "summary.json")
    os.makedirs(os.path.dirname(summary_path), exist_ok=True)
    
    with open(summary_path, "w") as f:
        json.dump(summary, f, indent=2)
        
    return {"result": f"Recorded {type}: {description}"}
