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
import asyncio
from google.adk.runners import InMemoryRunner
from foreman import create_foreman_agent

LOG_FILE = "output/swarm.log"

def log_event(message: str):
    """Logs an event to the swarm.log file and prints to stdout."""
    os.makedirs("output", exist_ok=True)
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(LOG_FILE, "a") as f:
        f.write(f"[{timestamp}] {message}\n")
    print(message)

def save_summary(goal: str, plan: Plan, results: dict, valid: bool, feedback: str, start_time: float, questions: list = None):
    """Saves the run summary to summary.json in the session directory."""
    from tools import SESSION_DIR
    
    summary = {
        "goal": goal,
        "plan": plan.model_dump() if plan else None,
        "results": results,
        "valid": valid,
        "feedback": feedback,
        "questions": questions,
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
    """Instantiates agents and executes tasks in the plan using ADK.
    
    Args:
        goal: The original user goal.
        plan: The Plan object containing agents and tasks.
        initial_results: Optional dictionary of results from previous runs.
        
    Returns:
        A dictionary mapping task IDs to their execution results.
    """
    log_event("\n--- ADK Foreman Execution Starting ---")
    
    # 1. Create Foreman Agent
    foreman_agent = create_foreman_agent(plan, goal)
    
    # 2. Initialize Runner
    runner = InMemoryRunner(agent=foreman_agent)
    
    # 3. Run Agent
    async def _run():
        session = await runner.session_service.create_session(
            app_name=runner.app_name, user_id="swarm_user"
        )
        
        # Inject state for tools
        session.state["goal"] = goal
        session.state["plan"] = plan.model_dump()
        
        from google.genai import types
        content = types.UserContent(parts=[types.Part(text=goal)])
        response = ""
        
        async for event in runner.run_async(
            user_id=session.user_id,
            session_id=session.id,
            new_message=content,
        ):
            # Log all events for detailed tracing
            log_event(f"[{event.author}] Event: {str(event)}")
            
            if event.content and event.content.parts and event.content.parts[0].text:
                text = event.content.parts[0].text
                # Also log the clean text for readability
                log_event(f"[{event.author}] Text: {text}")
                response += text
                
        return {
            "output": response,
            "state_results": session.state.get("results", {}),
            "interactions": session.state.get("interactions", [])
        }

    def _sync_run():
        return asyncio.run(_run())
        
    from utils import call_with_retry
    run_result = call_with_retry(_sync_run)
    output = run_result["output"]
    state_results = run_result["state_results"]
    interactions = run_result["interactions"]
    
    # Flatten for compatibility
    flat_results = {}
    for k, v in state_results.items():
        flat_results[k] = v["output"]
        
    if "final_output" not in flat_results:
        flat_results["final_output"] = output
        
    log_event("\n--- ADK Foreman Execution Completed ---\n")
    
    return {
        "results": flat_results,
        "interactions": interactions
    }

def run_swarm(goal: str, answers: dict = None):
    """Runs the full swarm loop with replanning."""
    from tools import SESSION_DIR
    log_event(f"Starting Swarm with goal: {goal}")
    start_time = time.time()
    

    
    # Load state from summary.json if it exists
    summary_path = os.path.join(SESSION_DIR, "summary.json")
    results = {}
    feedback = ""
    iteration = 0
    
    if os.path.exists(summary_path):
        try:
            with open(summary_path, "r") as f:
                summary = json.load(f)
                results = summary.get("results", {})
                feedback = summary.get("feedback", "")
                
                if answers:
                    feedback += "\n\n--- User Answers to Questions ---\n"
                    for q, a in answers.items():
                        feedback += f"Q: {q}\nA: {a}\n"
                        
                # Assume we are proceeding to next iteration
                iteration = 1 
                
        except Exception as e:
            log_event(f"Failed to load summary: {e}")
            
    current_goal = goal
    max_iterations = 3
    
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
        
        # Save plan to file for state tools to access
        from tools import SESSION_DIR
        plan_path = os.path.join(SESSION_DIR, "plan.json")
        with open(plan_path, "w") as f:
            json.dump(plan.model_dump(), f, indent=2)
        
        # 3. Execution
        # Pass accumulated results as initial context
        execution_output = run_foreman(goal, plan, start_time, initial_results=results)
        results.update(execution_output["results"])
        interactions = execution_output["interactions"]
        
        # 4. Critique
        log_event("Critiquing results...")
        valid, feedback, questions = critique_plan(goal, plan, results, interactions)
        
        log_event(f"Critique Valid: {valid}")
        log_event(f"Feedback: {feedback}")
        
        # Save final summary for this iteration
        save_summary(goal, plan, results, valid, feedback, start_time, questions)
        
        if valid:
            log_event("\nGoal achieved successfully!")
            break
        else:
            log_event(f"\nGoal not achieved. Feedback: {feedback}")
            if questions:
                log_event(f"Questions for user: {questions}")
                # Return to let frontend handle it (Option B)
                return {
                    "status": "Waiting for Input",
                    "questions": questions,
                    "results": results
                }
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
    
    answers = None
    if len(sys.argv) > 3:
        try:
            answers = json.loads(sys.argv[3])
        except Exception as e:
            log_event(f"Failed to parse answers JSON: {e}")
            
    run_swarm(goal, answers)
