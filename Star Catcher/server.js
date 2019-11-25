var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};
//random position for item
var star = {
	x: Math.floor(Math.random() * 1000) + 50,
  	y: Math.floor(Math.random() * 600) + 50
};// close star

//score variables
var scores = {
	blue: 0,
  	red: 0
}; // close scores

//go into the public folder
app.use(express.static(__dirname + '/public'));
//find index.html file to start the game
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.php');
});
//when a player connect
io.on('connection', function (socket) {
	console.log('a user connected: ', socket.id);
  	// create a new player and add it to our players object
  	players[socket.id] = {
    		rotation: 0,
		//spawn the player in a random place
    		x: Math.floor(Math.random() * 700) + 50,
    		y: Math.floor(Math.random() * 500) + 50,
    		playerId: socket.id,
    		team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
  	}; // close players
	
  	// send the players object to the new player
  	socket.emit('currentPlayers', players);
	
  	// send the star object to the new player
  	socket.emit('starLocation', star);
	
  	// send the current scores
  	socket.emit('scoreUpdate', scores);
	
	
	
  	// update all other players of the new player
  	socket.broadcast.emit('newPlayer', players[socket.id]);

  	// when a player disconnects, remove them from our players object
  	socket.on('disconnect', function () {
    		console.log('user disconnected: ', socket.id);
    		delete players[socket.id];
    		// emit a message to all players to remove this player
    		io.emit('disconnect', socket.id);
	}); // close socket

	// when a player moves, update the player data
	socket.on('playerMovement', function (movementData) {
		players[socket.id].x = movementData.x;
		players[socket.id].y = movementData.y;
		players[socket.id].rotation = movementData.rotation;
		// emit a message to all players about the player that moved
		socket.broadcast.emit('playerMoved', players[socket.id]);
	}); // close socket

	socket.on('starCollected', function () {
		if (players[socket.id].team === 'red') {
			//add 10 points to red when red player collects item
			scores.red += 10;			
		} else {
			//add 10 points to blue when blue player collects item
			scores.blue += 10;
		}// close if	
			
		
		//reset the item to random position
		star.x = Math.floor(Math.random() * 1000) + 50;
		star.y = Math.floor(Math.random() * 600) + 50;
		io.emit('starLocation', star);
		io.emit('scoreUpdate', scores);
	}); // close socket
	
	socket.on('scoreReset', function() {
		scores.red = 0;
		scores.blue = 0;
	});
	
});

//have the port listen on the web server. if it is unavailable use port 5000 for local server
server.listen(process.env.PORT || 5000, function () {
	console.log("Express server listening on port %d in %s mode", this.address().port,app.settings.env)
}); // close listener
