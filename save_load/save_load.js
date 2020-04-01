const fs = require('fs');

function saveFile(gamesession){
    this.gamesession = gamesession;
    var gamesessionRaw = JSON.stringify(this.gamesession);
    fs.writeFile('save_load/save/' + this.gamesession.sessionId + '.json', gamesessionRaw, 'utf8', function (err) {
        if(err) throw err;
    });
   
}


function saveGameSessionAAT(gamesession){
    this.gamesession = gamesession;
    fs.readFile('save_load/save/' + this.gamesession.sessionId + '.json', function(err, data){
        var rawGameSession = JSON.parse(data);
        rawGameSession.map = this.gamesession.map;
        rawGameSession.mapSave.push(this.gamesession.map);
        saveFile(rawGameSession);
    });
}

function loadSession(gamesessionId){
    this.gamesessionId = gamesessionId;
    var rawGameSession = fs.readFileSync('save_load/save/' + this.gamesessionId + '.json', function(err, data){
        if(err) throw err;
    });
    this.gamesession = JSON.parse(rawGameSession);
    this.gamesession = session;
    this.gamesession.map = session.mapSave[session.mapSave.length-1];
    this.gamesession.mapSave = [];
    return this.gamesession;
}

module.exports = {
    saveFile : saveFile,
    saveGameSessionAAT : saveGameSessionAAT,
    loadSession : loadSession
}