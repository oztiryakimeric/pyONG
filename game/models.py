from channels import Group
from django.db import models

import json

from pyONG import singleton_redis


class GameRoom(models.Model):
    code = models.CharField(max_length=10)
    # owner = models.CharField(max_length=100)
    # timestamp = models.CharField(max_length=100)
    # player_count = models.IntegerField()
    # ball_size = models.IntegerField()
    # paddle_size = models.IntegerField()

    def __str__(self):
        return self.code

# Create a model for store game results.


class BaseRedisModel:
    def __init__(self):
        self.redis = singleton_redis.Connection.get_instance()


class Game(BaseRedisModel):
    def __init__(self, room_code):
        super(Game, self).__init__()
        self.code = room_code
        self.screen_size = None
        self.users = []

    @staticmethod
    def from_redis(json):
        game = Game(json["code"])
        for user in json["users"]:
            game.users.append(user)
        game.screen_size = json["screen"]
        return game

    @staticmethod
    def get_or_create(code):
        redis = singleton_redis.Connection.get_instance()
        game = redis.get(code)
        if game:
            return Game.from_redis(json.loads(game))
        else:
            return Game(code)

    def save(self):
        serialized = {"code": self.code, "users": self.users, "screen": self.screen_size}
        self.redis.set(self.code, json.dumps(serialized))
        return self

    def delete(self):
        self.redis.delete(self.code)

    def add_client(self, message):
        self.users.append(message.user.username)
        self._set_screen_size(width=message["width"], height=message["height"])
        self.get_group().add(message.reply_channel)

    def remove_client(self, message):
        self.users.remove(message.user.username)
        self.get_group().discard(message.reply_channel)
        if len(self.users) == 0:
            self.delete()

    def send_all_clients(self, message):
        self.get_group().send({"text": json.dumps(message)})

    def get_group(self):
        return Group(self.code)

    def get_players(self):
        slots = ("LEFT", "RIGHT", "TOP", "BOTTOM")
        players = []
        for i in range(len(self.users)):
            players.append({"id": i + 1, "username": self.users[i], "border": slots[i]})
        return players

    def _set_screen_size(self, width, height):
        min_dimension = min(int(width), int(height))
        if not self.screen_size or self.screen_size > min_dimension:
            self.screen_size = min_dimension

    def __str__(self):
        return self.code + " " + " with users " + str(self.users)


