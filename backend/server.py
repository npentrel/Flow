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
from flask import Flask
from flask import jsonify

from flask.ext.cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)
thread = None

db = {}


@app.route('/update/concentration/<float:concentration>')
def update_concentration(concentration):
    # print("Concentration!: ", concentration)
    socketio.emit('museData', {'date': time.time(),
                               'concentration': concentration})
    return 'OK'


@socketio.on('lineRange')
def handle_message(json):
    for i in range(json['from'], json['to']):
        if i not in db:
            db[i] = {'accum': 0, 'count': 0}
        db[i] = {'accum': db[i]['accum'] + json['concentration'],
                 'count': db[i]['count'] + 1}


@app.route('/report/<int:max_line>', methods=['GET'])
def report(max_line):
    report = []
    for i in range(max_line):
        if i not in db:
            average = 0
        else:
            average = float(db[i]['accum']) / float(db[i]['count'])
        highlight = ""
        if average <= 0.33:
            highlight = 'bad'
        elif average <= 0.66:
            highlight = 'warning'
        else:
            highlight = 'good'

        report.append({'lineNo': i,
                       'highlight': highlight,
                       'average': average})
        print('[{}] = {}, highlight: {}'.format(i, average, highlight))

    print(str(db))
    print(str(report))
    return jsonify({'lineAnotations': report})

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
