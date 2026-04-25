# TETRIS - JavaScript Web Version

## Overview

This is a modern web-based conversion of the classic Turbo Pascal Tetris game created by Claudio Zopfi in 1992. The game has been faithfully recreated using HTML5, CSS3, and JavaScript, maintaining the spirit and gameplay of the original while providing a smooth, responsive web experience.

## Features

- **Classic Tetris Gameplay**: All 7 tetromino shapes (I, O, T, S, Z, J, L)
- **Progressive Difficulty**: Game speed increases as you progress
- **Score System**: Earn points for completing lines and dropping stones quickly
- **High Score Tracking**: Save and view your top 5 high scores (stored in browser localStorage)
- **Next Stone Preview**: See the next tetromino before it appears
- **Configurable Options**:
  - Game Level (1-5)
  - Auto Speed-Up toggle
  - Custom background color
  - Next stone visibility toggle
- **Responsive Design**: Works on desktop and tablet devices
- **Touch-Friendly Controls**: Keyboard shortcuts for all actions

## How to Play

### Controls

| Control | Action |
|---------|--------|
| **Arrow Left/Right** | Move stone left or right |
| **Arrow Down** | Drop stone faster (earn bonus points) |
| **Space** | Rotate current stone |
| **P** | Pause/Resume game |
| **ESC** | Quit current game |

### Scoring

- **Single Line**: 100 points
- **Double Line**: 300 points
- **Triple Line**: 500 points
- **Tetris (4 Lines)**: 800 points
- **Bonus**: 1 point per line of fast drop

### Game Mechanics

1. Tetrominoes fall from the top of the screen
2. Rotate and position pieces to complete horizontal lines
3. Completed lines are cleared and points are awarded
4. Game speeds up as you place more stones
5. Game ends when a new piece cannot be placed at the top

## Installation

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. No installation or build process required!

## File Structure

```
web/
├── index.html      # Main HTML file
├── styles.css      # Styling and responsive layout
├── tetris.js       # Game logic and engine
└── README.md       # This file
```

## Browser Compatibility

Works on all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript
- CSS3 Flexbox & Grid
- localStorage API

Tested on:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Game State Persistence

- High scores are automatically saved to browser localStorage
- Game state is NOT persisted (session-based)
- Clear browser cache/localStorage to reset high scores

## Configuration

Edit `gameState` object in `tetris.js` to customize:

```javascript
const defaultState = {
    level: 1,              // Starting level (1-5)
    autoSpeedUp: true,     // Enable automatic speed increase
    showNext: true,        // Show next tetromino preview
    bgColor: '#ffffff',    // Canvas background color
    speed: 1000            // Base game speed in milliseconds
};
```

## Performance

- Game runs at ~20 FPS (game logic tick rate)
- Canvas drawing optimized for smooth performance
- Efficient collision detection using field array
- Minimal memory footprint

## Original Credits

**Turbo Pascal Version:**
- Author: Claudio Zopfi
- Year: 1992
- Institution: Lehrwerkstatt Alcatel STR AG
- Duration: 23. November bis 18. Dezember 1992

**Web Version:**
- Conversion: 2026
- Source: https://github.com/misuco/TurboPascalTetris

## License

This is a faithful recreation of the original Turbo Pascal game. Tetris® is a registered trademark. This project is created for educational and historical preservation purposes.

## Acknowledgments

- Original Pascal code analysis and conversion
- Tetris game mechanics and design
- Classic gaming preservation

## Future Enhancements

Potential improvements:
- [ ] Sound effects and background music
- [ ] Mobile touch controls (swipe/tap)
- [ ] Multiplayer mode
- [ ] Additional game modes (marathon, time attack)
- [ ] Animation effects for line clearing
- [ ] Particle effects
- [ ] Leaderboard API integration
- [ ] Progressive Web App (PWA) support
- [ ] Accessibility improvements
- [ ] Theme selection (dark mode, retro, etc.)

## Support & Issues

For issues, suggestions, or improvements, please open an issue or pull request on the GitHub repository.

---

**Enjoy the Game!** 🎮
