const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.querySelector("#scoreEl");

const map = [
  ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
  ["|", " ", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "7", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", "_", "p", ".", ".", ".", "|"],
  ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
  ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "+", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
  ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
  ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "5", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", "p", "|"],
  ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"],
];

canvas.width = map[0].length * Boundary.width;
canvas.height = map.length * Boundary.height;

// audio
eatGhost = new Audio("./audio/eat_ghost.wav");
gameOver = new Audio("./audio/gameOver.wav");
gameWin = new Audio("./audio/gameWin.wav");
powerDot = new Audio("./audio/power_dot.wav");
waka = new Audio("./audio/waka.wav");

let pellets = [];
let powerUps = [];
let ghosts = [
  new Ghost({
    position: {
      x: Boundary.width * 8 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2,
    },
    velocity: {
      x: Ghost.speed,
      y: 0,
    },
  }),
  new Ghost({
    position: {
      x: Boundary.width + Boundary.width / 2,
      y: Boundary.height * 11 + Boundary.height / 2,
    },
    velocity: {
      x: Ghost.speed,
      y: 0,
    },
    color: "pink",
  }),
  new Ghost({
    position: {
      x: Boundary.width * 8 + Boundary.width / 2,
      y: Boundary.height * 11 + Boundary.height / 2,
    },
    velocity: {
      x: Ghost.speed,
      y: 0,
    },
    color: "aqua",
  }),
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height * 7 + Boundary.height / 2,
    },
    velocity: {
      x: Ghost.speed,
      y: 0,
    },
    color: "orange",
  }),
];

let player = new Player({
  position: {
    x: Boundary.width + Boundary.width / 2,
    y: Boundary.height + Boundary.height / 2,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});

let keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

let lastKey = "";

let game = {
  over: false,
  active: false,
};

let score = 0;

let animationId;

let boundaries = generateBoundaries();

function init() {
  pellets = [];
  powerUps = [];
  ghosts = [
    new Ghost({
      position: {
        x: Boundary.width * 8 + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2,
      },
      velocity: {
        x: Ghost.speed,
        y: 0,
      },
    }),
    new Ghost({
      position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height * 11 + Boundary.height / 2,
      },
      velocity: {
        x: Ghost.speed,
        y: 0,
      },
      color: "pink",
    }),
    new Ghost({
      position: {
        x: Boundary.width * 8 + Boundary.width / 2,
        y: Boundary.height * 11 + Boundary.height / 2,
      },
      velocity: {
        x: Ghost.speed,
        y: 0,
      },
      color: "aqua",
    }),
    new Ghost({
      position: {
        x: Boundary.width * 6 + Boundary.width / 2,
        y: Boundary.height * 7 + Boundary.height / 2,
      },
      velocity: {
        x: Ghost.speed,
        y: 0,
      },
      color: "orange",
    }),
  ];
  player = new Player({
    position: {
      x: Boundary.width + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2,
    },
    velocity: {
      x: 0,
      y: 0,
    },
  });
  keys = {
    w: {
      pressed: false,
    },
    a: {
      pressed: false,
    },
    s: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
  };
  lastKey = "";
  game = {
    over: false,
    active: true,
  };
  score = 0;
  document.querySelector("#finalScore").innerHTML = score;
  document.querySelector("#scoreEl").innerHTML = score;
  animationId;
  boundaries = generateBoundaries();
}

let fps = 60;
let fpsInterval = 1000 / fps;
let msPrev = window.performance.now();
function animate() {
  if (!game.active) return;
  animationId = requestAnimationFrame(animate);

  const msNow = window.performance.now();
  const elapsed = msNow - msPrev;

  if (elapsed < fpsInterval) return;

  msPrev = msNow - (elapsed % fpsInterval);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (keys.w.pressed && lastKey === "w") {
    player.moveUp(boundaries);
  } else if (keys.a.pressed && lastKey === "a") {
    player.moveLeft(boundaries);
  } else if (keys.s.pressed && lastKey === "s") {
    player.moveDown(boundaries);
  } else if (keys.d.pressed && lastKey === "d") {
    player.moveRight(boundaries);
  }

  for (let i = ghosts.length - 1; i >= 0; i--) {
    const ghost = ghosts[i];
    // ghost touches player
    if (
      Math.hypot(
        ghost.position.x - player.position.x,
        ghost.position.y - player.position.y
      ) <
      ghost.radius + player.radius
    ) {
      if (ghost.scared) {
        eatGhost.play();
        score += 50;
        ghosts.splice(i, 1);
      } else {
        // lose condition
        cancelAnimationFrame(animationId);
        gameOver.play();
        setTimeout(() => {
          game.over = true;
          game.active = false;
          document.querySelector("#restartScreen").style.display = "flex";
          document.querySelector("#finalOutcome").style.color = "red";
          document.querySelector("#finalOutcome").innerHTML = "GAME OVER";
          document.querySelector("#finalScore").innerHTML = score;
        }, 2800);
      }
    }
  }

  // win condition
  if (pellets.length === 0) {
    gameWin.play();
    cancelAnimationFrame(animationId);
    setTimeout(() => {
      game.over = true;
      game.active = false;
      document.querySelector("#restartScreen").style.display = "flex";
      document.querySelector("#finalOutcome").style.color = "green";
      document.querySelector("#finalOutcome").innerHTML = "YOU WIN!";
      document.querySelector("#finalScore").innerHTML = score;
    }, 4500);
  }

  for (let i = powerUps.length - 1; i >= 0; i--) {
    const powerUp = powerUps[i];
    powerUp.draw();
    // player eats powerup
    if (
      Math.hypot(
        powerUp.position.x - player.position.x,
        powerUp.position.y - player.position.y
      ) <
      powerUp.radius + player.radius
    ) {
      powerDot.play();
      powerUps.splice(i, 1);

      // make ghosts scared
      ghosts.forEach((ghost) => {
        ghost.scared = true;

        setTimeout(() => {
          ghost.scared = false;
        }, 5000);
      });
    }
  }

  // pacman touches pellets
  for (let i = pellets.length - 1; i >= 0; i--) {
    const pellet = pellets[i];
    pellet.draw();
    if (
      Math.hypot(
        pellet.position.x - player.position.x,
        pellet.position.y - player.position.y
      ) <
      pellet.radius + player.radius
    ) {
      waka.play();
      pellets.splice(i, 1);
      score += 10;
      scoreEl.innerHTML = score;
    }
  }

  boundaries.forEach((boundary) => {
    boundary.draw();
    // collision detection
    if (circleCollidesWithRectangle({ circle: player, rectangle: boundary })) {
      player.velocity.x = 0;
      player.velocity.y = 0;
    }
  });
  player.update();

  ghosts.forEach((ghost) => {
    ghost.update();

    const collisions = [];
    boundaries.forEach((boundary) => {
      if (
        !collisions.includes("right") &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: ghost.speed,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("right");
      }

      if (
        !collisions.includes("left") &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: -ghost.speed,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("left");
      }

      if (
        !collisions.includes("up") &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: -ghost.speed,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("up");
      }

      if (
        !collisions.includes("down") &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: ghost.speed,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("down");
      }
    });

    if (collisions.length > ghost.prevCollisions.length) {
      ghost.prevCollisions = collisions;
    }

    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
      if (ghost.velocity.x > 0) {
        ghost.prevCollisions.push("right");
      } else if (ghost.velocity.x < 0) {
        ghost.prevCollisions.push("left");
      } else if (ghost.velocity.y < 0) {
        ghost.prevCollisions.push("up");
      } else if (ghost.velocity.y > 0) {
        ghost.prevCollisions.push("down");
      }

      const pathways = ghost.prevCollisions.filter((collision) => {
        return !collisions.includes(collision);
      });

      const direction = pathways[Math.floor(Math.random() * pathways.length)];

      switch (direction) {
        case "down":
          ghost.velocity.y = ghost.speed;
          ghost.velocity.x = 0;
          break;
        case "up":
          ghost.velocity.y = -ghost.speed;
          ghost.velocity.x = 0;
          break;
        case "right":
          ghost.velocity.y = 0;
          ghost.velocity.x = ghost.speed;
          break;
        case "left":
          ghost.velocity.y = 0;
          ghost.velocity.x = -ghost.speed;
          break;
      }
      ghost.prevCollisions = [];
    }
  });
  if (player.velocity.x > 0) {
    player.rotation = 0;
  } else if (player.velocity.x < 0) {
    player.rotation = Math.PI;
  } else if (player.velocity.y > 0) {
    player.rotation = Math.PI / 2;
  } else if (player.velocity.y < 0) {
    player.rotation = Math.PI * 1.5;
  }
}

animate();
