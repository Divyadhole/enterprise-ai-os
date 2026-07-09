from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    Agent,
    AgentRun,
    DashboardSummary,
    EnterpriseTool,
    FeedbackRequest,
    FeedbackResponse,
    MemoryItem,
    RunRequest,
)
from app.services.agent_runner import run_agent, save_feedback
from app.services.catalog import AGENTS, MEMORY, TOOLS

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
def get_summary() -> DashboardSummary:
    return DashboardSummary(
        active_agents=len(AGENTS),
        connected_tools=len([tool for tool in TOOLS if tool.status != "disabled"]),
        runs_today=128,
        cost_today_usd=round(sum(agent.cost_usd_today for agent in AGENTS), 2),
        avg_latency_ms=1588,
        evaluation_score=0.88,
    )


@router.get("/agents", response_model=list[Agent])
def list_agents() -> list[Agent]:
    return AGENTS


@router.get("/tools", response_model=list[EnterpriseTool])
def list_tools() -> list[EnterpriseTool]:
    return TOOLS


@router.get("/memory", response_model=list[MemoryItem])
def list_memory() -> list[MemoryItem]:
    return MEMORY


@router.post("/runs", response_model=AgentRun)
def create_run(request: RunRequest) -> AgentRun:
    try:
        return run_agent(request)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/feedback", response_model=FeedbackResponse)
def create_feedback(request: FeedbackRequest) -> FeedbackResponse:
    return save_feedback(request)
