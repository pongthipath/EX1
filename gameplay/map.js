const state = require('../gameplay/state');

function spawnPlayer(data, onS) {
    
}

function movement(move, data) {
    if(move == 1){
        if(data.position_X == 0){
            return;
        }else{
            newPosY = Math.sqrt(data.position_Y * data.position_Y) + Math.sqrt(data.speed * data.speed);
            newPosX = Math.sqrt(data.position_X * data.position_X);
            return calculateMovement(newPosX, newPosY);
        }
    }else if(move == 2){
        if(data.position_X == 2){
            return;
        }else{
            newPosY = Math.sqrt(data.position_Y * data.position_Y) - Math.sqrt(data.speed * data.speed);
            newPosX = Math.sqrt(data.position_X * data.position_X);
            return calculateMovement(newPosX, newPosY);
        }
    }else if(move == 3){
        if(data.position_Y == 0){
            return;
        }else{
            newPosX = Math.sqrt(data.position_X * data.position_X) - Math.sqrt(data.speed * data.speed);
            newPosY = Math.sqrt(data.position_Y * data.position_Y);
            calculateMovement(newPosX, newPosY);
        }
    }else if(move == 4){
        if(data.position_Y == 2){
            return;
        }else{
            newPosX = Math.sqrt(data.position_X * data.position_X) + Math.sqrt(data.speed * data.speed);
            newPosY = Math.sqrt(data.position_Y * data.position_Y);
            calculateMovement(newPosX, newPosY);
        }
    }
}

function calculateMovement(posX, posY){
    return (Math.sqrt(posX * posX) + Math.sqrt(posY * posY) * 3);
}

module.exports = {
    spawnPlayer : spawnPlayer,
    movement : movement,
    calculateMovement : calculateMovement
}