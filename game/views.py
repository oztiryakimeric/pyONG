from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.shortcuts import render

from .models import GameRoom


@login_required
def list_rooms(request):
    rooms = GameRoom.objects.all()
    return render(request, "room_list.html", {"rooms": rooms})


@login_required
def game_canvas(request, room_code):
    return render(request, "game.html")

