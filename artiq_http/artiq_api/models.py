import logging
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class ExpID(BaseModel):
    log_level: int = logging.WARNING
    file: str
    class_name: str
    arguments: Optional[Dict[str, Any]]
    repo_rev: Optional[str]


class ScheduleItem(BaseModel):
    pipeline: str
    priority: int
    due_date: Optional[float]
    flush: bool
    status: Optional[str]
    repo_msg: Optional[str]
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


class ExperimentDefaults(BaseModel):
    file: str
    class_name: str
    arguments: Dict[str, Any]


class SubmitAndWaitResult(BaseModel):
    rid: int
    status: str
    timed_out: bool
