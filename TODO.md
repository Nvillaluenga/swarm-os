# Swarm OS TODO & Changelog

This document tracks the tasks and progress of Swarm OS.

## Completed Phases (MVP)

- **Phase 1: Core Framework & Dashboard**
  - Established foundation with `Agent`, `Plan`, and `Task` models.
  - Implemented Architect-Foreman orchestrator and Critique loops.
  - Upgraded to Gemini 3 with combined server-side tool invocations.
  - Developed Next.js frontend with Brutalist design, multi-tab navigation, and real-time backend stats integration.
  - Enabled full run control and execution from the dashboard.
- **Phase 2: System Logs Integration**
  - Built `LogToolbar` and `LogTerminal` frontend components.
  - Implemented real-time log streaming from `swarm.log` via dedicated API.
  - Added log level filtering (Info, Warning, Critical) and time filter controls.
- **Phase 3: Polishing & Refinements**
  - Upgraded time filter to full datetime-local range.
  - Enforced terminal scrolling and added auto-scroll with custom scrollbar.
  - Removed dark mode variants for a simplified clear (light) theme.
  - Updated "Active Agents" to "Agents" with an interactive modal for agent details.
  - Audited frontend and updated all project documentation (`README`, `DESIGN`, `TODO`).
  - Optimized executions page polling to only update state on changes.

## Current Focus (MVP)

- [x] **Phase 29: ADK Framework & Foreman Agent**
  - [x] Design overall ADK architecture and obtain approval.
  - [x] Migrate `agent.py` to ADK `LlmAgent`.
  - [x] Implement `foreman.py` with subscribed AgentTools.
  - [x] Refactor `main.py` to use ADK execution pipeline.
  - [x] Verify with existing test cases.

- [x] **Phase 30: Foreman Task Tracking & Logging**
  - [x] Create `state_tools.py` with `update_task_status` tool.
  - [x] Update `foreman.py` to use the new tool.
  - [x] Update `main.py` to inject state and improve logging.
  - [x] Verify functionality.

- [x] **Phase 31: Human-in-the-Loop (HITL) at Iteration Boundaries**
  - [x] Create `interaction_tools.py` with `record_interaction` tool.
  - [x] Update `foreman.py` to use the new tool.
  - [x] Update `critique.py` with `questions_for_user` support.
  - [x] Refactor `main.py` to support pause/resume or single-iteration execution.
  - [x] Update Frontend to display questions and handle resume.
  - [x] Verify functionality.

- [x] **Phase 32: ADK Native Tools Refactor**
  - [x] Update `tools.py` with ADK tools (`google_search`, `url_context`, `FunctionTool`).
  - [x] Update `agent.py` to handle `BuiltInCodeExecutor` and ADK tools.
  - [x] Verify with a test case.

---

## Future Phases (Planning)

- [ ] **Do whatever you want**: Self explanatory. P0
- [ ] **Human-in-the-Loop (HITL)**: Add `request_user_input` tool, pause/resume main loop, and Next.js UI controls. P1
- [ ] **Foreman Agent**: Create a foreman agent to coordinate the subagents and stop fixed for loop. P1 (Superceded by Phase 29)
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
