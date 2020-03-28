// GameSession.js
const shortid = require('shortid');
'use strict';

class GameSession {
    constructor(sessionName, playerId1, playerId2, positionAtk, positionDef, winner) {
        // this.sessionName = sessionName;
        this.sessionId = shortid.generate();
        this.player1 = playerId1;
        this.player2 = playerId2;
        this.onState = false;
        this.attackPowerBuffPosition = positionAtk;
        this.deffendPowerBuffPosition =positionDef;
        this.game = true;
        this.winner = winner;
        this.map = {
            "pos0": '',
            "pos1": '',
            "pos2": '',
            "pos3": '',
            "pos4": '',
            "pos5": '',
            "pos6": '',
            "pos7": '',
            "pos8": ''
        }
    }

    changeSessionName(newSessionName) {
        this.sessionName = newSessionName;
        return newSessionName;
    }

    changeSessionID (newSessionId) {
        this.sessionId = newSessionId;
        return newSessionId;
    }

    ToJSON() {
        let jsonStr = {
            'sessionName' : this.sessionName,
            'sessionID' : this.sessionId,
        }
        return jsonStr;
    }
}


module.exports = GameSession;