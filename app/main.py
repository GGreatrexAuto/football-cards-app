from fastapi import FastAPI

from app.api.endpoints import proxy

app = FastAPI()

app.include_router(proxy.router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"Hello": "World"}
