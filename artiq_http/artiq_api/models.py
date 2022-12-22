import logging
from typing import Any
from typing import Dict
from typing import List
from typing import Optional

from pydantic import BaseModel


class ExpID(BaseModel):
    log_level: int = logging.WARNING
    file: str
    class_name: str
    arguments: Dict[str, Any]
    repo_rev: Optional[str]


class ScheduleItem(BaseModel):
    pipeline: str
    priority: int
    due_date: Optional[float]
    flush: bool
    status: str
    repo_msg: str
    expid: ExpID


class ExperimentEntry(BaseModel):
    name: str
    file: str
    class_name: str
    arginfo: Dict[str, Any]
    argument_ui: Optional[str]
    scheduler_defaults: dict


class ExperimentList(BaseModel):
    current_rev: Optional[str]
    scanning: bool
    experiments: List[ExperimentEntry] = []
