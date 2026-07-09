from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_check():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_agent_run():
    response = client.post(
        "/api/runs",
        json={
            "agent_id": "research-agent",
            "prompt": "Summarize customer escalation risk.",
            "tool_ids": ["notion", "slack"],
        },
    )

    payload = response.json()
    assert response.status_code == 200
    assert payload["agent_id"] == "research-agent"
    assert payload["tools_used"] == ["notion", "slack"]
