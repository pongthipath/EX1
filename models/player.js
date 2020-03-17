// GameSession.js
const shortid = require('shortid');
'use strict';

class Player {
    constructor(playerName) {
        // this.playerName = playerName;
        this.playerId = shortid.generate();
        this.attackPower = 1;
        this.defensePower = 1;
        this.health = 1;
        this.speed = 1;
        this.position_X = 0;
        this.position_Y = 0;
        this.isAlive = true;
        this.idle = true;
    }

    changeSessionName(newPlayerName) {
        this.playerName = newPlayerName;
        return newPlayerName;
    }

    changeSessionID (newPlayerId) {
        this.playerId = newPlayerId;
        return newPlayerId;
    }

    changePosition(newPosition_X, newPosition_Y) {
        this.position_X = newPosition_X;
        this.position_Y = newPosition_Y;
        return newPosition_X, newPosition_Y;
    }

    ToJSON() {
        let jsonStr = {
            'playerName': this.playerName,
            'playerID' : this.playerId,
            'atttackPower' : this.attackPower,
            'defensePower' : this.defensePower,
            'health' : this.health,
            'speed' : this.speed,
            'position' : this.position, 
            'isAlive' : this.isAlive
        }
        return jsonStr;
    }
}


module.exports = Player;