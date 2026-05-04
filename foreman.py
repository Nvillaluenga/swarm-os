from google.adk.agents import LlmAgent
from google.adk.tools.agent_tool import AgentTool
from models import Plan
from agent import Agent
from state_tools import update_task_status
from interaction_tools import record_interaction
from google.genai import types

def create_foreman_agent(plan: Plan, user_goal: str) -> LlmAgent:
    """Creates a Foreman Agent subscribed to sub-agents as tools based on the plan.
    
    Args:
        plan: The Plan object containing agents and tasks.
        user_goal: The original user goal.
        
        Returns:
            An LlmAgent instance configured as the Foreman.
        """
    sub_agent_tools = []
    for agent_def in plan.agents:
        # Instantiate the worker agent using our wrapper (which handles tools)
        from tools import get_tool
        agent_tools = []
        for tool_name in agent_def.tools:
            t = get_tool(tool_name)
            if t:
                agent_tools.append(t)
            elif tool_name == "code_execution":
                agent_tools.append("code_execution")
                
        worker = Agent(name=agent_def.name, role=agent_def.role, tools=agent_tools)
        
        # Wrap the underlying LlmAgent in an AgentTool
        tool = AgentTool(agent=worker.llm_agent)
        sub_agent_tools.append(tool)
        
    # Define the instruction for the Foreman
    instruction = (
        f"You are the Foreman of a swarm of AI agents.\n"
        f"Your objective is to achieve the user goal: {user_goal}\n"
        f"Here is the plan you should follow:\n"
    )
    for task in plan.tasks:
        instruction += f"- Task {task.id}: {task.description} (Assigned to: {task.agent_name})\n"
        
    instruction += (
        f"\nYou must achieve this goal by delegating work to your specialized sub-agents.\n"
        f"You have access to these sub-agents as tools. Call them with specific instructions to perform tasks.\n"
        f"Coordinate their work, collect their outputs, and synthesize the final result.\n"
        f"\nCRITICAL: You MUST use the `update_task_status` tool to report the progress of each task. "
        f"Call it when you start a task (status='In Progress'), when you complete it (status='Complete', with the output), "
        f"or if it fails (status='Failed'). This is required for system monitoring.\n"
        f"\nYou can also use the `record_interaction` tool to log points where you need human clarification "
        f"or where you made a significant decision on behalf of the human. Use this to report issues or questions "
        f"that the user should address before or in the next iteration."
    )
    
    all_tools = sub_agent_tools + [update_task_status, record_interaction]
    
    foreman = LlmAgent(
        name="Foreman",
        model="gemini-3-flash-preview",
        instruction=instruction,
        tools=all_tools,
        generate_content_config=types.GenerateContentConfig(
            tool_config=types.ToolConfig(
                include_server_side_tool_invocations=True
            )
        )
    )
    
    return foreman
