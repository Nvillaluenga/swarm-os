from google.adk.tools import ToolContext
import os
import json
import datetime

async def update_task_status(task_id: str, status: str, output: str, tool_context: ToolContext) -> dict:
    """Updates the status and output of a task in the plan, and updates summary.json.
    
    Args:
        task_id: The ID of the task being updated.
        status: The new status (e.g., 'In Progress', 'Complete', 'Failed').
        output: The result or details produced by the task.
    """
    from tools import SESSION_DIR
    
    # Update state
    if "results" not in tool_context.state:
        tool_context.state["results"] = {}
        
    tool_context.state["results"][task_id] = {
        "status": status,
        "output": output,
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    goal = tool_context.state.get("goal", "Unknown Goal")
    
    plan_path = os.path.join(SESSION_DIR, "plan.json")
    if os.path.exists(plan_path):
        with open(plan_path, "r") as f:
            plan_dict = json.load(f)
    else:
        plan_dict = {}
    
    # Format results for frontend compatibility if needed
    # The frontend expects a flat dict for results if we follow previous patterns
    # Let's see what executions/page.tsx expects:
    # const getTaskStatus = (taskId: string, results: any) => {
    #   if (results && results[taskId]) { return 'Complete'; }
    #   return 'Pending';
    # };
    # It checks if results[taskId] exists.
    # So we can just store the output or the status.
    # Let's store the full object for now, but we might need to adjust if frontend breaks.
    # Actually, in previous runs, results was a dict of strings: {task_id: output}.
    # Let's maintain that for simplicity and compatibility!
    
    # Flat results for compatibility
    flat_results = {}
    for k, v in tool_context.state["results"].items():
        flat_results[k] = v["output"]
        
    summary = {
        "goal": goal,
        "plan": plan_dict,
        "results": flat_results,
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }
    
    summary_path = os.path.join(SESSION_DIR, "summary.json")
    
    os.makedirs(os.path.dirname(summary_path), exist_ok=True)
    
    with open(summary_path, "w") as f:
        json.dump(summary, f, indent=2)
        
    return {"result": f"Task {task_id} updated to {status}."}
