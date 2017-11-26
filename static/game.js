class Game{
  constructor(){
    this.players = [];
  }

  setConstants(id, ballSize, paddleHeight, paddleWidth, paddleSpace, velocity){
    this.id = id;
    this.ballSize = ballSize;
    this.paddleSize = {height: paddleHeight, width: paddleWidth}
    this.paddleSpace = paddleSpace;
    this.velocity = new Vector(velocity.x, velocity.y)
  }

  setScreen(screenSize){
    this.screen = new Screen(this.paddleSpace / 2, screenSize - this.paddleSpace / 2,
                             this.paddleSpace / 2, screenSize - this.paddleSpace / 2);
  }

  setVelocity(x, y){
    this.velocity = new Vector(x, y);
  }

  updatePlayerList(playerList){
    for(var i=0; i<playerList.length; i++){
      let player = playerList[i]
      if(!this._contains(player))
        this.players.push(new Player(player.id, player.username, player.border, player.color))
    }
  }

  _contains(player){
    for(var i=0; i < this.players.length; i++)
      if(this.players[i].id == player.id)
        return true;
    return false;
  }

  getPlayer(id){
    for(var i=0; i < this.players.length; i++)
      if(this.players[i].id == id)
        return this.players[i];
  }

  getPaddleList(){
    let tmp = []
    for(var i=0; i < this.players.length; i++)
      tmp.push(this.players[i].paddle)
    return tmp
  }

  initializeDrawables(){
    this.ball = new Ball(1, this.screen.position("CENTER", 0),
                    {height:this.ballSize, width:this.ballSize},
                    this.screen,
                    "#FFFFFF");

    for(var i=0; i<this.players.length; i++){
      let player = this.players[i]
      player.paddle = Paddle.newInstance(player.id,
                                        this.screen.position(player.border, this.paddleSpace),
                                        this.paddleSize,
                                        this.screen,
                                        player.border,
                                        player.color)
      if(this.id == player.id)
        this.player = player
    }
  }
}
