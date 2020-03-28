const map_finder = require('./map_finder');

// Check both player1 and player2 already spawn in map
//      - Set Gamesessin onState to true for playing
//      - Return Gamesession

function init(gameSession, player1, player2) {
    this.gameSession = gameSession;
    this.player1 = player1;
    this.player2 = player2;
    if(map_finder.playerCount(this.gameSession) == 2){
        if(this.player1.idle == true){
            if(this.player2.idle == false){
                this.gameSession.onState = true;
                return this.gameSession;
            }
        }
    }else{
        this.gameSession.onState = false;
        return this.gameSession;
        } 
}

function start() {
        return true;
}

// Check player alive or not 
//      - If player is dead, set the game to end and onState to false
//      - Return Gamesession

function end(player, gameSession) {
    this.player = player;
    this.gameSession = gameSession;
    if(this.player.isAlive == false){
        if(this.player.playerId == this.gameSession.player1){
            this.gameSession.winner = this.gameSession.player2;
        }else if(this.player.playerId == this.gameSession.player2){
            this.gameSession.winner = this.gameSession.player1;
        }
        this.gameSession.onState = false;
        this.gameSession.game = false;
        return this.gameSession;
    }else{
        return this.gameSession;
    }
}

module.exports = {
    init : init,
    start : start,
    end : end
}