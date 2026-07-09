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
