var gameState;
var canvas = document.createElement("canvas");
var timerID;

var thisPlayer;
var ctx;
var sideM;

var bomb; var bomb2; var bomb3;

var bombs = new Array(3);

function start(){
  var startbtn = document.getElementById("startbtn");
  document.body.removeChild(startbtn);
  init();
}

function init(){
  document.body.appendChild(canvas);
  initObjects();
  //canvas init
  canvas.id     = "canvas";
  canvas.width  = window.innerWidth - 20;
  canvas.height = window.innerHeight - 20;
  canvas.onmousemove = move;
  ctx = canvas.getContext("2d");
  draw();
  
  //init bomb movement
  bombMovement();
  
  //start game
  timerID = setInterval(function(){
    manageHitboxes();
    moveCircle();
    draw();
    timeCounter();
    checkIfEnded();
  }, 5);
  
  gameState.init = true;
  console.log("Initialized");
  }

function timeCounter(){
  gameState.score += .1;
  if(gameState.score % 25 <= 0.2 && thisPlayer.size <= 120){
    thisPlayer.size += 1;
  }
}
  function move(event){ //Player movement
  if(gameState.init){
    thisPlayer.x = event.clientX;
    thisPlayer.y = event.clientY;
  }
}

function moveCircle(){ //bombs[i] movement
  for(var i = 0; i < 3; i++){
    bombs[i].x += bombs[i].xVel;
    bombs[i].y += bombs[i].yVel;
  }
}

function manageHitboxes(){
  for(var i = 0; i < 3; i++){
    if(bombs[i].xVel < 0.6 && bombs[i].xVel > -0.6 || bombs[i].yVel < 0.6 && bombs[i].yVel > -0.6){
      bombMovement();
    }
    if(bombs[i].x <= 0){ //Left
      bombs[i].xVel *= -1;
      if(bombs[i].yVel >= 0){
        bombs[i].yVel += bombs[i].inc;
      } else {
        bombs[i].yVel -= bombs[i].inc;
      }
      bombs[i].maxVel += bombs[i].inc;
    } else if (bombs[i].x + (bombs[i].diameter/2) >= canvas.width){ //Right
      bombs[i].xVel *= -1;
      if(bombs[i].yVel >= 0){
        bombs[i].yVel += bombs[i].inc;
      } else {
        bombs[i].yVel -= bombs[i].inc;
      }
      bombs[i].maxVel += bombs[i].inc;
    }
    if(bombs[i].y <= 0){ //Top
      bombs[i].yVel *= -1;
      if(bombs[i].xVel >= 0){
        bombs[i].xVel += bombs[i].inc;
      } else {
        bombs[i].xVel -= bombs[i].inc;
      }
      bombs[i].maxVel += bombs[i].inc;
    } else if(bombs[i].y + (bombs[i].diameter/2) >= canvas.height){ //Bot
      bombs[i].yVel *= -1;
      if(bombs[i].xVel >= 0){
        bombs[i].xVel += bombs[i].inc;
      } else {
        bombs[i].xVel -= bombs[i].inc;
      }
      bombs[i].maxVel += bombs[i].inc;
    }
    if( !(
      ( ( thisPlayer.y + thisPlayer.size ) < ( bombs[i].y ) ) ||
  		( thisPlayer.y > ( bombs[i].y + bombs[i].diameter ) ) ||
  		( ( thisPlayer.x + thisPlayer.size ) < bombs[i].x ) ||
  		( thisPlayer.x > ( bombs[i].x + bombs[i].diameter ) ) 
  		) ) {
  		  //Player touched circle
  		  ended();
    }
  }
}

function draw(){
  //Grey Background
  ctx.fillStyle = "#C0C0C0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //bombs
  for(var i = 0; i < 3; i++){
    ctx.fillStyle = bombs[i].color;
    ctx.beginPath();
    ctx.arc(bombs[i].x, bombs[i].y, bombs[i].diameter, 0, bombs[i].maths);
    ctx.fill();
    ctx.closePath();
  }
  //This player
  ctx.fillStyle = "#0000FF"
  ctx.fillRect(thisPlayer.x - (thisPlayer.size / 2), thisPlayer.y - (thisPlayer.size / 2), thisPlayer.size, thisPlayer.size);
}

function checkIfEnded(){
  for(var i = 0; i < 3; i++){
    if(bombs[i].maxVel > 75){
      bombs[i].maxVel = 10;
      bombs[i].diameter += 10;
    }
  }
  if(bombs[2].maxVel > 75){
    ended();
  }
}

function initObjects(){
  gameState = {
    init: false,
    over: false,
    score: 0
  };
  bomb = {
    x: window.innerWidth / 2, y: window.innerHeight / 2,
    maths: 2 * Math.PI, diameter: 40,
    xVel: 0, yVel: 0, maxVel: 20, inc: 0.1, color: "#CC00CC"
  };
  bomb2 = {
    x: window.innerWidth / 2, y: window.innerHeight / 2,
    maths: 2 * Math.PI, diameter: 40,
    xVel: 0, yVel: 0, maxVel: 10, inc: 0.1, color: "#009933"
  };
  bomb3 = {
    x: window.innerWidth / 2, y: window.innerHeight / 2,
    maths: 2 * Math.PI, diameter: 40,
    xVel: 0, yVel: 0, maxVel: 5, inc: 0.1, color:"#FF9900"
  };
  
  bombs[0] = bomb;
  bombs[1] = bomb2;
  bombs[2] = bomb3;
  
  thisPlayer = {
    x: 0, y: 0, size: 50
  };
  
  sideM = {
    x: (window.innerWidth - (window.innerWidth / 10)) / 2,
    y: (window.innerHeight - (window.innerHeight / 10)) / 2,
  };
  
}
function bombMovement(){
  for(var i = 0; i < 3; i++){
    bombs[i].xVel = Math.random() * bombs[i].maxVel;
    var coin = Math.random();
    console.log(coin);
    if(coin > 0.5){
      bombs[i].xVel *= -1;
      bombs[i].yVel = bombs[i].maxVel + bombs[i].xVel;
    } else {
    bombs[i].yVel = bombs[i].maxVel - bombs[i].xVel;
    }
    coin = Math.random();
    if(coin > 0.5){
    bombs[i].yVel *= -1;
    }
  }
}
function reinit(){
  var btn = document.getElementById("input");
  document.body.removeChild(btn);
  var scoreP = document.getElementById("scoreP");
  document.body.removeChild(scoreP);
  init();
}
function ended(){
  clearInterval(timerID);
    gameState.init = false;
    document.body.removeChild(canvas);
    //Create Score Text
    var scoreP = document.createElement("P");
    scoreP.id = "scoreP";
    var roundedScore = Math.round(gameState.score);
    var scoreText = document.createTextNode("Score: " + roundedScore);
    scoreP.appendChild(scoreText);
    document.body.appendChild(scoreP);
    //Create Restart Game button
    
    var restartBtn = document.createElement("input");
    restartBtn.type = "button";
    restartBtn.onclick = reinit;
    restartBtn.value = "Restart Game";
    restartBtn.id = "input";
    document.body.appendChild(restartBtn);
}
