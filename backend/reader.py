#!/usr/bin/env python3
import argparse
import math
import time

from pythonosc import dispatcher
from pythonosc import osc_server


def concentration_handler(unused_addr, args, ch1):
    print("Concentration: ", ch1)
    log.write("{0},{1}\n".format(time.time(), ch1))
    log.flush()
    #logging.info("{0},{1}".format(time.time(), ch1))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--ip",
                        default="127.0.0.1",
                        help="The ip to listen on")
    parser.add_argument("--port",
                        type=int,
                        default=5000,
                        help="The port to listen on")
    parser.add_argument("--logfile",
                        default="muse.log",
                        help="The Concentration log file")
    args = parser.parse_args()

    dispatcher = dispatcher.Dispatcher()
    dispatcher.map("/debug", print)
    dispatcher.map("/muse/elements/experimental/concentration", concentration_handler, "Concentration")
    
    with open(args.logfile, 'w') as log:
        server = osc_server.ThreadingOSCUDPServer(
            (args.ip, args.port), dispatcher)
        print("Serving on {}".format(server.server_address))
        server.serve_forever()
