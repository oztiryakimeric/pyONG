let ball, socket, ball_size, paddle_height, paddle_width, paddle_space, velocity, id, screen
let players = []

function setup(){
  //ws://localhost:8000/room/ABC
  var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
  var ws_path = ws_scheme + '://' + window.location.host + "/room/ABC";

  socket = new ReconnectingWebSocket(ws_path);
  socket.debug = true;

  let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

  socket.onopen = function () {
    console.log("Connected to chat socket");
    socket.send(JSON.stringify({command:"join", width: width, height: height}))
  };

  socket.onclose = function () {
    console.log("Disconnected from chat socket");
  }

  socket.onmessage = function (message) {
    let data = JSON.parse(message.data)

    if(data.action == "CONSTANTS"){
      console.log("Action: CONSTANTS - " + message.data);

      id = data.id
      ball_size = data.ball_size
      paddle_height = data.paddle_height
      paddle_width = data.paddle_width
      paddle_space = data.paddle_space
    }

    else if(data.action == "NEW_PLAYER"){
      console.log("Action: NEW_PLAYER - " + message.data);
      for(var i=0; i<data.players.length; i++){
        if(!contains(data.players[i].id))
          players.push({id: data.players[i].id, username: data.players[i].username, border:data.players[i].border, score: 0})
      }
      function contains(id){
        for(var i=0; i<players.length; i++)
          if(players[i].id == id)
            return true;
        return false;
      }
    }

    else if(data.action == "ALL_USERS_OK"){
      console.log("Action: ALL_USERS_OK - " + message.data);

      createCanvas(data.screen_size, data.screen_size)
      screen = new Screen(paddle_space, data.screen_size - paddle_space, paddle_space, data.screen_size - paddle_space)

      velocity = new Vector(data.ball_vector.x, data.ball_vector.y)
      ball = new Ball(1,
                      {x:(data.screen_size - ball_size)/2, y:(data.screen_size - ball_size)/2},
                      {height:ball_size, width:ball_size},
                      screen,
                      "#FFFFFF")


      for(var i=0; i<players.length; i++){
        players[i].paddle = new Paddle(players[i].id, paddlePositions[players[i].border], paddleSizes[players[i].border], screen, "#FFFFFF")
        if(id == players[i].id){
          players[i].paddle.color = "#FF0000"
        }
      }
      console.log(players);
      loop()
    }
  }

  background(200);

  noLoop()
}

function draw() {
  background(200);
  if(ball){
    ball.move(velocity)
    ball.draw()
  }
  for(var i=0; i<players.length; i++){
    if(players[i].paddle){
      players[i].paddle.draw()
    }
  }
}

function keyPressed(){
  if (keyCode === LEFT_ARROW) {
   players[0].paddle.position.y -= 2
 } else if (keyCode === RIGHT_ARROW) {
   value = 0;
 }
}

function keyReleased(){

}
