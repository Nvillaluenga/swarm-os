import os
from typing import Callable, Any, Dict, List

class Tool:
    """Encapsulates a function that can be used as a tool by an agent."""
    def __init__(self, name: str, description: str, func: Callable):
        self.name = name
        self.description = description
        self.func = func

_REGISTRY: Dict[str, Tool] = {}

def register_tool(tool: Tool):
    """Registers a tool in the global registry."""
    _REGISTRY[tool.name] = tool

def get_tool(name: str) -> Tool:
    """Retrieves a tool by name."""
    return _REGISTRY.get(name)

def list_tools() -> List[Tool]:
    """Lists all registered tools."""
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

# Register default tools
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
    name="google_search",
    description="Performs a web search using Google. Useful for finding current information.",
    func=None
))
