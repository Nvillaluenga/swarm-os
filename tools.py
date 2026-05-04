import os
from typing import Callable, Any, Dict, List
from google.genai import types

class Tool(types.Tool):
    """Encapsulates a function or native tool that can be used by an agent."""
    name: str
    description: str
    func: Callable | None = None

_REGISTRY: Dict[str, Tool] = {
    "google_search": Tool(name="google_search", description="Google Search", google_search=types.GoogleSearch()),
    "code_execution": Tool(name="code_execution", description="Code Execution", code_execution=types.ToolCodeExecution()),
    "url_context": Tool(name="url_context", description="URL Context", url_context=types.UrlContext()),
}

def register_tool(tool: Tool):
    """Registers a tool in the global registry."""
    _REGISTRY[tool.name] = tool

def get_tool(name: str) -> Tool:
    """Retrieves a tool by name."""
    return _REGISTRY.get(name)

def list_tools() -> List[Tool]:
    """Lists all available tools (both registered and native)."""
    return list(_REGISTRY.values())

def generate_tool_descriptions() -> str:
    """Generates a string describing all available tools."""
    descriptions = []
    for tool in list_tools():
        descriptions.append(f"- **{tool.name}**: {tool.description}")
    return "\n".join(descriptions)

# --- Default Tools ---

SESSION_DIR = "output"

def set_session_dir(dir_path: str):
    """Sets the session directory for file operations."""
    global SESSION_DIR
    SESSION_DIR = dir_path
    # Ensure it exists
    os.makedirs(SESSION_DIR, exist_ok=True)

def write_file(filename: str, content: str) -> str:
    """Writes content to a file in the session directory.
    
    Args:
        filename: The name of the file (not path).
        content: The content to write.
    """
    filename = os.path.basename(filename)
    path = os.path.join(SESSION_DIR, filename)
    os.makedirs(SESSION_DIR, exist_ok=True)
    with open(path, "w") as f:
        f.write(content)
    return f"Successfully wrote to {filename} in {SESSION_DIR}"

def read_file(filename: str) -> str:
    """Reads content from a file in the session directory.
    
    Args:
        filename: The name of the file (not path).
    """
    filename = os.path.basename(filename)
    path = os.path.join(SESSION_DIR, filename)
    if not os.path.exists(path):
        return f"Error: File {filename} not found in {SESSION_DIR}."
    with open(path, "r") as f:
        return f.read()

def request_user_input(prompt: str) -> str:
    """Requests input from the human user.
    
    Args:
        prompt: The question or prompt for the user.
    """
    return input(f"[Agent Request] {prompt}: ")

register_tool(Tool(
    name="write_file",
    description="Writes content to a file in the output directory. Args: filename, content",
    func=write_file
))

register_tool(Tool(
    name="read_file",
    description="Reads content from a file in the output directory. Args: filename",
    func=read_file
))

register_tool(Tool(
    name="request_user_input",
    description="Requests input from the human user. Args: prompt",
    func=request_user_input
))

# To add a custom tool:
# 1. Define a Python function with clear type hints and docstring.
# 2. Create a Tool instance: `my_tool = Tool(name="my_name", description="...", func=my_func)`
# 3. Call `register_tool(my_tool)`
#
# To add a new native GenAI tool:
# Add it to the `_REGISTRY` dict above using the appropriate `types.Tool` keyword argument.