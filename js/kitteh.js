var MOVEMENT_SPEED = 2;
var UPDATE_RATE = 30; // updates per second

$(document).ready(function() {
	var canvas = document.getElementById('playing_surface');
	$(canvas).attr("height", window.innerHeight - 100);
	$(canvas).attr("width", window.innerWidth - 100);
	$(canvas).css("top", 50);
	$(canvas).css("left", 50);

	Math.seedrandom("Hello");

	var whiskers = new Hero();
	whiskers.init();

	var game = new GameState(canvas, whiskers, 5, 2);
	var start = confirm("Start game?");
	if (start) {
		var interval = setInterval(function() {
			game.updateGameState();
		}, 1000 / UPDATE_RATE);
	}
});

function GameState(canvas, hero, enemy_frequency, kitty_frequency) {
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.hero = hero;
	this.enemies = [];
	this.kitties = [];
	this.boardHeight = canvas.height;
	this.boardWidth = canvas.width;
	this.iteration = 0;
	this.enemy_frequency = enemy_frequency;
	this.kitty_frequency = kitty_frequency;
	this.score = 0;

	this.updateGameState = function() {
		this.iteration++;

		if ((this.iteration / UPDATE_RATE) % this.enemy_frequency == 0) {
			// spawn a new enemy
			// spawn the new enemy far away from the hero so that it doesn't spawn kill the hero
			var xr = this.boardWidth / 4; // randomness range for x coord
			var yr = this.boardHeight / 4; // randomness range for y coord
			var x = (this.hero.x > this.boardWidth / 2) ? 0 + randInt(0, xr) : this.boardWidth - randInt(0, xr);
			var y = (this.hero.y > this.boardHeight / 2) ? 0 + randInt(0, yr) : this.boardHeight - randInt(0, yr);
			var enemy = new Enemy(x, y, randInt(-MOVEMENT_SPEED, MOVEMENT_SPEED) || 1,
									 randInt(-MOVEMENT_SPEED, MOVEMENT_SPEED) || 1);
			enemy.init();
			this.enemies.push(enemy);
		}
		if ((this.iteration / UPDATE_RATE) % this.kitty_frequency == 0) {
			// spawn a new kitty, put it anywhere
			var x = randInt(0, this.boardWidth);
			var y = randInt(0, this.boardHeight);
			var kitty = new Kitty(x, y, randInt(-MOVEMENT_SPEED, MOVEMENT_SPEED) || 1,
									 randInt(-MOVEMENT_SPEED, MOVEMENT_SPEED) || 1);
			kitty.init();
			this.kitties.push(kitty);
		}

		this.hero.move();
		this.hero.checkBounds(this.boardWidth, this.boardHeight);
		for (var i = 0; i < this.enemies.length; i++) {
			this.enemies[i].move();
			this.enemies[i].checkBounds(this.boardWidth, this.boardHeight);
		}
		for (var i = 0; i < this.kitties.length; i++) {
			this.kitties[i].move();
			this.kitties[i].checkBounds(this.boardWidth, this.boardHeight);
		}
		this.drawBoard();
	}

	this.checkCollisions = function() {
		// check the hero has not collided with an enemy
		for (var i = 0; i < enemies.length; i++) {

		}
	}

	this.drawBoard = function() {
		this.context.clearRect(0, 0, this.boardWidth, this.boardHeight);
		var fontsize = 24;
		this.context.font = fontsize.toString() + "px Arial";
		var ARIAL_ASPECT_RATIO = 0.52
		var score_str = "Score: " + this.score.toString();
		this.context.fillText(score_str, 
			this.boardWidth - (ARIAL_ASPECT_RATIO * fontsize * score_str.length), fontsize);
		this.hero.draw(this.context);
		for (var i = 0; i < this.enemies.length; i++) {
			this.enemies[i].draw(this.context);
		}
		for (var i = 0; i < this.kitties.length; i++) {
			this.kitties[i].draw(this.context);
		}
	}
}

function inheritsFrom(child, parent) {
	child.prototype = Object.create(parent.prototype);
}

function Character(x, y, dx, dy) {
	this.img = new Image();
	this.x = x || 0; // current x location
	this.y = y || 0; // current y location
	this.dx = dx || 0; // speed in the x direction
	this.dy = dy || 0; // speed in the y direction
	this.height = 50;
	this.width = 50;
}

Character.prototype.move = function() {
	this.x += this.dx;
	this.y += this.dy;
}

Character.prototype.checkBounds = function(boardWidth, boardHeight) {
	if (this.x < 0) {
		this.dx = MOVEMENT_SPEED;
		this.x = 0;
	} else if (this.x > (boardWidth - this.width)) {
		this.dx = -MOVEMENT_SPEED;
		this.x = boardWidth - this.width;
	}
	if (this.y < 0) {
		this.dy = MOVEMENT_SPEED;
		this.y = 0;
	} else if (this.y > (boardHeight - this.height)) {
		this.dy = -MOVEMENT_SPEED;
		this.y = boardHeight - this.height;
	}
}

Character.prototype.draw = function(context) {
	context.drawImage(this.img, this.x, this.y, this.width, this.height);
}

function Hero() {
	Character.call(this);
	this.init = function() {
		this.img = new Image();
		this.img.src = "images/whiskers.jpg";
		this.bindKeyboard();
	}
	var that = this;
	this.bindKeyboard = function () {
		window.onkeydown = function(e) {
			if (e.key == "ArrowRight") {
				that.dx = MOVEMENT_SPEED;
				that.dy = 0;
			} else if (e.key == "ArrowLeft") {
				that.dx = (0 - MOVEMENT_SPEED);
				that.dy = 0;
			} else if (e.key == "ArrowUp") {
				that.dy = (0 - MOVEMENT_SPEED);
				that.dx = 0;
			} else if (e.key == "ArrowDown") {
				that.dy = MOVEMENT_SPEED;
				that.dx = 0;
			}
		}

	}
}
inheritsFrom(Hero, Character);

function Kitty(x, y, dx, dy) {
	Character.call(this, x, y, dx, dy);
	this.init = function() {
		this.img.src = "images/kitten.png";
	}
}
inheritsFrom(Kitty, Character);

function Enemy(x, y, dx, dy) {
	Character.call(this, x, y, dx, dy);
	this.init = function() {
		this.img.src = "images/dog.png";
	}
}
inheritsFrom(Enemy, Character);

function randInt(min, max) {
	return Math.round((Math.random() * (max - min)) + min);
}

function rectsOverlap(rect1, rect2) {
	r1xb = rect1.x + rect1.width;
	r2xb = rect2.x + rect2.width;
	if (!((rect1.x >= rect2.x && rect1.x < r2xb) ||
		(r1xb > rect2.x && r1xb <= r2xb))) {
		return false;
	}
	r1yb = rect1.y + rect1.height;
	r2yb = rect2.y + rect2.height;
	if ((rect1.y >= rect2.y && rect1.y < r2yb) ||
		(r1yb > rect2.y && r1yb <= r2yb)) {
		return true;
	} else {
		return false;
	}
}


