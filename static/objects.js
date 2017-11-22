class Screen{
  constructor(leftLimit, rightLimit, topLimit, bottomLimit){
    this.leftLimit = leftLimit
    this.rightLimit = rightLimit
    this.topLimit = topLimit
    this.bottomLimit = bottomLimit
  }

  position(border) {
    let paddlePositions = {"LEFT":  {x: this.leftLimit, y: (this.bottomLimit - this.topLimit)/2 + this.topLimit},
                           "RIGHT":  {x: this.rightLimit, y: (this.bottomLimit - this.topLimit)/2 + this.topLimit},
                           "TOP":  {x:  (this.rightLimit - this.leftLimit)/2 + this.leftLimit, y:this.topLimit},
                           "BOTTOM":  {x:(this.rightLimit - this.leftLimit)/2 + this.leftLimit, y:this.bottomLimit},
                           "CENTER": {x: (this.rightLimit - this.leftLimit)/2 + this.leftLimit, y: (this.bottomLimit - this.topLimit)/2 + this.topLimit}}
    return paddlePositions[border]
  }
}

class Rigid{
  constructor(position, size, screen,){
    this.size = size
    this.screen = screen
    this.position = position
  }

  isCollidesTop() {
    if(this.position.y - this.size.height/2 <= this.screen.topLimit){
      this.position.y = this.screen.topLimit + this.size.height/2;
      return true
    }
    return false
  }

  isCollidesBottom() {
    if(this.position.y + this.size.height/2 >= this.screen.bottomLimit){
      this.position.y = this.screen.bottomLimit - this.size.height/2
      return true
    }
    return false
  }

  isCollidesLeft() {
    if(this.position.x - this.size.width/2 <= this.screen.leftLimit){
      this.position.x = this.screen.leftLimit + this.size.width/2
      return true
    }
    return false
  }

  isCollidesRight() {
    if(this.position.x + this.size.width/2  >= this.screen.rightLimit){
      this.position.x = this.screen.rightLimit - this.size.width/2
      return true
    }
    return false
  }

  move(velocity){
    if(this.isCollidesTop() || this.isCollidesBottom()){
      this.changeVectorDirection("HORIZONTAL", velocity)
    }
    else if(this.isCollidesLeft() || this.isCollidesRight()){
      this.changeVectorDirection("VERTICAL", velocity)

    }
    let transformedVelocity = velocity.transform(7)

    this.position.x += transformedVelocity.x
    this.position.y += transformedVelocity.y
  }

  changeVectorDirection(collisionType, vector){
    if(collisionType == "VERTICAL")
      vector.x = -vector.x
    else if(collisionType == "HORIZONTAL")
      vector.y = -vector.y
  }

  translatedPosition() {
    return {x:floor(this.position.x - this.size.width / 2), y:floor(this.position.y - this.size.height / 2)}
  }
}

class Ball extends Rigid{
  constructor(id, position, size, screen, color){
    super(position, size, screen,)
    this.id = id
    this.color = color
  }

  draw(){
    fill(this.color)
    noStroke()
    ellipse(this.translatedPosition().x, this.translatedPosition().y, this.size.height)
  }
}

class Paddle extends Rigid{
  constructor(id, position, size, screen, border, color){
    super(position, size, screen,)
    this.id = id
    this.color = color
  }

  static newInstance(id, position, size, screen, border, color){
    if(border == "LEFT" || border == "RIGHT"){
      return new Paddle(id, position, size, screen, border, color);
    }
    else if(border == "TOP" || border == "BOTTOM"){
      return new Paddle(id, position, {height: size.width, width: size.height}, screen, border, color);
    }
  }

  move(velocity){
    this.position.x += velocity.x
    this.position.y += velocity.y
  }

  draw(){
    fill(this.color)
    noStroke()
    rect(this.translatedPosition().x, this.translatedPosition().y, this.size.width, this.size.height)
  }
}

class Vector{
  constructor(x, y){
    this.x = x
    this.y = y
    this.length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }

  transform(constraint) {
    return {x:floor(this.x / this.length * constraint), y:floor(this.y / this.length * constraint)}
  }
}

class Player{
  constructor(id, username, border){
    this.id = id;
    this.username = username;
    this.border = border;
    this.score = 0
  }
}

class Keyboard{

  constructor(game){
    this.game = game;
  }

  keyPressed(keyCode){
    this.isPressed = true;
    this.keyCode = keyCode;
  }

  keyReleased(){
    this.isPressed = false;
    this.keyCode = null;
  }

  getDirection(){
    let border = this.game.player.border;
    if(border == "LEFT" || border == "RIGHT"){
      if(this.keyCode == UP_ARROW)
        return -1
      if(this.keyCode == DOWN_ARROW)
        return 1
    }
    else if(border =="TOP" || border == "BOTTOM"){
      if(this.keyCode == LEFT_ARROW)
        return -1
      if(this.keyCode == RIGHT_ARROW)
        return 1
    }
    else {
      return 0
    }
  }
}
