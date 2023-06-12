Howler.volume(0.5);
const audio = {
  eatGhost: new Howl({
    src: "./audio/eat_ghost.wav",
  }),
  gameOver: new Howl({
    src: "./audio/gameOver.wav",
  }),
  gameWin: new Howl({
    src: "./audio/gameWin.wav",
  }),
  powerDot: new Howl({
    src: "./audio/power_dot.wav",
  }),
  waka: new Howl({
    src: "./audio/waka.wav",
  }),
};

let audioClicks = 0;

document.querySelector("#audioIcon").addEventListener("click", () => {
  if (audioClicks % 2 == 0) {
    document.querySelector("#audioIcon").src = "./img/volumeoff.png";
    Howler.volume(0);
  } else {
    document.querySelector("#audioIcon").src = "./img/volumeon.png";
    Howler.volume(0.5);
  }
  audioClicks++;
});
