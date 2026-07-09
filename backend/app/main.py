from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.core.config import settings

app = FastAPI(
    title="Enterprise AI Operating System",
    description="Milestone 1 API for an enterprise multi-agent platform.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/")
def root() -> dict[str, str]:
    return {
        "name": "Enterprise AI Operating System API",
        "status": "running",
        "frontend": "http://localhost:5173",
        "docs": "http://localhost:8000/docs",
        "health": "http://localhost:8000/health",
    }


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "enterprise-ai-os"}
