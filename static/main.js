class Ball{
  constructor(id, position, size, velocity, borders, color){
    this.id = id
    this.color = color
    this.size = size
    this.position = position
    this.velocity = velocity
    this.borders = borders
  }

  isCollides(){
    for(var border in this.borders){
      if(this.position.)
    }
  }
}

class Border{
  static LEFT = 1
  static RIGHT = 2
  static TOP = 3
  static BOTTOM = 4
  static VERTICAL = 1
  static HORIZONTAL = 2

  constructor(side, limit){
    self.side = side
    self.limit = limit

    if(side == Border.TOP){
      self.coefficient = 1
      self.alingment = Border.VERTICAL
    }
    else if(side == Border.TOP){
      self.coefficient = -1
      self.alingment = Border.VERTICAL
    }
    else if(side == Border.LEFT){
      self.coefficient = 1
      self.alingment = Border.HORIZONTAL
    }
    if(side == Border.RIGHT){
      self.coefficient = -1
      self.alingment = Border.HORIZONTAL
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
