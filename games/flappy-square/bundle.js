/**
 * Flappy Square - A simple Phaser game
 * Jump through gaps to score points
 */

(function(global) {
  'use strict';

  class FlappySquareScene extends Phaser.Scene {
    constructor() {
      super({ key: 'flappy-square' });
      this.score = 0;
      this.gameOver = false;
    }

    preload() {
      // No assets needed
    }

    create() {
      this.cameras.main.setBackgroundColor('#87ceeb');

      // Title
      this.titleText = this.add.text(
        this.scale.width / 2,
        20,
        'FLAPPY SQUARE',
        { fontSize: '28px', fill: '#ffffff', fontFamily: 'Arial Black', stroke: '#000000', strokeThickness: 2 }
      );
      this.titleText.setOrigin(0.5);

      // Score
      this.scoreText = this.add.text(
        20,
        50,
        'Score: 0',
        { fontSize: '20px', fill: '#ffffff', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 1 }
      );

      // Instructions
      this.instructionText = this.add.text(
        this.scale.width / 2,
        this.scale.height - 30,
        'Click or Tap to Jump',
        { fontSize: '14px', fill: '#ffffff', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 1 }
      );
      this.instructionText.setOrigin(0.5);

      // Create player
      this.player = this.add.rectangle(
        this.scale.width / 4,
        this.scale.height / 2,
        30,
        30,
        0xffaa00
      );
      this.physics.add.existing(this.player);
      this.player.body.setGravityY(800);
      this.player.body.setBounce(0);

      // Pipes group
      this.pipes = this.physics.add.group();

      // Input
      this.input.on('pointerdown', () => {
        if (!this.gameOver) {
          this.jump();
        }
      });

      this.input.keyboard.on('keydown-SPACE', () => {
        if (!this.gameOver) {
          this.jump();
        }
      });

      // Create first pipe
      this.time.delayedCall(2000, () => this.createPipe());

      // Collision
      this.physics.add.collider(this.player, this.pipes, () => this.crash());
    }

    update() {
      if (this.gameOver) return;

      // Check bounds
      if (this.player.y > this.scale.height || this.player.y < 0) {
        this.crash();
      }

      // Remove off-screen pipes
      this.pipes.children.entries.forEach((pipe) => {
        if (pipe.x < -50) {
          pipe.destroy();
        }

        // Score on passing pipe
        if (pipe.x === this.scale.width / 4 && !pipe.scored) {
          pipe.scored = true;
          this.score++;
          this.scoreText.setText('Score: ' + this.score);
        }
      });
    }

    jump() {
      this.player.body.setVelocityY(-400);
    }

    createPipe() {
      if (this.gameOver) return;

      const gapSize = 120;
      const minY = 80;
      const maxY = this.scale.height - gapSize - 80;
      const gapY = Phaser.Math.Between(minY, maxY);

      // Top pipe
      const topPipe = this.pipes.create(
        this.scale.width,
        gapY - gapSize / 2,
        null
      );
      topPipe.setDisplaySize(60, gapY - gapSize / 2);
      topPipe.setFillStyle(0x228b22);
      topPipe.body.setVelocityX(-300);
      topPipe.scored = false;

      // Bottom pipe
      const bottomPipe = this.pipes.create(
        this.scale.width,
        gapY + gapSize / 2 + (this.scale.height - gapY - gapSize / 2),
        null
      );
      bottomPipe.setDisplaySize(60, this.scale.height - gapY - gapSize / 2);
      bottomPipe.setFillStyle(0x228b22);
      bottomPipe.body.setVelocityX(-300);

      // Create next pipe
      this.time.delayedCall(2500, () => this.createPipe());
    }

    crash() {
      this.gameOver = true;

      const gameOverText = this.add.text(
        this.scale.width / 2,
        this.scale.height / 2,
        'GAME OVER\n\nScore: ' + this.score,
        {
          fontSize: '40px',
          fill: '#ffffff',
          align: 'center',
          fontFamily: 'Arial Black',
          stroke: '#000000',
          strokeThickness: 3
        }
      );
      gameOverText.setOrigin(0.5);

      const restartText = this.add.text(
        this.scale.width / 2,
        this.scale.height / 2 + 100,
        'Restarting in 3 seconds...',
        { fontSize: '16px', fill: '#ffffff', fontFamily: 'Arial', stroke: '#000000', strokeThickness: 1 }
      );
      restartText.setOrigin(0.5);

      this.physics.pause();

      this.time.delayedCall(3000, () => {
        this.scene.restart();
      });
    }
  }

  global.SanuyetiGame = global.SanuyetiGame || {};
  global.SanuyetiGame['flappy-square'] = FlappySquareScene;
  console.log('✅ Flappy Square Game Loaded');
})(window);
