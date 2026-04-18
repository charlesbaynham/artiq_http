"""Main ArtiqClient and sub-clients for the ARTIQ HTTP client SDK."""

from __future__ import annotations

from typing import Any, Optional
from urllib.parse import quote

import httpx

from ._models import (
    ExperimentDefaults,
    ExperimentList,
    ExpID,
    ScheduleItem,
    SubmitAndWaitResult,
)


class ScheduleClient:
    """Client for the /api/schedule endpoints."""

    def __init__(self, http: httpx.Client) -> None:
        self._http = http

    def list(self) -> dict[int, ScheduleItem]:
        """Return all scheduled experiments keyed by RID."""
        response = self._http.get("/api/schedule")
        response.raise_for_status()
        data: dict[str, Any] = response.json()
        return {int(rid): ScheduleItem.from_dict(item) for rid, item in data.items()}

    def get(self, rid: int) -> ScheduleItem:
        """Return a single scheduled experiment by RID. Raises 404 if not found."""
        response = self._http.get(f"/api/schedule/{rid}")
        response.raise_for_status()
        return ScheduleItem.from_dict(response.json())

    def submit(
        self,
        expid: ExpID,
        pipeline: str = "main",
        priority: int = 0,
        flush: bool = False,
        due_date: Optional[float] = None,
    ) -> int:
        """Submit an experiment and return its RID."""
        payload: dict[str, Any] = {
            "expid": expid.to_dict(),
            "pipeline": pipeline,
            "priority": priority,
            "flush": flush,
        }
        if due_date is not None:
            payload["due_date"] = due_date
        response = self._http.post("/api/schedule", json=payload)
        response.raise_for_status()
        return int(response.json())

    def submit_and_wait(
        self,
        expid: ExpID,
        timeout: float = 60.0,
        pipeline: str = "main",
        priority: int = 0,
        flush: bool = False,
        due_date: Optional[float] = None,
    ) -> SubmitAndWaitResult:
        """Submit an experiment and wait for it to complete."""
        payload: dict[str, Any] = {
            "expid": expid.to_dict(),
            "pipeline": pipeline,
            "priority": priority,
            "flush": flush,
            "timeout": timeout,
        }
        if due_date is not None:
            payload["due_date"] = due_date
        response = self._http.post("/api/schedule/submit-and-wait", json=payload)
        response.raise_for_status()
        return SubmitAndWaitResult.from_dict(response.json())

    def cancel(self, rid: int, force: bool = False) -> None:
        """Cancel a scheduled experiment by RID."""
        payload: dict[str, Any] = {"rid": rid, "force": force}
        response = self._http.post("/api/cancel", json=payload)
        response.raise_for_status()


class ExplistClient:
    """Client for the /api/explist endpoints."""

    def __init__(self, http: httpx.Client) -> None:
        self._http = http

    def list(self) -> ExperimentList:
        """Return the full experiment list."""
        response = self._http.get("/api/explist")
        response.raise_for_status()
        return ExperimentList.from_dict(response.json())

    def search(self, q: str) -> ExperimentList:
        """Search the experiment list by query string."""
        response = self._http.get("/api/explist/search", params={"q": q})
        response.raise_for_status()
        return ExperimentList.from_dict(response.json())

    def get_defaults(self, file: str, class_name: str) -> ExperimentDefaults:
        """Return default arguments for an experiment. Raises 404 if not found."""
        encoded_file = quote(file, safe="")
        encoded_class = quote(class_name, safe="")
        response = self._http.get(f"/api/explist/{encoded_file}/{encoded_class}/defaults")
        response.raise_for_status()
        return ExperimentDefaults.from_dict(response.json())


class DatasetsClient:
    """Client for the /api/datasets endpoints."""

    def __init__(self, http: httpx.Client) -> None:
        self._http = http

    def list(self) -> dict[str, Any]:
        """Return all datasets."""
        response = self._http.get("/api/datasets")
        response.raise_for_status()
        return response.json()

    def names(self) -> list[str]:
        """Return all dataset names."""
        response = self._http.get("/api/datasets/names")
        response.raise_for_status()
        return response.json()["names"]

    def values(self, names: list[str]) -> dict[str, Any]:
        """Return dataset values for the given names."""
        params = {"names": ",".join(names)}
        response = self._http.get("/api/datasets/values", params=params)
        response.raise_for_status()
        return response.json()


class HealthClient:
    """Client for the /api/health endpoint."""

    def __init__(self, http: httpx.Client) -> None:
        self._http = http

    def get(self) -> dict[str, Any]:
        """Return health status of the ARTIQ HTTP server."""
        response = self._http.get("/api/health")
        response.raise_for_status()
        return response.json()


class ArtiqClient:
    """
    Python client for the ARTIQ HTTP server.

    Usage::

        with ArtiqClient("http://localhost:8000") as client:
            health = client.health.get()
            experiments = client.explist.list()
            rid = client.schedule.submit(ExpID(file="repo/exp.py", class_name="MyExp"))
    """

    def __init__(
        self,
        base_url: str = "http://localhost:8000",
        timeout: float = 30.0,
    ) -> None:
        self._http = httpx.Client(base_url=base_url, timeout=timeout)
        self._schedule: Optional[ScheduleClient] = None
        self._explist: Optional[ExplistClient] = None
        self._datasets: Optional[DatasetsClient] = None
        self._health: Optional[HealthClient] = None

    def close(self) -> None:
        """Close the underlying HTTP client."""
        self._http.close()

    def __enter__(self) -> "ArtiqClient":
        return self

    def __exit__(self, *args: Any) -> None:
        self.close()

    @property
    def schedule(self) -> ScheduleClient:
        """Access schedule-related endpoints."""
        if self._schedule is None:
            self._schedule = ScheduleClient(self._http)
        return self._schedule

    @property
    def explist(self) -> ExplistClient:
        """Access experiment list endpoints."""
        if self._explist is None:
            self._explist = ExplistClient(self._http)
        return self._explist

    @property
    def datasets(self) -> DatasetsClient:
        """Access dataset endpoints."""
        if self._datasets is None:
            self._datasets = DatasetsClient(self._http)
        return self._datasets

    @property
    def health(self) -> HealthClient:
        """Access health endpoint."""
        if self._health is None:
            self._health = HealthClient(self._http)
        return self._health
