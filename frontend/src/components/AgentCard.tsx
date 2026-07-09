import { Activity, Clock, DollarSign } from "lucide-react";
import type { Agent } from "../lib/api";

type AgentCardProps = {
  agent: Agent;
  selected: boolean;
  onSelect: () => void;
};

export function AgentCard({ agent, selected, onSelect }: AgentCardProps) {
  return (
    <button
      className={`agent-card ${selected ? "selected" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Select ${agent.name}`}
    >
      <div className="agent-card-header">
        <div>
          <h3>{agent.name}</h3>
          <p>{agent.model}</p>
        </div>
        <span className={`status ${agent.status}`}>{agent.status.replace("_", " ")}</span>
      </div>
      <p className="agent-role">{agent.role}</p>
      <div className="agent-metrics">
        <span><Activity size={14} />{Math.round(agent.success_rate * 100)}%</span>
        <span><Clock size={14} />{agent.avg_latency_ms} ms</span>
        <span><DollarSign size={14} />{agent.cost_usd_today.toFixed(2)}</span>
      </div>
    </button>
  );
}
