var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

http.listen(5000, function(){
  console.log('listening on *:5000');
});

io.on('connection', function(socket){
  console.log('connection');
  socket.on('disconnect', function(){
    console.log('disconnection');
  });
  socket.on('lineRange', function(lineRange){
    console.log(lineRange);
  })
});

