export type Summary = {
  active_agents: number;
  connected_tools: number;
  runs_today: number;
  cost_today_usd: number;
  avg_latency_ms: number;
  evaluation_score: number;
};

export type Agent = {
  id: string;
  name: string;
  role: string;
  status: "ready" | "running" | "needs_review";
  model: string;
  success_rate: number;
  avg_latency_ms: number;
  cost_usd_today: number;
};

export type EnterpriseTool = {
  id: string;
  name: string;
  category: string;
  status: "connected" | "mocked" | "disabled";
  scopes: string[];
};

export type MemoryItem = {
  id: string;
  kind: string;
  title: string;
  summary: string;
  created_at: string;
};

export type AgentRun = {
  id: string;
  agent_id: string;
  prompt: string;
  response: string;
  tools_used: string[];
  latency_ms: number;
  estimated_cost_usd: number;
  created_at: string;
};

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";

export const demoSummary: Summary = {
  active_agents: 5,
  connected_tools: 6,
  runs_today: 128,
  cost_today_usd: 12.73,
  avg_latency_ms: 1588,
  evaluation_score: 0.88,
};

export const demoAgents: Agent[] = [
  {
    id: "research-agent",
    name: "Research Agent",
    role: "Finds internal knowledge, summarizes sources, and cites evidence.",
    status: "ready",
    model: "gpt-4.1",
    success_rate: 0.91,
    avg_latency_ms: 1840,
    cost_usd_today: 3.42,
  },
  {
    id: "coding-agent",
    name: "Coding Agent",
    role: "Inspects repositories, proposes changes, and drafts pull requests.",
    status: "running",
    model: "claude-3.7-sonnet",
    success_rate: 0.87,
    avg_latency_ms: 2310,
    cost_usd_today: 5.18,
  },
  {
    id: "sql-agent",
    name: "SQL Agent",
    role: "Translates business questions into safe read-only SQL.",
    status: "ready",
    model: "gpt-4.1-mini",
    success_rate: 0.94,
    avg_latency_ms: 970,
    cost_usd_today: 1.06,
  },
  {
    id: "email-agent",
    name: "Email Agent",
    role: "Drafts, classifies, and routes high-priority messages.",
    status: "needs_review",
    model: "gpt-4.1-mini",
    success_rate: 0.83,
    avg_latency_ms: 1210,
    cost_usd_today: 0.74,
  },
  {
    id: "meeting-agent",
    name: "Meeting Agent",
    role: "Turns meetings into decisions, action items, and follow-ups.",
    status: "ready",
    model: "gpt-4.1",
    success_rate: 0.89,
    avg_latency_ms: 1610,
    cost_usd_today: 2.33,
  },
];

export const demoTools: EnterpriseTool[] = [
  { id: "gmail", name: "Gmail", category: "Communication", status: "mocked", scopes: ["read", "draft"] },
  { id: "calendar", name: "Calendar", category: "Productivity", status: "mocked", scopes: ["read", "write"] },
  { id: "slack", name: "Slack", category: "Communication", status: "mocked", scopes: ["read", "send"] },
  { id: "github", name: "GitHub", category: "Engineering", status: "mocked", scopes: ["issues", "pull_requests"] },
  { id: "notion", name: "Notion", category: "Knowledge", status: "mocked", scopes: ["search", "read"] },
  { id: "jira", name: "Jira", category: "Planning", status: "disabled", scopes: ["tickets", "sprints"] },
  { id: "postgres", name: "PostgreSQL", category: "Data", status: "connected", scopes: ["read_only"] },
];

export const demoMemory: MemoryItem[] = [
  {
    id: "mem-001",
    kind: "long_term",
    title: "Customer escalation policy",
    summary: "Enterprise escalations require a severity label, owner, and next update time.",
    created_at: "2026-07-01T15:30:00Z",
  },
  {
    id: "mem-002",
    kind: "short_term",
    title: "Current product launch",
    summary: "The billing analytics launch is in private beta with three design partners.",
    created_at: "2026-07-08T09:15:00Z",
  },
];

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  summary: () => request<Summary>("/summary"),
  agents: () => request<Agent[]>("/agents"),
  tools: () => request<EnterpriseTool[]>("/tools"),
  memory: () => request<MemoryItem[]>("/memory"),
  runAgent: (body: { agent_id: string; prompt: string; tool_ids: string[] }) =>
    request<AgentRun>("/runs", { method: "POST", body: JSON.stringify(body) }),
};

export function demoRun(body: { agent_id: string; prompt: string; tool_ids: string[] }): AgentRun {
  const agent = demoAgents.find((item) => item.id === body.agent_id) ?? demoAgents[0];

  return {
    id: `demo-run-${Date.now().toString().slice(-6)}`,
    agent_id: agent.id,
    prompt: body.prompt,
    response:
      `${agent.name} created a cited workflow draft, selected the safest available tools, ` +
      "estimated execution cost, and marked the next action for human review.",
    tools_used: body.tool_ids,
    latency_ms: agent.avg_latency_ms,
    estimated_cost_usd: Number((Math.max(body.prompt.length, 1) * 0.00004 + body.tool_ids.length * 0.002).toFixed(4)),
    created_at: new Date().toISOString(),
  };
}
