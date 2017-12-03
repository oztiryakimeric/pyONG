from django import forms
from .models import GameRoom


class GameRoomForm(forms.ModelForm):
    class Meta:
        model = GameRoom
        fields = ('code', 'player_count', 'ball_size', 'paddle_size')
