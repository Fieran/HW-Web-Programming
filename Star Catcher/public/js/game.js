var config = {
	type: Phaser.AUTO,
	parent: 'phaser-example',
	//width of game window curreently set to width of browser
	width: 1280,
  	//height of game window currently set to height of browser
  	height: 720,
	
	// Creates the physics used by the game.
  	physics: {
		default: 'arcade',
		arcade: {
			debug: false,
			gravity: { y: 0 }
		} // close arcane
	}, // close physics
	
	// Generates the scene
	scene: {
		preload: preload,
		create: create,
		update: update
  	}  // close scene
}; // close config

//creates the game configuration
var game = new Phaser.Game(config);

//loads the images for the game
function preload() {
	this.load.image('ship', 'assets/spaceShips_001.png');
	this.load.image('otherPlayer', 'assets/enemyBlack5.png');
	this.load.image('star', 'assets/star_gold.png');
}// close preload function

//creates the match
function create() {
	var self = this;
	this.socket = io();
	this.otherPlayers = this.physics.add.group();
	this.socket.on('currentPlayers', function (players) {
		Object.keys(players).forEach(function (id) {
			if (players[id].playerId === self.socket.id) {
        			addPlayer(self, players[id]);
      			} else {
        			addOtherPlayers(self, players[id]);
      			} // close if
    		}); // close forEach
	}); // close this.socket
	
	//gets the info of the new player that joined
	this.socket.on('newPlayer', function (playerInfo) {
    		addOtherPlayers(self, playerInfo);
  	}); // close socket
	
  	//deletes the player once they disconnect from the session
	this.socket.on('disconnect', function (playerId) {
	//updates for other player that, that player is gone
    		self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      			if (playerId === otherPlayer.playerId) {
        			otherPlayer.destroy();
      			}// close if
    		}); // close getChildren
  	}); // close socket
	
  	//updates the position of the player to other players once they move
  	this.socket.on('playerMoved', function (playerInfo) {
    		self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      			if (playerInfo.playerId === otherPlayer.playerId) {
        			otherPlayer.setRotation(playerInfo.rotation);
				//the rotation of the player
        			otherPlayer.setPosition(playerInfo.x, playerInfo.y);
      			} // close if
    		}); // close getChildren
  	}); // close socket
	
  	this.cursors = this.input.keyboard.createCursorKeys();
	
	//scoreboaard
	//blue scoreboard text
  	this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#0000FF' });
  	//red scoreboard text
  	this.redScoreText = this.add.text(584, 16, '', { fontSize: '32px', fill: '#FF0000' });
  	//sets the scores on the score board
  	this.socket.on('scoreUpdate', function (scores) {
    		self.blueScoreText.setText('Blue: ' + scores.blue);
    		self.redScoreText.setText('Red: ' + scores.red);
		if (scores.red >= 1000) {
                	window.alert("Red wins")
                	scores.blue = 0;
                	scores.red = 0;
                }// close if
		else if (scores.blue >= 1000) {
                	window.alert("Blue wins")
                	scores.blue = 0;
                	scores.red = 0;
                }// close if  
  	}); // close socket
	
	//the random location of the collected item in the game
  	this.socket.on('starLocation', function (starLocation) {
	  	//once the item is collected destroy the original item and spawn a new one at random coordinates
    		if (self.star) self.star.destroy();
    			self.star = self.physics.add.image(starLocation.x, starLocation.y, 'star');
    			self.physics.add.overlap(self.ship, self.star, function () {
      				this.socket.emit('starCollected');
    			}, null, self); // close physics
  		}); // close if
	} // close socket

	//create a player
	function addPlayer(self, playerInfo) {
  		//adds the image to the player from the assets folder
 		self.ship = self.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
  		//tints the players colour depending on what team they are
 		if (playerInfo.team === 'blue') {
	 		//blue tint
    			self.ship.setTint(0x0000ff);
  		} else {
	  		//red tint
    			self.ship.setTint(0xff0000);
  		} // close if
  		// creates the 'ice slide' effect on the player, giving it momentum as it flies
		self.ship.setDrag(100);
		self.ship.setAngularDrag(100);
		self.ship.setMaxVelocity(200);
	} // close addPlayer

	//when another player joins
	function addOtherPlayers(self, playerInfo) {
		//change the sprite of other players relative to the player that is seeing them
  		const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
  		if (playerInfo.team === 'blue') {
	  		//tints the sprite blue
    			otherPlayer.setTint(0x0000ff);
  		} else {//tints the sprite red
    			otherPlayer.setTint(0xff0000);
  		}// close if
  		otherPlayer.playerId = playerInfo.playerId;
  		self.otherPlayers.add(otherPlayer);
	} // close addOtherPlayers

	//update function for movement
	function update() {
  		if (this.ship) {
    			if (this.cursors.left.isDown) {
				//speed of ship
      				this.ship.setAngularVelocity(-150);
    			} else if (this.cursors.right.isDown) {
      				this.ship.setAngularVelocity(150);
    			} else {//speed is 0 when not pressing keys
      				this.ship.setAngularVelocity(0);
    			} // close if
 			 //accelerate the player the longer they go in one direction
    			if (this.cursors.up.isDown) {
      				this.physics.velocityFromRotation(this.ship.rotation + 1.5, 100, this.ship.body.acceleration);
    			} else {
      				this.ship.setAcceleration(0);
    			} // close if
  
    			this.physics.world.wrap(this.ship, 5);

    			// emit player movement
			var x = this.ship.x;
			var y = this.ship.y;
			var r = this.ship.rotation;
			if (this.ship.oldPosition && (x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y || r !== this.ship.oldPosition.rotation)) {
			this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation });
		} // close if
			
   		// save old position data
    		this.ship.oldPosition = {
			x: this.ship.x,
			y: this.ship.y,
			rotation: this.ship.rotation
    		}; // close oldPosition
	} // close update
}// close create
