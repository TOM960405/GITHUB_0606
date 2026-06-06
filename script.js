let player;
let zombies = [];
let bullets = [];
let items = [];

let hp = 100;
let startTime;
let gameState = "start";
let cooldown = 0;

function setup(){
    createCanvas(windowWidth, windowHeight);

    player = {
        x: width/2,
        y: height/2,
        size: 30,
        speed: 5
    };
}

function draw(){

    background(10);

    // 星空效果（質感）
    for(let i=0;i<50;i++){
        stroke(255,50);
        point(random(width), random(height));
    }

    if(gameState === "start"){
        drawStart();
        return;
    }

    if(gameState === "gameover"){
        drawGameOver();
        return;
    }

    game();
}

function drawStart(){
    fill(255);
    textAlign(CENTER);
    textSize(40);
    text("🧟 Zombie Survival PRO", width/2, height/2-50);

    textSize(20);
    text("Click to Start", width/2, height/2+20);
}

function drawGameOver(){
    fill(255,0,0);
    textAlign(CENTER);
    textSize(50);
    text("GAME OVER", width/2, height/2);

    textSize(25);
    text("Survive: " + floor((millis()-startTime)/1000) + "s",
        width/2, height/2+60);
}

function game(){

    movePlayer();

    // 玩家
    fill(0,150,255);
    circle(player.x, player.y, player.size);

    // 血條（高級感）
    drawHP();

    // 冷卻條
    cooldown--;

    // 生成殭屍
    if(frameCount % 50 === 0){
        spawnZombie();
    }

    // 掉補血包
    if(frameCount % 300 === 0){
        spawnItem();
    }

    updateZombies();
    updateBullets();
    updateItems();

    drawUI();

    if(hp <= 0){
        gameState = "gameover";
    }
}

function movePlayer(){
    if(keyIsDown(65)) player.x -= player.speed;
    if(keyIsDown(68)) player.x += player.speed;
    if(keyIsDown(87)) player.y -= player.speed;
    if(keyIsDown(83)) player.y += player.speed;
}

function spawnZombie(){
    zombies.push({
        x: random(width),
        y: 0,
        speed: random(1,2)
    });
}

function spawnItem(){
    items.push({
        x: random(width),
        y: random(height),
        type: "heal"
    });
}

function updateZombies(){

    for(let i=zombies.length-1;i>=0;i--){
        let z = zombies[i];

        let dx = player.x - z.x;
        let dy = player.y - z.y;
        let d = sqrt(dx*dx+dy*dy);

        z.x += dx/d * z.speed;
        z.y += dy/d * z.speed;

        fill(0,200,0);
        circle(z.x, z.y, 25);

        if(dist(player.x,player.y,z.x,z.y)<20){
            hp -= 1;
        }
    }
}

function updateBullets(){

    for(let i=bullets.length-1;i>=0;i--){
        let b = bullets[i];

        b.x += b.dx;
        b.y += b.dy;

        fill(255,255,0);
        circle(b.x,b.y,8);

        for(let j=zombies.length-1;j>=0;j--){
            if(dist(b.x,b.y,zombies[j].x,zombies[j].y)<20){
                zombies.splice(j,1);
                bullets.splice(i,1);
                break;
            }
        }
    }
}

function updateItems(){

    for(let i=items.length-1;i>=0;i--){
        let it = items[i];

        fill(0,255,0);
        rect(it.x,it.y,15,15);

        if(dist(player.x,player.y,it.x,it.y)<20){
            hp = min(100, hp + 20);
            items.splice(i,1);
        }
    }
}

function drawHP(){
    fill(255);
    rect(20,20,100,10);

    fill(255,0,0);
    rect(20,20,hp,10);
}

function drawUI(){
    fill(255);
    textSize(20);
    text("Time: " + floor((millis()-startTime)/1000), 20, 70);
}

function mousePressed(){

    if(gameState === "start"){
        gameState = "play";
        startTime = millis();
        return;
    }

    if(cooldown > 0) return;

    let angle = atan2(mouseY-player.y, mouseX-player.x);

    bullets.push({
        x: player.x,
        y: player.y,
        dx: cos(angle)*10,
        dy: sin(angle)*10
    });

    cooldown = 10;
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}