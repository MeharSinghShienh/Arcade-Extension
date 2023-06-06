const scoreEl = document.querySelector("#scoreEl");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

let player = new Player();
let projectiles = [];
let grids = [];
let invaderProjectiles = [];
let particles = [];
let keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

let frames = 0;
let randomInterval = Math.floor(Math.random() * 500 + 500);
let game = {
  over: false,
  active: true,
};
let score = 0;
let spawnBuffer = 500;

function init() {
  player = new Player();
  projectiles = [];
  grids = [];
  invaderProjectiles = [];
  particles = [];

  keys = {
    a: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
    space: {
      pressed: false,
    },
  };

  frames = 0;
  randomInterval = Math.floor(Math.random() * 500 + 500);
  game = {
    over: false,
    active: true,
  };
  score = 0;
  document.querySelector("#finalScore").innerHTML = score;
  document.querySelector("#scoreEl").innerHTML = score;

  spawnBuffer = 500;
  // stars background
  for (let i = 0; i < 100; i++) {
    particles.push(
      new Particle({
        position: {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
        },
        velocity: {
          x: 0,
          y: 0.3,
        },
        radius: Math.random() * 2,
        color: "white",
      })
    );
  }
  //scoreEl.innerHTML = score;
}

function endGame() {
  console.log("you lose");
  audio.gameOver.play();
  setTimeout(() => {
    player.opacity = 0;
    game.over = true;
  }, 0);
  setTimeout(() => {
    game.active = false;
    document.querySelector("#restartScreen").style.display = "flex";
    document.querySelector("#finalScore").innerHTML = score;
  }, 2000);
  createParticles({
    object: player,
    color: "white",
  });
}

let fps = 60;
let fpsInterval = 1000 / fps;
let msPrev = window.performance.now();
function animate() {
  scoreEl.innerHTML = score;
  if (!game.active) return;
  requestAnimationFrame(animate);

  const msNow = window.performance.now;
  const elapsed = msNow - msPrev;

  if (elapsed < fpsInterval) return;

  msPrev = msNow - (elapsed % fpsInterval);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.update();

  for (let i = player.particles.length - 1; i >= 0; i--) {
    const particle = player.particles[i];
    particle.update();

    if (particle.opacity === 0) player.particles[i].splice(i);
  }

  particles.forEach((particle, i) => {
    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width;
      particle.position.y = -particle.radius;
    }

    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1);
      }, 0);
    } else {
      particle.update();
    }
  });
  invaderProjectiles.forEach((invaderProjectile, index) => {
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
      canvas.height
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1);
      }, 0);
    } else {
      invaderProjectile.update();
    }

    // projectile hits player
    if (
      rectangularCollision({
        rectangle1: invaderProjectile,
        rectangle2: player,
      })
    ) {
      invaderProjectiles.splice(index, 1);
      endGame();
    }
  });
  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    } else {
      projectile.update();
    }
  });

  grids.forEach((grid, gridIndex) => {
    grid.update();

    // spawn projectiles
    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles
      );
    }

    grid.invaders.forEach((invader, i) => {
      invader.update({ velocity: grid.velocity });

      // projectiles hit enemy
      projectiles.forEach((projectile, j) => {
        if (
          projectile.position.y - projectile.radius <=
            invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.x - projectile.radius <=
            invader.position.x + invader.width &&
          projectile.position.y + projectile.radius >= invader.position.y
        ) {
          setTimeout(() => {
            const invaderFound = grid.invaders.find(
              (invader2) => invader2 == invader
            );
            const projectileFound = projectiles.find(
              (projectile2) => projectile2 == projectile
            );
            if (invaderFound && projectileFound) {
              score += 100;
              scoreEl.innerHTML = score;

              // dynamic score labels
              const scoreLabel = document.createElement("label");
              scoreLabel.innerHTML = 100;
              scoreLabel.style.position = "absolute";
              scoreLabel.style.color = "white";
              scoreLabel.style.top = invader.position.y + "px";
              scoreLabel.style.left = invader.position.x + "px";
              scoreLabel.style.userSelect = "none";

              document.querySelector("#parentDiv").appendChild(scoreLabel);

              gsap.to(scoreLabel, {
                opacity: 0,
                y: -30,
                duration: 0.75,
                onComplete: () => {
                  document.querySelector("#parentDiv").removeChild(scoreLabel);
                },
              });

              createParticles({
                object: invader,
              });
              audio.explode.play();
              grid.invaders.splice(i, 1);
              projectiles.splice(j, 1);
              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0];
                const lastInvader = grid.invaders[grid.invaders.length - 1];
                grid.width =
                  lastInvader.position.x -
                  firstInvader.position.x +
                  lastInvader.width;
                grid.position.x = firstInvader.position.x;
              } else {
                grids.splice(gridIndex, 1);
              }
            }
          }, 0);
        }
      });

      // invader hits player
      if (
        rectangularCollision({
          rectangle1: invader,
          rectangle2: player,
        }) &&
        !game.over
      ) {
        endGame();
      }
    });
  });

  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -8;
    player.rotation = -0.15;
  } else if (
    keys.d.pressed &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = 8;
    player.rotation = 0.15;
  } else {
    player.velocity.x = 0;
    player.rotation = 0;
  }

  // spawn enemies
  if (frames % randomInterval === 0) {
    spawnBuffer = spawnBuffer < 0 ? 100 : spawnBuffer;
    grids.push(new Grid());
    randomInterval = Math.floor(Math.random() * 500 + spawnBuffer);
    frames = 0;
    spawnBuffer -= 100;
  }

  frames++;
}

// animate();

document.querySelector("#startButton").addEventListener("click", () => {
  audio.start.play();
  audio.backgroundMusic.play();
  document.querySelector("#startScreen").style.display = "none";
  document.querySelector("#scoreContainer").style.display = "block";
  init();
  animate();
});

document.querySelector("#restartButton").addEventListener("click", () => {
  audio.select.play();
  document.querySelector("#restartScreen").style.display = "none";
  init();
  animate();
});

addEventListener("keydown", ({ key }) => {
  // key automatically gets the key property from the event object, this is object destructuring

  if (game.over) return;

  switch (key) {
    case "a":
      keys.a.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;
    case "ArrowLeft":
      keys.a.pressed = true;
      break;
    case "ArrowRight":
      keys.d.pressed = true;
      break;
    case " ":
      if (projectiles.length <= 3) {
        audio.shoot.play();
        keys.space.pressed = true;
        projectiles.push(
          new Projectile({
            position: {
              x: player.position.x + player.width / 2,
              y: player.position.y,
            },
            velocity: {
              x: 0,
              y: -10,
            },
          })
        );
      }
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  // key automatically gets the key property from the event object, this is object destructuring
  switch (key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "ArrowLeft":
      keys.a.pressed = false;
      break;
    case "ArrowRight":
      keys.d.pressed = false;
      break;
    case " ":
      keys.space.pressed = false;
      break;
  }
});
