import os
from typing import Callable, Any, Dict, List
from google.adk.tools import google_search, url_context, FunctionTool

# Native ADK tools are stored directly in the registry.
# Custom tools are wrapped in FunctionTool.

SESSION_DIR = "output"

def set_session_dir(dir_path: str):
    """Sets the session directory for file operations."""
    global SESSION_DIR
    SESSION_DIR = dir_path
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
    if os.path.isdir(path):
        return f"Error: {filename} is a directory, not a file."
    with open(path, "r") as f:
        return f.read()

# Wrap custom functions in FunctionTool (passing just the function)
write_file_tool = FunctionTool(write_file)
read_file_tool = FunctionTool(read_file)

_REGISTRY: Dict[str, Any] = {
    "google_search": google_search,
    "url_context": url_context,
    "write_file": write_file_tool,
    "read_file": read_file_tool,
}

def register_tool(name: str, tool: Any):
    """Registers a tool in the global registry."""
    _REGISTRY[name] = tool

def get_tool(name: str) -> Any:
    """Retrieves a tool by name."""
    return _REGISTRY.get(name)

def list_tools() -> List[Any]:
    """Lists all available tools."""
    return list(_REGISTRY.values())

def generate_tool_descriptions() -> str:
    """Generates a string describing all available tools."""
    descriptions = []
    for name, tool in _REGISTRY.items():
        if name == "write_file":
             descriptions.append(f"- **write_file**: Writes content to a file in the output directory. Args: filename, content")
        elif name == "read_file":
             descriptions.append(f"- **read_file**: Reads content from a file in the output directory. Args: filename")
        elif name == "google_search":
             descriptions.append(f"- **google_search**: Performs a web search using Google. Useful for finding current information.")
        elif name == "url_context":
             descriptions.append(f"- **url_context**: Provides access to URL content.")
        else:
             descriptions.append(f"- **{name}**: ADK Tool")
             
    # Add description for code execution which is handled specially
    descriptions.append(f"- **code_execution**: Enables the agent to execute Python code. Useful for complex calculations and data processing.")
    
    return "\n".join(descriptions)