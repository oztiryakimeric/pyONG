from channels import Group
from django.db import models

import json

from pyONG import singleton_redis


class GameRoom(models.Model):
    code = models.CharField(max_length=10)

    @property
    def websocket_group(self):
        """
        Returns the Channels Group that sockets should subscribe to to get sent
        messages as they are generated.
        """
        return Group("room-%s" % self.id)

    def __str__(self):
        return self.code


class BaseRedisModel:
    def __init__(self):
        self.redis = singleton_redis.Connection.get_instance()


class Game(BaseRedisModel):
    def __init__(self, room_code):
        super(Game, self).__init__()
        self.code = room_code
        self.users = []

    @staticmethod
    def from_redis(json):
        game = Game(json["code"])
        for user in json["users"]:
            game.add_user(user)

    def add_user(self, user):
        self.users.append(user)

    def save(self):
        serialized = {"code": self.code, "users": self.users}
        self.redis.set(self.code, json.dumps(serialized))
        return self

    def delete(self):
        self.redis.delete(self.code)

    @staticmethod
    def get_or_create(code):
        redis = singleton_redis.Connection.get_instance()
        game = redis.get("code")
        if game:
            return Game.from_redis(json.loads(game))
        else:
            return Game(code).save()

    def __str__(self):
        return self.code + " " + " with users " + str(self.users)
