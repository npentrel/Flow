#!/usr/bin/env python3
import argparse
import requests
import math
import time


from pythonosc import dispatcher
from pythonosc import osc_server

socket_server = "http://127.0.0.1:5000"


def concentration_handler(unused_addr, args, con):
    print("Concentration: ", con)
    requests.get(socket_server + "/update/concentration/{}".format(con))


def mellow_handler(unused_addr, args, mellow):
    print("Mellow: ", mellow)
    requests.get(socket_server + "/update/mellow/{}".format(mellow))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--ip",
                        default="127.0.0.1",
                        help="The ip to listen on")
    parser.add_argument("--port",
                        type=int,
                        default=8000,
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
