/**
 * Tap The Tiles - A simple Phaser game
 * Click tiles as they light up in sequence
 */

(function(global) {
  'use strict';

  class TapTilesScene extends Phaser.Scene {
    constructor() {
      super({ key: 'tap-tiles' });
      this.score = 0;
      this.gameOver = false;
      this.sequence = [];
      this.userSequence = [];
      this.currentIndex = 0;
      this.tiles = [];
    }

    preload() {
      // No assets needed
    }

    create() {
      this.cameras.main.setBackgroundColor('#1a1a2e');

      // Title
      this.titleText = this.add.text(
        this.scale.width / 2,
        40,
        'TAP THE TILES',
        { fontSize: '32px', fill: '#ffffff', fontFamily: 'Arial Black' }
      );
      this.titleText.setOrigin(0.5);

      // Score
      this.scoreText = this.add.text(
        this.scale.width / 2,
        90,
        'Score: 0',
        { fontSize: '24px', fill: '#00ff00', fontFamily: 'Arial' }
      );
      this.scoreText.setOrigin(0.5);

      // Create 4 tiles in a 2x2 grid
      const tileSize = 100;
      const spacing = 20;
      const startX = (this.scale.width - (tileSize * 2 + spacing)) / 2;
      const startY = 150;

      const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3];
      let colorIndex = 0;

      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
          const x = startX + col * (tileSize + spacing);
          const y = startY + row * (tileSize + spacing);

          const tile = this.add.rectangle(x, y, tileSize, tileSize, colors[colorIndex]);
          tile.setInteractive({ useHandCursor: true });
          tile.setStrokeStyle(2, 0xffffff);
          
          tile.on('pointerdown', () => {
            if (!this.gameOver) {
              this.tileClicked(colorIndex);
            }
          });

          this.tiles.push({
            object: tile,
            color: colors[colorIndex],
            index: colorIndex
          });

          colorIndex++;
        }
      }

      // Instructions
      this.instructionText = this.add.text(
        this.scale.width / 2,
        this.scale.height - 80,
        'Watch the sequence and tap the tiles',
        { fontSize: '16px', fill: '#aaaaaa', fontFamily: 'Arial' }
      );
      this.instructionText.setOrigin(0.5);

      // Start the game
      this.time.delayedCall(1000, () => this.nextLevel());
    }

    nextLevel() {
      this.userSequence = [];
      this.currentIndex = 0;
      
      // Add new color to sequence
      const randomTile = Phaser.Math.Between(0, 3);
      this.sequence.push(randomTile);

      // Play sequence with delay
      this.playSequence();
    }

    playSequence() {
      let delay = 500;

      this.sequence.forEach((tileIndex, i) => {
        this.time.delayedCall(delay + i * 600, () => {
          this.highlightTile(tileIndex);
        });
      });

      // Wait for user input after sequence plays
      this.time.delayedCall(delay + this.sequence.length * 600 + 500, () => {
        this.instructionText.setText('Your turn!');
      });
    }

    highlightTile(index) {
      const tile = this.tiles[index];
      const originalColor = tile.color;

      // Flash white
      tile.object.setFillStyle(0xffffff);

      // Sound effect (using timer as visual feedback)
      this.time.delayedCall(200, () => {
        tile.object.setFillStyle(originalColor);
      });
    }

    tileClicked(index) {
      this.userSequence.push(index);

      // Flash the tile
      this.highlightTile(index);

      // Check if correct
      if (this.userSequence[this.currentIndex] !== this.sequence[this.currentIndex]) {
        this.gameOver = true;
        this.instructionText.setText('Game Over! Final Score: ' + this.score);
        this.scoreText.setFill('#ff0000');
        
        this.time.delayedCall(3000, () => {
          this.scene.restart();
        });

        return;
      }

      this.currentIndex++;

      // Check if user completed the sequence
      if (this.currentIndex === this.sequence.length) {
        this.score++;
        this.scoreText.setText('Score: ' + this.score);
        this.instructionText.setText('Correct! Next level...');
        
        this.time.delayedCall(1500, () => {
          this.nextLevel();
        });
      }
    }
  }

  global.SanuyetiGame = global.SanuyetiGame || {};
  global.SanuyetiGame['tap-tiles'] = TapTilesScene;
  console.log('✅ Tap The Tiles Game Loaded');
})(window);
