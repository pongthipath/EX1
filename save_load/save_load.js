const fs = require('fs');
const path = require('path');

function saveFile(gamesession){
    this.gamesession = gamesession;
    var gamesessionRaw = JSON.stringify(this.gamesession);
    fs.writeFile(path.resolve('save_load/save' ,this.gamesession.sessionId) + '.json', gamesessionRaw, 'utf8', function (err) {
        if(err) throw err;
    });
}


function saveGameSessionAAT(gamesession){
    this.gamesession = gamesession;
    var thisSession = fs.readFileSync(path.resolve('save_load/save' ,this.gamesession.sessionId) + '.json', function(err, data){
        if(err) throw err;
    });
    var thisGameSession = JSON.parse(thisSession);
    if(thisGameSession.mapSave[thisGameSession.mapSave.length-1] == this.gamesession.map){
        return
    }else{
         thisGameSession.mapSave.push(this.gamesession.map);
        this.gamesession.mapSave = thisGameSession.mapSave;
        saveFile(this.gamesession);
    }
   
}

function loadSession(gamesessionId){
    this.gamesessionId = gamesessionId;
    var rawGameSession = fs.readFileSync(path.resolve('save_load/save' ,this.gamesessionId) + '.json', function(err, data){
        if(err) throw err;
    });
    var gamesession = JSON.parse(rawGameSession);
    gamesession.map = gamesession.mapSave[gamesession.mapSave.length-1];
    gamesession.mapSave = [];
    return gamesession;
}

function loadAllFile(){
    var sessionArray = [];
    var sessionList = fs.readdirSync(path.resolve('save_load/save'), (err, files) => {
        files.forEach(file => {
          console.log(file);
        });
      });
    for(var i = 0 ; i < sessionList.length ; i++){
        var data = fs.readFileSync(path.resolve('save_load/save', sessionList[i]), function(err, data){
            if(err) throw err;
        });
        var rawData = JSON.parse(data);
        rawData.mapSave = [];
        sessionArray.push(rawData);
    }
    return sessionArray;
}

module.exports = {
    saveFile : saveFile,
    saveGameSessionAAT : saveGameSessionAAT,
    loadSession : loadSession,
    loadAllFile : loadAllFile
}