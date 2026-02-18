/**
 * Sample Phaser Game Bundle for Sanuyeti
 * 
 * This is a minimal game template that can be bundled and served from GitHub.
 * Instructions:
 * 1. Copy this file to your sanuyeti-games repo: games/{gameId}/bundle.js
 * 2. Replace 'sample-game' with your game ID everywhere
 * 3. Implement your game logic in the Scene class
 * 4. Update manifest.json with the bundleUrl
 * 5. Push to GitHub and the app will load it!
 */

(function(global) {
  'use strict';

  /**
   * Sample Game Scene
   * Extends Phaser.Scene to create a playable game
   */
  class SampleGameScene extends Phaser.Scene {
    constructor() {
      super({ key: 'sample-game' });
      
      // Game state
      this.score = 0;
      this.gameOver = false;
    }

    /**
     * Preload assets
     * Called first - load all images, sprites, audio, etc.
     */
    preload() {
      // If loading from network, use full URLs
      // this.load.image('player', 'https://raw.githubusercontent.com/coolnk/sanuyeti-games/main/games/sample-game/assets/player.png');
      
      // For now, we'll create a simple rectangle instead
      // In your game, replace with actual assets
    }

    /**
     * Create game objects
     * Called once after preload
     */
    create() {
      // Set background
      this.cameras.main.setBackgroundColor('#1a1a2e');

      // Create a simple player (rectangle)
      this.player = this.add.rectangle(
        this.scale.width / 2,
        this.scale.height / 2,
        50,
        50,
        0x00ff00
      );
      
      // Enable physics
      this.physics.add.existing(this.player);
      this.player.body.setBounce(0.2);
      this.player.body.setCollideWorldBounds(true);

      // Add text for score
      this.scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#ffffff',
        fontFamily: 'Arial'
      });

      // Create simple game elements
      this.createGameElements();

      // Setup input
      this.setupInput();
    }

    /**
     * Main game loop
     * Called every frame (60fps by default)
     */
    update(time, delta) {
      if (this.gameOver) {
        return;
      }

      // Update game physics
      this.updatePlayerMovement();
    }

    /**
     * Setup keyboard and pointer input
     */
    setupInput() {
      this.input.keyboard.on('keydown-LEFT', () => {
        this.player.body.setVelocity(-200, 0);
      });

      this.input.keyboard.on('keydown-RIGHT', () => {
        this.player.body.setVelocity(200, 0);
      });

      this.input.keyboard.on('keydown-UP', () => {
        this.player.body.setVelocity(0, -200);
      });

      this.input.keyboard.on('keydown-DOWN', () => {
        this.player.body.setVelocity(0, 200);
      });

      // Mobile touch input
      this.input.on('pointerdown', (pointer) => {
        const worldX = pointer.worldX;
        const playerX = this.player.x;
        
        if (worldX < playerX - 50) {
          this.player.body.setVelocity(-200, 0);
        } else if (worldX > playerX + 50) {
          this.player.body.setVelocity(200, 0);
        }
      });
    }

    /**
     * Create game elements (enemies, collectibles, obstacles)
     */
    createGameElements() {
      // Create a simple collectible
      this.collectibles = this.physics.add.group();
      
      for (let i = 0; i < 5; i++) {
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const y = Phaser.Math.Between(50, this.scale.height - 150);
        
        const collectible = this.collectibles.create(x, y);
        
        // Create as circle
        collectible.setFillStyle(0xffff00);
        collectible.setRadius(10);
      }

      // Add collision with player
      this.physics.add.overlap(
        this.player,
        this.collectibles,
        this.collectItem,
        null,
        this
      );
    }

    /**
     * Handle collecting items
     */
    collectItem(player, item) {
      item.destroy();
      this.score += 10;
      this.scoreText.setText('Score: ' + this.score);

      // Create new item
      const x = Phaser.Math.Between(50, this.scale.width - 50);
      const y = Phaser.Math.Between(50, this.scale.height - 150);
      
      const newItem = this.collectibles.create(x, y);
      newItem.setFillStyle(0xffff00);
      newItem.setRadius(10);

      // Slight visual feedback
      this.cameras.main.shake(100, 0.01);
    }

    /**
     * Update player movement based on keyboard
     */
    updatePlayerMovement() {
      const speed = 200;
      const keys = this.input.keyboard.createCursorKeys();

      this.player.body.setVelocity(0);

      if (keys.left.isDown) {
        this.player.body.setVelocityX(-speed);
      } else if (keys.right.isDown) {
        this.player.body.setVelocityX(speed);
      }

      if (keys.up.isDown) {
        this.player.body.setVelocityY(-speed);
      } else if (keys.down.isDown) {
        this.player.body.setVelocityY(speed);
      }
    }

    /**
     * End the game
     */
    endGame() {
      this.gameOver = true;
      
      const gameOverText = this.add.text(
        this.scale.width / 2,
        this.scale.height / 2,
        'GAME OVER\nScore: ' + this.score,
        {
          fontSize: '48px',
          fill: '#ff0000',
          align: 'center',
          fontFamily: 'Arial'
        }
      );
      
      gameOverText.setOrigin(0.5);
      
      // Restart after 3 seconds
      this.time.delayedCall(3000, () => {
        this.scene.restart();
      });
    }
  }

  /**
   * Register the scene globally
   * The app's gameLoader will inject this into Phaser
   */
  global.SanuyetiGame = global.SanuyetiGame || {};
  global.SanuyetiGame['sample-game'] = SampleGameScene;

  // Optional: Log that the game loaded
  console.log('✅ Sample Game Bundle Loaded');
})(window);
