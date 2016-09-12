var pictionary = function() {

    var nickName = null;
    var canvas, context;
    var drawing = false;
    var drawerCtls = $('#drawer');
    var guessCtls = $('#guess');
    var isDrawer = false;
    var addMessage = function(message) {
        $('#messages').append('<div>' + message + '</div>');
    };

    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
        context.fill();
    };

    var clearCanvas = function() {
        canvas[0].width = canvas[0].offsetWidth;
    };

    drawerCtls.hide();
    guessCtls.hide();

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.on('mousemove', function(event) {
        if (!drawing || !isDrawer) {
            return;
        }
        var offset = canvas.offset();
        var position = {
            x: event.pageX - offset.left,
            y: event.pageY - offset.top
        };
        draw(position);
        socket.emit('draw', position);
    });

    canvas.on('mousedown', function() {
        drawing = true;
    });

    canvas.on('mouseup', function() {
        drawing = false;
    });

    while (!nickName) {
        nickName = window.prompt("Please enter your nickname:", "");
    }
    $('#nickName').html(nickName);

    var socket = io();
    socket.on('connected', function(drawList) {
        drawList.forEach(function(position) {
            draw(position);
        });
    });

    socket.emit('regUser', nickName);

    socket.on('draw', draw);
    socket.on('clear', clearCanvas);

    socket.on('gameMsg', function(msg) {
        addMessage(msg);
    });
    socket.on('gameChanged', function(gameInfo) {
        $('#playerList').empty();
        var html = "";
        for (var index in gameInfo.players) {
            if (gameInfo.players.hasOwnProperty(index)) {
                if (gameInfo.drawerID === index) {
                    html += "<li>" + gameInfo.players[index] + '*' + "</li>";
                } else {
                    html += "<li>" + gameInfo.players[index] + "</li>";
                }

            }
        }
        $('#playerList').html(html);

        $('#drawerWord').html('Your word is ' + gameInfo.currentWord);
        isDrawer = (gameInfo.drawerID === socket.id);

        if (isDrawer) {
            drawerCtls.show();
            guessCtls.hide();
        } else {
            drawerCtls.hide();
            guessCtls.show();
        }
    });

    var guessBox = $('#guess input');
    guessBox.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }
        socket.emit('guess', guessBox.val());
        guessBox.val('');
    });
    $('#clearButton').on('click', function() {
        clearCanvas();
        socket.emit('clear');
    });

};

$(document).ready(function() {
    pictionary();
});
