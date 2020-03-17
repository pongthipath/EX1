function init(gameState, player1, player2) {
    if(player1.idle == true){
        if(player2.idle == true){
            gameState.onState = true;
            return gameState;
        }
    }
        return ;
}

function start() {
        return true;
}

function end() {
    if(!this.isAlive){
        return false;
    }else{
        return;
    }
}

module.exports = {
    init : init,
    start : start,
    end : end
}