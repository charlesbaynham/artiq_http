from fastapi import FastAPI
from .get_dict import get_dict
app = FastAPI()

SERVER = "labserver"


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/schedule")
async def get_schedule():
    return await get_dict(SERVER, "schedule")
