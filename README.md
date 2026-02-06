# GWC_GameDevWorkshop
# Collect the Stars! 🚀⭐
A space-themed arcade game built with Phaser 3. Collect stars, avoid asteroids, and reach 100 points to win!

### Step 1: Get the Code

**Option A: Fork this Repository (Recommended)**
1. Click the **Fork** button at the top right of this page
2. This creates your own copy of the game
3. Go to your forked repository

**Option B: Clone and Push**
1. Click the green **Code** button
2. Copy the HTTPS URL
3. Open terminal/command prompt and run:
   ```bash
   git clone [paste-the-url-here]
   cd collect-the-stars-game
   ```
4. Create your own repository on GitHub and push the code

---

### Step 2: Enable GitHub Pages (2 minutes)

1. In your repository, go to **Settings**
2. Scroll down and click **Pages** in the left sidebar
3. Under **Source**, select **main** (or **master**) branch
4. Click **Save**
5. Wait 1-2 minutes for deployment
6. Your game will be live at: `https://[your-username].github.io/[repository-name]/`

✅ **Bookmark this URL - this is your live game!**

---

### Step 3: Understand the Files (5 minutes)

Your repository has two files:

#### **index.html** - The game container
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Collect the Stars!</title>
  <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
    body { 
      width: 100vw;
      height: 100vh;
      background: #000;
    }
    canvas {
      display: block;
    }
  </style>
</head>
<body>
  <script src="game.js"></script>
</body>
</html>
```

**What it does:**
- Loads the Phaser 3 game library from a CDN
- Sets up fullscreen styling
- Links to `game.js` where our game code lives

#### **game.js** - The complete game code
This file contains all the game logic. We'll explore it section by section below.

---

### Step 4: How the Game Works (15 minutes)

Let's break down `game.js`:

#### **Section 1: Game Configuration** (lines 1-24)
```javascript
const config = {
    type: Phaser.AUTO,
    scale: { ... },
    backgroundColor: '#0a0a1a',
    physics: { ... },
    scene: { preload, create, update }
};
```
- Sets up the game window to fill the browser
- Enables arcade physics (no gravity)
- Links three main functions: `preload`, `create`, `update`

#### **Section 2: Game Variables** (lines 26-39)
```javascript
let player;
let stars;
let asteroids;
let score = 0;
// ...
```
- Declares all variables we'll use
- `player` = your spaceship
- `stars` = collectible objects (+10 points each)
- `asteroids` = obstacles (game over on hit)

#### **Section 3: Preload Assets** (lines 41-49)
```javascript
function preload() {
    this.load.image('sky', '...');
    this.load.image('ship', '...');
    this.load.image('star', '...');
    this.load.image('asteroid', '...');
}
```
- Loads images from Phaser's CDN before the game starts
- These run once when the page loads

#### **Section 4: Create the Game** (lines 51-129)
```javascript
function create() {
    // Add background
    // Create player at bottom center
    // Setup keyboard controls (Arrow keys + WASD)
    // Start spawning stars and asteroids
    // Setup collision detection
}
```
**Key parts:**
- **Player:** Spawns at bottom, can't leave screen
- **Timers:** Stars spawn every 1 second, asteroids every 0.8 seconds
- **Controls:** Both arrow keys and WASD work
- **Collisions:** Detects when player touches stars or asteroids

#### **Section 5: Spawning Objects** (lines 131-155)
```javascript
function spawnStar() {
    let x = Phaser.Math.Between(80, gameWidth - 80);
    let star = stars.create(x, 0, 'star');
    star.setVelocityY(280); // Falls at 280 px/second
}

function spawnAsteroid() {
    let asteroid = asteroids.create(x, 0, 'asteroid');
    asteroid.setVelocityY(220 + score * 2); // Gets faster!
}
```
- Objects spawn at random X positions at the top
- Stars fall at constant speed
- **Asteroids get faster as your score increases!**

#### **Section 6: Collision Handlers** (lines 157-184)
```javascript
function collectStar(player, star) {
    star.destroy();
    score += 10;
    // Bounce animation
    if (score >= 100) { // YOU WIN! }
}

function hitAsteroid(player, asteroid) {
    this.physics.pause();
    player.setTint(0xff0000); // Turn red
    gameOver = true;
}
```
- **Star:** Add 10 points, check for win condition
- **Asteroid:** Game over, show restart screen

#### **Section 7: Update Loop** (lines 314-343)
```javascript
function update() {
    // Runs 60 times per second!
    
    // Check keyboard input
    if (cursors.left.isDown) {
        player.setVelocityX(-350);
    }
    
    // Clean up objects that fell off screen
}
```
- This function runs every frame
- Handles player movement
- Removes off-screen objects to save memory

---

### Step 5: Play Your Game! (3 minutes)

1. Go to your GitHub Pages URL
2. Use **Arrow Keys** or **WASD** to move left/right
3. Collect stars (yellow) = +10 points each
4. Avoid asteroids (purple spinning balls) = instant game over
5. Reach **100 points** to win!

**Game Tips:**
- Asteroids speed up as you score more points
- You can't move up or down, only left and right
- The ship can't go off-screen edges

---

### Step 6: Customize Your Game (5+ minutes)

Try these quick modifications! Edit `game.js` in GitHub:

#### 🎨 **Easy Changes**

**1. Change background color:**
```javascript
backgroundColor: '#0a0a1a',  // Try: '#1a0a0a' (red) or '#0a1a1a' (cyan)
```

**2. Change win condition:**
```javascript
if (score >= 100) {  // Change 100 to 50, 150, 200, etc.
```

**3. Change point value:**
```javascript
score += 10;  // Change to 5, 15, 20, etc.
```

**4. Adjust spawn rates:**
```javascript
delay: 1000,  // Stars: Try 800 (more stars) or 1500 (fewer stars)
delay: 800,   // Asteroids: Try 600 (harder) or 1000 (easier)
```

#### ⚡ **Medium Changes**

**5. Change player speed:**
```javascript
player.setVelocityX(-350);  // Try 250 (slower) or 500 (faster)
```

**6. Change object sizes:**
```javascript
player.setScale(3.5);   // Try 2.5 (smaller) or 4.5 (bigger)
star.setScale(0.8);     // Adjust star size
asteroid.setScale(1.2); // Adjust asteroid size
```

**7. Change falling speeds:**
```javascript
star.setVelocityY(280);              // Stars fall speed
asteroid.setVelocityY(220 + score * 2); // Asteroid speed + acceleration
```

#### 🚀 **After Making Changes**

1. Click the **pencil icon** to edit `game.js` on GitHub
2. Make your changes
3. Scroll down and click **Commit changes**
4. Wait 1-2 minutes, then refresh your game page
5. See your changes live!

---

## 🎮 How to Play

- **Controls:** Arrow Keys or WASD
- **Goal:** Collect 100 points
- **Scoring:** Each star = 10 points
- **Danger:** Hitting asteroids = Game Over
- **Difficulty:** Asteroids speed up as you score more

---

## 🛠️ Technologies Used

- **Phaser 3** - HTML5 game framework
- **JavaScript** - Game logic
- **GitHub Pages** - Free hosting

---

## 📚 Next Steps

Want to learn more? Try these challenges:

1. **Add sound effects** when collecting stars or hitting asteroids
2. **Add a lives system** instead of instant game over
3. **Create power-ups** that give temporary invincibility
4. **Add a high score** that saves in localStorage
5. **Add background music**
6. **Create different levels** with increasing difficulty
7. **Add particle effects** for explosions

**Resources:**
- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Phaser 3 Examples](https://phaser.io/examples)
- [Game Development Tutorials](https://gamedevacademy.org/)

---

## 📝 License

Feel free to use this code for learning and personal projects!

---

**Happy coding! 🎉**

*Questions? Ask your instructor or check the Phaser documentation.*
