var http = require('http');
var express = require('express');
var socket_io = require('socket.io');
var engine = require('./game.js');

var gameEngine = new engine.GameEngine();

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);


io.on('connection', function(socket) {

    socket.emit('connected', gameEngine.drawList);

    socket.on('regUser', function(nickName) {
        gameEngine.addPlayer(socket.id, nickName);
        io.emit('gameChanged', gameEngine.getGameInfo());
    });

    socket.on('disconnect', function() {
        gameEngine.removePlayer(socket.id);
        io.emit('gameChanged', gameEngine.getGameInfo());
    });

    socket.on('draw', function(position) {
        gameEngine.addDrawPosition(position);
        socket.broadcast.emit('draw', position);
    });

    socket.on('guess', function(guess) {

        var nickName = gameEngine.players[socket.id];
        var msg = nickName + ' guessed: ' + guess;
        io.emit('gameMsg', msg);

        if (gameEngine.isGuessCorrect(guess)) {

            io.emit('gameMsg', nickName + ' was right!');
            gameEngine.setDrawer(socket.id);

            gameEngine.clearDrawList();
            io.emit('clear');

            gameEngine.setWord();

            io.emit('gameChanged', gameEngine.getGameInfo());
        }
    });
    socket.on('clear', function() {
        gameEngine.clearDrawList();
        socket.broadcast.emit('clear');
    });

});
server.listen(process.env.PORT || 8080);
