# Swarm OS

Swarm OS is a dynamic multi-agent framework designed to solve complex goals by orchestrating specialized AI agents. It moves beyond static, hardcoded agent systems by using a Lead Agent (Architect) to dynamically plan, staff, and execute tasks using a Foreman and a Critique loop.

The project features a Python backend for agent execution and a modern Next.js frontend for real-time observability.

## Project Structure

- **Root**: Python backend containing the core swarm logic, agent definitions, and tools.
- **`frontend/`**: Next.js web application providing a beautiful, brutalist-inspired dashboard to visualize runs.
- **`output/`**: Shared workspace where agents store their execution results and session summaries.

## Features

- **Dynamic Staffing**: The Architect agent creates specialized sub-agents on the fly based on the goal.
- **Real-Time Dashboard**: A web interface that updates as the swarm executes tasks, providing full visibility.
- **API Rate Limit Resilience**: Automatic exponential backoff retries for `429 RESOURCE_EXHAUSTED` errors.
- **Brutalist Glass Design**: A high-impact, high-contrast UI design system with sharp edges and glassmorphic depth.

## Getting Started

### Backend (Python)

The backend requires Python and uses the new `google-genai` SDK.

1.  **Install dependencies** (ensure you have `uv` or `pip`):
    ```bash
    # If using uv
    uv sync
    ```
2.  **Set your API key**:
    Make sure you have `GEMINI_API_KEY` set in your environment or a `.env` file.
3.  **Run the swarm**:
    ```bash
    python main.py
    ```
    *Note: You can edit the goal in the `__main__` block of `main.py`.*

### Frontend (Next.js)

The dashboard is built with Next.js 16 and requires Node.js.

1.  **Navigate to the folder**:
    ```bash
    cd frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the development server**:
    ```bash
    npm run dev
    ```
4.  **Open the dashboard**:
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Documentation

- [DESIGN.md](DESIGN.md): Detailed architecture and philosophy of the framework.
- [TODO.md](TODO.md): Tracked progress and future roadmap.
- [GRAPHICDESIGN.md](GRAPHICDESIGN.md): The visual guidelines for the Brutalist Glass theme.
- [GEMINI.md](GEMINI.md): Guidelines for AI assistants working on this codebase.
