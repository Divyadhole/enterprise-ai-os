import { useEffect, useMemo, useState } from "react";
import { BrainCircuit, Cable, Database, Gauge, GitBranch, Play, Search, ShieldCheck, WalletCards } from "lucide-react";
import { AgentCard } from "./components/AgentCard";
import { StatCard } from "./components/StatCard";
import {
  Agent,
  AgentRun,
  EnterpriseTool,
  MemoryItem,
  Summary,
  api,
  demoAgents,
  demoMemory,
  demoRun,
  demoSummary,
  demoTools,
} from "./lib/api";

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
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    Promise.all([api.summary(), api.agents(), api.tools(), api.memory()])
      .then(([summaryData, agentData, toolData, memoryData]) => {
        setSummary(summaryData);
        setAgents(agentData);
        setTools(toolData);
        setMemory(memoryData);
      })
      .catch(() => {
        setSummary(demoSummary);
        setAgents(demoAgents);
        setTools(demoTools);
        setMemory(demoMemory);
        setDemoMode(true);
      });
  }, []);

  const selectedAgent = useMemo(
    () => agents.find((agent) => agent.id === selectedAgentId),
    [agents, selectedAgentId],
  );

  async function handleRun() {
    setLoading(true);
    setError(null);
    try {
      const body = {
        agent_id: selectedAgentId,
        prompt,
        tool_ids: selectedToolIds,
      };
      const result = demoMode ? demoRun(body) : await api.runAgent(body);
      setRun(result);
    } catch {
      setRun(demoRun({ agent_id: selectedAgentId, prompt, tool_ids: selectedToolIds }));
      setDemoMode(true);
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
    <main className="app-shell" id="main-content">
      <a className="skip-link" href="#agent-workspace">Skip to agent workspace</a>
      <header className="topbar">
        <div>
          <p>Portfolio project</p>
          <h1>Enterprise AI Operating System</h1>
          <p className="hero-copy">
            A full-stack control plane for enterprise agents: tool routing, memory, cost tracking,
            feedback capture, and a roadmap toward MCP, hybrid RAG, evaluation, and observability.
          </p>
        </div>
        <div className="topbar-actions">
          <span><ShieldCheck size={16} /> Auth ready</span>
          <span><Gauge size={16} /> Observability planned</span>
        </div>
      </header>

      <section className="architecture-strip" aria-label="Platform capabilities">
        <span><BrainCircuit size={16} /> Multi-agent orchestration</span>
        <span><Cable size={16} /> Enterprise tool registry</span>
        <span><Database size={16} /> Memory and retrieval layer</span>
        <span><GitBranch size={16} /> Evaluation roadmap</span>
      </section>

      {error && <div className="notice">{error}</div>}
      {demoMode && (
        <div className="notice neutral" role="status">
          Portfolio demo mode is active. The interface remains interactive with sample data when the API is offline.
        </div>
      )}

      <section className="stats-grid">
        <StatCard icon={BrainCircuit} label="Agents" value={`${summary?.active_agents ?? agents.length}`} detail="specialized workers" />
        <StatCard icon={Cable} label="Tools" value={`${summary?.connected_tools ?? tools.length}`} detail="enterprise connectors" />
        <StatCard icon={Search} label="Runs today" value={`${summary?.runs_today ?? 0}`} detail="mock workload" />
        <StatCard icon={WalletCards} label="Cost today" value={`$${summary?.cost_today_usd ?? "0.00"}`} detail="tracked per run" />
      </section>

      <section className="workspace-grid" id="agent-workspace">
        <section className="panel agents-panel" aria-labelledby="agent-control-heading">
          <div className="panel-heading">
            <h2 id="agent-control-heading">Agent Control</h2>
            <p>{selectedAgent?.role ?? "Choose an agent to start."}</p>
          </div>
          <div className="agent-list" role="list" aria-label="Available agents">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                selected={agent.id === selectedAgentId}
                onSelect={() => setSelectedAgentId(agent.id)}
              />
            ))}
          </div>
        </section>

        <section className="panel run-panel" aria-labelledby="run-workspace-heading">
          <div className="panel-heading">
            <h2 id="run-workspace-heading">Run Workspace</h2>
            <p>Route a task through one agent and selected enterprise tools.</p>
          </div>
          <label className="field-label" htmlFor="agent-prompt">Agent task</label>
          <textarea
            id="agent-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            aria-describedby="agent-prompt-help"
          />
          <p className="field-help" id="agent-prompt-help">
            Write a realistic enterprise request for the selected agent to plan.
          </p>
          <fieldset className="tool-picker">
            <legend>Available tools</legend>
          <div className="tool-grid">
            {tools.map((tool) => (
              <button
                key={tool.id}
                className={`tool-chip ${selectedToolIds.includes(tool.id) ? "selected" : ""}`}
                onClick={() => toggleTool(tool.id)}
                disabled={tool.status === "disabled"}
                aria-pressed={selectedToolIds.includes(tool.id)}
                type="button"
              >
                <span>{tool.name}</span>
                <small>{tool.category} · {tool.status}</small>
              </button>
            ))}
          </div>
          </fieldset>
          <button className="primary-action" onClick={handleRun} disabled={loading || !prompt.trim()} type="button">
            <Play size={17} />
            {loading ? "Running" : "Run Agent"}
          </button>
          {run && (
            <article className="run-result" aria-live="polite">
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
        </section>

        <section className="panel memory-panel" aria-labelledby="memory-heading">
          <div className="panel-heading">
            <h2 id="memory-heading">Memory</h2>
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
        </section>
      </section>
    </main>
  );
}
