# Enterprise AI Operating System

Project 1 from the AI startup portfolio roadmap: a multi-agent enterprise platform with tool calling, memory, cost tracking, feedback, and a path toward MCP, RAG, evaluations, and observability.

## Milestone 1

This first version creates a runnable product foundation:

- FastAPI backend with typed endpoints for agents, tools, memory, runs, feedback, and dashboard metrics.
- React dashboard for agent selection, enterprise tool routing, memory inspection, and mock agent execution.
- Docker Compose services for PostgreSQL, Redis, Qdrant, backend, and frontend.
- Backend tests for health checks and agent runs.
- Roadmap structure for turning the mock system into a production-grade portfolio project.

## Run Locally

Backend:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

Full stack with Docker:

```bash
docker compose up --build
```

## API

- `GET /health`
- `GET /api/summary`
- `GET /api/agents`
- `GET /api/tools`
- `GET /api/memory`
- `POST /api/runs`
- `POST /api/feedback`

## Roadmap

### Milestone 2: Real Persistence

- Add SQLAlchemy models and Alembic migrations.
- Persist runs, feedback, users, prompt versions, and cost events in PostgreSQL.
- Use Redis for short-term run state and job coordination.

### Milestone 3: Agent Orchestration

- Add LangGraph workflows for Research, Coding, SQL, Email, and Meeting agents.
- Add guardrails for tool permissions and read-only SQL execution.
- Add human approval for risky actions.

### Milestone 4: Search and RAG

- Add BM25 document search.
- Add Qdrant vector search.
- Build hybrid retrieval with citations and source scoring.

### Milestone 5: MCP and Tool Connectors

- Add MCP-compatible tool registry.
- Implement Gmail, Calendar, Slack, GitHub, Notion, Jira, and SQL adapters.
- Add OAuth-ready connection records.

### Milestone 6: Evaluation and Observability

- Add prompt versioning, golden datasets, LLM-as-judge checks, and regression reports.
- Add Langfuse and OpenTelemetry traces.
- Add latency, quality, and cost dashboards.

### Milestone 7: Deployment

- Add Kubernetes manifests.
- Add CI checks for backend tests and frontend builds.
- Deploy demo to AWS or another public cloud.

## Resume Positioning

Enterprise AI Operating System: built a full-stack multi-agent platform with typed FastAPI services, React control plane, enterprise tool registry, memory layer, cost tracking, feedback capture, and a roadmap for MCP-compatible connectors, hybrid RAG, evaluations, and observability.
