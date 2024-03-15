/*
 * Copyright (c) 2024 Elevations, Fallen Evolution (www.fallen-evolution.com)
 * All rights reserved.
 * For inquiries, please contact elevations@fallen-evolution.com.
 *
 * Parts of this code uses the Phaser 3 game development framework (https://phaser.io) under the MIT License.
 *
 * Unauthorized use, modification, or distribution is prohibited without the express permission
 * of the copyright owner.
 *
 * File: Main.js
 */

import InputText from './InputText.js';
import Network from './Network.js';
window.onload = function() {
    var config = {
        type: Phaser.AUTO,
        width: 640,
        height: 480,
		autoFocus: true,
		   scale: {
               mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.Center.CENTER_BOTH // Center the game on the screen
    },
	scene: MainScene,
	parent: 'phaser-fe',
	 dom: {
        createContainer: true
    }
    };

    var game = new Phaser.Game(config);
    var scene; // Variable to store the Phaser scene reference
	var mouseX;
	var mouseY;
	let sprite;
	var fullscreen;
	var loginmenu;
	var logo;
	let socket; // Declare the socket variable outside any function
	let lastMessageTime;
	let mouseText;
	let accinputbox;
	let passinputbox;
	let usernameinput;
	let passwordinput;
	let textlogo;
	let loginbutton;
	let loginbuttontext;
	
		// Preload scene
	var PreloadScene = new Phaser.Class({

		Extends: Phaser.Scene,

		initialize:

		function PreloadScene ()
		{
			Phaser.Scene.call(this, { key: 'PreloadScene' });
		},

		preload: function ()
		{
			// 'this' refers to the Phaser scene context
			this.load.image('logo', 'assets/logo.png');
			this.load.image('background1', 'assets/gui/132.png');
			this.load.image('loginmenu', 'assets/gui/102.png');
			this.load.image('inputbox', 'assets/gui/inputbox.png');
			this.load.atlas('tiles', 'tiles.png', 'assets/tiles/tiles.json');
			this.load.audio('menumusic', 'music/245.mp3');
			
				this.load.spritesheet('spritesheet', 'assets/gui/113.png', {
				frameWidth: 180,
				frameHeight: 40,
			});
			
			this.load.spritesheet('button2', 'assets/gui/115.png', {
				frameWidth: 91,
				frameHeight: 29,
			});

			// Display loading bar or progress indicator
			var progressBar = this.add.graphics();
			var progressBox = this.add.graphics();
			var width = this.cameras.main.width;
			var height = this.cameras.main.height;
			var loadingText = this.make.text({
				x: width / 2,
				y: height / 2 - 50,
				text: 'Loading...',
				style: {
					font: '20px monospace',
					fill: '#ffffff'
				}
			});
			loadingText.setOrigin(0.5, 0.5);

			var percentText = this.make.text({
				x: width / 2,
				y: height / 2 + 25,
				text: '0%',
				style: {
					font: '18px monospace',
					fill: '#ffffff'
				}
			});
			percentText.setOrigin(0.5, 0.5);

			var assetText = this.make.text({
				x: width / 2,
				y: height / 2 + 100,
				text: '',
				style: {
					font: '18px monospace',
					fill: '#ffffff'
				}
			});
			assetText.setOrigin(0.5, 0.5);

			this.load.on('progress', function (value) {
				percentText.setText(parseInt(value * 100) + '%');
				progressBar.clear();
				progressBar.fillStyle(0xffffff, 1);
				var progressBarX = (width - 300) / 2; // Center horizontally
				var progressBarY = (height - 30) / 2; // Center vertically
				progressBar.fillRect(progressBarX, progressBarY, 300 * value, 30);
			});

			this.load.on('fileprogress', function (file) {
				assetText.setText('Loading asset: ' + file.key);
			});

			this.load.on('complete', function () {
				progressBar.destroy();
				progressBox.destroy();
				loadingText.destroy();
				percentText.destroy();
				assetText.destroy();
			});
		},

		create: function ()
		{
			// Proceed to the main game scene or menu scene
			this.scene.start('MainScene');
		}
	});

	// Main game scene
	var MainScene = new Phaser.Class({

		Extends: Phaser.Scene,

		initialize:

		function MainScene ()
		{
			Phaser.Scene.call(this, { key: 'MainScene' });
			
			this.sprites = []; 
			this.generateMap = false;
		},

		create: function ()
		{
			
			lastMessageTime = new Date().getTime();
		
			var music = this.sound.add('menumusic');

			// Play the audio
			music.play();
			
			var background1 = this.add.image(0, 0, 'background1');
			
			background1.setOrigin(0);
			
			scene = this; // Assign the Phaser scene to the 'scene' variable
			logo = this.add.image(400, 300, 'logo');
			logo.setScale(0.5); // Scale down the 
			
			this.anims.create({
			key: 'walk',          // Animation key
			frames: this.anims.generateFrameNumbers('spritesheet'), // Generate frame numbers automatically
			frameRate: 10,        // Frame rate
			repeat: -1            // Repeat indefinitely
		});
		
		this.anims.create({
			key: 'walk2',          // Animation key
			frames: this.anims.generateFrameNumbers('button2'), // Generate frame numbers automatically
			frameRate: 10,        // Frame rate
			repeat: -1            // Repeat indefinitely
		});
		
			sprite = this.add.sprite(220, 354, 'spritesheet');
			
			mouseText = this.add.text(0, 0, '', {
			fontFamily: 'Public Sans',
			fontSize: '12px',
			antialias: true,
			color: '#ffffff'
		});
			
			const text = this.add.text(230, 354, 'Play Game', {
			fontFamily: 'Public Sans',
			fontSize: '32px',
			antialias: true,
			color: '#ffffff',
			stroke: '#000000', // Outline color
			strokeThickness: 2, // Thickness of the outline
		});
			
			sprite.setOrigin(0, 0);
			sprite.setInteractive();
			sprite.setFrame(4);
			
			loginmenu = this.add.sprite(304, 254, 'loginmenu');
			
			loginmenu.setVisible(false);
			
			accinputbox = this.add.sprite(348, 217, 'inputbox');
			accinputbox.setVisible(false);
			
			passinputbox = this.add.sprite(348, 251, 'inputbox');
			passinputbox.setVisible(false);
			
			loginbutton = this.add.sprite(259, 281, 'button2');
			loginbutton.setVisible(false);
			
			loginbuttontext = this.add.text(279, 281, 'Login', {
				fontFamily: 'Public Sans',
				fontSize: '20px',
				antialias: true,
				color: '#ffffff',
				stroke: '#000000', // Outline color
				strokeThickness: 2, // Thickness of the outline
			});
			loginbuttontext.setVisible(false);
			
			loginbutton.setFrame(20);
			loginbutton.setOrigin(0, 0);
			loginbutton.setInteractive();
			
			//login button
			loginbutton.on('pointerdown', () => {
				
			});

			// Set input event handlers
			loginbutton.on('pointerover', () => {
				loginbutton.setFrame(21);
				loginbuttontext.setColor('red');
			});

			loginbutton.on('pointerout', () => {
				loginbutton.setFrame(20);
				loginbuttontext.setColor('white');
			});
			

			//playgame
			sprite.on('pointerdown', () => {
				loginmenu.setVisible(true);
				accinputbox.setVisible(true);
				passinputbox.setVisible(true);
				usernameinput.inputText.setActive(true).setVisible(true);
				passwordinput.inputText.setActive(true).setVisible(true);
				loginbutton.setVisible(true);
				loginbuttontext.setVisible(true);
			});

			// Set input event handlers
			sprite.on('pointerover', () => {
				text.setColor('red');
				sprite.setFrame(5);
			});

			sprite.on('pointerout', () => {
				sprite.setFrame(4);
				text.setColor('white');
			});
			
			//loginmenu.setDepth(0);
			
			usernameinput = new InputText(this, 284, 209, 'Enter username...', '#333333', 'white', 16, 137);
			usernameinput.inputText.setActive(false).setVisible(false);
			
			passwordinput = new InputText(this, 284, 242, 'Enter password...', '#333333', 'white', 16, 137);
			passwordinput.inputText.setActive(false).setVisible(false);
		
		
			fullscreen = this.add.sprite(12, 438, 'spritesheet');
			
						const fullscreentext = this.add.text(22, 438, 'Full Screen', {
			fontFamily: 'Public Sans',
			fontSize: '22px',
			antialias: true,
			color: '#ffffff',
			stroke: '#000000', // Outline color
			strokeThickness: 2, // Thickness of the outline
		});
			
			fullscreen.setOrigin(0, 0);
			fullscreen.setInteractive();
			fullscreen.setFrame(4);
			fullscreen.setScale(0.8);
			
			fullscreen.on('pointerdown', function () {
							console.log('Button clicked'); // Check if the button click event is detected
			
							if (game.scale.scaleMode == Phaser.Scale.FIT)
							{
							config.scale.mode = Phaser.Scale.ScaleModes.SCALE;
							// Destroy the current game instance
							game.destroy(true);
							}
							else
							{
							config.scale.mode = Phaser.Scale.FIT;
							// Destroy the current game instance
							game.destroy(true);
							}
			});

			// Set input event handlers
			fullscreen.on('pointerover', () => {
				fullscreentext.setColor('red');
				fullscreen.setFrame(5);
			});

			fullscreen.on('pointerout', () => {
				fullscreen.setFrame(4);
				fullscreentext.setColor('white');
			});
			
			    textlogo = this.add.text(327, 140, "FE Mobile", { fontFamily: 'Arial Black', fontSize: 80 });

				const gradient = textlogo.context.createLinearGradient(0, 0, 0, textlogo.height);

			    gradient.addColorStop(0, '#800080'); // Purple
				gradient.addColorStop(0.5, 'magenta'); // Gold
				gradient.addColorStop(0.5, 'purple'); // Orange
				gradient.addColorStop(1, 'cyan'); // Red

				textlogo.setFill(gradient);
				textlogo.setOrigin(0.5, 0.5);

				const fx = textlogo.preFX.addReveal();

				this.tweens.add({
					targets: fx,
					progress: 1,
					hold: 500,
					duration: 3000
				});
				
				  const fx1 = textlogo.postFX.addGlow(0xffffff, 0, 0, false, 0.1, 24);

				this.tweens.add({
					targets: fx1,
					outerStrength: 4,
					yoyo: true,
					loop: -1,
					ease: 'sine.inout'
				});
			
			// Listen for the game's destroy event
			this.game.events.on('destroy', function () {
				// Your cleanup or additional logic here
				// Create a new game instance
				game = new Phaser.Game(config);
				
				game.scene.add('PreloadScene', PreloadScene);
				game.scene.add('MainScene', MainScene);

				// Start preloading
				game.scene.start('PreloadScene');
			});

			this.network = new Network(this);
			socket = this.network.socket;
		},
		
		update: function ()
		{
			 mouseX = this.input.x;
			 mouseY = this.input.y;	 
			 
			 //loginbutton.x = mouseX;
			 //loginbutton.y = mouseY;
			 
			 //passinputbox.x = mouseX;
			 //passinputbox.y = mouseY;
			 
			 //passwordinput.inputText.x = mouseX;
			 //passwordinput.inputText.y = mouseY;
			 
			 if (this.generateMap)
			 {
				 for (var i = 0; i < 100; ++i)
				 {
					 var x = 0;
					 var y = 0;
					if (i < 100) {
						y = i;
					}
					else {
						x = i - 100;
						y = 100;
					}

					while (y >= 0 && x < 100) {
						var tilex = (x * 32) - (y * 32);
						var tiley = (x * 16) + (y * 16);
						let tilesprite =  this.add.sprite(tilex, tiley, 'tiles', '101.png');
						
						tilesprite.setData('thex', x);
						tilesprite.setData('they', y);
						this.sprites.push(tilesprite);

						--y;
						++x;
					}
				 }
				 this.generateMap = false;
			 }
			 
						for (let ii = 0; ii < this.sprites.length; ii++)
						{
							var tilex = this.sprites[ii].getData('thex');
							var tiley = this.sprites[ii].getData('they');
							
							this.sprites[ii].x = parseInt(mouseX) + (tilex * 32) - (tiley * 32);
							this.sprites[ii].y = parseInt(mouseY) + (tilex * 16) + (tiley * 16);

						}
			 
			 mouseText.text = 'MouseX: ' + parseInt(mouseX).toString() + ' MouseY: ' + parseInt(mouseY).toString(); 
			
			 /*const seconds = Math.floor(this.time.now / 1000);
			 
			  if (this.time.now - lastMessageTime >= messageInterval) {
			// Send the message
			sendMessage(messageToSend + " running for " + seconds.toString() + " seconds");

			// Update the last message time
			lastMessageTime = this.time.now;
		}*/
			
			game.canvas.focus();
			if (logo.x < 300)
			{
			logo.x += 1; // Change the value to adjust the speed of movement
			}
			else
			{
				logo.x = 100;
			}
		}
	});

	// Add scenes to game
	game.scene.add('PreloadScene', PreloadScene);
	game.scene.add('MainScene', MainScene);

	// Start preloading
	game.scene.start('PreloadScene');
	
	// Function to send a message through the socket
	function sendMessage(message) {
		if (socket.readyState === WebSocket.OPEN) {
			socket.send(message);
		}
	}
	
		setInterval(() => {
			
		var currentTime = new Date().getTime() - lastMessageTime;
		var seconds = Math.floor(currentTime / 1000);
		var days = Math.floor(seconds / (3600 * 24));
		var hours = Math.floor((seconds % (3600 * 24)) / 3600);
		var minutes = Math.floor((seconds % 3600) / 60);
		var remainingSeconds = seconds % 60;
		
		var pmessage = "Ping test running for ";
		
		if (days > 0)
		{
			pmessage += days.toString() + " days ";
		}
		if (hours > 0)
		{
			pmessage += hours.toString() + " hours ";
		}
		if (minutes > 0)
		{
			pmessage += minutes.toString() + " minutes ";
		}
		
		pmessage += remainingSeconds.toString() + " seconds";
		
		sendMessage(pmessage);
	}, 5000);
	
	// Prevent pausing when the window loses focus
	window.addEventListener('blur', function(event) {
		event.preventDefault();
	}, false);
	
};