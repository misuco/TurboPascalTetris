// Tetris Game - JavaScript Web Version
// Original Turbo Pascal version by Claudio Zopfi (1992)
// Web conversion 2026

const GRID_WIDTH = 10;
const GRID_HEIGHT = 25;
const BLOCK_SIZE = 20;
const CANVAS_WIDTH = GRID_WIDTH * BLOCK_SIZE;
const CANVAS_HEIGHT = GRID_HEIGHT * BLOCK_SIZE;

// Tetromino shapes (0=I, 1=O, 2=T, 3=S, 4=Z, 5=J, 6=L)
const TETROMINOES = [
    [[1, 1, 1, 1]],           // I
    [[1, 1], [1, 1]],         // O
    [[0, 1, 0], [1, 1, 1]],   // T
    [[0, 1, 1], [1, 1, 0]],   // S
    [[1, 1, 0], [0, 1, 1]],   // Z
    [[1, 0, 0], [1, 1, 1]],   // J
    [[0, 0, 1], [1, 1, 1]]    // L
];

const COLORS = ['red', 'blue', 'lime', 'cyan', 'magenta', 'yellow', 'orange'];
const GRID_COLOR = '#000';
const BG_COLOR = '#fff';
let gameState = {
    gameRunning: false,
    gamePaused: false,
    playField: [],
    currentStone: null,
    nextStone: null,
    stoneX: 0,
    stoneY: 0,
    score: 0,
    lines: 0,
    stones: 0,
    level: 1,
    speed: 1000,
    autoSpeedUp: true,
    showNext: true,
    bgColor: '#ffffff',
    topFive: [
        { name: 'Claudio', score: 6000 },
        { name: 'Player', score: 5000 },
        { name: 'User', score: 4000 },
        { name: 'Gamer', score: 3000 },
        { name: 'Master', score: 2000 }
    ]
};

let gameCanvas, gameCtx, nextCanvas, nextCtx;
let gameLoopId;
let lastDropTime = 0;

// Initialize the game
function init() {
    gameCanvas = document.getElementById('gameCanvas');
    gameCtx = gameCanvas.getContext('2d');
    nextCanvas = document.getElementById('nextCanvas');
    nextCtx = nextCanvas.getContext('2d');

    // Set canvas sizes
    gameCanvas.width = CANVAS_WIDTH;
    gameCanvas.height = CANVAS_HEIGHT;
    nextCanvas.width = 80;
    nextCanvas.height = 80;

    // Event listeners
    document.getElementById('playBtn').addEventListener('click', startGame);
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.getElementById('optionsBtn').addEventListener('click', () => openModal('optionsModal'));
    document.getElementById('helpBtn').addEventListener('click', () => openModal('helpModal'));
    document.getElementById('topFiveBtn').addEventListener('click', showTopFive);

    // Options modal
    document.getElementById('levelSlider').addEventListener('change', (e) => {
        gameState.level = parseInt(e.target.value);
        document.getElementById('levelValue').textContent = gameState.level;
        updateSpeed();
    });
    document.getElementById('autoSpeedUp').addEventListener('change', (e) => {
        gameState.autoSpeedUp = e.target.checked;
    });
    document.getElementById('bgColor').addEventListener('change', (e) => {
        gameState.bgColor = e.target.value;
        redrawGame();
    });
    document.getElementById('showNext').addEventListener('change', (e) => {
        gameState.showNext = e.target.checked;
    });

    // Keyboard controls
    document.addEventListener('keydown', handleKeyPress);

    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });

    // Load high scores from localStorage
    loadTopFive();
    initializePlayField();
    drawGame();
}

// Initialize play field
function initializePlayField() {
    gameState.playField = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
        gameState.playField[y] = [];
        for (let x = 0; x < GRID_WIDTH; x++) {
            gameState.playField[y][x] = 0;
        }
    }
}

// Start a new game
function startGame() {
    if (gameState.gameRunning && !gameState.gamePaused) return;

    resetGame();
    gameState.gameRunning = true;
    gameState.gamePaused = false;
    document.getElementById('playBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = false;

    gameState.currentStone = getRandomStone();
    gameState.nextStone = getRandomStone();
    gameState.stoneX = Math.floor(GRID_WIDTH / 2) - 1;
    gameState.stoneY = 0;
    lastDropTime = Date.now();

    gameLoopId = setInterval(gameLoop, 50);
    redrawGame();
}

// Game loop
function gameLoop() {
    if (!gameState.gameRunning || gameState.gamePaused) return;

    const now = Date.now();
    const elapsed = now - lastDropTime;

    if (elapsed >= gameState.speed) {
        dropStone();
        lastDropTime = now;
    }

    redrawGame();
}

// Reset game state
function resetGame() {
    gameState.gameRunning = false;
    gameState.gamePaused = false;
    gameState.score = 0;
    gameState.lines = 0;
    gameState.stones = 0;
    gameState.level = 1;
    gameState.speed = 1000;
    updateUI();
    initializePlayField();
    if (gameLoopId) clearInterval(gameLoopId);
    document.getElementById('playBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
}

// Toggle pause
function togglePause() {
    if (!gameState.gameRunning) return;
    gameState.gamePaused = !gameState.gamePaused;
    document.getElementById('pauseBtn').textContent = gameState.gamePaused ? 'Resume' : 'Pause';
}

// Get random tetromino
function getRandomStone() {
    return Math.floor(Math.random() * TETROMINOES.length);
}

// Check if stone can be placed at position
function canPlace(stone, x, y) {
    const shape = TETROMINOES[stone];
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const newX = x + col;
                const newY = y + row;

                if (newX < 0 || newX >= GRID_WIDTH || newY >= GRID_HEIGHT) return false;
                if (newY >= 0 && gameState.playField[newY][newX]) return false;
            }
        }
    }
    return true;
}

// Place stone on the field
function placeStone(stone, x, y) {
    const shape = TETROMINOES[stone];
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const newX = x + col;
                const newY = y + row;
                if (newY >= 0 && newY < GRID_HEIGHT && newX >= 0 && newX < GRID_WIDTH) {
                    gameState.playField[newY][newX] = stone + 1;
                }
            }
        }
    }
}

// Drop stone one line
function dropStone() {
    if (!gameState.gameRunning) return;

    // Try to move stone down
    if (canPlace(gameState.currentStone, gameState.stoneX, gameState.stoneY + 1)) {
        gameState.stoneY++;
    } else {
        // Place stone and spawn new one
        placeStone(gameState.currentStone, gameState.stoneX, gameState.stoneY);
        gameState.stones++;

        // Check for completed lines
        const linesCleared = checkLines();
        gameState.lines += linesCleared;
        gameState.score += calculateScore(linesCleared);

        // Spawn new stone
        gameState.currentStone = gameState.nextStone;
        gameState.nextStone = getRandomStone();
        gameState.stoneX = Math.floor(GRID_WIDTH / 2) - 1;
        gameState.stoneY = 0;

        // Check for game over
        if (!canPlace(gameState.currentStone, gameState.stoneX, gameState.stoneY)) {
            endGame();
            return;
        }

        // Increase speed
        if (gameState.autoSpeedUp && gameState.stones % 10 === 0) {
            gameState.speed = Math.max(200, gameState.speed - 50);
        }
    }

    updateUI();
}

// Check for completed lines and remove them
function checkLines() {
    let linesCleared = 0;
    for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
        let isComplete = true;
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (!gameState.playField[y][x]) {
                isComplete = false;
                break;
            }
        }
        if (isComplete) {
            linesCleared++;
            // Remove line
            gameState.playField.splice(y, 1);
            gameState.playField.unshift(new Array(GRID_WIDTH).fill(0));
            y++; // Check this line again
        }
    }
    return linesCleared;
}

// Calculate score based on lines cleared
function calculateScore(linesCleared) {
    const multipliers = [0, 100, 300, 500, 800];
    return multipliers[linesCleared] || 0;
}

// Rotate stone
function rotateStoneCW() {
    if (!gameState.gameRunning) return;

    const shape = TETROMINOES[gameState.currentStone];
    const rotated = rotateShape(shape);

    // Create a temporary rotated tetromino for testing
    const tempStone = { shape: rotated };
    const originalShape = TETROMINOES[gameState.currentStone];
    TETROMINOES[gameState.currentStone] = rotated;

    if (canPlace(gameState.currentStone, gameState.stoneX, gameState.stoneY)) {
        // Rotation successful
    } else {
        // Restore original shape if rotation not possible
        TETROMINOES[gameState.currentStone] = originalShape;
    }
}

// Rotate shape 90 degrees clockwise
function rotateShape(shape) {
    const rows = shape.length;
    const cols = shape[0].length;
    const rotated = [];

    for (let col = 0; col < cols; col++) {
        const newRow = [];
        for (let row = rows - 1; row >= 0; row--) {
            newRow.push(shape[row][col]);
        }
        rotated.push(newRow);
    }

    return rotated;
}

// Handle keyboard input
function handleKeyPress(e) {
    if (!gameState.gameRunning) return;

    switch (e.key.toLowerCase()) {
        case 'arrowleft':
            if (canPlace(gameState.currentStone, gameState.stoneX - 1, gameState.stoneY)) {
                gameState.stoneX--;
            }
            e.preventDefault();
            break;
        case 'arrowright':
            if (canPlace(gameState.currentStone, gameState.stoneX + 1, gameState.stoneY)) {
                gameState.stoneX++;
            }
            e.preventDefault();
            break;
        case 'arrowdown':
            if (canPlace(gameState.currentStone, gameState.stoneX, gameState.stoneY + 1)) {
                gameState.stoneY++;
                gameState.score += 1;
            }
            e.preventDefault();
            break;
        case ' ':
            rotateStoneCW();
            e.preventDefault();
            break;
        case 'p':
            togglePause();
            e.preventDefault();
            break;
        case 'escape':
            endGame();
            e.preventDefault();
            break;
    }
    redrawGame();
}

// Draw the game
function drawGame() {
    // Clear background
    gameCtx.fillStyle = gameState.bgColor;
    gameCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid lines
    gameCtx.strokeStyle = GRID_COLOR;
    gameCtx.lineWidth = 0.5;

    for (let x = 0; x <= GRID_WIDTH; x++) {
        gameCtx.beginPath();
        gameCtx.moveTo(x * BLOCK_SIZE, 0);
        gameCtx.lineTo(x * BLOCK_SIZE, CANVAS_HEIGHT);
        gameCtx.stroke();
    }

    for (let y = 0; y <= GRID_HEIGHT; y++) {
        gameCtx.beginPath();
        gameCtx.moveTo(0, y * BLOCK_SIZE);
        gameCtx.lineTo(CANVAS_WIDTH, y * BLOCK_SIZE);
        gameCtx.stroke();
    }

    // Draw placed blocks
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (gameState.playField[y][x]) {
                drawBlock(gameCtx, x, y, gameState.playField[y][x] - 1);
            }
        }
    }

    // Draw current stone
    if (gameState.currentStone !== null) {
        const shape = TETROMINOES[gameState.currentStone];
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    drawBlock(gameCtx, gameState.stoneX + col, gameState.stoneY + row, gameState.currentStone);
                }
            }
        }
    }
}

// Draw next stone preview
function drawNextStone() {
    nextCtx.fillStyle = '#f9f9f9';
    nextCtx.fillRect(0, 0, 80, 80);

    if (gameState.nextStone !== null) {
        const shape = TETROMINOES[gameState.nextStone];
        const offsetX = (80 - shape[0].length * 10) / 2;
        const offsetY = (80 - shape.length * 10) / 2;

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    nextCtx.fillStyle = COLORS[gameState.nextStone];
                    nextCtx.fillRect(
                        offsetX + col * 10,
                        offsetY + row * 10,
                        9,
                        9
                    );
                }
            }
        }
    }
}

// Draw a single block
function drawBlock(ctx, x, y, stoneIndex) {
    ctx.fillStyle = COLORS[stoneIndex % COLORS.length];
    ctx.fillRect(x * BLOCK_SIZE + 1, y * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
}

// Redraw the game
function redrawGame() {
    drawGame();
    if (gameState.showNext) {
        drawNextStone();
    }
}

// Update UI
function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('lines').textContent = gameState.lines;
    document.getElementById('stones').textContent = gameState.stones;
    document.getElementById('level').textContent = Math.ceil(gameState.level + gameState.stones / 10);
}

// Update speed based on level
function updateSpeed() {
    gameState.speed = Math.max(200, 1000 - (gameState.level - 1) * 100);
}

// End game
function endGame() {
    gameState.gameRunning = false;
    clearInterval(gameLoopId);
    document.getElementById('playBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('pauseBtn').textContent = 'Pause';

    // Show game over modal
    document.getElementById('finalScore').textContent = gameState.score;
    openModal('gameOverModal');
}

// Save score
function saveScore() {
    const playerName = document.getElementById('playerName').value || 'Anonymous';
    const newScore = { name: playerName, score: gameState.score };

    // Add to top 5
    gameState.topFive.push(newScore);
    gameState.topFive.sort((a, b) => b.score - a.score);
    gameState.topFive = gameState.topFive.slice(0, 5);

    // Save to localStorage
    localStorage.setItem('tetrisTopFive', JSON.stringify(gameState.topFive));
    closeModal('gameOverModal');
}

// Load top 5 scores
function loadTopFive() {
    const saved = localStorage.getItem('tetrisTopFive');
    if (saved) {
        try {
            gameState.topFive = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading top 5 scores:', e);
        }
    }
}

// Show top 5 scores
function showTopFive() {
    const tableBody = document.getElementById('topFiveTable');
    tableBody.innerHTML = '';
    gameState.topFive.forEach((score, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = score.name;
        row.insertCell(2).textContent = score.score;
    });
    openModal('topFiveModal');
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', init);