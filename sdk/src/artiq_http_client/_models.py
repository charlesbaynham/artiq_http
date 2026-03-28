"""Dataclass models for the ARTIQ HTTP client SDK."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Optional


@dataclass
class ExpID:
    """Experiment identifier used to submit experiments."""

    file: str
    class_name: str
    log_level: int = 30
    arguments: Optional[dict[str, Any]] = None
    repo_rev: Optional[str] = None

    def to_dict(self) -> dict[str, Any]:
        d: dict[str, Any] = {
            "log_level": self.log_level,
            "file": self.file,
            "class_name": self.class_name,
        }
        if self.arguments is not None:
            d["arguments"] = self.arguments
        if self.repo_rev is not None:
            d["repo_rev"] = self.repo_rev
        return d


@dataclass
class ScheduleItem:
    """A single item in the experiment schedule."""

    pipeline: str
    priority: int
    due_date: Optional[float]
    flush: bool
    status: str
    repo_msg: Optional[str]
    expid: dict[str, Any]

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "ScheduleItem":
        return cls(
            pipeline=data["pipeline"],
            priority=data["priority"],
            due_date=data.get("due_date"),
            flush=data["flush"],
            status=data["status"],
            repo_msg=data.get("repo_msg"),
            expid=data["expid"],
        )


@dataclass
class ExperimentEntry:
    """A single experiment entry from the experiment list."""

    name: str
    file: str
    class_name: str
    arginfo: dict[str, Any]
    argument_ui: Optional[dict[str, Any]]
    scheduler_defaults: Optional[dict[str, Any]]

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "ExperimentEntry":
        return cls(
            name=data["name"],
            file=data["file"],
            class_name=data["class_name"],
            arginfo=data.get("arginfo", {}),
            argument_ui=data.get("argument_ui"),
            scheduler_defaults=data.get("scheduler_defaults"),
        )


@dataclass
class ExperimentList:
    """The full experiment list response."""

    current_rev: Optional[str]
    scanning: bool
    experiments: list[ExperimentEntry]

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "ExperimentList":
        experiments = [ExperimentEntry.from_dict(e) for e in data.get("experiments", [])]
        return cls(
            current_rev=data.get("current_rev"),
            scanning=data.get("scanning", False),
            experiments=experiments,
        )


@dataclass
class ExperimentDefaults:
    """Default argument values for an experiment."""

    file: str
    class_name: str
    arguments: dict[str, Any]

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "ExperimentDefaults":
        return cls(
            file=data["file"],
            class_name=data["class_name"],
            arguments=data.get("arguments", {}),
        )


@dataclass
class SubmitAndWaitResult:
    """Result of a submit-and-wait operation."""

    rid: int
    status: str
    timed_out: bool

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "SubmitAndWaitResult":
        return cls(
            rid=data["rid"],
            status=data["status"],
            timed_out=data.get("timed_out", False),
        )
