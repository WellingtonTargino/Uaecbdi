const jumpSound = document.getElementById("jumpSound");
const bgMusic = document.getElementById("bgMusic");
const game = document.getElementById("game");
const bird = document.getElementById("bird");
const scoreText = document.getElementById("score");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");

const mobileButton = document.getElementById("mobileButton");

let birdY = 300;
let velocity = 0;
let gravity = 0.5;
let jumpForce = -9;

let gameStarted = false;
let gameEnded = false;

let score = 0;

const pipes = [];
const coins = [];

function startGame() {

  if (gameStarted) return;

  gameStarted = true;

  startScreen.style.display = "none";

  // inicia música
  bgMusic.volume = 0.4;
  bgMusic.play();

  gameLoop();
  createPipes();
}

function jump() {

  if (!gameStarted) {
    startGame();
  }

  if (gameEnded) return;

  velocity = jumpForce;

  // toca som do pulo
  jumpSound.currentTime = 0;
  jumpSound.play();
}

/* ========= CONTROLES ========= */

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});

document.addEventListener("click", jump);

mobileButton.addEventListener("touchstart", (e) => {
  e.preventDefault();
  jump();
});

/* ========= GAME LOOP ========= */

function gameLoop() {

  if (gameEnded) return;

  velocity += gravity;
  birdY += velocity;

  bird.style.top = birdY + "px";

  movePipes();
  moveCoins();

  checkCollision();

  requestAnimationFrame(gameLoop);
}

/* ========= PIPES ========= */

function randomBalloonColor() {

  const colors = [
    "#ff4d4d",
    "#3498db",
    "#f1c40f",
    "#2ecc71",
    "#9b59b6",
    "#ff7f50",
    "#1abc9c"
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

function createPipes() {

  if (gameEnded) return;

  const gap = 220;
  const minHeight = 80;

  const screenHeight = window.innerHeight;

  const topHeight =
    Math.floor(Math.random() * (screenHeight - gap - 200)) + 50;

  const bottomHeight =
    screenHeight - topHeight - gap;

  const pipeX = window.innerWidth;
  const color = randomBalloonColor();

  

  // Pipe superior
  const topPipe = document.createElement("div");
  topPipe.classList.add("pipe");

  topPipe.style.height = topHeight + "px";
  topPipe.style.left = pipeX + "px";
  topPipe.style.top = "0px";

  // Pipe inferior
  const bottomPipe = document.createElement("div");
  bottomPipe.classList.add("pipe");

  bottomPipe.style.height = bottomHeight + "px";
  bottomPipe.style.left = pipeX + "px";
  bottomPipe.style.bottom = "0px";

  game.appendChild(topPipe);
  game.appendChild(bottomPipe);

  pipes.push(topPipe, bottomPipe);

  topPipe.style.background = color;
  bottomPipe.style.background = color;

  /* ========= MOEDA ========= */

  const coin = document.createElement("div");
  coin.classList.add("coin");

  coin.style.left = (pipeX + 22) + "px";
  coin.style.top =
    (topHeight + gap / 2 - 20) + "px";

  game.appendChild(coin);

  coins.push(coin);

  setTimeout(createPipes, 1800);
}



/* ========= MOVIMENTAÇÃO ========= */

function movePipes() {

  pipes.forEach((pipe, index) => {

    let pipeX = parseFloat(pipe.style.left || 0);

    pipeX -= 3;

    pipe.style.left = pipeX + "px";

    if (pipeX < -100) {
      pipe.remove();
      pipes.splice(index, 1);
    }
  });
}

function moveCoins() {

  coins.forEach((coin, index) => {

    let coinX = parseFloat(coin.style.left);

    coinX -= 3;

    coin.style.left = coinX + "px";

    if (coinX < -50) {
      coin.remove();
      coins.splice(index, 1);
    }

    if (isColliding(bird, coin)) {

      score++;
      scoreText.innerText = score;

      coin.remove();
      coins.splice(index, 1);
    }
  });
}

/* ========= COLISÕES ========= */

function checkCollision() {

  // chão/teto
  if (birdY <= 0 || birdY >= window.innerHeight - 45) {
    endGame();
  }

  pipes.forEach(pipe => {
    if (isColliding(bird, pipe)) {
      endGame();
    }
  });
}

function isColliding(a, b) {

  const rectA = a.getBoundingClientRect();
  const rectB = b.getBoundingClientRect();

  return !(
    rectA.top > rectB.bottom ||
    rectA.bottom < rectB.top ||
    rectA.right < rectB.left ||
    rectA.left > rectB.right
  );
}

/* ========= GAME OVER ========= */

function endGame() {

  gameEnded = true;

  bgMusic.pause();

  gameOverScreen.style.display = "flex";

  finalScore.innerText = `Pontuação: ${score}`;
}

function restartGame() {
  location.reload();
}