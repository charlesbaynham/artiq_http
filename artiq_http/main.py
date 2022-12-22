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


@app.get("/devices")
async def get_devices():
    """Get the current device_db

    Returns:
        dict: ARTIQ Device_DB
    """
    return await get_dict(SERVER, "devices")


@app.get("/datasets")
async def get_datasets() -> dict:
    """Get all existing ARTIQ datasets

    This method might return a large output

    Returns:
        dict: All broadcasted ARTIQ datasets
    """
    return await get_dict(SERVER, "datasets")
