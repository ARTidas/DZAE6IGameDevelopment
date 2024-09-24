var GameManager = pc.createScript('gameManager');

// Initialize game variables
GameManager.prototype.initialize = function() {
    //document.addEventListener("DOMContentLoaded", () => {
        //console.log("GameManager initialized!");

        this.score = 0;    // Player score
        this.health = 100; // Player health
        this.uiScore = document.getElementById('score'); // Update score UI
        this.uiHealth = document.getElementById('health'); // Update health UI

        // Ensure UI elements are available
        if (!this.uiScore || !this.uiHealth) {
            console.error("UI elements not found!");
        } else {
            this.updateUI();
        }
    //});
};

// Update UI elements
GameManager.prototype.updateUI = function() {
    this.uiScore.textContent = 'Score: ' + this.score;
    this.uiHealth.textContent = 'Health: ' + this.health;
};

// Handle meteorite reaching the player (decrease health)
GameManager.prototype.onMeteoriteHit = function() {
    this.health -= 10; // Decrease health by 10
    this.updateUI();

    // If health is zero, end the game
    if (this.health <= 0) {
        this.endGame();
    }
};

// Handle meteorite destruction (increase score)
GameManager.prototype.onMeteoriteDestroyed = function() {
    this.score += 10; // Increase score by 10
    this.updateUI();
};

// End the game
GameManager.prototype.endGame = function() {
    alert('Game Over! Your score: ' + this.score);
    this.resetGame();
};

// Reset game logic
GameManager.prototype.resetGame = function() {
    this.score = 0;
    this.health = 100;
    this.updateUI();
};
