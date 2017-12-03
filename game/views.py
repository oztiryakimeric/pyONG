from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.shortcuts import render

from .forms import GameRoomForm
from .models import GameRoom


@login_required
def list_rooms(request):
    rooms = GameRoom.objects.all()
    return render(request, "room_list.html", {"rooms": rooms})


@login_required()
def room(request, room_code):
    room = GameRoom.objects.get(code=room_code)
    return render(request, "room.html", {room: room})


@login_required
def create_room(request):
    if request.method == "POST":
        form = GameRoomForm(request.POST)

        if form.is_valid():
            game_room = form.save(commit=False)
            game_room.owner = request.user
            game_room.save()
    else:
        form = GameRoomForm()
    return render(request, "create_room.html", {"form":form})


@login_required
def game_canvas(request, room_code):
    return render(request, "game.html")

