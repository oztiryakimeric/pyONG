
class State{
  constructor(game){
    this.game = game
  }

  disconnect(){
    this.game.state = game.notConnectedState
    console.log("Connection lost, state is setting to 'NOT CONNECTED STATE'")
  }
}

class NotConnectedState extends State{
  constructor(game){
    super(game)
  }

  connected(){
    this.game.state = game.authState
    console.log("Connected to server, state is setting to 'AUTH STATE'")
  }
}

class AuthState extends State{
  constructor(game){
    super(game)
  }

  sendCredentials(){
    this.game.state = game.waitingState
    console.log("Credentials sended to server, state is setting to 'WAITING STATE'")
  }
}

class WaitingState extends State{
  constructor(game){
    super(game)
  }
  pressStart(){
    this.game.state = game.readyState
    console.log("User pressed ready, state is setting to 'READY STATE'");
  }
}

class ReadyState extends State{
  constructor(game){
    super(game)
  }
  everyOneReady(){
    this.game.state = game.playingState
    console.log("Everyone pressed ready, state is setting to 'PLAYING STATE'");
  }
}

class PlayingState extends State{
  constructor(game){
    super(game)
  }

  finish(){
    this.game.state = game.scoreState
    console.log("Game finished, state is setting to 'FINISHED STATE'");
  }
}

class ScoreState extends State{
  constructor(game){
    super(game)
  }
}

class Game{
  constructor(){
    this.notConnectedState = new NotConnectedState(this)
    this.authState = new AuthState(this)
    this.waitingState = new WaitingState(this)
    this.readyState = new ReadyState(this)
    this.playingState = new PlayingState(this)
    this.scoreState = new ScoreState(this)
    this.state = new NotConnectedState(this)
  }
}
