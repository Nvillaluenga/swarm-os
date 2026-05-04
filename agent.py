from google import genai
from google.genai import types
from tools import Tool
from typing import List


class Agent:
    """Represents a worker agent in the swarm using Gemini 3 and native multi-tool support."""
    

    def __init__(self, name: str, role: str, tools: List[Tool]):
        """Initializes the agent with a name, role, and tools.
        
        Args:
            name: The name of the agent.
            role: The role description and system instructions.
            tools: A list of Tool objects the agent can use.
        """
        self.name = name
        self.role = role
        self.tools = tools
        
        # Initialize the Gemini client
        self.client = genai.Client()
        
        # Construct the system instruction (persona)
        self.system_instruction = (
            f"You are {self.name}.\n"
            f"Your role is: {self.role}\n"
            f"Always act according to your role."
        )
        
        self.sdk_compatible_tools = [t.func if t.func else t for t in self.tools]
        # Initialize in-memory chat session
        # Using gemini-3-flash-preview as requested and verified
        self.chat = self.client.chats.create(
            model="gemini-3-flash-preview",
            config=types.GenerateContentConfig(
                system_instruction=self.system_instruction,
                tools=self.sdk_compatible_tools,
                # Enable combining built-in tools with function calling
                tool_config=types.ToolConfig(
                    include_server_side_tool_invocations=True
                ),
                temperature=0.2 # Lower temperature for deterministic tool use
            )
        )

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
            
        from utils import call_with_retry
        response = call_with_retry(self.chat.send_message, prompt)
        return response.text
