let game = new Game();
let keyboard = new Keyboard(game);
let socket;

function setup(){
  //ws://localhost:8000/room/ABC
  var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
  var ws_path = ws_scheme + '://' + window.location.host + "/room/ABC";

  socket = new ReconnectingWebSocket(ws_path);
  socket.debug = true;

  socket.onopen = function () {
    console.log("Connected to chat socket");

    let width = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth
    let height = window.innerHeight
                 || document.documentElement.clientHeight
                 || document.body.clientHeight
    socket.send(JSON.stringify({command:"join", width: width, height: height}))
  };

  socket.onclose = function () {
    console.log("Disconnected from chat socket");
  }

  socket.onmessage = function (message) {
    let data = JSON.parse(message.data)

    if(data.action == "CONSTANTS"){
      console.log("Action: CONSTANTS - " + message.data);

      game.setConstants(data.id, data.ball_size, data.paddle_height,
                        data.paddle_width, data.paddle_space);
    }

    else if(data.action == "NEW_PLAYER"){
      console.log("Action: NEW_PLAYER - " + message.data);

      game.updatePlayerList(data.players);
    }

    else if(data.action == "ALL_USERS_OK"){
      console.log("Action: ALL_USERS_OK - " + message.data);

      createCanvas(data.screen_size, data.screen_size)
      game.setScreen(data.screen_size)
      game.setVelocity(data.ball_vector.x, data.ball_vector.y)
      game.initializeDrawables()

      loop()
    }
    else if(data.action == "CLIENT_PRESSED_KEY"){
      console.log("Action: CLIENT_PRESSED_KEY - " + message.data);

    }
    else if(data.action == "CLIENT_RELEASED_KEY"){
      console.log("Action: CLIENT_RELEASED_KEY - " + message.data);
    }
  }

  background(200);

  noLoop()
}

function draw() {
  background(200);
  if(game){
    if(game.ball){
      game.ball.move(game.velocity)
      game.ball.draw()
    }

    for(var i=0; i<game.players.length; i++){
      if(game.players[i].paddle)
        game.players[i].paddle.draw()
    }

    if(keyboard.isPressed){
      game.player.paddle.move(new Vector(0, keyboard.getDirection() * 6));
    }
  }
}

function keyPressed(){
  keyboard.keyPressed(keyCode);
  socket.send(JSON.stringify({command:"paddle_update",
                              action:"pressed",
                              id:game.id,
                              direction:keyboard.getDirection()}))
}

function keyReleased(){
  keyboard.keyReleased();
  socket.send(JSON.stringify({command:"paddle_update",
                              action:"released",
                              id:game.id,
                              last_position:game.player.paddle.position}))
}
