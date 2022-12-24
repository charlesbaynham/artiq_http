import argparse
import asyncio
import logging
import sys

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


def main():
    args = get_argparser().parse_args()
    common_args.init_logger_from_args(args)

    class TrivialServer:
        def ping():
            return True

    async def run_rpc_server():
        logger.info("Starting trivial RPC server.")
        server = Server({"trivial": TrivialServer()}, None, True)

        await server.start(common_args.bind_address_from_args(args), args.port)
        try:
            await server.wait_terminate()
        finally:
            await server.stop()

    def run_fastapi_server():
        uvicorn.run(fastapi_app, host=args.host, port=args.http_port)

    loop = asyncio.get_event_loop()

    loop.create_task(loop.run_in_executor(None, run_fastapi_server))
    try:
        loop.run_until_complete(run_rpc_server())
    except KeyboardInterrupt:
        pass
    finally:
        loop.close()

    if __name__ == "__main__":
        main()
