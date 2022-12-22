from typing import Any
from typing import Dict
from typing import Optional

from pydantic import BaseModel


class ExpID(BaseModel):
    log_level: int
    file: str
    class_name: str
    arguments: Dict[str, Any]
    repo_rev: str


class ScheduleItem(BaseModel):
    pipeline: str
    priority: int
    due_date: Optional[float]
    flush: bool
    status: str
    repo_msg: str
    expid: ExpID
