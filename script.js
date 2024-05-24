const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gameWidth = 3000;
const gameHeight = 3000;
const numRandomPlayers = 3;


alert("Salam! Oyunda səndən başqa 3 dənə random oyunçu var. Onların 3-ünü də tapıb yesən oyunu qazanırsan. Onlardan biri səni yesə məğlub olursan. Bölünmə və sürətləmə yoxdur, yaxın zamanda olacaq) Ok basıb ad daxil et və başla!")
let playerName = prompt("Username daxil et:");
while (!playerName) {
  playerName = prompt("Username daxil et:");
}

let player = {
  name: playerName,
  x: gameWidth / 2,
  y: gameHeight / 2,
  radius: 20,
  color: "blue",
  speed: 6,
};

let foods = [];
for (let i = 0; i < 200; i++) {
  foods.push({
    x: Math.random() * gameWidth,
    y: Math.random() * gameHeight,
    radius: 5 + Math.random() * 5,
    color:
      "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0"),
  });
}

let randomPlayers = [];
for (let i = 0; i < numRandomPlayers; i++) {
  let randomPlayerName = "Player " + (i + 1);
  randomPlayers.push({
    name: randomPlayerName,
    x: Math.random() * gameWidth,
    y: Math.random() * gameHeight,
    radius: 20,
    color: "red",
    speed: 1 + Math.random() * 1.5,
    direction: Math.random() * Math.PI * 2,
  });
}

function drawCircle(x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

canvas.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

function restartGame() {
  window.location.reload();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let dx = mouseX - canvas.width / 2;
  let dy = mouseY - canvas.height / 2;
  let angle = Math.atan2(dy, dx);
  let distance = Math.hypot(dx, dy);

  if (distance > 1) {
    player.x += Math.cos(angle) * player.speed;
    player.y += Math.sin(angle) * player.speed;
  }

  player.x = Math.max(
    player.radius,
    Math.min(gameWidth - player.radius, player.x)
  );
  player.y = Math.max(
    player.radius,
    Math.min(gameHeight - player.radius, player.y)
  );

  let cameraX = player.x - canvas.width / 2;
  let cameraY = player.y - canvas.height / 2;

  for (let food of foods) {
    drawCircle(food.x - cameraX, food.y - cameraY, food.radius, food.color);
  }

  for (let randomPlayer of randomPlayers) {
    if (
      randomPlayer.x < randomPlayer.radius ||
      randomPlayer.x > gameWidth - randomPlayer.radius
    ) {
      randomPlayer.direction = Math.PI - randomPlayer.direction;
    }
    if (
      randomPlayer.y < randomPlayer.radius ||
      randomPlayer.y > gameHeight - randomPlayer.radius
    ) {
      randomPlayer.direction = -randomPlayer.direction;
    }

    randomPlayer.x += Math.cos(randomPlayer.direction) * randomPlayer.speed;
    randomPlayer.y += Math.sin(randomPlayer.direction) * randomPlayer.speed;

    drawCircle(
      randomPlayer.x - cameraX,
      randomPlayer.y - cameraY,
      randomPlayer.radius,
      randomPlayer.color
    );

    let distToPlayerCenter = Math.hypot(
      player.x - randomPlayer.x,
      player.y - randomPlayer.y
    );
    if (
      distToPlayerCenter < player.radius + randomPlayer.radius &&
      player.radius > randomPlayer.radius * 1.1
    ) {
      player.radius += randomPlayer.radius * 0.2;
      randomPlayer.radius = 0;
      randomPlayers = randomPlayers.filter((p) => p !== randomPlayer);
      if (randomPlayers.length === 0) {
        alert("Oyunu qazandın! Bütün oyunçuları yedin, ağlın artdı??");
        restartGame();
        return;
      }
    } else if (
      distToPlayerCenter < player.radius &&
      player.radius * 1.1 < randomPlayer.radius
    ) {
      alert("Məğlub oldun! Kimsə səni yediii !!");
      restartGame();
      return;
    }

    let distToPlayer = Math.hypot(
      player.x - randomPlayer.x,
      player.y - randomPlayer.y
    );
    if (distToPlayer < 200) {
      let angleToPlayer = Math.atan2(
        player.y - randomPlayer.y,
        player.x - randomPlayer.x
      );
      randomPlayer.x += Math.cos(angleToPlayer) * randomPlayer.speed;
      randomPlayer.y += Math.sin(angleToPlayer) * randomPlayer.speed;
    }

    for (let food of foods) {
      let distToFood = Math.hypot(
        randomPlayer.x - food.x,
        randomPlayer.y - food.y
      );
      if (distToFood < randomPlayer.radius + food.radius) {
        randomPlayer.radius += food.radius * 0.2;
        foods = foods.filter((f) => f !== food);
        break;
      }
    }
  }

  for (let food of foods) {
    let distToFood = Math.hypot(player.x - food.x, player.y - food.y);
    if (distToFood < player.radius + food.radius) {
      player.radius += food.radius * 0.2;
      foods = foods.filter((f) => f !== food);
      break;
    }
  }

  for (let food of foods) {
    drawCircle(food.x - cameraX, food.y - cameraY, food.radius, food.color);
  }

  drawCircle(canvas.width / 2, canvas.height / 2, player.radius, player.color);

  ctx.fillStyle = "white";
  ctx.font = "14px Arial";

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    player.name,
    canvas.width / 2,
    canvas.height / 2 - player.radius - 5
  );

  for (let randomPlayer of randomPlayers) {
    ctx.fillText(
      randomPlayer.name,
      randomPlayer.x - cameraX,
      randomPlayer.y - cameraY - randomPlayer.radius - 5
    );
  }

  requestAnimationFrame(update);
}

update();
