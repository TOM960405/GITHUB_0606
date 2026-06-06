let player;
let meteors = [];
let score = 0;
let gameOver = false;

function setup() {
    createCanvas(windowWidth, windowHeight);

    player = {
        x: width/2,
        y: height-80,
        size: 40
    };
}

function draw() {

    background(10);

    for(let i=0;i<100;i++){
        stroke(255);
        point(random(width),random(height));
    }

    if(gameOver){

        fill(255,0,0);
        textAlign(CENTER);
        textSize(50);
        text("GAME OVER",width/2,height/2);

        textSize(25);
        text("Score: "+score,width/2,height/2+50);
        text("Click to Restart",width/2,height/2+100);

        return;
    }

    player.x = mouseX;

    noStroke();
    fill(0,255,255);
    triangle(
        player.x,
        player.y-25,
        player.x-20,
        player.y+20,
        player.x+20,
        player.y+20
    );

    if(frameCount%20===0){
        meteors.push({
            x: random(width),
            y: -20,
            size: random(20,50),
            speed: random(4,10)
        });
    }

    for(let i=meteors.length-1;i>=0;i--){

        let m = meteors[i];

        fill(150);
        circle(m.x,m.y,m.size);

        m.y += m.speed;

        let d = dist(player.x,player.y,m.x,m.y);

        if(d < player.size/2 + m.size/2){
            gameOver = true;
        }

        if(m.y > height+50){
            meteors.splice(i,1);
            score++;
        }
    }

    fill(255);
    textSize(25);
    textAlign(LEFT);
    text("Score: "+score,20,40);
}

function mousePressed(){

    if(gameOver){

        meteors = [];
        score = 0;
        gameOver = false;
    }
}

function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
}