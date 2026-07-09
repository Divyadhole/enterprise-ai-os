from datetime import datetime, UTC

from app.models.schemas import Agent, AgentStatus, EnterpriseTool, MemoryItem, ToolStatus


AGENTS: list[Agent] = [
    Agent(
        id="research-agent",
        name="Research Agent",
        role="Finds internal knowledge, summarizes sources, and cites evidence.",
        status=AgentStatus.READY,
        model="gpt-4.1",
        success_rate=0.91,
        avg_latency_ms=1840,
        cost_usd_today=3.42,
    ),
    Agent(
        id="coding-agent",
        name="Coding Agent",
        role="Inspects repositories, proposes changes, and drafts pull requests.",
        status=AgentStatus.RUNNING,
        model="claude-3.7-sonnet",
        success_rate=0.87,
        avg_latency_ms=2310,
        cost_usd_today=5.18,
    ),
    Agent(
        id="sql-agent",
        name="SQL Agent",
        role="Translates business questions into safe read-only SQL.",
        status=AgentStatus.READY,
        model="gpt-4.1-mini",
        success_rate=0.94,
        avg_latency_ms=970,
        cost_usd_today=1.06,
    ),
    Agent(
        id="email-agent",
        name="Email Agent",
        role="Drafts, classifies, and routes high-priority messages.",
        status=AgentStatus.NEEDS_REVIEW,
        model="gpt-4.1-mini",
        success_rate=0.83,
        avg_latency_ms=1210,
        cost_usd_today=0.74,
    ),
    Agent(
        id="meeting-agent",
        name="Meeting Agent",
        role="Turns meetings into decisions, action items, and follow-ups.",
        status=AgentStatus.READY,
        model="gpt-4.1",
        success_rate=0.89,
        avg_latency_ms=1610,
        cost_usd_today=2.33,
    ),
]


TOOLS: list[EnterpriseTool] = [
    EnterpriseTool(id="gmail", name="Gmail", category="Communication", status=ToolStatus.MOCKED, scopes=["read", "draft"]),
    EnterpriseTool(id="calendar", name="Calendar", category="Productivity", status=ToolStatus.MOCKED, scopes=["read", "write"]),
    EnterpriseTool(id="slack", name="Slack", category="Communication", status=ToolStatus.MOCKED, scopes=["read", "send"]),
    EnterpriseTool(id="github", name="GitHub", category="Engineering", status=ToolStatus.MOCKED, scopes=["issues", "pull_requests"]),
    EnterpriseTool(id="notion", name="Notion", category="Knowledge", status=ToolStatus.MOCKED, scopes=["search", "read"]),
    EnterpriseTool(id="jira", name="Jira", category="Planning", status=ToolStatus.DISABLED, scopes=["tickets", "sprints"]),
    EnterpriseTool(id="postgres", name="PostgreSQL", category="Data", status=ToolStatus.CONNECTED, scopes=["read_only"]),
]


MEMORY: list[MemoryItem] = [
    MemoryItem(
        id="mem-001",
        kind="long_term",
        title="Customer escalation policy",
        summary="Enterprise escalations require a severity label, owner, and next update time.",
        created_at=datetime(2026, 7, 1, 15, 30, tzinfo=UTC),
    ),
    MemoryItem(
        id="mem-002",
        kind="short_term",
        title="Current product launch",
        summary="The billing analytics launch is in private beta with three design partners.",
        created_at=datetime(2026, 7, 8, 9, 15, tzinfo=UTC),
    ),
]
