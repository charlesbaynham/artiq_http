# import asyncio
# import logging
# import time
# from dateutil.parser import parse as parse_date
# from sipyco.pc_rpc import Client
# SERVER = "labserver"
# async def submit_experiment(server, target_name, args, port=3251):
#     remote = Client(server, port, target_name)
#     try:
#         expid = {
#             "log_level": logging.WARNING,  # + args.quiet*10 - args.verbose*10,
#             "class_name": args.class_name,
#             "arguments": args.arguments,
#         }
#         expid["file"] = args.file
#         if args.repository:
#             expid["repo_rev"] = args.revision
#         if args.timed is None:
#             due_date = None
#         else:
#             due_date = time.mktime(parse_date(args.timed).timetuple())
#         rid = remote.submit(args.pipeline, expid, args.priority, due_date, args.flush)
#         return rid
#     finally:
#         remote.close_rpc()
# def cancel_experiment(server, rid, force=False, port=3251):
#     remote = Client(server, port, "master_schedule")
#     try:
#         if not force:
#             remote.request_termination(rid)
#         else:
#             remote.delete(rid)
#     finally:
#         remote.close_rpc()
