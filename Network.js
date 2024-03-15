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
 * File: Network.js
 */

export default class Network {
 constructor(scene) {
        this.scene = scene;
        this.socket = new WebSocket("wss://fallen-evolution.com/ws");
        this.setupSocketHandlers();
    }

    setupSocketHandlers() {
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onerror = this.onError.bind(this);
        this.socket.onclose = this.onClose.bind(this);
    }

    onOpen() {
        console.log('WebSocket connection established.');
        this.socket.send('Hello from Phaser 1!');
        this.socket.send('Hello from Phaser 2!');
        // Send initial data or perform other actions upon connection
    }

    onMessage(event) {
        console.log('Message received from server:', event.data);
        // Process received messages from the server
    }

    onError(error) {
        console.error('WebSocket error:', error);
        // Handle WebSocket errors
    }

    onClose() {
        console.log('WebSocket connection closed.');
        // Handle WebSocket closure
    }
	
	sendLogin(username, password) {
		console.log("username: " + username + " password: " + password);
	}

    // Add more networking methods as needed
}