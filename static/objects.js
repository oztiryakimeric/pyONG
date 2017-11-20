class Screen{
  constructor(leftLimit, rightLimit, topLimit, bottomLimit){
    this.leftLimit = leftLimit
    this.rightLimit = rightLimit
    this.topLimit = topLimit
    this.bottomLimit = bottomLimit
  }
}

class Rigid{
  constructor(position, size, screen,){
    this.size = size
    this.screen = screen
    this.position = position
  }

  isCollidesTop() {
    if(this.position.y <= this.screen.topLimit){
      this.position.y = this.screen.topLimit;
      return true
    }
    return false
  }

  isCollidesBottom() {
    if(this.position.y + this.size.height >= this.screen.bottomLimit){
      this.position.y = this.screen.bottomLimit - this.size.height
      return true
    }
    return false
  }

  isCollidesLeft() {
    if(this.position.x <= this.screen.leftLimit){
      this.position.x = this.screen.leftLimit
      return true
    }
    return false
  }

  isCollidesRight() {
    if(this.position.x + this.size.width  >= this.screen.rightLimit){
      this.position.x = this.screen.rightLimit - this.size.width
      return true
    }
    return false
  }

  move(velocity){
    if(this.isCollidesTop() || this.isCollidesBottom()){
      this.changeVectorDirection("HORIZONTAL", velocity)
    }
    else if(this.isCollidesLeft() || this.isCollidesRight()){
      console.log("Collide");
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

  getCenter() {
    return {x:floor(this.position.x + this.size.width / 2), y:floor(this.position.y + this.size.height / 2)}
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
    ellipse(this.position.x, this.position.y, this.size.height)
  }
}

class Paddle extends Rigid{
  constructor(id, position, size, screen, color){
    super(position, size, screen,)
    this.id = id
    this.color = color
  }

  draw(){
    fill(this.color)
    noStroke()
    ellipse(this.position.x, this.position.y, this.size)
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

class Connection{
  constructor(path){
    this.path = path
    this.socket = new ReconnectingWebSocket(path);
  }
}
