from django.shortcuts import render
from .models import GameRoom


def game_canvas(request, room_code):
    return render(request, "game.html")


def list_rooms(request):
    rooms = GameRoom.objects.all()
    return render(request, "room_list.html", {"rooms": rooms})
