// GameSession.js
const shortid = require('shortid');
'use strict';

class GameSession {
    constructor(sessionName, playerId1, playerId2) {
        // this.sessionName = sessionName;
        this.sessionId = shortid.generate();
        this.player1 = playerId1;
        this.player2 = playerId2;
        this.onState = false;
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