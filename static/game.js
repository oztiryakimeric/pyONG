class Game{
  constructor(){
    this.players = [];
  }

  setConstants(id, ballSize, paddleHeight, paddleWidth, paddleSpace){
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
    this.velocity = new Vector(x, y);
  }

  updatePlayerList(playerList){
    for(var i=0; i<playerList.length; i++){
      let player = playerList[i]
      if(!this._contains(player))
        this.players.push(new Player(player.id, player.username, player.border))
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

  initializeDrawables(){
    this.ball = new Ball(1, this.screen.position("CENTER"),
                    {height:this.ballSize, width:this.ballSize},
                    this.screen,
                    "#FFFFFF");

    for(var i=0; i<this.players.length; i++){
      let player = this.players[i]
      player.paddle = Paddle.newInstance(player.id,
                                        this.screen.position(player.border),
                                        this.paddleSize,
                                        this.screen,
                                        player.border,
                                        "#FFFFFF")
      if(this.id == player.id){
        player.paddle.color = "#FF0000"
        this.player = player
      }
    }
  }
}
