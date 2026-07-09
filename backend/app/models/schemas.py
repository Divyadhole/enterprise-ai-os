from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class AgentStatus(str, Enum):
    READY = "ready"
    RUNNING = "running"
    NEEDS_REVIEW = "needs_review"


class ToolStatus(str, Enum):
    CONNECTED = "connected"
    MOCKED = "mocked"
    DISABLED = "disabled"


class Agent(BaseModel):
    id: str
    name: str
    role: str
    status: AgentStatus
    model: str
    success_rate: float = Field(ge=0, le=1)
    avg_latency_ms: int
    cost_usd_today: float


class EnterpriseTool(BaseModel):
    id: str
    name: str
    category: str
    status: ToolStatus
    scopes: list[str]


class MemoryItem(BaseModel):
    id: str
    kind: str
    title: str
    summary: str
    created_at: datetime


class RunRequest(BaseModel):
    user_id: str = "demo-user"
    agent_id: str
    prompt: str
    tool_ids: list[str] = []


class AgentRun(BaseModel):
    id: str
    agent_id: str
    prompt: str
    response: str
    tools_used: list[str]
    latency_ms: int
    estimated_cost_usd: float
    created_at: datetime


class FeedbackRequest(BaseModel):
    run_id: str
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class FeedbackResponse(BaseModel):
    id: str
    run_id: str
    rating: int
    comment: str | None
    created_at: datetime


class DashboardSummary(BaseModel):
    active_agents: int
    connected_tools: int
    runs_today: int
    cost_today_usd: float
    avg_latency_ms: int
    evaluation_score: float
