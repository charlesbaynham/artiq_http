#!/usr/bin/env python3
"""Manual test of all MCP server tools, prompts, and resources."""

import asyncio
import json
import os

import pytest
from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client

MCP_URL = os.getenv("MCP_URL", "http://localhost:8001/mcp")


@pytest.mark.realserver
async def test_all():
    print("=" * 70)
    print("CONNECTING TO MCP SERVER")
    print("=" * 70)

    async with streamable_http_client(MCP_URL) as (read, write, get_session_id):
        async with ClientSession(read, write) as session:
            await session.initialize()
            print("Connected successfully!")
            print()

            # -----------------------------------------------------------------
            # List available primitives
            # -----------------------------------------------------------------
            print("=" * 70)
            print("LISTING TOOLS")
            print("=" * 70)
            tools = await session.list_tools()
            print(f"Found {len(tools.tools)} tools:")
            for tool in tools.tools:
                print(f"  - {tool.name}: {tool.description[:80]}...")
            print()

            print("=" * 70)
            print("LISTING PROMPTS")
            print("=" * 70)
            prompts = await session.list_prompts()
            print(f"Found {len(prompts.prompts)} prompts:")
            for prompt in prompts.prompts:
                print(f"  - {prompt.name}")
            print()

            print("=" * 70)
            print("LISTING RESOURCES")
            print("=" * 70)
            resources = await session.list_resources()
            print(f"Found {len(resources.resources)} resources:")
            for res in resources.resources:
                print(f"  - {res.uri}")
            print()

            # -----------------------------------------------------------------
            # Test Tools
            # -----------------------------------------------------------------
            print("=" * 70)
            print("TESTING TOOLS")
            print("=" * 70)

            # 1. check_health
            print("\n--- 1. check_health ---")
            result = await session.call_tool("check_health", {})
            print(format_result(result))

            # 2. list_experiments
            print("\n--- 2. list_experiments ---")
            result = await session.call_tool("list_experiments", {})
            data = format_result(result)
            if "experiments" in data:
                print(f"Experiments count: {len(data['experiments'])}")
                for exp in data["experiments"][:3]:
                    print(f"  - {exp.get('name', 'unknown')} ({exp.get('file', 'unknown')})")
                if len(data["experiments"]) > 3:
                    print(f"  ... and {len(data['experiments']) - 3} more")

            # 3. search_experiments
            print("\n--- 3. search_experiments (query='Cooling') ---")
            result = await session.call_tool("search_experiments", {"query": "Cooling"})
            data = format_result(result)
            if "experiments" in data:
                print(f"Found {len(data['experiments'])} matching experiments")
                for exp in data["experiments"][:3]:
                    print(f"  - {exp.get('name', 'unknown')}")

            # 4. get_experiment_defaults
            print("\n--- 4. get_experiment_defaults ---")
            result = await session.call_tool(
                "get_experiment_defaults",
                {
                    "file": "Cooling/RF/Basic_Cooling_RF_454.py",
                    "class_name": "BasicCoolingRF454",
                },
            )
            print(format_result(result))

            # 5. get_experiment_arginfo
            print("\n--- 5. get_experiment_arginfo ---")
            result = await session.call_tool(
                "get_experiment_arginfo",
                {
                    "file": "Cooling/RF/Basic_Cooling_RF_454.py",
                    "class_name": "BasicCoolingRF454",
                },
            )
            data = format_result(result)
            if isinstance(data, dict) and "arginfo" in data:
                print(f"Parameters: {list(data['arginfo'].keys())}")
            else:
                print(data)

            # 6. get_schedule
            print("\n--- 6. get_schedule ---")
            result = await session.call_tool("get_schedule", {})
            print(format_result(result))

            # 7. submit_experiment
            print("\n--- 7. submit_experiment ---")
            result = await session.call_tool(
                "submit_experiment",
                {
                    "file": "Cooling/RF/Basic_Cooling_RF_454.py",
                    "class_name": "BasicCoolingRF454",
                    "arguments": {"frequency": 150e6, "amplitude": 0.8, "count": 5},
                },
            )
            data = format_result(result)
            print(data)
            rid = data if isinstance(data, int) else None
            print(f"Submitted with RID: {rid}")

            # Re-check schedule
            print("\n--- 8. get_schedule (after submit) ---")
            result = await session.call_tool("get_schedule", {})
            data = format_result(result)
            print(data)

            # 8. submit_and_wait
            print("\n--- 9. submit_and_wait ---")
            result = await session.call_tool(
                "submit_and_wait",
                {
                    "file": "idle.py",
                    "class_name": "Idle",
                    "timeout_seconds": 5,
                },
            )
            print(format_result(result))

            # 9. cancel_experiment
            print("\n--- 10. cancel_experiment ---")
            # Cancel may 404 since mock schedule doesn't persist properly
            try:
                result = await session.call_tool("cancel_experiment", {"rid": 999})
                print(format_result(result))
            except Exception as e:
                print(f"Expected error (RID not found): {type(e).__name__}")

            # 10. list_dataset_names
            print("\n--- 11. list_dataset_names ---")
            result = await session.call_tool("list_dataset_names", {})
            data = format_result(result)
            if isinstance(data, list):
                print(f"Datasets: {data}")

            # 11. get_dataset_values
            print("\n--- 12. get_dataset_values ---")
            result = await session.call_tool(
                "get_dataset_values",
                {"names": ["test.counter", "test.voltage", "test.array"]},
            )
            print(format_result(result))

            # -----------------------------------------------------------------
            # Test Prompts
            # -----------------------------------------------------------------
            print("\n" + "=" * 70)
            print("TESTING PROMPTS")
            print("=" * 70)

            print("\n--- run_experiment_workflow ---")
            try:
                result = await session.get_prompt("run_experiment_workflow", {"experiment_name": "Cooling"})
                for msg in result.messages[:2]:
                    print(f"  [{msg.role}]: {msg.content.text[:100]}...")
            except Exception as e:
                print(f"  Error: {e}")

            print("\n--- analyze_datasets ---")
            try:
                result = await session.get_prompt("analyze_datasets", {})
                for msg in result.messages[:2]:
                    print(f"  [{msg.role}]: {msg.content.text[:100]}...")
            except Exception as e:
                print(f"  Error: {e}")

            print("\n--- manage_schedule ---")
            try:
                result = await session.get_prompt("manage_schedule", {})
                for msg in result.messages[:2]:
                    print(f"  [{msg.role}]: {msg.content.text[:100]}...")
            except Exception as e:
                print(f"  Error: {e}")

            # -----------------------------------------------------------------
            # Test Resources
            # -----------------------------------------------------------------
            print("\n" + "=" * 70)
            print("TESTING RESOURCES")
            print("=" * 70)

            print("\n--- artiq://health ---")
            result = await session.read_resource("artiq://health")
            print(result.contents[0].text[:500])

            print("\n--- artiq://experiments ---")
            result = await session.read_resource("artiq://experiments")
            text = result.contents[0].text
            print(text[:500] + "..." if len(text) > 500 else text)

            print("\n--- artiq://schedule ---")
            result = await session.read_resource("artiq://schedule")
            print(result.contents[0].text[:500])

            print("\n" + "=" * 70)
            print("ALL TESTS COMPLETE")
            print("=" * 70)


def format_result(result):
    """Extract structured data from tool result."""
    if hasattr(result, "isError") and result.isError:
        return f"Error: {result.content}"
    if hasattr(result, "structuredContent") and result.structuredContent is not None:
        sc = result.structuredContent
        # FastMCP wraps scalar returns in {"result": value}
        if isinstance(sc, dict) and "result" in sc and len(sc) == 1:
            return sc["result"]
        return sc
    if hasattr(result, "content") and result.content:
        for item in result.content:
            if hasattr(item, "text"):
                try:
                    return json.loads(item.text)
                except json.JSONDecodeError:
                    return item.text
    return result


if __name__ == "__main__":
    asyncio.run(test_all())
