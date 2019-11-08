// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);


app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'game.html'));
});

server.listen(process.env.PORT || 5000, function(){
console.log("Express server listening on port %d in %s mode", this.address().port,app.settings.env)});


var players = {};
io.on('connection', function(socket) {
	util.log('A new player connected'+client.id);
  socket.on('disconnect', function(){
	  client.on('A player disconnected'+client.id)
  });
});
/*
  socket.on('new player', function() {
    players[socket.id] = {
      x: 300,
      y: 300
    };
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  },1000 / 60)});
  */