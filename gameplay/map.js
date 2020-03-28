const state = require('../gameplay/state');
const map_finder = require('./map_finder');

// Random player position
//      - Return Player

function spawnPlayerPosition(player, gameSession) {
    var min=0; 
    var max=3;  
    var posX =  Math.floor(Math.random() * (+max - +min)) + +min;
    var posY = Math.floor(Math.random() * (+max - +min)) + +min;
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

// Check player collect the attackBuff
//      - Return Player

function checkCollectAttackBuff(gameSession, player){
    this.gameSession = gameSession;
    this.player = player;
    var playerPosition = calculateMovement(this.player.position_X, this.player.position_Y);
    if(playerPosition == this.gameSession.attackPowerBuffPosition){
        this.player.attackPower +=  Math.sqrt(1 * 1);
        return this.player;
    }else{
        return this.player;
    }
}

// Check player collect the defendBuff
//      - Return Player

function checkCollectDeffendBuff(gameSession, player){
    this.gameSession = gameSession;
    this.player = player;
    var playerPosition = calculateMovement(this.player.position_X, this.player.position_Y);
    if(playerPosition == this.gameSession.deffendPowerBuffPosition){
        this.player.defensePower += Math.sqrt(1 * 1);
        return this.player;
    }else{
        return this.player;
    }
}

// Random both attackBuff and defendBuff position
//      - Return Gamesession

function spawnBuffPosition(gameSession){
    this.gameSession = gameSession;
    start: while(true){
        var min=0; 
        var max=2;  
        var posX =  Math.floor(Math.random() * (+max - +min)) + +min;
        var posY = Math.floor(Math.random() * (+max - +min)) + +min;
        var positionAtk = calculateMovement(posX, posY);
        this.gameSession.attackPowerBuffPosition = positionAtk;
        var positionDef = positionAtk;
        this.positionDef = positionDef;
        if(positionAtk+2 > 8){
            this.positionDef -= 2;
            this.gameSession.deffendPowerBuffPosition = this.positionDef;
        }else{
            this.positionDef += 2;
            this.gameSession.deffendPowerBuffPosition = this.positionDef;
        }
        return this.gameSession;
    }
}

// Find opponent Id
//      - Return Id

function findEnemyId(gameSession, player){
    this.gameSession = gameSession;
    this.player = player;
    if(this.player.playerId == this.gameSession.player1){
        return this.gameSession.player2;
    }else if(this.player.playerId == this.gameSession.player2){
        return this.gameSession.player1;
    }
}

// Attack system
//      - Calculate damage to health and defendPower
//      - If health equal to 0, set isAlive to false
//      - Return Enemy Player

function attackEnemy(player1, player2){
    this.player1 = player1;
    this.player2 = player2;
    var result = (this.player2.health + this.player2.defensePower) - this.player1.attackPower;
    if(this.player2.health != 0 || this.player2.isAlive == true){
        this.player2.idle = true;
        if(result >= this.player2.health){
            this.player2.defensePower -= this.player1.attackPower;
            return this.player2;
        }else if(result < this.player2.health){
            this.player2.defensePower = 0;
            this.player2.health = result;
            if(this.player2.health <= 0){
                this.player2.isAlive = false;
                return this.player2;
            }else{
                return this.player2;
            }
        }else if(result <= 0){
            this.player2.isAlive = false;
            return this.player2;
        }
    }else{
        return this.player2;
    }
}

// Player movement
//      - Calculate by player speed
//      - Limit player movement
//      - Return Player

function movement(move, player) {
    this.player = player;
    if(this.player.idle == true && this.player.isAlive == true){
        if(move == 1){
            if(this.player.position_Y == 0){
                return this.player;
            }else{
                newPosY = Math.sqrt(this.player.position_Y * this.player.position_Y) - Math.sqrt(this.player.speed * this.player.speed);
                newPosX = Math.sqrt(this.player.position_X * this.player.position_X);
                this.player.position_X = newPosX;
                this.player.position_Y = newPosY;
                return this.player;
            }
        }else if(move == 2){
            if(this.player.position_Y == 2){
                return this.player;
            }else{
                newPosY = Math.sqrt(this.player.position_Y * this.player.position_Y) + Math.sqrt(this.player.speed * this.player.speed);
                newPosX = Math.sqrt(this.player.position_X * this.player.position_X);
                this.player.position_X = newPosX;
                this.player.position_Y = newPosY;
                return this.player;
            }
        }else if(move == 3){
            if(this.player.position_X == 0){
                return this.player;
            }else{
                newPosX = Math.sqrt(this.player.position_X * this.player.position_X) - Math.sqrt(this.player.speed * this.player.speed);
                newPosY = Math.sqrt(this.player.position_Y * this.player.position_Y);
                this.player.position_X = newPosX;
                this.player.position_Y = newPosY;
                return this.player;
            }
        }else if(move == 4){
            if(this.player.position_X == 2){
                return this.player;
            }else{
                newPosX = Math.sqrt(this.player.position_X * this.player.position_X) + Math.sqrt(this.player.speed * this.player.speed);
                newPosY = Math.sqrt(this.player.position_Y * this.player.position_Y);
                this.player.position_X = newPosX;
                this.player.position_Y = newPosY;
                return this.player;
            }
        }
    }else{
        return this.player;
    }
}

// Find map position by player position
//      - Return Number of position in map
function calculateMovement(posX, posY){
    this.posX = posX;
    this.posY = posY;
    var position = Math.sqrt(this.posX * this.posX) + Math.sqrt(this.posY * this.posY) * 3;
    return position;
}

module.exports = {
    spawnPlayerPosition : spawnPlayerPosition,
    movement : movement,
    calculateMovement : calculateMovement,
    spawnBuffPosition : spawnBuffPosition,
    checkCollectAttackBuff : checkCollectAttackBuff,
    checkCollectDeffendBuff : checkCollectDeffendBuff,
    findEnemyId : findEnemyId,
    attackEnemy : attackEnemy
}