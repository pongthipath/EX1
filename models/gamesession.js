// GameSession.js
const shortid = require('shortid');
'use strict';

class GameSession {
    constructor(sessionName, playerId1, playerId2, positionAtk, positionDef, winner) {
        // this.sessionName = sessionName;
        this.sessionId = shortid.generate();
        this.player1 = null;
        this.player2 = null;
        this.onState = false;
        this.attackPowerBuffPosition = null;
        this.deffendPowerBuffPosition = null;
        this.game = true;
        this.winner = null;
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
        this.mapSave = []
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