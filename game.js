// Configuration
const app = new PIXI.Application({
  width: 600,
  height: 600,
  antialias: true,
  transparent: false,
  resolution: 1,
});
document.body.appendChild(app.view);

const gameContainer = new PIXI.Container();
app.stage.addChild(gameContainer);

// Background
const background = new PIXI.Graphics();
background.beginFill(0xffffff);
background.lineStyle(1, 0x000000);
background.drawRect(0, 0, app.screen.width, app.screen.height);
gameContainer.addChild(background);

const letters = ["A", "B", "C", "D"]; 
const letterColors = ["0xFF0000", "0x00FF00", "0x0000FF", "0xFF00FF"]; 
const letterSize = 40; 
const bgSize = 50; 
const initialSpeed = 1; 
const scoreElement = document.createElement("div");
scoreElement.textContent = "Score: 0";
document.body.appendChild(scoreElement);

const toggleButton = document.createElement("button");
toggleButton.textContent = "Start";
document.body.appendChild(toggleButton);

let score = 0;
let gameRunning = false;
let fallingLetters = [];
let speed = initialSpeed;

// Letter class
class Letter {
  constructor(x, letter, color) {
    this.x = x;
    this.y = 0;
    this.letter = letter;
    this.color = color;
    this.active = true;

    this.container = new PIXI.Container();
    this.container.x = this.x;
    this.container.y = this.y;

    this.background = new PIXI.Graphics();
    this.background.beginFill(this.color);
    this.background.drawRect(0, 0, bgSize, bgSize);
    this.container.addChild(this.background);

    this.text = new PIXI.Text(this.letter, {
      fontFamily: "Arial",
      fontSize: letterSize,
      fill: 0x000000,
    });
    this.text.anchor.set(0.5);
    this.text.position.set(bgSize / 2, bgSize / 2);
    this.container.addChild(this.text);

    gameContainer.addChild(this.container);
  }

  update() {
    this.y += speed;

    if (this.y >= app.screen.height) {
      gameOver();
    }

    if (!this.active) {
      return;
    }

    this.container.y = this.y;
  }

  deactivate() {
    this.active = false;
    gameContainer.removeChild(this.container);
  }
}

// Event listener
toggleButton.addEventListener("click", () => {
  if (!gameRunning) {
    startGame();
  } else {
    stopGame();
  }
});

document.addEventListener("keydown", (event) => {
  if (gameRunning) {
    const pressedKey = event.key.toUpperCase();
    const matchingLetters = fallingLetters.filter(
      (letter) => letter.letter === pressedKey && letter.active
    );

    if (matchingLetters.length >= 2) {
      score++;
      scoreElement.textContent = "Score: " + score;
      matchingLetters.forEach((letter) => {
        letter.deactivate();
      });
    } else {
      const singleLetter = fallingLetters.find(
        (letter) => letter.letter === pressedKey && letter.active
      );
      if (singleLetter) {
        score -= 2;
        score = Math.max(score, 0);
        scoreElement.textContent = "Score: " + score;
        singleLetter.deactivate();
      } else {
        score -= 2;
        score = Math.max(score, 0);
        scoreElement.textContent = "Score: " + score;
      }
    }
  }
});

// Functions
function startGame() {
  gameRunning = true;
  fallingLetters = [];
  score = 0;
  scoreElement.textContent = "Score: " + score;
  speed = initialSpeed;
  toggleButton.textContent = "Stop";

  animate();
}

function stopGame() {
  gameRunning = false;
  toggleButton.textContent = "Start";
}

function animate() {
  if (!gameRunning) {
    return;
  }

  app.renderer.clear();

  if (Math.random() < 0.02) {
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const color = letterColors[Math.floor(Math.random() * letterColors.length)];
    const x = Math.random() * (app.screen.width - bgSize);

    const newLetter = new Letter(x, letter, color);
    fallingLetters.push(newLetter);
  }

  fallingLetters.forEach((letter, index) => {
    letter.update();
    if (!letter.active) {
      fallingLetters.splice(index, 1);
    }
  });

  if (score >= 50) {
    stopGame();
    alert("You won!");
  }

  speed = initialSpeed + Math.floor(score / 10);

  app.renderer.render(app.stage);

  requestAnimationFrame(animate);
}

function gameOver() {
  stopGame();
  alert("Game over!");
}
