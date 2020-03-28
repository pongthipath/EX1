
// Check number of player in map
//      - Return number of player in map

function playerCount(gamesession){
    this.gamesession = gamesession;
    this.count = 0;
    if(this.gamesession.map.pos0 != ''){
        this.count++;
    }
    if(this.gamesession.map.pos1 != ''){
        this.count++;
    }
    if(this.gamesession.map.pos2 != ''){
        this.count++;
    }
    if(this.gamesession.map.pos3 != ''){
        this.count++;
    }
    if(this.gamesession.map.pos4 != ''){
        this.count++;
    }
    if(this.gamesession.map.pos5 != ''){
        this.count++;
    }
    if(this.gamesession.map.pos6 != ''){
        this.count++;
    }
    if(this.gamesession.map.pos7 != ''){
        this.count++;
    }
    if(this.gamesession.map.pos8 != ''){
        this.count++;
    }
    return this.count;
}

// Find the position and player to add player
//      - Return Gamesession

function findPositionToAddPlayer(pos, gamesession, player){
    this.pos = pos;
    this.gamesession = gamesession;
    this.player = player;
    if(this.pos == 0){
        this.gamesession.map.pos0 = this.player
    }else if(this.pos == 1){
        this.gamesession.map.pos1 = this.player
    }else if(this.pos == 2){
        this.gamesession.map.pos2 = this.player
    }else if(this.pos == 3){
        this.gamesession.map.pos3 = this.player
    }else if(this.pos == 4){
        this.gamesession.map.pos4 = this.player
    }else if(this.pos == 5){
        this.gamesession.map.pos5 = this.player
    }else if(this.pos == 6){
        this.gamesession.map.pos6 = this.player
    }else if(this.pos == 7){
        this.gamesession.map.pos7 = this.player
    }else if(this.pos == 8){
        this.gamesession.map.pos8 = this.player
    }
    return this.gamesession;
}

// Find the position and player to delete player
//      - Return Gamesession

function findPlayerToDelete(pos, gamesession){
    this.pos = pos;
    this.gamesession = gamesession;
    if(this.pos == 0){
        this.gamesession.map.pos0 = ''
    }else if(this.pos == 1){
        this.gamesession.map.pos1 = ''
    }else if(this.pos == 2){
        this.gamesession.map.pos2 = ''
    }else if(this.pos == 3){
        this.gamesession.map.pos3 = ''
    }else if(this.pos == 4){
        this.gamesession.map.pos4 = ''
    }else if(this.pos == 5){
        this.gamesession.map.pos5 = ''
    }else if(this.pos == 6){
        this.gamesession.map.pos6 = ''
    }else if(this.pos == 7){
        this.gamesession.map.pos7 = ''
    }else if(this.pos == 8){
        this.gamesession.map.pos8 = ''
    }
    return this.gamesession;
}

// Find that player which position in the map
//      - Return map position

function findPlayerInPosition(gamesession, player){
    this.gamesession = gamesession;
    this.player = player;
    if(this.gamesession.map.pos0 == this.player){
        return 0;
    }else if(this.gamesession.map.pos1 == this.player){
        return 1;
    }else if(this.gamesession.map.pos2== this.player){
        return 2;
    }else if(this.gamesession.map.pos3 == this.player){
        return 3;
    }else if(this.gamesession.map.pos4 == this.player){
        return 4;
    }else if(this.gamesession.map.pos5 == this.player){
        return 5;
    }else if(this.gamesession.map.pos6 == this.player){
        return 6;
    }else if(this.gamesession.map.pos7 == this.player){
        return 7;
    }else if(this.gamesession.map.pos8 == this.player){
        return 8;
    }else{
        return;
    }
}

module.exports = {
    playerCount : playerCount,
    findPositionToAddPlayer : findPositionToAddPlayer,
    findPlayerInPosition : findPlayerInPosition,
    findPlayerToDelete : findPlayerToDelete
}