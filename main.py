import os
from models import Plan, Task
from agent import Agent
from tools import get_tool, list_tools
from architect import generate_plan, load_env
from critique import critique_plan
from typing import Dict
import datetime
import json
import time

LOG_FILE = "output/swarm.log"

def log_event(message: str):
    """Logs an event to the swarm.log file and prints to stdout."""
    os.makedirs("output", exist_ok=True)
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(LOG_FILE, "a") as f:
        f.write(f"[{timestamp}] {message}\n")
    print(message)

def save_summary(goal: str, plan: Plan, results: dict, valid: bool, feedback: str, start_time: float):
    """Saves the run summary to summary.json in the session directory."""
    from tools import SESSION_DIR
    
    summary = {
        "goal": goal,
        "plan": plan.model_dump() if plan else None,
        "results": results,
        "valid": valid,
        "feedback": feedback,
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "execution_stats": {
            "total_duration": time.time() - start_time,
            "active_nodes": len(plan.agents) if plan else 0,
            "critical_errors": sum(1 for v in results.values() if str(v).startswith("Error:"))
        }
    }
    
    summary_path = os.path.join(SESSION_DIR, "summary.json")
    with open(summary_path, "w") as f:
        json.dump(summary, f, indent=2)
    log_event(f"Saved summary to {summary_path}")

def run_foreman(goal: str, plan: Plan, start_time: float, initial_results: Dict[str, str] = None) -> Dict[str, str]:
    """Instantiates agents and executes tasks in the plan.
    
    Args:
        goal: The original user goal.
        plan: The Plan object containing agents and tasks.
        initial_results: Optional dictionary of results from previous runs.
        
    Returns:
        A dictionary mapping task IDs to their execution results.
    """
    log_event("\n--- Foreman Execution Starting ---")
    
    # 1. Instantiate Agents
    agents: Dict[str, Agent] = {}
    for agent_def in plan.agents:
        log_event(f"Instantiating agent: {agent_def.name}...")
        log_event(f"Persona: {agent_def.role}")
        
        # Lookup tools by name in the registry
        agent_tools = []
        for tool_name in agent_def.tools:
            t = get_tool(tool_name)
            if t:
                agent_tools.append(t)
            else:
                log_event(f"Warning: Tool '{tool_name}' not found in registry.")
                
        agents[agent_def.name] = Agent(
            name=agent_def.name,
            role=agent_def.role,
            tools=agent_tools
        )
        
    # 2. Execute Tasks
    results = initial_results.copy() if initial_results else {}
    for task in plan.tasks:
        log_event(f"\nExecuting Task {task.id}: {task.description}")
        log_event(f"Assigned to: {task.agent_name}")
        
        agent = agents.get(task.agent_name)
        if not agent:
            log_event(f"Error: Agent '{task.agent_name}' not found!")
            results[task.id] = f"Error: Agent '{task.agent_name}' not found."
            continue
            
        # Resolve context: Pass all accumulated results as context
        context = ""
        if results:
            context = "Data Gathered So Far:\n"
            for k, v in results.items():
                context += f"- {k}: {v}\n"
                
        try:
            log_event(f"Calling agent {task.agent_name} with instruction...")
            output = agent.execute(task.description, context)
            log_event(f"Task {task.id} completed.")
            log_event(f"Result of {task.id}:\n{output}\n")
            results[task.id] = output
            
            # NEW: Save incremental summary after each task!
            save_summary(goal, plan, results, valid=False, feedback="Running...", start_time=start_time)
            
        except Exception as e:
            log_event(f"Task {task.id} failed: {e}")
            results[task.id] = f"Error: {e}"
            
    log_event("\n--- Foreman Execution Completed ---\n")
    return results

def run_swarm(goal: str):
    """Runs the full swarm loop with replanning: Context Check -> [Planning -> Execution -> Critique] -> Done."""
    log_event(f"Starting Swarm with goal: {goal}")
    start_time = time.time()
    

    
    # Loop variables
    max_iterations = 3
    iteration = 0
    valid = False
    feedback = ""
    results = {}
    current_goal = goal
    
    while iteration < max_iterations:
        log_event(f"\n=== Swarm Iteration {iteration + 1} ===")
        
        # 2. Planning
        available_tools = [t.name for t in list_tools()]
        log_event("Generating plan...")
        
        # Append feedback and previous data to the goal prompt for the Architect
        if feedback:
            current_goal = (
                f"{goal}\n\n"
                f"--- Previous Attempt Feedback ---\n"
                f"{feedback}\n\n"
                f"--- Data Gathered So Far ---\n"
            )
            for k, v in results.items():
                current_goal += f"- {k}: {v}\n"
                
        plan = generate_plan(current_goal, available_tools)
        
        log_event("\n--- Generated Plan ---")
        log_event(plan.model_dump_json(indent=2))
        
        # 3. Execution
        # Pass accumulated results as initial context
        new_results = run_foreman(goal, plan, start_time, initial_results=results)
        results.update(new_results) # Accumulate results
        
        # 4. Critique
        log_event("Critiquing results...")
        valid, feedback = critique_plan(goal, plan, results)
        
        log_event(f"Critique Valid: {valid}")
        log_event(f"Feedback: {feedback}")
        
        # Save final summary for this iteration
        save_summary(goal, plan, results, valid, feedback, start_time)
        
        if valid:
            log_event("\nGoal achieved successfully!")
            break
        else:
            log_event(f"\nGoal not achieved. Feedback: {feedback}")
            iteration += 1
            
    if not valid:
        log_event(f"\nMax iterations reached. Goal not achieved. Final Feedback: {feedback}")

if __name__ == "__main__":
    # Ensure env vars are loaded
    load_env()
    
    import sys
    import uuid
    
    if len(sys.argv) > 1:
        goal = sys.argv[1]
    else:
        goal = "Write a file named 'hello.txt' with content 'Hello World'."
        
    if len(sys.argv) > 2:
        session_id = sys.argv[2]
    else:
        timestamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
        session_id = f"{timestamp}-{uuid.uuid4().hex[:8]}"
        
    session_dir = f"output/{session_id}"
    
    from tools import set_session_dir
    set_session_dir(session_dir)
    
    log_event(f"Session Directory set to: {session_dir}")
    
    run_swarm(goal)
