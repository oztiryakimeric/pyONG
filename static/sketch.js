let SCREEN_HEIGHT = 500
let SCREEN_WIDTH = SCREEN_HEIGHT

let PADDLE_HEIGHT = SCREEN_HEIGHT / 5
let PADDLE_WIDTH = PADDLE_HEIGHT / 7

let PADDLE_SPACE = 0//PADDLE_WIDTH * 1.5
let BALL_SIZE = PADDLE_WIDTH * 0.8

let TOP_LIMIT = 0 + PADDLE_SPACE
let BOTTOM_LIMIT = SCREEN_HEIGHT - PADDLE_SPACE
let LEFT_LIMIT = 0 + PADDLE_SPACE
let RIGHT_LIMIT = SCREEN_WIDTH - PADDLE_SPACE

let BALL_VELOCITY = 7

let ball_count = 10
var balls = []

var p1, p2, p3, p4, ball;

function setup() {
  createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT)
  background(120, 120, 120)

  var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
  var ws_path = "ws://localhost:8000/chat/ABCa"
  console.log("Connecting to " + ws_path);
  var socket = new ReconnectingWebSocket(ws_path);

  // Helpful debugging
  socket.onopen = function () {
    console.log("Connected to chat socket");
    socket.send(JSON.stringify({command:"start_game"}));
  };
  socket.onclose = function () {
    console.log("Disconnected from chat socket");
  }

  socket.onmessage = function (message) {
    console.log("Got websocket message " + message.data);
  }
  document.body.style.backgroundColor = "#f47742";

  stroke(105);


  p1 = new Player(1, "LEFT", "#FF0000")
  p2 = new Player(2, "RIGHT", "#a1f442")
  p3 = new Player(3, "TOP", "#4171f4")
  p4 = new Player(4, "BOTTOM", "#d941f4")

  for(var i=0; i<ball_count; i++){
      let ball = new Ball(1, {x:floor(SCREEN_WIDTH/2), y:floor(SCREEN_HEIGHT/2)}, BALL_SIZE, generateRandomVector(), "#ffffff")
      balls.push(ball)
  }
}

function draw() {
  background(120, 120, 120)

  for(var i=0; i<ball_count; i++){
    balls[i].move()
    balls[i].draw()
  }
}

function drawLines() {
    line(SCREEN_WIDTH/2, PADDLE_SPACE + PADDLE_WIDTH*2, SCREEN_WIDTH/2, SCREEN_HEIGHT - PADDLE_SPACE - PADDLE_WIDTH*2)
    line(PADDLE_SPACE + PADDLE_WIDTH*2, SCREEN_HEIGHT/2, SCREEN_WIDTH - PADDLE_SPACE - PADDLE_WIDTH*2,  SCREEN_HEIGHT/2)
}

function Player(id, border, color) {
  this.id = id;
  this.color = color;
  this.border = border

  if(border == "LEFT"){
    this.position = {x:PADDLE_SPACE, y:floor(SCREEN_WIDTH/2) - floor(PADDLE_HEIGHT/2)}
    this.size = {h:PADDLE_HEIGHT, w:PADDLE_WIDTH}
  }
  else if(border == "RIGHT"){
    this.position = {x:SCREEN_WIDTH - (PADDLE_SPACE + PADDLE_WIDTH), y:floor(SCREEN_WIDTH/2 - PADDLE_HEIGHT/2)}
    this.size = {h:PADDLE_HEIGHT, w:PADDLE_WIDTH}
  }
  else if(border == "TOP"){
    this.position = {x:floor(SCREEN_HEIGHT/2 - PADDLE_HEIGHT/2), y:PADDLE_SPACE}
    this.size = {h:PADDLE_WIDTH, w:PADDLE_HEIGHT}
  }
  else if(border == "BOTTOM"){
    this.position = {x:floor(SCREEN_HEIGHT/2 - PADDLE_HEIGHT/2), y:SCREEN_HEIGHT - (PADDLE_SPACE + PADDLE_WIDTH)}
    this.size = {h:PADDLE_WIDTH, w:PADDLE_HEIGHT}
  }

  this.draw = function() {
    fill(this.color)
    noStroke()
    rect(this.position.x, this.position.y, this.size.w, this.size.h)
  }

  this.move = function(vector) {
    if(border == "LEFT" || border == "RIGHT"){
      this.moveHorizontal(vector)
    }
    else if(border == "TOP" || border == "BOTTOM"){
      this.moveVertical(vector)
    }
  }

  this.moveVertical = function(vector){
    if(this.position.y <= TOP_LIMIT)
      this.position.y = 0
    else if(this.position.y= BOTTOM_LIMIT)
      this.position.y = BOTTOM_LIMIT
    else
      this.position.y += vector.y
  }

  this.moveHorizontal = function(vector){
    if(this.position.x <= LEFT_LIMIT)
      this.positionx = 0
    else if(this.position.y= RIGHT_LIMIT)
      this.position.x = RIGHT_LIMIT
    else
      this.position.x += vector.x
  }

  this.follow = function(ball) {
    this.position.y = ball.center().y - PADDLE_HEIGHT/2
    this.move()
  }
}

function Ball(id, position, size, velocity, color){
  this.id = id
  this.color = color
  this.size = size
  this.position = position
  this.velocity = velocity

  this.draw = function () {
    fill(this.color)
    noStroke()
    ellipse(this.position.x, this.position.y, this.size)
  }

  this.move = function() {
    if(this.isCollidesTop() || this.isCollidesBottom()){
      this.changeVectorDirection("HORIZONTAL")
    }
    else if(this.isCollidesLeft() || this.isCollidesRight()){
      this.changeVectorDirection("VERTICAL")
    }
    transformedVelocity = this.velocity.transform()

    this.position.x += transformedVelocity.x
    this.position.y += transformedVelocity.y
  }

  this.isCollidesTop = function () {
    if(this.position.y <= TOP_LIMIT){
      this.position.y = TOP_LIMIT;
      return true
    }
    return false
  }

  this.isCollidesBottom = function() {
    if(this.position.y >= BOTTOM_LIMIT){
      this.position.y = BOTTOM_LIMIT
      return true
    }
    return false
  }

  this.isCollidesLeft = function() {
    if(this.position.x <= LEFT_LIMIT){
      this.position.x = LEFT_LIMIT
      return true
    }
    return false
  }

  this.isCollidesRight = function() {
    if(this.position.x >= RIGHT_LIMIT){
      this.position.x = RIGHT_LIMIT
      return true
    }
    return false
  }

  this.changeVectorDirection = function(collisionType){
    if(collisionType == "VERTICAL")
      this.velocity.x = -this.velocity.x
    else if(collisionType == "HORIZONTAL")
      this.velocity.y = -this.velocity.y
  }

  this.center = function() {
    return {x:floor(this.position.x + BALL_SIZE / 2), y:floor(this.position.y + BALL_SIZE / 2)}
  }
}

function Vector(x, y) {
  this.x = x
  this.y = y
  this.length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))

  this.transform = function() {
    return {x:floor(this.x / this.length * BALL_VELOCITY), y:floor(this.y / this.length * BALL_VELOCITY)}
  }
}

function generateRandomVector(){
  let possibleVelocities = [-3, -2, -1, 1, 2, 3]
  let possibleX = possibleVelocities[floor(random(6))]
  let possibleY = possibleVelocities[floor(random(6))]
  return new Vector(possibleX, possibleY)
}
