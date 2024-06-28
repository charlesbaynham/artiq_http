import argparse
import asyncio
import concurrent.futures
import logging
import os
import signal
import threading
import time

import uvicorn
from sipyco import common_args
from sipyco.pc_rpc import Server

from .api import app as fastapi_app

logger = logging.getLogger(__name__)


def get_argparser():
    parser = argparse.ArgumentParser(
        description="""ARTIQ RESTful API and basic web interface."""
    )
    parser.add_argument(
        "--http-port",
        default=8000,
        help="Port for HTTP interface (as opposed to RPC server)",
    )

    common_args.simple_network_args(parser, 10001)
    common_args.verbosity_args(parser)
    return parser


class TrivialServer:
    def ping():
        return True


async def run_rpc_server(args):
    logger.info("Starting trivial RPC server.")
    server = Server({"trivial": TrivialServer()}, None, True)

    await server.start(common_args.bind_address_from_args(args), args.port)
    try:
        await server.wait_terminate()
    finally:
        await server.stop()


def fastapi(args):
    uvicorn.run(fastapi_app, host="0.0.0.0", port=args.http_port),


def start_thread_to_terminate_when_parent_process_dies(ppid):
    # See https://stackoverflow.com/questions/71300294/how-to-terminate-pythons-processpoolexecutor-when-parent-process-dies
    pid = os.getpid()

    def f():
        while True:
            try:
                os.kill(ppid, 0)
            except OSError:
                os.kill(pid, signal.SIGTERM)
            time.sleep(1)

    thread = threading.Thread(target=f, daemon=True)
    thread.start()


async def run_fastapi_server(args):
    loop = asyncio.get_event_loop()
    with concurrent.futures.ProcessPoolExecutor(
        initializer=start_thread_to_terminate_when_parent_process_dies,
        initargs=(os.getpid(),),
    ) as pool:
        await loop.run_in_executor(pool, fastapi, args)


def main():
    args = get_argparser().parse_args()
    common_args.init_logger_from_args(args)

    async def main_loop():
        tasks = [
            asyncio.create_task(run_fastapi_server(args)),
            # asyncio.create_task(run_rpc_server(args)),
        ]
        for t in asyncio.as_completed(tasks):
            try:
                await t
            except asyncio.CancelledError:
                pass

            logger.info("One of RPC server or FastAPI server closed - terminating all")
            for t in tasks:
                t.cancel()

    asyncio.run(main_loop())


if __name__ == "__main__":
    main()
