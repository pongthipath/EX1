const fs = require('fs');
const path = require('path');

function saveFile(player){
    this.player = player;
    var rawPlayer = JSON.stringify(this.player);
    fs.writeFile(path.resolve('save_load/save_Player' ,this.player.playerId) + '.json', rawPlayer, 'utf8', function (err) {
        if(err) throw err;
    });
}

function updatePlayer(player){
    this.player = player;
    var thisData = fs.readFileSync(path.resolve('save_load/save_Player' ,this.player.playerId) + '.json', function(err, data){
        if(err) throw err;
    });
    var rawData = JSON.parse(thisData);
    saveFile(this.player);
}

function loadPlayer(playerId){
    this.playerId = playerId;
    var player = fs.readFileSync(path.resolve('save_load/save_Player' ,this.playerId) + '.json', function(err, data){
        if(err) throw err;
    });
    return JSON.parse(player);
}


function loadAllFile(){
    let playerArray = [];
    var playerList = fs.readdirSync(path.resolve('save_load/save_Player'), (err, files) => {
        files.forEach(file => {
          console.log(file);
        });
      });
    for(var i = 0 ; i < playerList.length ; i++){
        var thisData = fs.readFileSync(path.resolve('save_load/save_Player', playerList[i]), function(err, data){
            if(err) throw err;
        });
        var rawData = JSON.parse(thisData);
        playerArray.push(rawData);
    }
    return playerArray;
}

module.exports = {
    saveFile : saveFile,
    updatePlayer : updatePlayer,
    loadPlayer : loadPlayer,
    loadAllFile : loadAllFile
}