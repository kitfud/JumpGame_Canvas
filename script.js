var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext('2d')

var playAgain = document.getElementById("playAgain")
var title = document.getElementById("title")
console.log(playAgain)
playAgain.style.display = "none"

var audio = new Audio('littleidea.mp3')

// canvas.onmousemove= function(e){
//   console.log(e.offsetX,e.offsetY)
// }


    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // the link to your model provided by Teachable Machine export panel
      // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/cA1eQXQiw/";

    let model, webcam, labelContainer, maxPredictions;

    var chinUpVal; 

    let container = document.getElementsByClassName('container')
 let teachableMachineText = document.getElementById("teachMachine")

    container[0].style.display="none"

    // Load the image model and setup the webcam
    async function init() {

        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

      container[0].style.display="flex"
      teachableMachineText.style.display="none"
      title.innerHTML="Rectangle Jump!"
        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }

    }

    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model
    async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(webcam.canvas);
      chinUpVal = prediction[0].probability.toFixed(2)
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
    }



function drawGround(){
ctx.fillStyle="green"
ctx.fillRect(0,265,300,50)
ctx.fill()
ctx.stroke()
}

var spacePressed = false
var canJump = true 

function detectChin(){
  if(chinUpVal>=0.80){
    if(canJump){
      canJump=false
      spacePressed=true
    }
  }
  else{
    spacePressed=false
  }
}
// function keyUpHandler(e){
//   if(e.keyCode==32){
//     spacePressed = false   
//   }
// }


// function keyDownHandler(e){
//   if(e.keyCode==32){
//     audio.play()
//     if(canJump){
//     canJump = false
//     spacePressed=true
//     }
//   }
// }

// document.addEventListener('keydown',keyDownHandler,false)
// document.addEventListener('keyup',keyUpHandler,false)

var gravity= 0.3
var score= 0

class Player{
  constructor(){
    this.x = 67
    this.y = 221
    this.velocity = 0
    this.box = {
      x:this.x,
      y:this.y,
      w:10,
      h:45
    }
    this.draw()
  }

  draw(){
    ctx.beginPath()
    ctx.fillStyle="red"
    ctx.fillRect(this.x,this.y,10,45)
    this.y-=this.velocity
  }

  jump(){
    if(spacePressed){
      this.velocity = 4
    }
   else if(this.y<150){
     this.velocity=-4
   }
  else if(this.y>=220){
    this.velocity=0
    canJump=true
  }  
  }

  update(){
    this.box.x = this.x
    this.box.y = this.y
    this.draw()
    this.jump()
  }
  }
var player = new Player()

class Obstacle{
  constructor(){
    this.x=261
    this.y=246
     this.box = {
      x:this.x,
      y:this.y,
      w:20,
      h:20
    }
    this.draw()
    this.velocity = 3
  }
  draw(){
    ctx.fillStyle="orange"
    ctx.fillRect(this.x,this.y,20,20)
  }
  update(){
    if(this.x>2){
      this.x -=this.velocity
    }
    else{
      score++
      this.velocity +=0.6
      this.x = 300
    }
    this.box.x = this.x
    this.box.y= this.y
    this.draw()
  }
}

var obstacle = new Obstacle()

function boxCollision(sprite1, sprite2) {
  if (!sprite1 || !sprite2) {
    console.log("null") }
  var box1 = sprite1.box;
  var box2 = sprite2.box;
  
  if (box1.x < box2.x + box2.w &&
      box1.x + box1.w > box2.x &&
      box1.y < box2.y + box2.h &&
      box1.h + box1.y > box2.y) {
    console.log("collision")
    gameOver = true
    return true;
  }
  return false;
}

function drawScore(){
    ctx.fillStyle = "red"
    ctx.font = "20px Arial"
    ctx.fillText(`Score:${score}`,180,24)
}

function resetGame(){
  audio.play()
  score=0
  gameOver=false
  obstacle.x = 261
  obstacle.velocity=3
  playAgain.style.display="none"
}

var gameOver = false

function endGame(){
      audio.pause()
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle="black"
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle = "white"
    ctx.font = "20px Arial"
    ctx.fillText("Game Over",100,100)
    ctx.fillText(`Score: ${score}`,100,150)
    playAgain.style.display="block"
}

function game(){
  //console.log("chin",chinUpVal)
  
  if(!gameOver){
  detectChin()
  console.log("jump",spacePressed)
  ctx.clearRect(0,0,canvas.width,canvas.height)
      ctx.fillStyle="black"
    ctx.fillRect(0,0,canvas.width,canvas.height)
  drawGround()
  drawScore()
  player.update()
  obstacle.update()
  boxCollision(player,obstacle)
  }
  else{
  endGame()
  }
}

setInterval(game,50)

