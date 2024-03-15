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
 * File: InputText.js
 */

export default class InputText {
    constructor(scene, x, y, initialText, preColor, color, fontSize, hitWidth) {
        this.scene = scene;
        this.inputText = scene.add.text(x, y, initialText, {
            fontFamily: 'Arial',
            fontSize: fontSize,
            color: preColor || 'grey' // Default preColor to 'grey' if not provided
        });
		
        this.inputText.setInteractive(new Phaser.Geom.Rectangle(0, 0, hitWidth, this.inputText.height), Phaser.Geom.Rectangle.Contains);
		
        this.inputText.setStyle({ cursor: 'text' });

        this.inputText.on('pointerover', () => {
            document.body.style.cursor = 'text';
        });

        this.inputText.on('pointerout', () => {
            document.body.style.cursor = 'default';
        });

        this.inputText.on('pointerdown', () => {
            if (scene.sys.game.device.os.android || scene.sys.game.device.os.iOS) {
                this.createMobileInput();
            } else {
                this.createDesktopInput();
            }
        });
        
        // Set text color
        //this.inputText.setColor(color || 'white'); // Default color to 'white' if not provided
    }

    createMobileInput() {
        let inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.style.position = 'absolute';
        inputElement.style.top = '50%';
        inputElement.style.left = '50%';
        inputElement.style.transform = 'translate(-50%, -50%)';
        inputElement.style.opacity = '0';
        inputElement.style.pointerEvents = 'none';
        document.body.appendChild(inputElement);
        inputElement.focus();
        
        this.inputText.text = '';
        this.inputText.setColor(this.color || 'white');
        
        inputElement.addEventListener('input', (event) => {
            this.inputText.text = event.target.value;
        });

        inputElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                inputElement.blur();
            }
        });
    }

    createDesktopInput() {
        let typingText = '';

        this.inputText.text = '';
        this.inputText.setColor(this.color || 'white');
		
		this.scene.selectedBox = this;

        this.scene.input.keyboard.on('keydown', (event) => {
			if (this.scene.selectedBox == this)
			{
			if (event.key === "Shift") {
				// Prevent the default action of the "Shift" key
				event.preventDefault();
			} 
            else if (event.key === 'Backspace') {
                typingText = typingText.slice(0, -1);
            } else {
                typingText += event.key;
            }
            this.inputText.text = typingText;
			}
        });
    }
}