// Intro screen JavaScript
// Navigate to the main game

document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('playButton');
    
    playButton.addEventListener('click', () => {
        navigateToGame();
    });

    // Also allow SPACE key to start the game
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            navigateToGame();
        }
    });
});

function navigateToGame() {
    // Fade out effect
    document.body.style.transition = 'opacity 0.5s ease-out';
    document.body.style.opacity = '0';
    
    // Redirect to the main game after fade
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}
