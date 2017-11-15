let SCREEN_HEIGHT = 500
let SCREEN_WIDTH = SCREEN_HEIGHT

let screen = new Screen(0, SCREEN_HEIGHT, 0, SCREEN_WIDTH)

let ball
var velocity;

function setup(){
  createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT)
  background(120, 120, 120)

  ball = new Ball(1, {x:250, y:250}, {width:10, height:10}, screen, "#FF0000")
  velocity = new Vector(2, 1)
}

function draw() {
  background(120, 120, 120)

  ball.move(velocity)
  ball.draw()
}
