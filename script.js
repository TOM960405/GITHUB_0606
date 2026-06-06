let state = "loading";

let player;
let enemies = [];
let bullets = [];
let particles = [];

let hp = 100;
let score = 0;

let shake = 0;
let hitStop = 0;
window.onload = () => {

  let bar = document.getElementById("bar");
  bar.style.width = "100%";

  setTimeout(() => {
    document.getElementById("loading").style.display = "none";
    document.getElementById("menu").style.display = "block";
    state = "menu";
  }, 1200);
};
function startGame(){

  document.getElementById("menu").style.display = "none";

  player = {
    x: width/2,
    y: height/2,
    speed: 5
  };

  createCanvas(windowWidth, windowHeight);

  state = "play";
}
function draw(){

  background(0);

  if(state !== "play") return;

  applyShake();

  if(hitStop > 0){
    hitStop--;
    return;
  }

  game();
}
function game(){

  movePlayer();
  drawPlayer();

  spawnEnemies();
  updateEnemies();

  updateBullets();
  updateParticles();

  drawUI();

  if(hp <= 0){
    state = "gameover";
  }
}
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
function spawnEnemies(){

  if(frameCount % 30 === 0){

    enemies.push({
      x: random(width),
      y: 0,
      speed: 1 + score * 0.01
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

    fill(0,255,100);
    circle(e.x, e.y, 25);

    if(dist(e.x,e.y,player.x,player.y) < 20){
      hp -= 1;
      shake = 4;
    }
  }
}
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
function updateBullets(){

  for(let i=bullets.length-1;i>=0;i--){

    let b = bullets[i];

    b.x += b.dx;
    b.y += b.dy;

    fill(255,255,0);
    circle(b.x,b.y,6);

    for(let j=enemies.length-1;j>=0;j--){

      if(dist(b.x,b.y,enemies[j].x,enemies[j].y)<20){

        spawnParticles(enemies[j].x, enemies[j].y);

        enemies.splice(j,1);
        bullets.splice(i,1);

        score++;

        shake = 4;
        hitStop = 2; // 🔥 產品級手感

        break;
      }
    }
  }
}
function spawnParticles(x,y){

  for(let i=0;i<8;i++){
    particles.push({
      x:x,
      y:y,
      dx:random(-2,2),
      dy:random(-2,2),
      life:20
    });
  }
}

function updateParticles(){

  for(let p of particles){

    p.x += p.dx;
    p.y += p.dy;
    p.life--;

    fill(255,200,0,p.life*10);
    circle(p.x,p.y,4);
  }
}
function drawUI(){

  fill(255);
  textSize(18);

  text("HP: " + hp, 20, 30);
  text("Score: " + score, 20, 60);
}
function applyShake(){

  if(shake > 0){
    translate(random(-shake,shake), random(-shake,shake));
    shake *= 0.85;
  }
}
function drawGameOver(){

  fill(255,0,0);
  textAlign(CENTER);

  textSize(50);
  text("GAME OVER", width/2, height/2);

  textSize(20);
  text("Score: " + score, width/2, height/2+50);
}