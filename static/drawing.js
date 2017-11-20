let SCREEN_HEIGHT = 500
let SCREEN_WIDTH = SCREEN_HEIGHT

let screen = new Screen(0, SCREEN_HEIGHT, 0, SCREEN_WIDTH)

let ball
var velocity;

function setup(){
  //ws://localhost:8000/room/ABC
  socket = new ReconnectingWebSocket("ws://localhost:8000/room/ABC");

  let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

  socket.onopen = function () {
    console.log("Connected to chat socket");
    socket.send(JSON.stringify({command:"join", width: width, height: height}));
  };

  socket.onclose = function () {
    console.log("Disconnected from chat socket");
  }

  socket.onmessage = function (message) {
    console.log("Got websocket message " + message.data);
  }

  createCanvas(100, 100);
  background(200);

  //noLoop()
}

function draw() {
  background(200);



}
