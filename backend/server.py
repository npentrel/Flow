#!/usr/bin/env python

# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on available packages.
async_mode = None

if async_mode is None:
    try:
        import eventlet
        async_mode = 'eventlet'
    except ImportError:
        pass

    if async_mode is None:
        try:
            from gevent import monkey
            async_mode = 'gevent'
        except ImportError:
            pass

    if async_mode is None:
        async_mode = 'threading'

    print('async_mode is ' + async_mode)

import time
from flask import Flask, session
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)
thread = None


@app.route('/update/concentration/<float:concentration>')
def update_concentration(concentration):
        session['receive_count'] = session.get('receive_count', 0) + 1
        print("Concentration!: ", concentration)
        socketio.emit('museData', {'date': time.time(),
                                   'concentration': concentration})
        return 'OK'

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
