import { useEffect, useMemo, useState } from "react";
import { BrainCircuit, Cable, Gauge, Play, Search, ShieldCheck, WalletCards } from "lucide-react";
import { AgentCard } from "./components/AgentCard";
import { StatCard } from "./components/StatCard";
import { Agent, AgentRun, EnterpriseTool, MemoryItem, Summary, api } from "./lib/api";

const fallbackPrompt = "Find the latest product launch risks, check internal notes, and draft next actions.";

export function App() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tools, setTools] = useState<EnterpriseTool[]>([]);
  const [memory, setMemory] = useState<MemoryItem[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState("research-agent");
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>(["notion", "slack"]);
  const [prompt, setPrompt] = useState(fallbackPrompt);
  const [run, setRun] = useState<AgentRun | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.summary(), api.agents(), api.tools(), api.memory()])
      .then(([summaryData, agentData, toolData, memoryData]) => {
        setSummary(summaryData);
        setAgents(agentData);
        setTools(toolData);
        setMemory(memoryData);
      })
      .catch(() => setError("Start the backend API to load live platform data."));
  }, []);

  const selectedAgent = useMemo(
    () => agents.find((agent) => agent.id === selectedAgentId),
    [agents, selectedAgentId],
  );

  async function handleRun() {
    setLoading(true);
    setError(null);
    try {
      const result = await api.runAgent({
        agent_id: selectedAgentId,
        prompt,
        tool_ids: selectedToolIds,
      });
      setRun(result);
    } catch {
      setError("The agent run could not be started. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  function toggleTool(toolId: string) {
    setSelectedToolIds((current) =>
      current.includes(toolId) ? current.filter((id) => id !== toolId) : [...current, toolId],
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p>Project 1</p>
          <h1>Enterprise AI Operating System</h1>
        </div>
        <div className="topbar-actions">
          <span><ShieldCheck size={16} /> Auth ready</span>
          <span><Gauge size={16} /> Observability planned</span>
        </div>
      </header>

      {error && <div className="notice">{error}</div>}

      <section className="stats-grid">
        <StatCard icon={BrainCircuit} label="Agents" value={`${summary?.active_agents ?? agents.length}`} detail="specialized workers" />
        <StatCard icon={Cable} label="Tools" value={`${summary?.connected_tools ?? tools.length}`} detail="enterprise connectors" />
        <StatCard icon={Search} label="Runs today" value={`${summary?.runs_today ?? 0}`} detail="mock workload" />
        <StatCard icon={WalletCards} label="Cost today" value={`$${summary?.cost_today_usd ?? "0.00"}`} detail="tracked per run" />
      </section>

      <section className="workspace-grid">
        <div className="panel agents-panel">
          <div className="panel-heading">
            <h2>Agent Control</h2>
            <p>{selectedAgent?.role ?? "Choose an agent to start."}</p>
          </div>
          <div className="agent-list">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                selected={agent.id === selectedAgentId}
                onSelect={() => setSelectedAgentId(agent.id)}
              />
            ))}
          </div>
        </div>

        <div className="panel run-panel">
          <div className="panel-heading">
            <h2>Run Workspace</h2>
            <p>Route a task through one agent and selected enterprise tools.</p>
          </div>
          <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} />
          <div className="tool-grid">
            {tools.map((tool) => (
              <button
                key={tool.id}
                className={`tool-chip ${selectedToolIds.includes(tool.id) ? "selected" : ""}`}
                onClick={() => toggleTool(tool.id)}
                disabled={tool.status === "disabled"}
              >
                <span>{tool.name}</span>
                <small>{tool.status}</small>
              </button>
            ))}
          </div>
          <button className="primary-action" onClick={handleRun} disabled={loading || !prompt.trim()}>
            <Play size={17} />
            {loading ? "Running" : "Run Agent"}
          </button>
          {run && (
            <article className="run-result">
              <div>
                <h3>{run.id}</h3>
                <p>{run.response}</p>
              </div>
              <dl>
                <div><dt>Latency</dt><dd>{run.latency_ms} ms</dd></div>
                <div><dt>Cost</dt><dd>${run.estimated_cost_usd.toFixed(4)}</dd></div>
                <div><dt>Tools</dt><dd>{run.tools_used.join(", ") || "none"}</dd></div>
              </dl>
            </article>
          )}
        </div>

        <div className="panel memory-panel">
          <div className="panel-heading">
            <h2>Memory</h2>
            <p>Short-term and long-term context available to agents.</p>
          </div>
          <div className="memory-list">
            {memory.map((item) => (
              <article key={item.id}>
                <span>{item.kind.replace("_", " ")}</span>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
