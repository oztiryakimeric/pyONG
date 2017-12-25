let game = new Game();
let socket;
let start = false;
let collision_message_send = false;
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
    socket.send(JSON.stringify({command:"join", width: width, height: height, color: "150,150,150"}))
  };

  socket.onclose = function () {
    console.log("Disconnected from chat socket");
  }

  socket.onmessage = function (message) {
    let data = JSON.parse(message.data)

    if(data.action == "CONSTANTS"){
      console.log("Action: CONSTANTS - " + message.data);

      game.setConstants(data.id, data.ball_size, data.paddle_height,
                        data.paddle_width, data.paddle_space, data.velocity);
    }

    else if(data.action == "NEW_PLAYER"){
      console.log("Action: NEW_PLAYER - " + message.data);

      game.updatePlayerList(data.players);
    }

    else if(data.action == "ALL_USERS_OK"){
      console.log("Action: ALL_USERS_OK - " + message.data);

      createCanvas(data.screen_size, data.screen_size)
      game.setScreen(data.screen_size)
      game.initializeDrawables()
      start = true
      loop()
    }

    else if(data.action == "CLIENT_PRESSED_KEY"){
      if(data.id != game.id){
        game.getPlayer(data.id).movement.keyPressed(parseInt(data.key))
        console.log(game.getPlayer(data.id).movement);
      }
    }

    else if(data.action == "CLIENT_RELEASED_KEY"){
      if(data.id != game.id){
        let player = game.getPlayer(data.id)
        player.paddle.position = data.last_position
        player.movement.keyReleased()
      }
    }

    else if(data.action == "BORDER_COLLISION"){
      console.log("Action : BORDER_COLLISION " + message.data);
      game.ball.position = data.position
      game.velocity = new Vector(data.velocity.x, data.velocity.y)
      collision_message_send = false;
    }
  }

  background(200);

  noLoop()
}

function draw() {
  background(200);
  if(start){
    game.screen.drawBorders(game.player.paddle.color)

    drawBall(game.ball)

    for(var i=0; i<game.players.length; i++){
      let player = game.players[i]
        if(player.movement.isPressed)
            player.paddle.move(new Vector(0, player.movement.getDirection() * 6));
        player.paddle.draw()
    }
  }
}

function drawBall(ball){
  let borderCollision = ball.willCollideBorder(game.velocity)
  let paddleCollision = ball.isCollidesPaddles(game.getPaddleList())

  if(borderCollision){
    let collisionVector = ball.getCollisionVector(borderCollision);
    game.velocity.product(collisionVector)
    game.ball.move(game.velocity)
    ball.draw()
  }
  else if(paddleCollision){
    let collisionVector = ball.getCollisionVector(paddleCollision);
    game.velocity.product(collisionVector)
    game.ball.move(game.velocity)
    ball.draw()
  }
  else{
    game.ball.move(game.velocity)
    game.ball.draw()
  }
}

function keyPressed(){
  if(keyCode == UP_ARROW || keyCode == DOWN_ARROW || keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW){
    let movement = game.player.movement;
    movement.keyPressed(keyCode);
    socket.send(JSON.stringify({command:"paddle_update",
                                action:"pressed",
                                id:game.id,
                                key:keyCode}))
  }
}

function keyReleased(){
  if(game.player.movement.keyCode){
    game.player.movement.keyReleased();
    socket.send(JSON.stringify({command:"paddle_update",
                                action:"released",
                                id:game.id,
                                last_position:game.player.paddle.position}))
  }
}
