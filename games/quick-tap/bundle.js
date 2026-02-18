/**
 * Quick Tap - A reaction game
 * Tap the correct colored button as fast as possible!
 */

(function(global) {
  'use strict';

  class QuickTapScene extends Phaser.Scene {
    constructor() {
      super({ key: 'quick-tap' });
      this.score = 0;
      this.gameOver = false;
      this.timeLeft = 45;
      this.currentColor = null;
      this.buttons = [];
      this.colors = [
        { hex: 0xFF6B6B, name: 'RED', label: '🔴' },
        { hex: 0x4ECDC4, name: 'TEAL', label: '🟦' },
        { hex: 0xFFE66D, name: 'YELLOW', label: '🟨' },
        { hex: 0x95E1D3, name: 'MINT', label: '🟩' },
        { hex: 0xFF8C42, name: 'ORANGE', label: '🟧' }
      ];
    }

    preload() {
      // No assets needed
    }

    create() {
      this.cameras.main.setBackgroundColor('#0a0e27');

      // Title
      this.titleText = this.add.text(
        this.scale.width / 2,
        30,
        'QUICK TAP',
        { fontSize: '36px', fill: '#ffffff', fontFamily: 'Arial Black', fontStyle: 'bold' }
      );
      this.titleText.setOrigin(0.5);

      // Score
      this.scoreText = this.add.text(
        this.scale.width / 2,
        85,
        'Score: 0',
        { fontSize: '28px', fill: '#00ff88', fontFamily: 'Arial Black' }
      );
      this.scoreText.setOrigin(0.5);

      // Timer
      this.timerText = this.add.text(
        this.scale.width / 2,
        135,
        'Time: 45s',
        { fontSize: '24px', fill: '#ff6b6b', fontFamily: 'Arial Black' }
      );
      this.timerText.setOrigin(0.5);

      // Target color display
      this.targetText = this.add.text(
        this.scale.width / 2,
        190,
        'TAP THIS COLOR:',
        { fontSize: '18px', fill: '#aaaaaa', fontFamily: 'Arial' }
      );
      this.targetText.setOrigin(0.5);

      this.colorName = this.add.text(
        this.scale.width / 2,
        230,
        '?',
        { fontSize: '32px', fill: '#ffff00', fontFamily: 'Arial Black', fontStyle: 'bold' }
      );
      this.colorName.setOrigin(0.5);

      // Instructions
      this.instructionText = this.add.text(
        this.scale.width / 2,
        this.scale.height - 50,
        'Tap the button with the correct color!',
        { fontSize: '14px', fill: '#888888', fontFamily: 'Arial' }
      );
      this.instructionText.setOrigin(0.5);

      // Game over text (hidden initially)
      this.gameOverText = this.add.text(
        this.scale.width / 2,
        this.scale.height / 2,
        'TIME\'S UP!',
        { fontSize: '48px', fill: '#ff0000', fontFamily: 'Arial Black', backgroundColor: '#00000088', padding: { x: 20, y: 10 } }
      );
      this.gameOverText.setOrigin(0.5);
      this.gameOverText.setVisible(false);

      // Create color buttons
      this.createColorButtons();

      // Start the game
      this.nextColor();

      // Timer
      this.timerEvent = this.time.addTimer({
        delay: 1000,
        callback: this.updateTimer,
        callbackScope: this,
        loop: true
      });
    }

    createColorButtons() {
      const buttonSize = 70;
      const spacing = 15;
      const totalWidth = (buttonSize + spacing) * 5 - spacing;
      const startX = (this.scale.width - totalWidth) / 2 + buttonSize / 2;
      const startY = this.scale.height / 2 + 50;

      this.buttons = [];

      this.colors.forEach((colorData, index) => {
        const x = startX + index * (buttonSize + spacing);
        const y = startY;

        const button = this.add.circle(x, y, buttonSize / 2, colorData.hex);
        button.setInteractive({ useHandCursor: true });
        button.setStrokeStyle(2, 0xffffff);

        const emoji = this.add.text(
          x,
          y,
          colorData.label,
          { fontSize: '24px', fontFamily: 'Arial Black' }
        );
        emoji.setOrigin(0.5);

        button.on('pointerdown', () => {
          if (!this.gameOver) {
            this.handleTap(colorData, button, emoji);
          }
        });

        button.on('pointerover', () => {
          if (!this.gameOver) {
            button.setScale(1.1);
          }
        });

        button.on('pointerout', () => {
          button.setScale(1);
        });

        this.buttons.push({
          button,
          emoji,
          color: colorData,
          index: index
        });
      });
    }

    nextColor() {
      const randomIndex = Phaser.Math.Between(0, this.colors.length - 1);
      this.currentColor = this.colors[randomIndex];
      this.colorName.setText(this.currentColor.name);
      this.colorName.setFill('#' + this.currentColor.hex.toString(16).padStart(6, '0'));
    }

    handleTap(colorData, button, emoji) {
      if (colorData.name === this.currentColor.name) {
        // Correct tap!
        this.score += 10;
        button.setFillStyle(0x00ff00);
        emoji.setFill('#000000');
        
        // Flash effect
        this.tweens.add({
          targets: button,
          scaleX: 1.3,
          scaleY: 1.3,
          duration: 100,
          yoyo: true
        });

        this.scoreText.setText('Score: ' + this.score);

        // Next color after a short delay
        this.time.delayedCall(300, () => {
          button.setFillStyle(colorData.hex);
          emoji.setFill('#ffffff');
          this.nextColor();
        });
      } else {
        // Wrong tap - penalty
        this.score = Math.max(0, this.score - 5);
        button.setFillStyle(0xff0000);
        emoji.setFill('#ffffff');
        
        // Flash effect
        this.tweens.add({
          targets: button,
          scaleX: 0.9,
          scaleY: 0.9,
          duration: 100,
          yoyo: true
        });

        this.scoreText.setText('Score: ' + this.score);

        // Reset button after a short delay
        this.time.delayedCall(200, () => {
          const originalColor = this.colors[this.buttons.indexOf(this.buttons.find(b => b.button === button))];
          button.setFillStyle(originalColor.hex);
          emoji.setFill('#ffffff');
        });
      }
    }

    updateTimer() {
      if (!this.gameOver) {
        this.timeLeft--;
        this.timerText.setText('Time: ' + this.timeLeft + 's');

        if (this.timeLeft <= 0) {
          this.endGame();
        }
      }
    }

    endGame() {
      this.gameOver = true;
      this.gameOverText.setVisible(true);
      this.gameOverText.setText(`TIME'S UP!\nFinal Score: ${this.score}\nTap to retry`);

      // Make game over text interactive to restart
      this.gameOverText.setInteractive({ useHandCursor: true });
      this.gameOverText.on('pointerdown', () => {
        this.scene.restart();
      });

      // Make buttons non-interactive
      this.buttons.forEach(b => {
        b.button.setAlpha(0.5);
        b.button.disableInteractive();
      });

      // Stop timer
      if (this.timerEvent) {
        this.timerEvent.remove();
      }
    }

    shutdown() {
      if (this.timerEvent) {
        this.timerEvent.remove();
      }
    }
  }

  // Export the scene
  global.SanuyetiGame = global.SanuyetiGame || {};
  global.SanuyetiGame['quick-tap'] = QuickTapScene;
})(window);
