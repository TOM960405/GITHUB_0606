let state = "menu";

let player;
let enemies = [];
let bullets = [];

let hp = 100;
let score = 0;

let shake = 0;

// ===== START GAME =====
function startGame(){

  document.getElementById("menu").style.display = "none";
  document.getElementById("hud").style.display = "block";

  createCanvas(windowWidth, windowHeight);

  player = {
    x: width/2,
    y: height/2,
    speed: 5
  };

  state = "play";
}

// ===== MAIN LOOP =====
function draw(){

  background(0);

  if(state !== "play") return;

  applyShake();

  movePlayer();
  drawPlayer();

  spawnEnemies();
  updateEnemies();

  updateBullets();

  drawUI();

  if(hp <= 0){
    state = "gameover";
    alert("GAME OVER! Score: " + score);
    location.reload();
  }
}

// ===== PLAYER =====
function movePlayer(){

  if(keyIsDown(65)) player.x -= player.speed;
  if(keyIsDown(68)) player.x += player.speed;
  if(keyIsDown(87)) player.y -= player.speed;
  if(keyIsDown(83)) player.y += player.speed;
}

function drawPlayer(){
  fill(0,255,255);
  circle(player.x, player.y, 25);
}

// ===== ENEMIES =====
function spawnEnemies(){
  if(frameCount % 40 === 0){
    enemies.push({
      x: random(width),
      y: 0,
      speed: 2
    });
  }
}

function updateEnemies(){

  for(let e of enemies){

    let dx = player.x - e.x;
    let dy = player.y - e.y;
    let d = sqrt(dx*dx + dy*dy);

    e.x += dx/d * e.speed;
    e.y += dy/d * e.speed;

    fill(0,255,0);
    circle(e.x, e.y, 25);

    if(dist(e.x,e.y,player.x,player.y) < 20){
      hp -= 1;
      shake = 5;
    }
  }
}

// ===== SHOOT =====
function mousePressed(){

  if(state !== "play") return;

  let a = atan2(mouseY-player.y, mouseX-player.x);

  bullets.push({
    x: player.x,
    y: player.y,
    dx: cos(a)*12,
    dy: sin(a)*12
  });
}

// ===== BULLETS =====
function updateBullets(){

  for(let i=bullets.length-1;i>=0;i--){

    let b = bullets[i];

    b.x += b.dx;
    b.y += b.dy;

    fill(255,255,0);
    circle(b.x,b.y,6);

    for(let j=enemies.length-1;j>=0;j--){

      if(dist(b.x,b.y,enemies[j].x,enemies[j].y)<20){

        enemies.splice(j,1);
        bullets.splice(i,1);

        score++;
        shake = 3;

        break;
      }
    }
  }
}

// ===== UI =====
function drawUI(){

  document.getElementById("hp").innerText = "HP: " + hp;
  document.getElementById("score").innerText = "Score: " + score;
}

// ===== SHAKE =====
function applyShake(){

  if(shake > 0){
    translate(random(-shake,shake), random(-shake,shake));
    shake *= 0.85;
  }
}

// ===== WINDOW =====
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}