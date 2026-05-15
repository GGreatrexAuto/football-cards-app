"""Football Cards API — application entry point."""

import logging
from contextlib import asynccontextmanager

import httpx
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints import proxy
from app.core.config import settings

logger = logging.getLogger(__name__)


async def _probe_external_api() -> bool:
    """Return True if Football-Data.org responds to a lightweight probe."""
    if not settings.football_data_api_key:
        return False
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(
                f"{settings.football_data_api_url}/competitions",
                headers={"X-Auth-Token": settings.football_data_api_key},
            )
            resp.raise_for_status()
        return True
    except Exception:  # pylint: disable=broad-exception-caught
        return False


@asynccontextmanager
async def lifespan(application: FastAPI):
    """Run startup probe and set external API status on app.state."""
    if not settings.football_data_api_key:
        application.state.external_api_status = "not_configured"
        logger.info("No FOOTBALL_DATA_API_KEY set — serving built-in mock data")
    elif await _probe_external_api():
        application.state.external_api_status = "connected"
        logger.info("External API (Football-Data.org) connected")
    else:
        application.state.external_api_status = "unreachable"
        logger.warning(
            "External API (Football-Data.org) unreachable — "
            "serving built-in mock data until connectivity is restored"
        )
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(proxy.router, prefix="/api/v1")


@app.get("/")
def read_root():
    """Root endpoint."""
    return {"Hello": "World"}


@app.get("/api/v1/health")
def health_check():
    """Return service liveness and external API connectivity status."""
    return {
        "status": "ok",
        "external_api": getattr(app.state, "external_api_status", "unknown"),
    }


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
