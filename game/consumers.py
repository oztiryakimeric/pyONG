import json

from channels import Channel
from channels.auth import channel_session_user_from_http, channel_session_user

from .models import GameRoom, Game


@channel_session_user_from_http
def ws_connect(message, room_code):
    try:
        game_room = GameRoom.objects.get(code=room_code)
        message.reply_channel.send({"accept": True})

        print("Client ({}) connected successfully to {}".format(message.user.username, room_code))
    except GameRoom.DoesNotExist:
        print("Room {} does not exist.".format(room_code))
        message.reply_channel.send({"accept": False})


@channel_session_user
def ws_receive(message, room_code):
    payload = json.loads(message['text'])
    payload['reply_channel'] = message.content['reply_channel']
    payload['room_code'] = room_code
    Channel("websocket.receive").send(payload)


@channel_session_user
def ws_disconnect(message, room_code):
    print("Client ({}) disconnected. Removing from game object...".format(message.user))
    game = Game.get_or_create(room_code)
    game.remove_client(message)


@channel_session_user
def join(message):
    print("Client ({}) joined game".format(message.user))
    game = Game.get_or_create(message["room_code"])
    game.add_client(message)
    game.save()

    if len(game.users) is not 2:
        game.send_all_clients({"state": "WAITING", "players": game.users})
    else:
        game.send_all_clients({"state": "STARTING", "players": game.users, "ball_vector": "(2,3)"})


def paddle_update(message):
    pass


def score(message):
    pass

