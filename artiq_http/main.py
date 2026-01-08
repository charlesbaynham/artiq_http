import argparse
import asyncio
import concurrent
import logging
import sys

import uvicorn
from sipyco import common_args
from sipyco.pc_rpc import Server

from .api import app as fastapi_app

logger = logging.getLogger(__name__)

# If uvloop is installed, prevent its use by replacing it with the default
# asyncio loop. This is because sipyco uses private members of asyncio, breaking
# uvloop
try:
    import uvloop  # type: ignore
    import asyncio

    sys.modules["uvloop"] = asyncio
except ImportError:
    pass


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


async def run_fastapi_server(args):
    loop = asyncio.get_event_loop()
    with concurrent.futures.ProcessPoolExecutor() as pool:
        await loop.run_in_executor(pool, fastapi, args)


def fastapi(args):
    uvicorn.run(fastapi_app, host="0.0.0.0", port=args.http_port),


def main():
    args = get_argparser().parse_args()
    common_args.init_logger_from_args(args)

    async def main_loop():
        tasks = [
            asyncio.create_task(run_fastapi_server(args)),
            asyncio.create_task(run_rpc_server(args)),
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
