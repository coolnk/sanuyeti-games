# Sanuyeti Games Repository

This is the games registry for the Sanuyeti app. Games are dynamically fetched and served without requiring app updates.

## 🎮 Available Games

### 1. Tap The Tiles
- **ID**: `tap-tiles`
- **Description**: Watch the color sequence and tap the tiles in the correct order. Each level adds a new color to the pattern.
- **Difficulty**: Increases with each level
- **Best For**: Memory training

### 2. Ball Catcher
- **ID**: `ball-catcher`
- **Description**: Move your paddle to catch the falling balls. The game gets faster as you score more points!
- **Lives**: 3
- **Difficulty**: Progressive (speeds up every 5 points)
- **Best For**: Hand-eye coordination

### 3. Flappy Square
- **ID**: `flappy-square`
- **Description**: Click or tap to jump through the pipes. Don't hit the pipes or go out of bounds!
- **Controls**: Click/Tap/Space to jump
- **Difficulty**: Increases with score
- **Best For**: Timing and reflexes

## 📁 Game Structure

```
games/
├── tap-tiles/
│   └── bundle.js
├── ball-catcher/
│   └── bundle.js
└── flappy-square/
    └── bundle.js
```

Each game is a self-contained Phaser 3 Scene exported as a JavaScript bundle.

## 🔧 Technical Details

- **Framework**: Phaser 3
- **Format**: UMD (Universal Module Definition)
- **Assets**: No external assets (uses Phaser graphics)
- **Bundle Size**: 11-13KB each

## ➕ Adding New Games

1. Create folder: `games/{gameId}/`
2. Create `bundle.js` with your Phaser scene
3. Update `manifest.json` with game metadata
4. Push to GitHub
5. Users get it on next app launch! 🚀

---

**Last Updated**: 2026-02-18