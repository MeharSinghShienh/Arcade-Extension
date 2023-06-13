// board
let board;
let boardWidth = 360;
let boardHeight = 590;
let context;

// bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

// pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; // speed of pipes moving left
let velocityY = 0; // bird jump speed
let gravity = 0.4;

// audio
die = new Audio("./audio/sfx_die.wav");
hit = new Audio("./audio/sfx_hit.wav");
point = new Audio("./audio/sfx_point.wav");
wing = new Audio("./audio/sfx_wing.wav");

let gameStart = false;
let gameOver = false;
let birdOutOfFrame = false;

let score = 0;

let hitAudio = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  // // draw bird
  // context.fillStyle = "green";
  // context.fillRect(bird.x, bird.y, bird.width, bird.height);

  // load images
  birdImg = new Image();
  birdImg.src = "./img/flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "./img/toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./img/bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePipes, 1500);
  document.addEventListener("keydown", moveBird);
};

function update() {
  requestAnimationFrame(update);
  if (birdOutOfFrame) {
    return;
  }
  if (gameOver) {
    if (velocityY < 0) {
      velocityY = 0;
    }
    velocityY += gravity;
    bird.y += velocityY;

    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    if (bird.y > board.height) {
      birdOutOfFrame = true;
      return;
    }
  }
  context.clearRect(0, 0, board.width, board.height);

  if (!gameStart) {
    context.fillStyle = "white";
    context.font = "30px sans-serif";
    context.fillText("Press Space to Start", board.width / 8, board.height / 3);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    return;
  }

  // bird
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    if (hitAudio == 0) {
      die.play();
      hitAudio++;
    }
    birdOutOfFrame = true;
    gameOver = true;
  }

  // pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      point.play();
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      if (hitAudio == 0) {
        hit.play();
        hitAudio++;
      }
      gameOver = true;
    }
  }

  // clear pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
  }

  // score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver) {
    context.fillText("GAME OVER", 5, 90);
    context.font = "25px sans-serif";
    context.fillText(
      "Press Space to Play Again",
      board.width / 10,
      board.height / 2
    );
  }
}

function placePipes() {
  if (gameOver || !gameStart) {
    return;
  }
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

function moveBird(event) {
  if (event.code == "Space" || event.code == "ArrowUp") {
    // jump
    velocityY = -6;
    if (!gameOver) {
      //wing.play();
    }

    if (!gameStart) {
      gameStart = true;
    }

    // reset game
    if (gameOver && birdOutOfFrame) {
      birdOutOfFrame = false;
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      hitAudio = 0;
      gameOver = false;
    }
  }
}

function detectCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

let audioClicks = 0;

document.getElementById("audioIcon").addEventListener("click", () => {
  if (audioClicks % 2 == 0) {
    document.querySelector("#audioIcon").src = "./img/volumeoff.png";
    die.muted = true;
    hit.muted = true;
    point.muted = true;
    wing.muted = true;
  } else {
    document.querySelector("#audioIcon").src = "./img/volumeon.png";
    die.muted = false;
    hit.muted = false;
    point.muted = false;
    wing.muted = false;
  }
  audioClicks++;
});
