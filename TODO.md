# Swarm OS TODO & Changelog

This document tracks the tasks and progress of Swarm OS.

## [MVP Phase] - Current Focus

- [x] **Phase 1: Foundation & Models**
  - [x] **Setup Workspace**:
    - [x] Create the `output/` directory for shared agent workspace.
  - [x] **Create `agent.py`**:
    - [x] Define the `Agent` class to represent a worker in the swarm.
    - [x] Implement initialization that accepts a name, role description, and a list of `Tool` objects.
    - [x] Implement an `execute` method that takes a task instruction and context, constructs a prompt with the agent's persona, and calls Gemini with the assigned tools.
    - [x] **Crucial**: Ensure the agent maintains an **in-memory chat session** (not persisted to disk) for the duration of the run.
  - [x] **Update `models.py`**:
    - [x] Add `AgentDefinition` Pydantic model to capture name, role, and a list of tool names.
    - [x] Update `Plan` model to include a list of `AgentDefinition` objects, representing the "staffing" for the project.
    - [x] Update `Task` model to include an `agent_name` field instead of a generic `worker` string, linking it explicitly to a defined agent.
  - [x] **Update `tools.py`**:
    - [x] Create a `Tool` class that encapsulates the function, its name, description, and parameter schema.
    - [x] Implement a registry system (or refactor the existing one) to store these `Tool` objects.
    - [x] Add a helper to generate a list of tool descriptions to be fed to the Architect.
    - [x] **New**: Update file tools to read/write exclusively from a dedicated `output/` directory.
    - [x] **New**: Add a `read_file` tool.

- [x] **Phase 2: The Lead Agent (Planning)**
  - [x] **Context Check Implementation**:
    - [x] Add a pre-planning step where the Lead Agent checks if the user goal has enough context.
    - [x] Implement the fallback to ask the user for more input if context is lacking.
  - [x] **Architect Prompt & Plan Generation**:
    - [x] Overhaul the prompt in `architect.py` to instruct Gemini to act as the Lead Agent/Architect.
    - [x] Instruct it to read the available tools and output a JSON plan matching the updated `Plan` schema in `models.py`.
    - [x] **Crucial**: Ensure the output includes the definitions of the sub-agents it wants to spawn (name, role, specific tools assigned).

- [x] **Phase 3: The Foreman & Critique (Execution)**
  - [x] **Foreman Instantiation Logic**:
    - [x] In `main.py` (`run_foreman`), iterate over the `AgentDefinition`s in the plan.
    - [x] Instantiate real `Agent` objects (from `agent.py`) for each definition, looking up tools in the registry by name.
    - [x] Store these instances in a dictionary mapped by agent name.
  - [x] **Task Routing & Execution**:
    - [x] Update the task execution loop to lookup the assigned agent in the dictionary.
    - [x] Call the agent's `execute` method, passing the instruction and resolved context.
  - [x] **Critique Agent Implementation**:
    - [x] Create a new function or file for the Critique Agent.
    - [x] It should take the original goal, the plan, and the execution results.
    - [x] Call Gemini to validate if the goal was achieved.
    - [x] If not, generate recommendations for changes.
  - [x] **Loop Integration**:
    - [x] Wire the Critique result back into the flow to allow for replanning or iterative execution.

- [x] **Phase 4: Verification**
  - [x] Create a complex test goal to verify the multi-agent interaction.
  - [x] Verify the context check and critique loop manually.

- [x] **Phase 5: Upgrade to Gemini 3 & Combined Tools**
  - [x] Switch to `gemini-3-flash-preview` in `agent.py`, `architect.py`, and `critique.py`.
  - [x] Enable `include_server_side_tool_invocations` in `agent.py`.
  - [x] Remove tool restriction in `architect.py` prompt.
  - [x] Verify with a complex test case.

- [x] **Phase 6: Market Cap Analysis & Unique Output Dir**
  - [x] Update `tools.py` to support dynamic `SESSION_DIR`.
  - [x] Update `main.py` to generate timestamp/UUID and use market cap goal.
  - [x] Verify results in the new directory.

- [x] **Phase 7: Next.js Frontend (Brutalist Design)**
  - [x] Initialize Next.js project in `frontend` folder.
  - [x] Configure Tailwind with designer's palette and fonts.
  - [x] Implement layout and page components based on `brutalist_design.html`.
  - [x] Verify build and rendering.

- [x] **Phase 8: Full-Stack Integration**
  - [x] Update `main.py` to generate `summary.json`.
  - [x] Create Next.js API routes to serve run data.
  - [x] Update `page.tsx` to fetch and display real data.

- [x] **Phase 9: Real-Time Dashboard Updates**
  - [x] Update `main.py` to save `summary.json` after each task.
  - [x] Update `page.tsx` to poll for updates.
  - [x] Verify real-time updates with browser subagent.

- [ ] **Phase 10: Human-in-the-Loop (HITL)**
  - [ ] Add `request_user_input` tool in `tools.py`.
  - [ ] Update `main.py` to support pause/resume.
  - [ ] Create API routes for respond and resume in Next.js.
  - [ ] Update `page.tsx` to show input field and resume button.
  - [ ] Verify with a test case.

- [x] **Phase 11: Robustness & 429 Retries**
  - [x] Create `utils.py` with `call_with_retry` function.
  - [x] Update `agent.py` to use `call_with_retry`.
  - [x] Update `architect.py` to use `call_with_retry`.
  - [x] Update `critique.py` to use `call_with_retry`.
  - [x] Verify normal operation.

- [X] **Phase 12: UI Improvements (Sorting & Titles)**
  - [x] Add `title` field to `Plan` model in `models.py`.
  - [x] Update Architect prompt in `architect.py` to generate titles.
  - [x] Update `main.py` to save titles in `summary.json`.
  - [x] Fix sorting and add title support in `api/runs/route.ts`.
  - [x] Update `page.tsx` to display titles in sidebar.
  - [x] Verify with a test run.

- [x] **Phase 13: UI Card Hover Effect**
  - [x] Add marquee CSS to `globals.css`.
  - [x] Update `page.tsx` to use title/goal in card header and apply marquee.
  - [x] Verify build and visual effect.

- [x] **Phase 14: UI Dynamic Shadow**
  - [x] Add `.brutalist-shadow-error` to `globals.css`.
  - [x] Update `page.tsx` to use dynamic shadow for Execution Overview.
  - [x] Verify build and visual effect.
  - [x] Make decorative hue dynamic in `page.tsx`.

- [x] **Phase 15: Component Refactoring**
  - [x] Create reusable `Card` component in `src/components/`.
  - [x] Create other component files in `src/components/`.
  - [x] Refactor `page.tsx` to use the new components.
  - [x] Verify build and functionality.

- [x] **Phase 16: Remove Default Card Hue**
  - [x] Update `Card.tsx` to make `bgHue` optional.
  - [x] Update `ExecutionOverview.tsx` to use `neon` hue.
  - [x] Verify build and visual effect.

- [x] **Phase 17: Home Page & Multi-Tab Navigation**
  - [x] Move current dashboard to `src/app/executions/page.tsx`.
  - [x] Implement new Home page in `src/app/page.tsx` based on Figma HTML.
  - [x] Update `Nav.tsx` with new tabs and links.
  - [x] Verify routing and build.

- [x] **Phase 18: Fix UI, Remove Mock Data & Add Backend Stats**
    - [x] Update `main.py` to add execution stats to `summary.json`.
    - [x] Update `page.tsx` to fetch real data for Home page.
    - [x] Implement new Executions page layout in `executions/page.tsx`.
    - [x] Verify on port 3000 and create report.

- [x] **Phase 19: Execution Selection & Dropdown**
    - [x] Support query params in `executions/page.tsx`.
    - [x] Create `ExecutionDropdown` component.
    - [x] Add dropdown to `Nav.tsx`.
    - [x] Verify build and functionality.

- [x] **Phase 20: Frontend Enhancements & Run Control**
    - [x] Figure out how to run swarm runs from the frontend (Home page).
    - [x] Implement running swarm runs from the Home page.
    - [x] Remove the memory button from the FE.
    - [x] Modify the context button to upload local files.
    - [x] Fix execution status to show "In Progress" instead of "Failing" when running.
    - [x] Fix default progress percentage to 0% in executions page.
    - [x] Fix frontend API to use venv python for executing swarm.
    - [x] Fix critical errors to default to 0 instead of 1 in executions page.
    - [x] Remove context check feature (main.py, architect.py, DESIGN.md).
    - [x] Fix completion bar to show completed tasks / total tasks in executions page.
    - [x] Change "Active Nodes" to "Active Agents" and use summary count in executions page.

- [x] **Phase 21: System Logs Toolbar**
  - [x] Create `LogToolbar.tsx` component.
  - [x] Integrate `LogToolbar` in `system-logs/page.tsx`.
  - [x] Verify rendering and styles.

- [x] **Phase 22: System Logs Terminal Canvas**
  - [x] Create `LogTerminal.tsx` component.
  - [x] Integrate `LogTerminal` in `system-logs/page.tsx`.
  - [x] Verify rendering and styles.

- [x] **Phase 23: Real Logs & Filtering**
  - [x] Create API route for logs.
  - [x] Update `LogToolbar` to support active filter state.
  - [x] Update `LogTerminal` to accept logs as prop.
  - [x] Update `system-logs/page.tsx` to fetch and filter logs.
  - [x] Verify functionality.

- [x] **Phase 24: Time Filter, Scrolling & Auto-Scroll**
  - [x] Update `LogToolbar` with date filter control.
  - [x] Update `LogTerminal` with scrolling and auto-scroll button.
  - [x] Update `system-logs/page.tsx` with date filter logic.
  - [x] Verify functionality.

- [x] **Phase 25: Fix Range Filter, Scrolling & Button**
  - [x] Update `LogToolbar` with datetime-local range inputs.
  - [x] Update `LogTerminal` to enforce scrolling with fixed height.
  - [x] Update `system-logs/page.tsx` with range filter logic.
  - [x] Verify functionality.

- [x] **Phase 26: Dark Mode Removal & Frontend Audit**
  - [x] Remove `dark:` classes from all frontend files.
  - [x] Conduct frontend audit and document in `frontend_audit_report.md`.
  - [x] Verify functionality and layout.

- [x] **Phase 27: Agents Card Modal & Label Update**
  - [x] Create design proposal for modal (Fallback for failed image gen).
  - [x] Change "Active Agents" to "Agents" in `executions/page.tsx`.
  - [x] Implement modal for agent details in `executions/page.tsx`.
  - [x] Verify functionality.

- [x] **Phase 28: Documentation Update & End of Phase**
  - [x] Update `TODO.md` marking all done.
  - [x] Update `DESIGN.md` with new components.
  - [x] Update `README.md` with new features.

---

## Future Phases (Planning)

- [ ] **Do whatever you want**: Self explanatory. P0
- [ ] **Foreman Agent**: Create a foreman agent to coordinate the subagents and stop fixed for loop. P1
- [ ] **Add more tools to the bag**: Self explanatory. P1
- [ ] **Add MCP Server support**: Self explanatory. P1
- [ ] **Add Skills support**: Self explanatory. P1
- [ ] **Long-Term Memory**: Integrate a vector database to allow agents to persist knowledge across sessions. P2
- [ ] **Dynamic Replanning**: Allow agents to request a plan modification from the Architect during execution if conditions change. P2
- [ ] **Make it more of a web service or a CLI**: Self explanatory. P2
- [ ] **Add some kind of self healing on tasks**: Figure it out. P2
- [ ] **DAG Task Execution**: Support parallel execution of independent tasks based on dependencies. P3
- [ ] **Add some kind of AI image generation to agents**: Self explanatory P4
- [ ] **Add graphic person interface to agents**: Self explanatory (Kinda) P4
