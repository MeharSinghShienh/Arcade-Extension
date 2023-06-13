addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;

    case "ArrowUp":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "ArrowLeft":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "ArrowDown":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "ArrowRight":
      keys.d.pressed = true;
      lastKey = "d";
      break;

    case "Enter":
      if (game.active == false) {
        document.querySelector("#startScreen").style.display = "none";
        document.querySelector("#restartScreen").style.display = "none";
        document.querySelector("#scoreContainer").style.display = "block";
        init();
        animate();
      }
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;

    case "ArrowUp":
      keys.w.pressed = false;
      break;
    case "ArrowLeft":
      keys.a.pressed = false;
      break;
    case "ArrowDown":
      keys.s.pressed = false;
      break;
    case "ArrowRight":
      keys.d.pressed = false;
      break;
  }
});

let audioClicks = 0;

document.querySelector("#audioIcon").addEventListener("click", () => {
  if (audioClicks % 2 == 0) {
    document.querySelector("#audioIcon").src = "./img/volumeoff.png";
    eatGhost.muted = true;
    gameOver.muted = true;
    gameWin.muted = true;
    powerDot.muted = true;
    waka.muted = true;
  } else {
    document.querySelector("#audioIcon").src = "./img/volumeon.png";
    eatGhost.muted = false;
    gameOver.muted = false;
    gameWin.muted = false;
    powerDot.muted = false;
    waka.muted = false;
  }
  audioClicks++;
});
