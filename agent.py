from google.genai import types
from typing import List, Any
from google.adk.agents import LlmAgent
from google.adk.runners import InMemoryRunner
from google.adk.tools import google_search
import asyncio
import os

class Agent:
    """Represents a worker agent in the swarm using ADK LlmAgent."""
    
    def __init__(self, name: str, role: str, tools: List[Any]):
        """Initializes the agent with a name, role, and tools.
        
        Args:
            name: The name of the agent.
            role: The role description and system instructions.
            tools: A list of Tool objects the agent can use.
        """
        self.name = name
        self.role = role
        self.tools = tools
        
        # Construct the system instruction (persona)
        self.system_instruction = (
            f"You are {self.name}.\n"
            f"Your role is: {self.role}\n"
            f"Always act according to your role."
        )
        
        # Map Tool objects to their underlying functions or native tools for the SDK
        self.sdk_tools = []
        self.code_executor = None
        
        for t in self.tools:
            if t == "code_execution":
                from google.adk.code_executors import BuiltInCodeExecutor
                self.code_executor = BuiltInCodeExecutor()
            else:
                self.sdk_tools.append(t)
                
        # Initialize the ADK LlmAgent
        self.llm_agent = LlmAgent(
            name=self.name,
            model="gemini-3-flash-preview",
            instruction=self.system_instruction,
            tools=self.sdk_tools,
            code_executor=self.code_executor,
            generate_content_config=types.GenerateContentConfig(
                tool_config=types.ToolConfig(
                    include_server_side_tool_invocations=True
                )
            )
        )
        
        # Initialize the runner
        self.runner = InMemoryRunner(agent=self.llm_agent)

    def execute(self, instruction: str, context: str = "") -> str:
        """Executes a task instruction with given context.
        
        Args:
            instruction: The specific task instruction.
            context: Optional background context or data.
            
        Returns:
            The agent's response text.
        """
        prompt = f"Task Instruction: {instruction}\n"
        if context:
            prompt += f"\nContext Data:\n{context}"
            
        async def _run():
            session = await self.runner.session_service.create_session(
                app_name=self.runner.app_name, user_id="swarm_user"
            )
            content = types.UserContent(parts=[types.Part(text=prompt)])
            response = ""
            async for event in self.runner.run_async(
                user_id=session.user_id,
                session_id=session.id,
                new_message=content,
            ):
                if event.content and event.content.parts and event.content.parts[0].text:
                    response += event.content.parts[0].text
            return response
            
        def _sync_run():
            return asyncio.run(_run())
            
        from utils import call_with_retry
        return call_with_retry(_sync_run)

