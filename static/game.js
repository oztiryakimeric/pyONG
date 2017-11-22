class Game{
  constructor(id, ballSize, paddleHeight, paddleWidth, paddleSpace){
    this.players = [];
    this.id = id;
    this.ballSize = ballSize;
    this.paddleSize = {height: paddleHeight, width: paddleWidth}
    this.paddleSpace = paddleSpace;
  }

  setScreen(screenSize){
    this.screen = new Screen(this.paddleSpace, screenSize - this.paddleSpace,
                             this.paddleSpace, screenSize - this.paddleSpace);
  }

  setVelocity(x, y){
    this.velocity = new Velocity(x, y);
  }

  addPlayer(player){
    this.players.push(player);
  }

  initializeDrawables(){
    this.ball = new Ball(1, screen.position("CENTER"),
                    {height:ball_size, width:ball_size},
                    screen,
                    "#FFFFFF");

    for(var i=0; i<this.players.length; i++){
      let player = players[i]
      players[i].paddle = Paddle.newInstance(player.id,
                                             screen.position(player.border),
                                             this.paddleSize,
                                             player.border,
                                             "#FFFFFF")
      if(this.id == player.id)
        player.paddle.color = "#FF0000"
    }
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
