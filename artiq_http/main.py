import argparse
import logging
import os
import sys

import uvicorn

from .api import app as fastapi_app

logger = logging.getLogger(__name__)

# If uvloop is installed, prevent its use by replacing it with the default
# asyncio loop. This is because sipyco uses private members of asyncio, breaking
# uvloop
try:
    import uvloop  # type: ignore  # noqa: F401
    import asyncio

    sys.modules["uvloop"] = asyncio
except ImportError:
    pass


def get_argparser():
    parser = argparse.ArgumentParser(description="""ARTIQ RESTful API and basic web interface.""")
    parser.add_argument(
        "--port",
        type=int,
        default=int(os.getenv("ARTIQ_HTTP_SERVER_PORT", "8000")),
        help="Port for HTTP server",
    )
    parser.add_argument(
        "--host",
        default=os.getenv("ARTIQ_HTTP_SERVER_HOST", "0.0.0.0"),
        help="Host address to bind to",
    )
    parser.add_argument(
        "--log-level",
        default=os.getenv("ARTIQ_HTTP_LOG_LEVEL", "INFO"),
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        help="Logging level",
    )
    return parser


def main():
    args = get_argparser().parse_args()

    # Configure logging
    logging.basicConfig(
        level=getattr(logging, args.log_level),
        format="%(levelname)s:%(name)s:%(message)s",
    )

    logger.info("Starting ARTIQ HTTP server on %s:%d", args.host, args.port)
    uvicorn.run(fastapi_app, host=args.host, port=args.port)


if __name__ == "__main__":
    main()
