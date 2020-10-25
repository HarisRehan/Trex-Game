//Declare variables for game objects and behaviour indicators(FLAGS)
var trex, trexImage, trexDeadImg
var ground, groundImage, invisibleGround
var cloud, cloudImage, cloudsGroup
var cactus, cactusImg1, cactusImg2, cactusImg3, cactusImg4, cactusImg5, cactusImg6, cactiiGroup
var PLAY, END, gameState;
var score, highScore, displayHighScore;
var gameOver, gameOverImg, restartIcon, restartImg;
var die, jump, checkPoint


//Create Media library and load to use it during the course of the software //executed only once at the start of the program
function preload() {
  trexImage = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexDeadImage = loadImage("trex_collided.png");
  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  cactusImg1 = loadImage("obstacle1.png");
  cactusImg2 = loadImage("obstacle2.png");
  cactusImg3 = loadImage("obstacle3.png");
  cactusImg4 = loadImage("obstacle4.png");
  cactusImg5 = loadImage("obstacle5.png");
  cactusImg6 = loadImage("obstacle6.png");

  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  checkPoint = loadSound("checkPoint.mp3");
}


//define the intial environment of the software(before it is used) //by defining the declared variables with default values //executed only once at the start of the program
function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 180, 50, 70);
  trex.addAnimation("trex running", trexImage);
  trex.addAnimation("trexDeadImage", trexDeadImage);
  trex.scale = 0.6;

  ground = createSprite(200, 180, 400, 20)
  ground.addImage("ground", groundImage);



  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  cloudsGroup = createGroup();
  cactiiGroup = createGroup();

  PLAY = 1;
  END = 0;
  gameState = PLAY;
  score = 0;
  highScore = 0;
  displayHighScore = false;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  restartIcon = createSprite(300, 140);
  restartIcon.addImage(restartImg);
  restartIcon.scale = 0.5;
}


//All modifications, changes, conditions, manipulations, actions during the course of the program are written inside function draw. //All commands to be executed, checked continously, applied throughout the program are written inside function draw. //function draw is executed for every frame created since the start till it stops.
function draw() {
  background(258);

  //displaying score 
  text("Score: " + score, 500, 50);

  console.log(trex.y);

  if (gameState === PLAY) {
    gameOver.visible = false;
    restartIcon.visible = false;
    
    if (score % 500 == 0) {
      checkPoint.play();
    }
    //scoring 
    score = score + Math.round(frameCount / 60);
    if (displayHighScore == true) {
      text("High Score:" + highScore, 400, 50);
    }
    if (keyDown("space") && trex.y >= 150) {
      trex.velocityY = -13;
      jump.play();
    }
    trex.velocityY = trex.velocityY + 0.8;
    trex.collide(invisibleGround);
    ground.velocityX = -10;
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    spawnCloud();
    spawnCactus();

    if (cactiiGroup.isTouching(trex)) {
      gameState = END;
      die.play();
    }

  } else if (gameState == END) {
    ground.velocityX = 0;

    trex.velocityY = 0;
    trex.changeAnimation("trexDeadImage", trexDeadImage);

    cactiiGroup.setVelocityXEach(0);
    cactiiGroup.setLifetimeEach(-1);

    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    
     

    if (highScore < score) {
      highScore = score;
    }
    text("High Score:" + highScore, 400, 50);

    gameOver.visible = true;
    restartIcon.visible = true;

    if (mousePressedOver(restartIcon)) {
      startOver();
    }
  }
  drawSprites();
}



//function to spawn clouds
function spawnCloud() {
  if (World.frameCount % 60 == 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.velocityX = -5;
    cloud.y = random(10, 60);
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.lifetime = 134;

    cloud.addImage("cloud", cloudImage);
    cloud.scale = 0.5;

    cloudsGroup.add(cloud);
  }
}

//spawn cactus function
function spawnCactus() {
  if (World.frameCount % 50 == 0) {
    cactus = createSprite(600, 165, 10, 40);
    cactus.velocityX = -7;
    var imgNumber = Math.round(random(1, 7));
    switch (imgNumber) {
      case 1:
        cactus.addImage(cactusImg1);
        break;
      case 2:
        cactus.addImage(cactusImg2);
        break;
      case 3:
        cactus.addImage(cactusImg3);
        break;
      case 4:
        cactus.addImage(cactusImg4);
        break;
      case 5:
        cactus.addImage(cactusImg5);
        break;
      case 6:
        cactus.addImage(cactusImg6);
        break;
      default:
        cactus.addImage(cactusImg1);
        break;

    }
   
    cactus.scale = 0.5;
    cactus.lifetime = 300;

    cactiiGroup.add(cactus);
  }
}

function startOver() {
  score = 0;
  gameState = PLAY;
  displayHighScore = true;

  cactiiGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("trex running", trexImage);
}