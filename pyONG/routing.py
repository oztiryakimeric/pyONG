from channels import include
from channels import route

# This function will display all messages received in the console
from game.consumers import ws_connect, ws_receive, ws_disconnect, join

websocket_routing = [
    # Called when WebSockets connect
    route("websocket.connect", ws_connect),

    # Called when WebSockets get sent a data frame
    route("websocket.receive", ws_receive),

    # Called when WebSockets disconnect
    route("websocket.disconnect", ws_disconnect),
]

custom_routing = [
    # Handling different chat commands (websocket.receive is decoded and put
    # onto this channel) - routed on the "command" attribute of the decoded
    # message.
    route("websocket.receive", join, command="^join"),
]

channel_routing = [
    # Include sub-routing from an app.
    include("pyONG.routing.websocket_routing", path=r"^/room/(?P<room_code>[a-zA-Z0-9_]+)"),
    include("pyONG.routing.custom_routing"),
    # A default "http.request" route is always inserted by Django at the end of the routing list
    # that routes all unmatched HTTP requests to the Django view system. If you want lower-level
    # HTTP handling - e.g. long-polling - you can do it here and route by path, and let the rest
    # fall through to normal views.
]