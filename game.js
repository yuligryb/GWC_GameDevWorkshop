// ========================================
// GAME CONFIGURATION
// ========================================
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    },
    backgroundColor: '#0a0a1a',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// ========================================
// GAME VARIABLES
// ========================================
let player;
let stars;
let asteroids;
let score = 0;
let scoreText;
let gameOver = false;
let gameWon = false;
let cursors;
let wasd;
let gameWidth;
let gameHeight;


// ========================================
// PRELOAD - Load Images
// ========================================
function preload() {
    // Load images from Phaser Labs CDN
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('ship', 'https://labs.phaser.io/assets/sprites/thrust_ship2.png');
    this.load.image('star', 'https://labs.phaser.io/assets/sprites/star.png');
    this.load.image('asteroid', 'https://labs.phaser.io/assets/sprites/purple_ball.png');
}


// ========================================
// CREATE - Setup the Game
// ========================================
function create() {
    // Get game dimensions
    gameWidth = this.scale.width;
    gameHeight = this.scale.height;
    
    // Add background
    this.add.image(gameWidth / 2, gameHeight / 2, 'sky').setDisplaySize(gameWidth, gameHeight);
    
    // Add title
    this.add.text(gameWidth / 2, 50, 'COLLECT THE STARS!', {
        fontSize: '48px',
        fill: '#fff',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 6
    }).setOrigin(0.5);
    
    // Add goal text
    this.add.text(gameWidth / 2, 110, 'Get 100 Points to Win!', {
        fontSize: '28px',
        fill: '#ffeb3b',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 4
    }).setOrigin(0.5);
    
    // Create the player (spaceship)
    player = this.physics.add.sprite(gameWidth / 2, gameHeight - 100, 'ship');
    player.setCollideWorldBounds(true);
    player.setScale(3.5);
    player.setRotation(0); // Point upward
    
    // Create stars group
    stars = this.physics.add.group();
    
    // Create asteroids group
    asteroids = this.physics.add.group();
    
    // Setup keyboard controls
    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys({
        up: 'W',
        left: 'A',
        down: 'S',
        right: 'D'
    });
    
    // Score display
    scoreText = this.add.text(20, 20, 'Score: 0 / 100', {
        fontSize: '36px',
        fill: '#fff',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 4
    });
    
    // Instructions
    this.add.text(gameWidth / 2, gameHeight - 40, 'Arrow Keys or WASD to Move', {
        fontSize: '24px',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 3
    }).setOrigin(0.5);
    
    // Spawn stars every 1 second
    this.time.addEvent({
        delay: 1000,
        callback: spawnStar,
        callbackScope: this,
        loop: true
    });
    
    // Spawn asteroids more frequently
    this.time.addEvent({
        delay: 800,
        callback: spawnAsteroid,
        callbackScope: this,
        loop: true
    });
    
    // Check collisions
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.overlap(player, asteroids, hitAsteroid, null, this);
}

// ========================================
// SPAWN STAR
// ========================================
function spawnStar() {
    if (gameOver || gameWon) return;
    
    let x = Phaser.Math.Between(80, gameWidth - 80);
    let star = stars.create(x, 0, 'star');
    star.setScale(0.8);
    star.setVelocityY(280);
}

// ========================================
// SPAWN ASTEROID
// ========================================
function spawnAsteroid() {
    if (gameOver || gameWon) return;
    
    let x = Phaser.Math.Between(80, gameWidth - 80);
    let asteroid = asteroids.create(x, 0, 'asteroid');
    asteroid.setScale(1.2);
    asteroid.setVelocityY(220 + score * 2);
    
    // Make asteroids spin
    asteroid.setAngularVelocity(100);
}


// ========================================
// COLLECT STAR
// ========================================
function collectStar(player, star) {
    star.destroy();
    
    // Add 10 points
    score += 10;
    scoreText.setText('Score: ' + score + ' / 100');
    
    // Play a simple scale animation
    this.tweens.add({
        targets: player,
        scaleX: 2.8,
        scaleY: 2.8,
        duration: 100,
        yoyo: true
    });
    
    // Check if player won
    if (score >= 100) {
        gameWon = true;
        showWinScreen.call(this);
    }
}

// ========================================
// HIT ASTEROID - Game Over
// ========================================
function hitAsteroid(player, asteroid) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
    
    showGameOver.call(this);
}
// ========================================
// WIN SCREEN
// ========================================
function showWinScreen() {
    this.physics.pause();
    
    // Dark overlay
    let overlay = this.add.rectangle(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 0x000000, 0.8);
    
    // Win Box
    let box = this.add.rectangle(gameWidth / 2, gameHeight / 2, 600, 400, 0x1b5e20);
    box.setStrokeStyle(8, 0xffd700);
    
    // Win Text
    this.add.text(gameWidth / 2, gameHeight / 2 - 150, 'YOU WIN!', {
        fontSize: '72px',
        fill: '#ffeb3b',
        fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Final Score
    this.add.text(gameWidth / 2, gameHeight / 2 - 50, 'You collected 100 points!', {
        fontSize: '40px',
        fill: '#ffffff',
        fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Play Again Button
    let playAgainButton = this.add.text(gameWidth / 2, gameHeight / 2 + 80, 'PLAY AGAIN', {
        fontSize: '36px',
        fill: '#ffffff',
        backgroundColor: '#4CAF50',
        padding: { x: 40, y: 20 }
    }).setOrigin(0.5);
    
    playAgainButton.setInteractive({ useHandCursor: true });
    
    playAgainButton.on('pointerdown', () => {
        score = 0;
        gameWon = false;
        this.scene.restart();
    });
    
    playAgainButton.on('pointerover', () => {
        playAgainButton.setStyle({ backgroundColor: '#45a049' });
    });
    
    playAgainButton.on('pointerout', () => {
        playAgainButton.setStyle({ backgroundColor: '#4CAF50' });
    });
}

// ========================================
// GAME OVER SCREEN
// ========================================
function showGameOver() {
    // Dark overlay
    let overlay = this.add.rectangle(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 0x000000, 0.8);
    
    // Game Over Box
    let box = this.add.rectangle(gameWidth / 2, gameHeight / 2, 600, 400, 0x222222);
    box.setStrokeStyle(8, 0xffffff);
    
    // Game Over Text
    this.add.text(gameWidth / 2, gameHeight / 2 - 150, 'GAME OVER!', {
        fontSize: '72px',
        fill: '#ff4444',
        fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Final Score
    this.add.text(gameWidth / 2, gameHeight / 2 - 50, 'Score: ' + score + ' / 100', {
        fontSize: '40px',
        fill: '#ffffff',
        fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Play Again Button
    let playAgainButton = this.add.text(gameWidth / 2, gameHeight / 2 + 80, 'PLAY AGAIN', {
        fontSize: '36px',
        fill: '#ffffff',
        backgroundColor: '#4CAF50',
        padding: { x: 40, y: 20 }
    }).setOrigin(0.5);
    
    playAgainButton.setInteractive({ useHandCursor: true });
    
    playAgainButton.on('pointerdown', () => {
        score = 0;
        gameOver = false;
        this.scene.restart();
    });
    
    playAgainButton.on('pointerover', () => {
        playAgainButton.setStyle({ backgroundColor: '#45a049' });
    });
    
    playAgainButton.on('pointerout', () => {
        playAgainButton.setStyle({ backgroundColor: '#4CAF50' });
    });
}

// ========================================
// UPDATE - Runs Every Frame
// ========================================
function update() {
    if (gameOver || gameWon) return;
    
    // Move player left
    if (cursors.left.isDown || wasd.left.isDown) {
        player.setVelocityX(-350);
    }
    // Move player right
    else if (cursors.right.isDown || wasd.right.isDown) {
        player.setVelocityX(350);
    }
    // Stop moving
    else {
        player.setVelocityX(0);
    }
    
    // Clean up stars that fall off screen
    stars.children.entries.forEach(star => {
        if (star.y > gameHeight + 20) star.destroy();
    });
    
    // Clean up asteroids that fall off screen
    asteroids.children.entries.forEach(asteroid => {
        if (asteroid.y > gameHeight + 20) asteroid.destroy();
    });
}

// ========================================
// START THE GAME
// ========================================
const game = new Phaser.Game(config);
