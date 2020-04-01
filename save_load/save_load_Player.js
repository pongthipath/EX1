const fs = require('fs');

function saveFile(player){
    this.player = player;
    var rawPlayer = JSON.stringify(this.player);
    fs.writeFile('save_load/save_Player/' + this.player.playerId + '.json', rawPlayer, 'utf8', function (err) {
        if(err) throw err;
    });
}

function updatePlayer(player){
    this.player = player;
    var oldPlayer = fs.readFileSync('save_load/save_Player/' + this.player.playerId + '.json', function(err, data){
        if(err) throw err;
    });
    oldPlayer = this.player;
    saveFile(JSON.parse(oldPlayer));
}

function loadPlayer(playerId){
    this.playerId = playerId;
    var player = fs.readFileSync('save_load/save_Player/' + this.playerId + '.json', function(err, data){
        if(err) throw err;
    });
    return JSON.parse(player);
}

module.exports = {
    saveFile : saveFile,
    updatePlayer : updatePlayer,
    loadPlayer : loadPlayer
}