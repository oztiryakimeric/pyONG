class Screen{
  constructor(leftLimit, rightLimit, topLimit, bottomLimit){
    this.leftLimit = leftLimit
    this.rightLimit = rightLimit
    this.topLimit = topLimit
    this.bottomLimit = bottomLimit
  }

  position(border, space) {
    let tmp = {"LEFT":  {x: this.leftLimit + space,
                         y: (this.bottomLimit - this.topLimit)/2 + this.topLimit},
               "RIGHT": {x: this.rightLimit - space,
                         y: (this.bottomLimit - this.topLimit)/2 + this.topLimit},
               "TOP":   {x:  (this.rightLimit - this.leftLimit)/2 + this.leftLimit,
                         y:this.topLimit + space},
               "BOTTOM":{x:(this.rightLimit - this.leftLimit)/2 + this.leftLimit,
                         y:this.bottomLimit - space},
               "CENTER": {x: (this.rightLimit - this.leftLimit)/2 + this.leftLimit,
                          y: (this.bottomLimit - this.topLimit)/2 + this.topLimit}}
    return tmp[border]
  }

  drawBorders(col){
    fill(10, 200, 100)
    stroke(240,240,240)
    rect(this.leftLimit, this.topLimit,
         this.rightLimit - this.leftLimit, this.bottomLimit - this.topLimit);
  }
}

class Rigid{
  constructor(position, size, screen,){
    this.size = size
    this.screen = screen
    this.position = position
  }

  translatedPosition() {
    return {x:floor(this.position.x - this.size.width / 2),
            y:floor(this.position.y - this.size.height / 2)}
  }

  getRightLimit(){
    return this.position.x + this.size.width/2
  }

  getLeftLimit(){
    return this.position.x - this.size.width/2
  }

  getTopLimit(){
    return this.position.y - this.size.height/2
  }

  getBottomLimit(){
    return this.position.y + this.size.height/2
  }
}

class Ball extends Rigid{
  constructor(id, position, size, screen, color){
    super(position, size, screen,)
    this.id = id
    this.color = color
  }

  willCollideBorder(velocity){
    if(this.position.x + this.size.width/2 + velocity.x >= this.screen.rightLimit){
      return "RIGHT"
    }
    else if(this.position.x - this.size.width/2 + velocity.x <= this.screen.leftLimit){
      return "LEFT"
    }
    else false
    if(this.position.y - this.size.height/2 + velocity.y <= this.screen.topLimit){
      return "TOP"
    }
    else if(this.position.y + this.size.height/2 + velocity.y >= this.screen.bottomLimit){
      return "BOTTOM"
    }
    else false
  }

  isCollidesPaddles(paddles){
    for(var i=0; i<paddles.length; i++){
      console.log(this._distance(paddles[i]));
      if(this._distance(paddles[i]) < 100){
        console.log("PADDLE COLLISION CONTROL");
        let paddleCollision = this._isCollidesPaddle(paddles[i])
        if(paddleCollision) return paddleCollision
      }
    }
    return false;
  }

  _isCollidesPaddle(paddle){
    let positions = [{x:this.getLeftLimit(), y:this.getTopLimit()}, {x:this.getRightLimit(), y:this.getTopLimit()},
                     {x:this.getLeftLimit(), y:this.getBottomLimit()}, {x:this.getRightLimit(), y:this.getBottomLimit()}]

    for(var i=0; i<positions.length; i++)
      if(this._isPosInsideOf(positions[i], paddle))
        return paddle.border;
    return false;
  }

  _isPosInsideOf(position, rigid){
    return position.x <= rigid.getRightLimit() && position.x >= rigid.getLeftLimit() && position.y <= rigid.getBottomLimit() && position.y >= rigid.getTopLimit()
  }

  _distance(rigid){
    return Math.sqrt(Math.pow(this.position.x - rigid.position.x, 2) + Math.pow(this.position.y - rigid.position.y, 2))
  }

  getCollisionVector(border){
    let vertical = new Vector(-1, 1)
    let horizontal = new Vector(1, -1)
    let tmp = {"RIGHT": vertical, "LEFT": vertical, "TOP": horizontal, "BOTTOM": horizontal}
    return tmp[border]
  }

  move(velocity){
    let transformed = velocity.transform(7)
    this.position.x += transformed.x
    this.position.y += transformed.y
  }

  draw(){
    fill(this.color)
    noStroke()
    ellipse(this.position.x, this.position.y,
            this.size.height)
  }
}

class Paddle extends Rigid{
  constructor(id, position, size, screen, border, color){
    super(position, size, screen,)
    this.id = id
    this.border = border
    this.color = color
  }

  static newInstance(id, position, size, screen, border, color){
    if(border == "LEFT" || border == "RIGHT"){
      return new Paddle(id, position, size, screen, border, color);
    }
    else if(border == "TOP" || border == "BOTTOM"){
      return new Paddle(id, position, {height: size.width, width: size.height},
                        screen, border, color);
    }
  }

  move(velocity){
    if(velocity.y == 0){
      if(this.position.x + velocity.x >= this.screen.rightLimit)
        this.position.x = this.screen.rightLimit;
      else if(this.position.x + velocity.x <= this.screen.leftLimit)
        this.position.x = this.screen.leftLimit;
      else
        this.position.x += velocity.x
    }
    else if(velocity.x == 0){
      if(this.position.y - this.size.height/2 + velocity.y <= this.screen.topLimit)
        this.position.y = this.screen.topLimit + this.size.height/2
      else if(this.position.y + this.size.height/2 + velocity.y >= this.screen.bottomLimit)
        this.position.y = this.screen.bottomLimit - this.size.height/2
      else
        this.position.y += velocity.y
    }
  }

  draw(){
    fill(this.color.r, this.color.g, this.color.b)
    noStroke()
    rect(this.translatedPosition().x, this.translatedPosition().y,
         this.size.width, this.size.height)
  }
}

class Vector{
  constructor(x, y){
    this.x = x
    this.y = y
    this.length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }

  transform(constraint) {
    return {x:floor(this.x / this.length * constraint),
            y:floor(this.y / this.length * constraint)}
  }

  product(vector){
    this.x *= vector.x
    this.y *= vector.y
  }
}

class Player{
  constructor(id, username, border, color){
    this.id = id;
    this.username = username;
    this.border = border;
    this.color = color;
    this.movement = new Movement(this);
    this.score = 0;
  }
}

class Movement{
  constructor(player){
    this.player = player;
  }

  keyPressed(code){
    this.isPressed = true;
    this.keyCode = code;
  }

  keyReleased(){
    this.isPressed = false;
    this.keyCode = null;
  }

  getDirection(){
    let border = this.player.border;
    if(border == "LEFT" || border == "RIGHT"){
      if(this.keyCode == UP_ARROW)
        return -1
      else if(this.keyCode == DOWN_ARROW)
        return 1
    }
    else if(border =="TOP" || border == "BOTTOM"){
      if(this.keyCode == LEFT_ARROW)
        return -1
      else if(this.keyCode == RIGHT_ARROW)
        return 1
    }
  }
}
