var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext('2d')

var playAgain = document.getElementById("playAgain")
console.log(playAgain)
playAgain.style.display = "none"

var audio = new Audio('littleidea.mp3')

// canvas.onmousemove= function(e){
//   console.log(e.offsetX,e.offsetY)
// }

function drawGround(){
ctx.fillStyle="green"
ctx.fillRect(0,265,300,50)
ctx.fill()
ctx.stroke()
}

var spacePressed = false
var canJump = true 

function keyUpHandler(e){
  if(e.keyCode==32){
    spacePressed = false   
  }
}


function keyDownHandler(e){
  if(e.keyCode==32){
    audio.play()
    if(canJump){
    canJump = false
    spacePressed=true
    }
  }
}

document.addEventListener('keydown',keyDownHandler,false)
document.addEventListener('keyup',keyUpHandler,false)

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
  playAgain.style.display="none"
}

var gameOver = false
function game(){
  if(!gameOver){
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
    audio.pause()
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle="black"
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle = "purple"
    ctx.font = "20px Arial"
    ctx.fillText("Game Over",100,100)
    ctx.fillText(`Score: ${score}`,100,150)
    playAgain.style.display="block"
  }
}

setInterval(game,50)