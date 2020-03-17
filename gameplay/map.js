const state = require('../gameplay/state');

function spawnPlayerPosition(player, gameSession) {
    var min=0; 
    var max=2;  
    var posX =  Math.floor(Math.random() * (+max - +min)) + +min;
    console.log("posX - " + posX);
    var posY = Math.floor(Math.random() * (+max - +min)) + +min;
    console.log("posY - " + posY);
    this.player = player;
    this.gameSession = gameSession;
    this.player.position_X = posX;
    this.player.position_Y = posY;
    if(this.player.playerId == gameSession.player1){
        this.player.idle = true;
    }else if(this.player.playerId == gameSession.player2){
        this.player.idle = false;
    }
    return this.player;
}

function movement(move, data) {
    this.data = data;
    if(this.data.idle == true && this.data.isAlive == true){
        if(move == 1){
            if(this.data.position_Y == 0){
                return{
                    'posX' : this.data.position_X,
                    'posY' : this.data.position_Y
                };
            }else{
                newPosY = Math.sqrt(this.data.position_Y * this.data.position_Y) - Math.sqrt(this.data.speed * this.data.speed);
                newPosX = Math.sqrt(this.data.position_X * this.data.position_X);
                state.end();
                return {
                    'posX' : newPosX,
                    'posY' : newPosY
                };
            }
        }else if(move == 2){
            if(this.data.position_Y == 2){
                return{
                    'posX' : this.data.position_X,
                    'posY' : this.data.position_Y
                };
            }else{
                newPosY = Math.sqrt(this.data.position_Y * this.data.position_Y) + Math.sqrt(this.data.speed * this.data.speed);
                newPosX = Math.sqrt(this.data.position_X * this.data.position_X);
                state.end();
                return {
                    'posX' : newPosX,
                    'posY' : newPosY
                };
            }
        }else if(move == 3){
            if(this.data.position_X == 0){
                return{
                    'posX' : this.data.position_X,
                    'posY' : this.data.position_Y
                };
            }else{
                newPosX = Math.sqrt(this.data.position_X * this.data.position_X) - Math.sqrt(this.data.speed * this.data.speed);
                newPosY = Math.sqrt(this.data.position_Y * this.data.position_Y);
                state.end();
                return {
                    'posX' : newPosX,
                    'posY' : newPosY
                };
            }
        }else if(move == 4){
            if(this.data.position_X == 2){
                return{
                    'posX' : this.data.position_X,
                    'posY' : this.data.position_Y
                };
            }else{
                newPosX = Math.sqrt(this.data.position_X * this.data.position_X) + Math.sqrt(this.data.speed * this.data.speed);
                newPosY = Math.sqrt(this.data.position_Y * this.data.position_Y);
                state.end();
                return {
                    'posX' : newPosX,
                    'posY' : newPosY
                };
            }
        }
    }else{
        return{
            'posX' : this.data.position_X,
            'posY' : this.data.position_Y
        };
    }
}

function calculateMovement(posX, posY){
    this.posX = posX;
    this.posY = posY;
    var position = Math.sqrt(this.posX * this.posX) + Math.sqrt(this.posY * this.posY) * 3;
    console.log("position - " + position);
    return position;
}

module.exports = {
    spawnPlayerPosition : spawnPlayerPosition,
    movement : movement,
    calculateMovement : calculateMovement
}