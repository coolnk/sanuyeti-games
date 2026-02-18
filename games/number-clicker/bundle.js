/**
 * Number Clicker - A simple clicking game
 * Click the numbers in ascending order to score points!
 */

(function(global) {
  'use strict';

  class NumberClickerScene extends Phaser.Scene {
    constructor() {
      super({ key: 'number-clicker' });
      this.score = 0;
      this.currentNumber = 1;
      this.gameOver = false;
      this.timeLeft = 30;
      this.maxNumber = 5;
    }

    preload() {
      // No assets needed
    }

    create() {
      this.cameras.main.setBackgroundColor('#0d1117');

      // Title
      this.titleText = this.add.text(
        this.scale.width / 2,
        40,
        'NUMBER CLICKER',
        { fontSize: '36px', fill: '#ffffff', fontFamily: 'Arial Black', fontStyle: 'bold' }
      );
      this.titleText.setOrigin(0.5);

      // Score
      this.scoreText = this.add.text(
        this.scale.width / 2,
        100,
        'Score: 0',
        { fontSize: '28px', fill: '#00ff00', fontFamily: 'Arial Black' }
      );
      this.scoreText.setOrigin(0.5);

      // Timer
      this.timerText = this.add.text(
        this.scale.width / 2,
        150,
        'Time: 30s',
        { fontSize: '24px', fill: '#ffaa00', fontFamily: 'Arial' }
      );
      this.timerText.setOrigin(0.5);

      // Instructions
      this.instructionText = this.add.text(
        this.scale.width / 2,
        this.scale.height - 100,
        'Click numbers in order: 1 → 2 → 3 → 4 → 5',
        { fontSize: '16px', fill: '#aaaaaa', fontFamily: 'Arial' }
      );
      this.instructionText.setOrigin(0.5);

      // Game over text (hidden initially)
      this.gameOverText = this.add.text(
        this.scale.width / 2,
        this.scale.height / 2,
        'GAME OVER!',
        { fontSize: '48px', fill: '#ff0000', fontFamily: 'Arial Black', backgroundColor: '#00000088', padding: { x: 20, y: 10 } }
      );
      this.gameOverText.setOrigin(0.5);
      this.gameOverText.setVisible(false);

      // Create number buttons
      this.createNumberButtons();

      // Timer
      this.timerEvent = this.time.addTimer({
        delay: 1000,
        callback: this.updateTimer,
        callbackScope: this,
        loop: true
      });
    }

    createNumberButtons() {
      const buttonSize = 80;
      const spacing = 40;
      const gridWidth = (buttonSize + spacing) * 5;
      const startX = (this.scale.width - gridWidth) / 2 + buttonSize / 2;
      const startY = this.scale.height / 2 - 50;

      this.buttons = [];

      for (let i = 1; i <= this.maxNumber; i++) {
        const x = startX + (i - 1) * (buttonSize + spacing);
        const y = startY;

        const button = this.add.circle(x, y, buttonSize / 2, 0x4ecdc4);
        button.setInteractive({ useHandCursor: true });
        button.setStrokeStyle(3, 0xffffff);

        const text = this.add.text(
          x,
          y,
          String(i),
          { fontSize: '32px', fill: '#ffffff', fontFamily: 'Arial Black', fontStyle: 'bold' }
        );
        text.setOrigin(0.5);

        button.on('pointerdown', () => {
          if (!this.gameOver) {
            this.handleClick(i, button, text);
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
          text,
          number: i,
          clicked: false
        });
      }
    }

    handleClick(number, button, text) {
      if (number === this.currentNumber) {
        // Correct click!
        this.score += 10;
        this.currentNumber++;
        button.setFillStyle(0x00ff00);
        text.setFill('#000000');

        if (this.currentNumber > this.maxNumber) {
          // Level complete - add more numbers
          this.maxNumber++;
          if (this.maxNumber > 10) {
            this.maxNumber = 10;
          }
          this.currentNumber = 1;
          this.score += 50;

          // Reset buttons
          this.buttons.forEach(b => {
            b.button.setFillStyle(0x4ecdc4);
            b.text.setFill('#ffffff');
            b.clicked = false;
          });
        }

        this.scoreText.setText('Score: ' + this.score);
      } else {
        // Wrong click - game over
        this.endGame();
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
      this.gameOverText.setText(`GAME OVER!\nFinal Score: ${this.score}\nTap to retry`);

      // Make game over text interactive to restart
      this.gameOverText.setInteractive({ useHandCursor: true });
      this.gameOverText.on('pointerdown', () => {
        this.scene.restart();
      });

      // Also make buttons transparent and non-interactive
      this.buttons.forEach(b => {
        b.button.setAlpha(0.5);
        b.button.disableInteractive();
      });

      // Stop timer
      this.timerEvent.remove();
    }

    shutdown() {
      if (this.timerEvent) {
        this.timerEvent.remove();
      }
    }
  }

  // Export the scene
  global.SanuyetiGame = global.SanuyetiGame || {};
  global.SanuyetiGame['number-clicker'] = NumberClickerScene;
})(window);
