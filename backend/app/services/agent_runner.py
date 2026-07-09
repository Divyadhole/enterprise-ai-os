from datetime import datetime, UTC
from uuid import uuid4

from app.models.schemas import AgentRun, FeedbackRequest, FeedbackResponse, RunRequest
from app.services.catalog import AGENTS, TOOLS


def run_agent(request: RunRequest) -> AgentRun:
    agent = next((item for item in AGENTS if item.id == request.agent_id), None)
    if agent is None:
        raise ValueError("Unknown agent_id")

    allowed_tools = {tool.id for tool in TOOLS}
    tools_used = [tool_id for tool_id in request.tool_ids if tool_id in allowed_tools]
    response = (
        f"{agent.name} analyzed the request and created a draft enterprise workflow. "
        f"Next milestone should connect real credentials, persist runs, and add evaluation checks."
    )

    return AgentRun(
        id=f"run-{uuid4().hex[:10]}",
        agent_id=agent.id,
        prompt=request.prompt,
        response=response,
        tools_used=tools_used,
        latency_ms=agent.avg_latency_ms,
        estimated_cost_usd=round(max(len(request.prompt), 1) * 0.00004 + len(tools_used) * 0.002, 4),
        created_at=datetime.now(UTC),
    )


def save_feedback(request: FeedbackRequest) -> FeedbackResponse:
    return FeedbackResponse(
        id=f"feedback-{uuid4().hex[:10]}",
        run_id=request.run_id,
        rating=request.rating,
        comment=request.comment,
        created_at=datetime.now(UTC),
    )
