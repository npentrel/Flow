var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.get('/', function(req, res){
  res.sendfile('index.html');
});

http.listen(5000, function(){
  console.log('listening on *:5000');
});

io.on('connection', function(socket){
  console.log('connection: ' + socket.id);

  var t;
  function timeout() {
    t = setTimeout(function() {
      var museData = {
        time: moment().milliseconds(),
        concentration: moment().milliseconds()
      };
      console.log('emitting: ' + JSON.stringify(museData));
      socket.emit('museData', JSON.stringify(museData));
      timeout(t);
    }, 3000);
  }
  timeout();

  socket.on('disconnect', function(){
    clearTimeout(t);
    console.log('disconnection: ' + socket.id);
  });
  socket.on('lineRange', function(lineRange){
    console.log(lineRange);
  })

});

