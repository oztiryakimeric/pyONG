import json

from channels import Channel
from .models import GameRoom, Game


def ws_connect(message, room_code):
    message.reply_channel.send({"accept": True})
    try:
        game_room = GameRoom.objects.get(code=room_code)
        message.reply_channel.send({"accept": True})
        print("Connected successfully to " + room_code)
        game = Game.get_or_create(game_room.code)
        print("Game  :  " + str(game))
    except GameRoom.DoesNotExist:
        print(room_code + " Does not exists.")


def ws_receive(message, room_code):
    payload = json.loads(message['text'])

    payload['reply_channel'] = message.content['reply_channel']
    print("Received with payload " + str(payload))
    message.reply_channel.send({"text": "YO"})
    Channel("websocket.receive").send(payload)


def ws_disconnect(message, room_code):
    print("Disconnect")


def start_game(message):
    print("Start Game Clicked")


