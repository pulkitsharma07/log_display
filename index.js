var fs = require('fs');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var send_delta_log = function(socket) {
  fs.readFile("log_file.log", "utf8", function(err, data) {
    if (err) throw err;
    socket.emit("change",data.substr(socket.curr_eof,data.length));
    socket.curr_eof = data.length;
  });
}

app.get('/', function(req, res) {
	res.sendfile('index.html');
});


io.on('connection', function(socket) {
  socket.curr_eof = 0;
  send_delta_log(socket);

  fs.watchFile("log_file.log",function(err,data) {
  	send_delta_log(socket);
  });

});

http.listen(3000, function() {
  console.log('listening on *:3000');
});