var GameEngine = function() {

    this.WORDS = [
        "word", "letter", "number", "person", "pen", "class", "people",
        "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
        "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
        "land", "home", "hand", "house", "picture", "animal", "mother", "father",
        "brother", "sister", "world", "head", "page", "country", "question",
        "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
        "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
        "west", "child", "children", "example", "paper", "music", "river", "car",
        "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
        "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
        "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
        "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
        "space", "football"
    ];

    this.drawerID = null;
    this.players = new Object();
    this.currentWord = null;
    this.setWord();
    this.drawList = [];

};

GameEngine.prototype.addPlayer = function(id, nickName) {
    this.players[id] = nickName;
    if (!this.drawerID) {
        this.drawerID = id;
    }
};

GameEngine.prototype.removePlayer = function(id) {
    if (!this.players[id]) {
        return;
    }

    delete this.players[id];

    if (id === this.drawerID) {

        if (Object.keys(this.players).length > 0) {
            for (var index in this.players) {
                this.drawerID = index;
                break;
            }

        } else {
            this.drawerID = null;
        }
    }
};

GameEngine.prototype.setDrawer = function(id) {
    this.drawerID = id;
};

GameEngine.prototype.setWord = function() {
    var rndNum = Math.floor((Math.random() * (this.WORDS.length - 1)));
    this.currentWord = this.WORDS[rndNum];
};

GameEngine.prototype.addDrawPosition = function(position) {
    this.drawList.push(position);
};

GameEngine.prototype.clearDrawList = function() {
    this.drawList = [];
};

GameEngine.prototype.getGameInfo = function() {
    return {
        drawerID: this.drawerID,
        currentWord: this.currentWord,
        players: this.players
    }
};

GameEngine.prototype.isGuessCorrect = function(guess) {
    return (this.currentWord.toUpperCase() === guess.toUpperCase())
};

exports.GameEngine = GameEngine;
