import random

from channels import Group
from django.contrib.auth.models import User
from django.db import models

import json

from pyONG import singleton_redis


class GameRoom(models.Model):
    name = models.CharField(max_length=144)
    code = models.CharField(max_length=10)
    owner = models.ForeignKey(User, related_name="builder")
    player_count = models.IntegerField(default=2)
    ball_size = models.IntegerField(default=20)
    paddle_size = models.IntegerField(default=75)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    def __str__(self):
        return self.code


class BaseRedisModel:
    def __init__(self):
        self.redis = singleton_redis.Connection.get_instance()


class Game(BaseRedisModel):
    def __init__(self, room_code):
        super(Game, self).__init__()
        self.code = room_code
        self.screen_size = None
        self.users = []
        self._prepare_random_vector()

    @staticmethod
    def from_redis(json_obj):
        game = Game(json_obj["code"])
        for user in json_obj["users"]:
            game.users.append(RedisUser(user["id"], user["username"], user["border"], RedisColor.from_json(user["color"])))
        game.screen_size = json_obj["screen"]
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
        serialized_users = [user.dict() for user in self.users]
        serialized = {"code": self.code, "users": serialized_users, "screen": self.screen_size}
        self.redis.set(self.code, json.dumps(serialized))
        return self

    def safe_delete(self):
        if len(self.users) == 0:
            self.redis.delete(self.code)

    def add_client(self, message):
        slots = ("LEFT", "RIGHT", "TOP", "BOTTOM")
        self.users.append(RedisUser(len(self.users) + 1, message.user.username, slots[len(self.users)],
                                    RedisColor(random.randint(0, 250), random.randint(0, 250), random.randint(0, 250))))
        self._set_screen_size(width=message["width"], height=message["height"])
        self.get_group().add(message.reply_channel)

    def remove_client(self, message):
        for user in self.users:
            if user.username == message.user.username:
                self.users.remove(user)
                break
        self.get_group().discard(message.reply_channel)

    def get_clients(self):
        return [user.dict() for user in self.users]

    def find_client(self, username):
        for user in self.users:
            if user.username == username:
                return user

    def send_all_clients(self, message):
        self.get_group().send({"text": json.dumps(message)})

    def get_group(self):
        return Group(self.code)

    def get_room(self):
        GameRoom.objects.get(code=self.code)

    def _set_screen_size(self, width, height):
        min_dimension = min(int(width), int(height))
        if not self.screen_size or self.screen_size > min_dimension:
            self.screen_size = min_dimension

    def _prepare_random_vector(self):
        possible = (-3, -2, -1, 1, 2, 3)
        self.ball_vector = {"x": possible[random.randint(0, 6)], "y": possible[random.randint(0, 6)]}

    def __str__(self):
        return self.code + " " + " with users " + str(self.users)


class RedisUser:
    def __init__(self, id, username, border, color):
        self.id = id
        self.username = username
        self.border = border
        self.color = color
        self.score = 0

    def dict(self):
        return {"id": self.id, "username": self.username, "border": self.border, "color": self.color.dict()}


class RedisColor:
    @staticmethod
    def from_string(data):
        return RedisColor(data.split(",")[0], data.split(",")[1], data.split(",")[2])

    @staticmethod
    def from_json(json_obj):
        return RedisColor(json_obj["r"], json_obj["g"], json_obj["b"])

    def __init__(self, r, g, b):
        self.r = r
        self.g = g
        self.b = b

    def dict(self):
        return {"r": self.r, "g": self.g, "b": self.b}
