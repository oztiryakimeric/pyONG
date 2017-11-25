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
    game.send_all_clients({"action": "PLAYER_DISCONNECTED",
                           "players": game.get_clients(),
                           "disconnected_player": game.find_client(message.user.username).dict()})
    game.remove_client(message)
    game.save()
    game.safe_delete()


@channel_session_user
def join(message):
    print("Client ({}) joined game".format(message.user))

    game = Game.get_or_create(message["room_code"])
    game.add_client(message)
    game.save()

    message.reply_channel.send({"text": json.dumps({"action": "CONSTANTS",
                                                    "id": len(game.users),
                                                    "player_count": 2,
                                                    "ball_size": 15,
                                                    "paddle_height": 75,
                                                    "paddle_width": 15,
                                                    "paddle_space": 23})})

    game.send_all_clients({"action": "NEW_PLAYER",
                           "players": game.get_clients()})

    if len(game.users) == 2:
        game.send_all_clients({"action": "ALL_USERS_OK",
                               "players": game.get_clients(),
                               "screen_size": game.screen_size,
                               "ball_vector": {"x": 2, "y": 3}})


@channel_session_user
def paddle_update(message):
    game = Game.get_or_create(message["room_code"])
    if message["action"] == "pressed":
        game.send_all_clients({"action": "CLIENT_PRESSED_KEY",
                               "id": message["id"],
                               "key": message["key"]})

    elif message["action"] == "released":
        game.send_all_clients({"action": "CLIENT_RELEASED_KEY",
                               "id": message["id"],
                               "last_position": message["last_position"]})

