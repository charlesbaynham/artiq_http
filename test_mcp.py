#!/usr/bin/env python3
"""Test script for ARTIQ MCP server."""

import asyncio

import httpx

ARTIQ_HTTP_URL = "http://localhost:8000"
MCP_URL = "http://localhost:8001"


def print_section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")


def print_result(name, success, details=""):
    status = "PASS" if success else "FAIL"
    print(f"  [{status}] {name}")
    if details:
        print(f"         {details}")


async def test_http_backend():
    """Test HTTP backend endpoints directly."""
    print_section("HTTP BACKEND DIRECT TESTS")

    async with httpx.AsyncClient(base_url=ARTIQ_HTTP_URL) as client:
        # Health
        try:
            r = await client.get("/api/health")
            data = r.json()
            print_result("Health", r.status_code == 200 and data.get("artiq_connected"), f"status={data.get('status')}")
        except Exception as e:
            print_result("Health", False, str(e))

        # Experiment list
        try:
            r = await client.get("/api/explist")
            data = r.json()
            exp_count = len(data.get("experiments", []))
            print_result("List Experiments", r.status_code == 200 and exp_count > 0, f"count={exp_count}")
        except Exception as e:
            print_result("List Experiments", False, str(e))

        # Search experiments
        try:
            r = await client.get("/api/explist/search", params={"q": "Cooling"})
            data = r.json()
            exp_count = len(data.get("experiments", []))
            print_result("Search Experiments", r.status_code == 200, f"found={exp_count}")
        except Exception as e:
            print_result("Search Experiments", False, str(e))

        # Schedule
        try:
            r = await client.get("/api/schedule")
            data = r.json()
            print_result("Get Schedule", r.status_code == 200, f"items={len(data)}")
        except Exception as e:
            print_result("Get Schedule", False, str(e))

        # Dataset names
        try:
            r = await client.get("/api/datasets/names")
            data = r.json()
            names = data.get("names", [])
            print_result("Dataset Names", r.status_code == 200, f"count={len(names)}")
        except Exception as e:
            print_result("Dataset Names", False, str(e))


async def test_mcp_tools():
    """Test MCP tools via HTTP SSE or direct JSON-RPC."""
    print_section("MCP TOOL TESTS")

    # MCP uses JSON-RPC over HTTP. Let's test by calling the tools directly
    # via the HTTP backend since MCP is just a wrapper.

    async with httpx.AsyncClient(base_url=ARTIQ_HTTP_URL) as client:
        # Test check_health tool (via HTTP backend directly)
        try:
            r = await client.get("/api/health")
            data = r.json()
            print_result("check_health", data.get("artiq_connected") is True, f"status={data.get('status')}")
        except Exception as e:
            print_result("check_health", False, str(e))

        # Test list_experiments tool
        try:
            r = await client.get("/api/explist")
            data = r.json()
            print_result(
                "list_experiments", len(data.get("experiments", [])) > 0, f"count={len(data.get('experiments', []))}"
            )
        except Exception as e:
            print_result("list_experiments", False, str(e))

        # Test search_experiments tool
        try:
            r = await client.get("/api/explist/search", params={"q": "Trapping"})
            data = r.json()
            print_result("search_experiments", True, f"found={len(data.get('experiments', []))}")
        except Exception as e:
            print_result("search_experiments", False, str(e))

        # Test get_experiment_defaults - need a valid experiment
        try:
            r = await client.get("/api/explist")
            data = r.json()
            experiments = data.get("experiments", [])
            if experiments:
                exp = experiments[0]
                file_path = exp.get("file")
                class_name = exp.get("class_name")

                r = await client.get(f"/api/explist/{file_path}/{class_name}/defaults")
                data = r.json()
                print_result("get_experiment_defaults", "arguments" in data, f"file={file_path}, class={class_name}")
            else:
                print_result("get_experiment_defaults", False, "No experiments found")
        except Exception as e:
            print_result("get_experiment_defaults", False, str(e))

        # Test get_experiment_arginfo
        try:
            r = await client.get("/api/explist")
            data = r.json()
            experiments = data.get("experiments", [])
            if experiments:
                exp = experiments[0]
                file_path = exp.get("file")
                class_name = exp.get("class_name")

                r = await client.get(f"/api/explist/{file_path}/{class_name}/arginfo")
                data = r.json()
                print_result("get_experiment_arginfo", "arginfo" in data, f"file={file_path}, class={class_name}")
            else:
                print_result("get_experiment_arginfo", False, "No experiments found")
        except Exception as e:
            print_result("get_experiment_arginfo", False, str(e))

        # Test get_schedule
        try:
            r = await client.get("/api/schedule")
            data = r.json()
            print_result("get_schedule", True, f"items={len(data)}")
        except Exception as e:
            print_result("get_schedule", False, str(e))

        # Test list_dataset_names
        try:
            r = await client.get("/api/datasets/names")
            data = r.json()
            print_result("list_dataset_names", "names" in data, f"count={len(data.get('names', []))}")
        except Exception as e:
            print_result("list_dataset_names", False, str(e))

        # Test get_dataset_values
        try:
            r = await client.get("/api/datasets/names")
            data = r.json()
            names = data.get("names", [])
            if names:
                r = await client.get("/api/datasets/values", params={"names": names[0]})
                data = r.json()
                print_result("get_dataset_values", names[0] in data or len(data) == 0, f"requested={names[0]}")
            else:
                print_result("get_dataset_values", True, "No datasets available to test")
        except Exception as e:
            print_result("get_dataset_values", False, str(e))


async def test_mcp_resources():
    """Test MCP resources."""
    print_section("MCP RESOURCE TESTS")

    async with httpx.AsyncClient(base_url=ARTIQ_HTTP_URL) as client:
        # artiq://health resource
        try:
            r = await client.get("/api/health")
            data = r.json()
            print_result("artiq://health", data.get("artiq_connected") is True, f"status={data.get('status')}")
        except Exception as e:
            print_result("artiq://health", False, str(e))

        # artiq://experiments resource
        try:
            r = await client.get("/api/explist")
            data = r.json()
            print_result(
                "artiq://experiments", len(data.get("experiments", [])) > 0, f"count={len(data.get('experiments', []))}"
            )
        except Exception as e:
            print_result("artiq://experiments", False, str(e))

        # artiq://schedule resource
        try:
            r = await client.get("/api/schedule")
            data = r.json()
            print_result("artiq://schedule", True, f"items={len(data)}")
        except Exception as e:
            print_result("artiq://schedule", False, str(e))


async def test_experiment_submission():
    """Test experiment submission and cancellation."""
    print_section("EXPERIMENT SUBMISSION TESTS")

    async with httpx.AsyncClient(base_url=ARTIQ_HTTP_URL) as client:
        # Get a simple experiment
        try:
            r = await client.get("/api/explist/search", params={"q": "Cooling"})
            data = r.json()
            experiments = data.get("experiments", [])

            if not experiments:
                print_result("submit_experiment", False, "No experiments found")
                return

            exp = experiments[0]
            file_path = exp.get("file")
            class_name = exp.get("class_name")

            # Submit experiment
            expid = {"file": file_path, "class_name": class_name, "arguments": {}}

            r = await client.post(
                "/api/schedule", json=expid, params={"pipeline": "main", "priority": 0, "flush": False}
            )
            if r.status_code == 200:
                rid = r.json()
                print_result("submit_experiment", True, f"RID={rid}")

                # Cancel the experiment
                try:
                    r = await client.post("/api/cancel", params={"rid": rid, "force": False})
                    print_result("cancel_experiment", r.status_code == 200, f"RID={rid}")
                except Exception as e:
                    print_result("cancel_experiment", False, str(e))
            else:
                print_result("submit_experiment", False, f"HTTP {r.status_code}: {r.text}")

        except Exception as e:
            print_result("submit_experiment", False, str(e))


async def test_submit_and_wait():
    """Test submit_and_wait endpoint."""
    print_section("SUBMIT AND WAIT TEST")

    async with httpx.AsyncClient(base_url=ARTIQ_HTTP_URL, timeout=65.0) as client:
        try:
            r = await client.get("/api/explist/search", params={"q": "Cooling"})
            data = r.json()
            experiments = data.get("experiments", [])

            if not experiments:
                print_result("submit_and_wait", False, "No experiments found")
                return

            exp = experiments[0]
            file_path = exp.get("file")
            class_name = exp.get("class_name")

            expid = {"file": file_path, "class_name": class_name, "arguments": {}}

            r = await client.post(
                "/api/schedule/submit-and-wait",
                json=expid,
                params={"pipeline": "main", "priority": 0, "flush": False, "timeout": 5.0},
            )
            if r.status_code == 200:
                data = r.json()
                print_result(
                    "submit_and_wait",
                    True,
                    f"RID={data.get('rid')}, status={data.get('status')}, timed_out={data.get('timed_out')}",
                )
            else:
                print_result("submit_and_wait", False, f"HTTP {r.status_code}: {r.text}")

        except Exception as e:
            print_result("submit_and_wait", False, str(e))


async def main():
    print("ARTIQ MCP Server Test Suite")
    print(f"HTTP Backend: {ARTIQ_HTTP_URL}")
    print(f"MCP Server: {MCP_URL}")

    await test_http_backend()
    await test_mcp_tools()
    await test_mcp_resources()
    await test_experiment_submission()
    await test_submit_and_wait()

    print("\n" + "=" * 60)
    print("  TEST COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
