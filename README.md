# Collect the Stars! 🚀⭐

A space-themed arcade game built with Phaser 3. Collect stars, avoid asteroids, and reach 100 points to win!

---

### Prerequisites
✅ **index.html is already provided in this repository**  
✅ You'll be building the `game.js` file step-by-step by copying each section below

---

## Step 1: Fork This Repository!

1. Click the **Fork** button at the top right of this page
2. Go to your forked repository
3. Click **Settings** → **Pages** (left sidebar)
4. Under **Source**, select **main** branch → **Save**
5. Your game will be live at: `https://[your-username].github.io/[repository-name]/`

---

## Step 2: Build the Game - Copy Each Section Below!

Follow along and copy-paste each section into your `game.js` file in order.

---

### 📋 **Section 1: Game Configuration**
Copy and paste this code into your `game.js` file:

```javascript
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
```

**What this does:** Sets up the game window, physics engine, and background color.

---

### 📋 **Section 2: Game Variables**
Add this code right after Section 1:

```javascript

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
```

**What this does:** Declares all variables we'll use (player, stars, score, etc.).

---

### 📋 **Section 3: Preload Function**
Add this code next:

```javascript

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
```

**What this does:** Loads all images before the game starts.

---

### 📋 **Section 4: Create Function**
Add this code next:

```javascript

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
```

**What this does:** Sets up everything - background, player, controls, timers, and collision detection.

---

### 📋 **Section 5: Spawn Star Function**
Add this code next:

```javascript

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
```

**What this does:** Creates a star at random position that falls down.

---

### 📋 **Section 6: Spawn Asteroid Function**
Add this code next:

```javascript

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
```

**What this does:** Creates spinning asteroids that get faster as your score increases.

---

### 📋 **Section 7: Collect Star Function**
Add this code next:

```javascript

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
```

**What this does:** Adds 10 points when you collect a star, plays animation, checks for win.

---

### 📋 **Section 8: Hit Asteroid Function**
Add this code next:

```javascript

// ========================================
// HIT ASTEROID - Game Over
// ========================================
function hitAsteroid(player, asteroid) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
    
    showGameOver.call(this);
}
```

**What this does:** Ends the game when you hit an asteroid.

---

### 📋 **Section 9: Win Screen**
Add this code next:

```javascript

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
```

**What this does:** Shows victory screen with "PLAY AGAIN" button.

---

### 📋 **Section 10: Game Over Screen**
Add this code next:

```javascript

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
```

**What this does:** Shows game over screen with your score and restart button.

---

### 📋 **Section 11: Update Function**
Add this code next:

```javascript

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
```

**What this does:** Runs 60 times per second - handles player movement and cleanup.

---

### 📋 **Section 12: Start the Game** (I already included this is your game.js file)
Add this FINAL code:

```javascript

// ========================================
// START THE GAME
// ========================================
const game = new Phaser.Game(config);
```

**What this does:** Creates and starts the game. This MUST be the last line!

---

## Step 3: Commit Your Code 
1. Scroll down to the bottom of the page
2. Click **Commit changes**
3. Click **Commit changes** again in the popup
4. Wait 1-2 minutes for GitHub Pages to deploy

---

## Step 4: Play Your Game!

1. Go to: `https://[your-username].github.io/[repository-name]/`
2. Use **WASD** to move left and right
3. Collect yellow stars = +10 points each
4. Avoid purple spinning asteroids = instant game over
5. Reach 100 points to win!

---

## 🎨 Quick Customization Ideas

Edit `game.js` and try changing these values:

**Make it easier/harder:**
```javascript
delay: 1000,  // Line 115 - Stars spawn rate (try 800 or 1500)
delay: 800,   // Line 122 - Asteroids spawn rate (try 600 or 1000)
```

**Change win condition:**
```javascript
if (score >= 100) {  // Line 178 - Change to 50, 200, etc.
```

**Change points per star:**
```javascript
score += 10;  // Line 171 - Change to 5, 15, 20, etc.
```

**Change player speed:**
```javascript
player.setVelocityX(-350);  // Lines 323 & 327 - Try 250 or 500
```

**Change background color:**
```javascript
backgroundColor: '#0a0a1a',  // Line 13 - Try '#1a0a0a' or '#0a1a0a'
```

---

## 🎮 How It Works

**The Game Loop:**
1. `preload()` - Loads images (once)
2. `create()` - Sets up game (once)
3. `update()` - Runs every frame (60 times/second)

**Difficulty System:**
- Asteroids speed increases with score: `220 + score * 2` pixels/second
- At 0 points: 220 px/s
- At 50 points: 320 px/s
- At 100 points: 420 px/s

---

## 🛠️ Technologies

- **Phaser 3.55.2** - Game framework
- **JavaScript** - Game logic
- **GitHub Pages** - Free hosting

---

**🎉 Congratulations! You built a complete game!**

*Learn more: [Phaser Examples](https://phaser.io/examples) | [Phaser Docs](https://photonstorm.github.io/phaser3-docs/)*
