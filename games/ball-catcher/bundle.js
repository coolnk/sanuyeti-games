/**
 * Ball Catcher - A simple Phaser game
 * Move the paddle to catch falling balls
 */

(function(global) {
  'use strict';

  class BallCatcherScene extends Phaser.Scene {
    constructor() {
      super({ key: 'ball-catcher' });
      this.score = 0;
      this.lives = 3;
      this.gameOver = false;
      this.ballSpeed = 300;
    }

    preload() {
      // No assets needed
    }

    create() {
      this.cameras.main.setBackgroundColor('#0f3460');

      // Title
      this.titleText = this.add.text(
        this.scale.width / 2,
        20,
        'BALL CATCHER',
        { fontSize: '28px', fill: '#16c784', fontFamily: 'Arial Black' }
      );
      this.titleText.setOrigin(0.5);

      // Score
      this.scoreText = this.add.text(
        20,
        50,
        'Score: 0',
        { fontSize: '20px', fill: '#16c784', fontFamily: 'Arial' }
      );

      // Lives
      this.livesText = this.add.text(
        this.scale.width - 150,
        50,
        'Lives: 3',
        { fontSize: '20px', fill: '#ff6b6b', fontFamily: 'Arial' }
      );

      // Create paddle (player)
      this.paddle = this.add.rectangle(
        this.scale.width / 2,
        this.scale.height - 30,
        120,
        20,
        0x16c784
      );
      this.paddle.setInteractive({ useHandCursor: true });
      this.paddle.body = { x: this.paddle.x };

      // Track mouse movement
      this.input.on('pointermove', (pointer) => {
        this.paddle.x = Phaser.Math.Clamp(
          pointer.x,
          60,
          this.scale.width - 60
        );
      });

      // Ball pool
      this.balls = this.physics.add.group();

      // Drop first ball
      this.time.delayedCall(500, () => this.dropBall());
    }

    update() {
      if (this.gameOver) return;

      // Check balls going out of bounds
      this.balls.children.entries.forEach((ball) => {
        if (ball.y > this.scale.height) {
          ball.destroy();
          this.lives--;
          this.livesText.setText('Lives: ' + this.lives);

          if (this.lives <= 0) {
            this.endGame();
          } else {
            // Drop new ball
            if (this.balls.children.entries.length < 5) {
              this.time.delayedCall(200, () => this.dropBall());
            }
          }
        }
      });

      // Check collisions with paddle
      this.physics.overlap(this.paddle, this.balls, (paddle, ball) => {
        ball.destroy();
        this.score++;
        this.scoreText.setText('Score: ' + this.score);

        // Increase difficulty
        if (this.score % 5 === 0) {
          this.ballSpeed += 30;
        }

        // Drop new ball
        if (this.balls.children.entries.length < 5) {
          this.time.delayedCall(200, () => this.dropBall());
        }
      });
    }

    dropBall() {
      if (this.gameOver) return;

      const x = Phaser.Math.Between(50, this.scale.width - 50);
      const ball = this.balls.create(x, 20, null);

      // Draw circle
      const graphics = this.make.graphics({ x: 0, y: 0 }, false);
      graphics.fillStyle(0xff6b6b, 1);
      graphics.fillCircleShape(new Phaser.Geom.Circle(10, 10, 10));
      graphics.generateTexture('ball', 20, 20);
      graphics.destroy();

      ball.setTexture('ball');
      ball.setVelocityY(this.ballSpeed);
      ball.setBounce(0.2);
      ball.setCollideWorldBounds(true);
    }

    endGame() {
      this.gameOver = true;

      const gameOverText = this.add.text(
        this.scale.width / 2,
        this.scale.height / 2,
        'GAME OVER\n\nScore: ' + this.score,
        {
          fontSize: '40px',
          fill: '#ff6b6b',
          align: 'center',
          fontFamily: 'Arial Black'
        }
      );
      gameOverText.setOrigin(0.5);

      const restartText = this.add.text(
        this.scale.width / 2,
        this.scale.height / 2 + 100,
        'Restarting in 3 seconds...',
        { fontSize: '16px', fill: '#aaaaaa', fontFamily: 'Arial' }
      );
      restartText.setOrigin(0.5);

      this.time.delayedCall(3000, () => {
        this.scene.restart();
      });
    }
  }

  global.SanuyetiGame = global.SanuyetiGame || {};
  global.SanuyetiGame['ball-catcher'] = BallCatcherScene;
  console.log('✅ Ball Catcher Game Loaded');
})(window);
