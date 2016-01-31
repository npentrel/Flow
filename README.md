<<<<<<< HEAD
# Flow

backend
=======

install
-------
```
virtualenv -p python3 venv
source venv/bin/activate
pip install -r requirements.txt
```

run
-----
```
muse-io --device Muse-1E7D --osc osc.udp://localhost:5000
./reader.py
./server.py
```

frontend
========
install
------
```
cd ./websocket-dummy/ && npm install`
cd ..
cd ./frontend/ && npm install`
```

run
---

```
cd ./websocket-dummy/ && npm start &
cd ..
cd ./frontend/ && npm start
```

idea-graveyard
--------------

 [X] Plot concentration data over time above
 [ ] File upload, github import
 [ ] Use HPE API to do prediction/smoothing
      * Topic modeling/extraction?
