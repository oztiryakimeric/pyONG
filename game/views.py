from django.http import HttpResponseRedirect
from django.shortcuts import render

from game.forms import UserForm
from .models import GameRoom


def list_rooms(request):
    rooms = GameRoom.objects.all()
    return render(request, "room_list.html", {"rooms": rooms})


def create_user(request, room_code):
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            return HttpResponseRedirect('../game/room_code/')
    else:
        form = UserForm()

    return render(request, 'name.html', {'form': form})


def game_canvas(request, room_code):
    return render(request, "game.html")

