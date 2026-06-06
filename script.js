let player;
let zombies = [];
let bullets = [];

let hp = 100;
let startTime;
let gameOver = false;

function setup() {
    createCanvas(windowWidth, windowHeight);

    player = {
        x: width/2,
        y: height/2,
        size: 30,
        speed: 5
    };

    startTime = millis();
}

function draw() {

    background(40,120,40);

    if(gameOver){
        fill(255,0,0);
        textAlign(CENTER);
        textSize(50);
        text("GAME OVER", width/2, height/2);

        textSize(30);
        text("存活時間: " + floor((millis()-startTime)/1000) + " 秒",
             width/2, height/2+50);

        text("按 R 重新開始", width/2, height/2+100);
        return;
    }

    movePlayer();

    fill(0,0,255);
    circle(player.x, player.y, player.size);

    if(frameCount % 60 === 0){
        spawnZombie();
    }

    updateBullets();
    updateZombies();

    fill(255);
    textSize(24);
    textAlign(LEFT);

    text("HP: " + hp, 20, 40);

    let surviveTime = floor((millis()-startTime)/1000);
    text("Time: " + surviveTime + " s", 20, 80);
}

function movePlayer(){

    if(keyIsDown(65)) player.x -= player.speed;
    if(keyIsDown(68)) player.x += player.speed;
    if(keyIsDown(87)) player.y -= player.speed;
    if(keyIsDown(83)) player.y += player.speed;

    player.x = constrain(player.x,0,width);
    player.y = constrain(player.y,0,height);
}

function spawnZombie(){

    let side = floor(random(4));

    let x,y;

    if(side===0){
        x=random(width);
        y=0;
    }
    else if(side===1){
        x=width;
        y=random(height);
    }
    else if(side===2){
        x=random(width);
        y=height;
    }
    else{
        x=0;
        y=random(height);
    }

    zombies.push({
        x:x,
        y:y,
        size:25,
        speed:1.5
    });
}

function updateZombies(){

    for(let i=zombies.length-1;i>=0;i--){

        let z = zombies[i];

        let dx = player.x-z.x;
        let dy = player.y-z.y;

        let d = sqrt(dx*dx+dy*dy);

        z.x += dx/d*z.speed;
        z.y += dy/d*z.speed;

        fill(0,200,0);
        circle(z.x,z.y,z.size);

        if(dist(player.x,player.y,z.x,z.y)<25){

            hp -= 1;

            if(hp<=0){
                gameOver=true;
            }
        }
    }
}

function mousePressed(){

    let angle = atan2(
        mouseY-player.y,
        mouseX-player.x
    );

    bullets.push({
        x:player.x,
        y:player.y,
        dx:cos(angle)*10,
        dy:sin(angle)*10
    });
}

function updateBullets(){

    for(let i=bullets.length-1;i>=0;i--){

        let b=bullets[i];

        b.x += b.dx;
        b.y += b.dy;

        fill(255,255,0);
        circle(b.x,b.y,10);

        for(let j=zombies.length-1;j>=0;j--){

            if(dist(b.x,b.y,zombies[j].x,zombies[j].y)<20){

                zombies.splice(j,1);
                bullets.splice(i,1);
                break;
            }
        }
    }
}

function keyPressed(){

    if(key==='r' || key==='R'){

        hp = 100;
        zombies = [];
        bullets = [];

        player.x = width/2;
        player.y = height/2;

        startTime = millis();
        gameOver = false;
    }
}

function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
}