const GameSession = require('./models/gamesession') ;
const Player = require('./models/player');
const map_finder = require('./gameplay/map_finder');
const MAP = require('./gameplay/map');
const app = require('express')();
const state = require('./gameplay/state');

let gameSessions = [];
let players = [];


app.get('/', function(req, res){

    // Default page
    res.sendFile(__dirname + '/index/index.html');
});

app.get('/result', function(req, res){

    // Overall 

       let result = {
        'sessions': gameSessions,
        'players': players  
    }
    res.send(result);
});

app.get('/index', function(req, res){
    res.sendFile(__dirname + '/index/index.html');
});

app.get('/test', function(){
    console.log('test');
});


app.get('/games', function(req, res){
    res.send(gameSessions);
});

app.get('/players', function(req, res){
    res.send(players);
});

app.get('/game/create', function(req, res){

    // Create Gamesession

    var newGameSessions = new GameSession();
    gameSessions.push(newGameSessions);
    res.send(gameSessions);
});

app.get('/game/delete/:sessionId', function(req, res){

    // Delete Gamesession

    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    if(selectSession >= 0){
        gameSessions.splice(selectSession, 1);
        res.sendStatus(301);
    }else{
        res.sendStatus(204);
    }
});

app.get('/player/create', function(req, res){

    // Create player

    var newPlayer = new Player();
    players.push(newPlayer);
    res.send(players);
});

app.get('/player/:playerId/maps/delete', function(req, res){

    // Delete player 

    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    if(selectPlayer >= 0){
        players.splice(selectPlayer, 1);
        res.send(players[selectPlayer]);
    }else{
        res.sendStatus(204);
    }
});

// --Find the player--

app.get('/player/:playerId', function(req, res){
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    if(selectPlayer >= 0){
        res.send(players[selectPlayer]);
    }else{
        res.sendStatus(304);
    }
});

// --Send Gamesession selector page--

app.get('/player/:playerId/maps', function(req, res){

    // Check current player

    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);

    // Response Gamesession selection page

    if(selectPlayer >= 0){
        res.sendFile(__dirname + '/index/gameSession.html');
    }else{
        res.sendStatus(304);
    }
});

// --Leave the Gamesession--

app.get('/player/:playerId/maps/game/:sessionId/addplayer/ingame/delete', function(req, res){

    // Check current player

    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    let selectPlayer1 = players.findIndex((x) => x.playerId == gameSessions[selectSession].player1);
    let selectPlayer2 = players.findIndex((x) => x.playerId == gameSessions[selectSession].player2);

    // Set player1 or player2 to undefinded, if player leave the Gamesession

    if(gameSessions[selectSession].player1 == players[selectPlayer].playerId){
        players[selectPlayer].idle = false;
        var position = MAP.calculateMovement(players[selectPlayer].position_X, players[selectPlayer].position_Y);
        gameSessions[selectSession] = map_finder.findPlayerToDelete(position, gameSessions[selectSession]);
        gameSessions[selectSession] = state.init(gameSessions[selectSession], players[selectPlayer1], players[selectPlayer2]);
        gameSessions[selectSession].player1 = undefined;
        res.send(players[selectPlayer]);
    }else if(gameSessions[selectSession].player2 == players[selectPlayer].playerId){
        players[selectPlayer].idle = false;
        var position = MAP.calculateMovement(players[selectPlayer].position_X, players[selectPlayer].position_Y);
        gameSessions[selectSession] = map_finder.findPlayerToDelete(position, gameSessions[selectSession]);
        gameSessions[selectSession] = state.init(gameSessions[selectSession], players[selectPlayer1], players[selectPlayer2]);
        gameSessions[selectSession].player2 = undefined;
        res.send(players[selectPlayer]);
    }else{
        res.sendStatus(204);
    }
});

// --Add player into the Gamesession that already have--

app.get('/player/:playerId/maps/game/:sessionId/addplayer', function(req, res){

    // Check current player

    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);

    // Check playerId in Gamesession and current player are match

    if(gameSessions[selectSession].player1 == players[selectPlayer].playerId || gameSessions[selectSession].player2 == players[selectPlayer].playerId){
        res.sendStatus(204);

        // Check player in Gamesession 

        // If have player in player1, it will add player in player2.
        // If not, it will add into player1

        // Then, add current playerId in Gamesession

    }else if(gameSessions[selectSession].player1 == undefined || gameSessions[selectSession].player2 == undefined){
        if(gameSessions[selectSession].player1 === undefined ){
            gameSessions[selectSession].player1 = players[selectPlayer].playerId;
            res.send(gameSessions);
        }else if(gameSessions[selectSession].player1 !== undefined){
            gameSessions[selectSession].player2 = players[selectPlayer].playerId;
            res.send(gameSessions);
        }else{
            res.sendStatus(204);
        }
    }
});

// --Send gameplays interface--

app.get('/player/:playerId/maps/game/:sessionId/addplayer/ingame', function(req, res){

    // Check current player

    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    if(selectPlayer >= 0){
        res.sendFile(__dirname + '/index/gameplays_interface.html');
    }else{
        res.sendStatus(304);
    }
});

// --Current map at a times--

app.get('/player/:playerId/maps/game/:sessionId/addplayer/ingame/inmap', function(req, res){

    // Get index of Gamesession or Player in Array

    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);

    // Check playerId in Gamesession and current player are match
    // Then response Gamesession

    if(gameSessions[selectSession].player1 == players[selectPlayer].playerId || gameSessions[selectSession].player2 == players[selectPlayer].playerId){
        res.send(gameSessions[selectSession]);
    }
});

// --Spawn player to the map--
app.get('/player/:playerId/maps/game/:sessionId/addplayer/ingame/spawn', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    let selectPlayer1 = players.findIndex((x) => x.playerId == gameSessions[selectSession].player1);
    let selectPlayer2 = players.findIndex((x) => x.playerId == gameSessions[selectSession].player2);


    // Check player in Gamesession 
    // Find player in map
    //  -If not have any player in the map --> Spawn player
    //  -If have 1 player in the map --> Check the position that will spawn the second player by random spawn function, if already have a player in there position 
    //      --> random until it's not have another player in that position.

    if(gameSessions[selectSession].player1 == players[selectPlayer].playerId || gameSessions[selectSession].player2 == players[selectPlayer].playerId){
        var countPlayer = map_finder.playerCount(gameSessions[selectSession]);
        if(gameSessions[selectSession].player1 == players[selectPlayer].playerId && countPlayer < 1){
            var playerSpawnPosition = MAP.spawnPlayerPosition(players[selectPlayer], gameSessions[selectSession]);
            players[selectPlayer] = playerSpawnPosition;
            var position = MAP.calculateMovement(players[selectPlayer].position_X, players[selectPlayer].position_Y);
            gameSessions[selectSession] = map_finder.findPositionToAddPlayer(position, gameSessions[selectSession], players[selectPlayer]);
            res.send(gameSessions[selectSession]);
        }else if(gameSessions[selectSession].player2 == players[selectPlayer].playerId && countPlayer < 2){
            var playerSpawnPosition = MAP.spawnPlayerPosition(players[selectPlayer], gameSessions[selectSession]);
            var position = MAP.calculateMovement(playerSpawnPosition.position_X, playerSpawnPosition.position_Y);
            var player1Position = map_finder.findPlayerInPosition(gameSessions[selectSession], players[selectPlayer1]);
            if(position == player1Position){
                res.sendStatus(204);
            }else{
                players[selectPlayer] = playerSpawnPosition;
                gameSessions[selectSession] = map_finder.findPositionToAddPlayer(position, gameSessions[selectSession], players[selectPlayer]);
                res.send(gameSessions[selectSession]);
            }
        }else{
            res.sendStatus(204);
        }
    }else{
        res.sendStatus(204);
    }
});

// --Prepare player--

// If player ready the state will allow player to play
// Spawn buff

app.get('/game/:sessionId/player/:playerId1/:playerId2/state', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer1 = players.findIndex((x) => x.playerId == req.params.playerId1);
    let selectPlayer2 = players.findIndex((x) => x.playerId == req.params.playerId2);
    if(gameSessions[selectSession].player1 == players[selectPlayer1].playerId || gameSessions[selectSession].player2 == players[selectPlayer2].playerId || gameSessions[selectSession].player2 == players[selectPlayer1].playerId || gameSessions[selectSession].player1 == players[selectPlayer2].playerId){
        gameSessions[selectSession] = state.init(gameSessions[selectSession], players[selectPlayer1], players[selectPlayer2]);
        gameSessions[selectSession] = MAP.spawnBuffPosition(gameSessions[selectSession]);
        res.send(gameSessions[selectSession]);
    }else{
        gameSessions[selectSession] = state.init(gameSessions[selectSession], players[selectPlayer1], players[selectPlayer2]);
        res.send(gameSessions[selectSession]);
    }
});

// --Movement up(1)--
//      For movement we use 
//          -   1 = up
//          -   2 = down
//          -   3 = left
//          -   4 = right
// --------Movement--------

app.get('/player/:playerId/maps/game/:sessionId/addplayer/ingame/moveUp', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    let selectPlayer1 = players.findIndex((x) => x.playerId == gameSessions[selectSession].player1);
    let selectPlayer2 = players.findIndex((x) => x.playerId == gameSessions[selectSession].player2);

    // Check state

    if(gameSessions[selectSession].onState == true){
        if(players[selectPlayer].idle == true){

            // Verify position have no player
            //      - Calculate player position by formular
            //      - Generate the new player position
            //      - Compare position

            var oldPosition = MAP.calculateMovement(players[selectPlayer].position_X, players[selectPlayer].position_Y);
            var rawPosition = MAP.movement(1, players[selectPlayer]);
            var position = MAP.calculateMovement(rawPosition.position_X, rawPosition.position_Y);
            if(players[selectPlayer].playerId == players[selectPlayer1].playerId){
                var checkNullPosition = map_finder.findPlayerInPosition(gameSessions[selectSession], players[selectPlayer2]);
                if(checkNullPosition == position){
                    res.sendStatus(204);
                }else{

                    // Movement(player1)
                    //      - Delete the old player position
                    //      - Set player turn
                    //      - Set new player position(position_X, position_Y)
                    //      - Add player to the map by the new player position(position_X, position_Y) that already set up
                    //      - Check the buff(Attack up, Defend up), if player on that buff's positon

                    gameSessions[selectSession] = map_finder.findPlayerToDelete(oldPosition, gameSessions[selectSession]);
                    players[selectPlayer1].idle = false;
                    players[selectPlayer2].idle = true;
                    players[selectPlayer] = rawPosition;
                    gameSessions[selectSession] = map_finder.findPositionToAddPlayer(position, gameSessions[selectSession], players[selectPlayer]);
                    players[selectPlayer] = MAP.checkCollectAttackBuff(gameSessions[selectSession], players[selectPlayer]);
                    players[selectPlayer] = MAP.checkCollectDeffendBuff(gameSessions[selectSession], players[selectPlayer]);
                }
            }else if(players[selectPlayer].playerId == players[selectPlayer2].playerId){
                var checkNullPosition = map_finder.findPlayerInPosition(gameSessions[selectSession], players[selectPlayer1]);
                if(checkNullPosition == position){
                    res.sendStatus(204);
                }else{

                    // Movement(player2)
                    //      - Delete the old player position
                    //      - Set player turn
                    //      - Set new player position(position_X, position_Y)
                    //      - Add player to the map by the new player position(position_X, position_Y) that already set up
                    //      - Check the buff(Attack up, Defend up), if player on that buff's positon

                    gameSessions[selectSession] = map_finder.findPlayerToDelete(oldPosition, gameSessions[selectSession]);
                    players[selectPlayer1].idle = true;
                    players[selectPlayer2].idle = false;
                    players[selectPlayer] = rawPosition;
                    gameSessions[selectSession] = map_finder.findPositionToAddPlayer(position, gameSessions[selectSession], players[selectPlayer]);
                    players[selectPlayer] = MAP.checkCollectAttackBuff(gameSessions[selectSession], players[selectPlayer]);
                    players[selectPlayer] = MAP.checkCollectDeffendBuff(gameSessions[selectSession], players[selectPlayer]);
                }
            }else{
                res.sendStatus(204);
            }
        }else{
            res.sendStatus(204);
        }

        // Check state and the game ended

    }else if(gameSessions[selectSession].onState == false){
        if(gameSessions[selectSession].game == false){
            res.send(gameSessions[selectSession]);
        }else{
            res.sendStatus(204);
        }
    }else{
        res.sendStatus(204);
    }
});

// --Movement down(2)--

app.get('/player/:playerId/maps/game/:sessionId/addplayer/ingame/moveDown', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    let selectPlayer1 = players.findIndex((x) => x.playerId == gameSessions[selectSession].player1);
    let selectPlayer2 = players.findIndex((x) => x.playerId == gameSessions[selectSession].player2);

    // Check state

    if(gameSessions[selectSession].onState == true){
        if(players[selectPlayer].idle == true){

            // Verify position have no player
            //      - Calculate player position by formular
            //      - Generate the new player position
            //      - Compare position

            var oldPosition = MAP.calculateMovement(players[selectPlayer].position_X, players[selectPlayer].position_Y);
            var rawPosition = MAP.movement(2, players[selectPlayer]);
            var position = MAP.calculateMovement(rawPosition.position_X, rawPosition.position_Y);
            if(players[selectPlayer].playerId == players[selectPlayer1].playerId){
                var checkNullPosition = map_finder.findPlayerInPosition(gameSessions[selectSession], players[selectPlayer2]);
                if(checkNullPosition == position){
                    res.sendStatus(204);
                }else{

                    // Movement(player1)
                    //      - Delete the old player position
                    //      - Set player turn
                    //      - Set new player position(position_X, position_Y)
                    //      - Add player to the map by the new player position(position_X, position_Y) that already set up
                    //      - Check the buff(Attack up, Defend up), if player on that buff's positon

                    gameSessions[selectSession] = map_finder.findPlayerToDelete(oldPosition, gameSessions[selectSession]);
                    players[selectPlayer1].idle = false;
                    players[selectPlayer2].idle = true;
                    players[selectPlayer] = rawPosition;
                    gameSessions[selectSession] = map_finder.findPositionToAddPlayer(position, gameSessions[selectSession], players[selectPlayer]);
                    players[selectPlayer] = MAP.checkCollectAttackBuff(gameSessions[selectSession], players[selectPlayer]);
                    players[selectPlayer] = MAP.checkCollectDeffendBuff(gameSessions[selectSession], players[selectPlayer]);
                }
            }else if(players[selectPlayer].playerId == players[selectPlayer2].playerId){
                var checkNullPosition = map_finder.findPlayerInPosition(gameSessions[selectSession], players[selectPlayer1]);
                if(checkNullPosition == position){
                    res.sendStatus(204);
                }else{

                    // Movement(player2)
                    //      - Delete the old player position
                    //      - Set player turn
                    //      - Set new player position(position_X, position_Y)
                    //      - Add player to the map by the new player position(position_X, position_Y) that already set up
                    //      - Check the buff(Attack up, Defend up), if player on that buff's positon

                    gameSessions[selectSession] = map_finder.findPlayerToDelete(oldPosition, gameSessions[selectSession]);
                    players[selectPlayer1].idle = true;
                    players[selectPlayer2].idle = false;
                    players[selectPlayer] = rawPosition;
                    gameSessions[selectSession] = map_finder.findPositionToAddPlayer(position, gameSessions[selectSession], players[selectPlayer]);
                    players[selectPlayer] = MAP.checkCollectAttackBuff(gameSessions[selectSession], players[selectPlayer]);
                    players[selectPlayer] = MAP.checkCollectDeffendBuff(gameSessions[selectSession], players[selectPlayer]);
                }
            }else{
                res.sendStatus(204);
            }
        }else{
            res.sendStatus(204);
        }

        // Check state and the game ended

    }else if(gameSessions[selectSession].onState == false){
        if(gameSessions[selectSession].game == false){
            res.send(gameSessions[selectSession]);
        }else{
            res.sendStatus(204);
        }
    }else{
        res.sendStatus(204);
    }
});

// --Movement left(3)--

app.get('/player/:playerId/maps/game/:sessionId/addplayer/ingame/moveLeft', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    let selectPlayer1 = players.findIndex((x) => x.playerId == gameSessions[selectSession].player1);
    let selectPlayer2 = players.findIndex((x) => x.playerId == gameSessions[selectSession].player2);
   
    // Check state

    if(gameSessions[selectSession].onState == true){
        if(players[selectPlayer].idle == true){

            // Verify position have no player
            //      - Calculate player position by formular
            //      - Generate the new player position
            //      - Compare position

            var oldPosition = MAP.calculateMovement(players[selectPlayer].position_X, players[selectPlayer].position_Y);
            var rawPosition = MAP.movement(3, players[selectPlayer]);
            var position = MAP.calculateMovement(rawPosition.position_X, rawPosition.position_Y);
            if(players[selectPlayer].playerId == players[selectPlayer1].playerId){
                var checkNullPosition = map_finder.findPlayerInPosition(gameSessions[selectSession], players[selectPlayer2]);
                if(checkNullPosition == position){
                    res.sendStatus(204);
                }else{

                    // Movement(player1)
                    //      - Delete the old player position
                    //      - Set player turn
                    //      - Set new player position(position_X, position_Y)
                    //      - Add player to the map by the new player position(position_X, position_Y) that already set up
                    //      - Check the buff(Attack up, Defend up), if player on that buff's positon

                    gameSessions[selectSession] = map_finder.findPlayerToDelete(oldPosition, gameSessions[selectSession]);
                    players[selectPlayer1].idle = false;
                    players[selectPlayer2].idle = true;
                    players[selectPlayer] = rawPosition;
                    gameSessions[selectSession] = map_finder.findPositionToAddPlayer(position, gameSessions[selectSession], players[selectPlayer]);
                    players[selectPlayer] = MAP.checkCollectAttackBuff(gameSessions[selectSession], players[selectPlayer]);
                    players[selectPlayer] = MAP.checkCollectDeffendBuff(gameSessions[selectSession], players[selectPlayer]);
                }
            }else if(players[selectPlayer].playerId == players[selectPlayer2].playerId){
                var checkNullPosition = map_finder.findPlayerInPosition(gameSessions[selectSession], players[selectPlayer1]);
                if(checkNullPosition == position){
                    res.sendStatus(204);
                }else{

                    // Movement(player2)
                    //      - Delete the old player position
                    //      - Set player turn
                    //      - Set new player position(position_X, position_Y)
                    //      - Add player to the map by the new player position(position_X, position_Y) that already set up
                    //      - Check the buff(Attack up, Defend up), if player on that buff's positon

                    gameSessions[selectSession] = map_finder.findPlayerToDelete(oldPosition, gameSessions[selectSession]);
                    players[selectPlayer1].idle = true;
                    players[selectPlayer2].idle = false;
                    players[selectPlayer] = rawPosition;
                    gameSessions[selectSession] = map_finder.findPositionToAddPlayer(position, gameSessions[selectSession], players[selectPlayer]);
                    players[selectPlayer] = MAP.checkCollectAttackBuff(gameSessions[selectSession], players[selectPlayer]);
                    players[selectPlayer] = MAP.checkCollectDeffendBuff(gameSessions[selectSession], players[selectPlayer]);
                }
            }else{
                res.sendStatus(204);
            }
        }else{
            res.sendStatus(204);
        }

        // Check state and the game ended

    }else if(gameSessions[selectSession].onState == false){
        if(gameSessions[selectSession].game == false){
            res.send(gameSessions[selectSession]);
        }else{
            res.sendStatus(204);
        }
    }else{
        res.sendStatus(204);
    }
});

// --Movement right(4)--

app.get('/player/:playerId/maps/game/:sessionId/addplayer/ingame/moveRight', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    let selectPlayer1 = players.findIndex((x) => x.playerId == gameSessions[selectSession].player1);
    let selectPlayer2 = players.findIndex((x) => x.playerId == gameSessions[selectSession].player2);
   
    // Check state

    if(gameSessions[selectSession].onState == true){
        if(players[selectPlayer].idle == true){

            // Verify position have no player
            //      - Calculate player position by formular
            //      - Generate the new player position
            //      - Compare position

            var oldPosition = MAP.calculateMovement(players[selectPlayer].position_X, players[selectPlayer].position_Y);
            var rawPosition = MAP.movement(4, players[selectPlayer]);
            var position = MAP.calculateMovement(rawPosition.position_X, rawPosition.position_Y);
            if(players[selectPlayer].playerId == players[selectPlayer1].playerId){
                var checkNullPosition = map_finder.findPlayerInPosition(gameSessions[selectSession], players[selectPlayer2]);
                if(checkNullPosition == position){
                    res.sendStatus(204);
                }else{

                    // Movement(player1)
                    //      - Delete the old player position
                    //      - Set player turn
                    //      - Set new player position(position_X, position_Y)
                    //      - Add player to the map by the new player position(position_X, position_Y) that already set up
                    //      - Check the buff(Attack up, Defend up), if player on that buff's positon

                    gameSessions[selectSession] = map_finder.findPlayerToDelete(oldPosition, gameSessions[selectSession]);
                    players[selectPlayer1].idle = false;
                    players[selectPlayer2].idle = true;
                    players[selectPlayer] = rawPosition;
                    gameSessions[selectSession] = map_finder.findPositionToAddPlayer(position, gameSessions[selectSession], players[selectPlayer]);
                    players[selectPlayer] = MAP.checkCollectAttackBuff(gameSessions[selectSession], players[selectPlayer]);
                    players[selectPlayer] = MAP.checkCollectDeffendBuff(gameSessions[selectSession], players[selectPlayer]);
                }
            }else if(players[selectPlayer].playerId == players[selectPlayer2].playerId){
                var checkNullPosition = map_finder.findPlayerInPosition(gameSessions[selectSession], players[selectPlayer1]);
                if(checkNullPosition == position){
                    res.sendStatus(204);
                }else{

                    // Movement(player2)
                    //      - Delete the old player position
                    //      - Set player turn
                    //      - Set new player position(position_X, position_Y)
                    //      - Add player to the map by the new player position(position_X, position_Y) that already set up
                    //      - Check the buff(Attack up, Defend up), if player on that buff's positon

                    gameSessions[selectSession] = map_finder.findPlayerToDelete(oldPosition, gameSessions[selectSession]);
                    players[selectPlayer1].idle = true;
                    players[selectPlayer2].idle = false;
                    players[selectPlayer] = rawPosition;
                    gameSessions[selectSession] = map_finder.findPositionToAddPlayer(position, gameSessions[selectSession], players[selectPlayer]);
                    players[selectPlayer] = MAP.checkCollectAttackBuff(gameSessions[selectSession], players[selectPlayer]);
                    players[selectPlayer] = MAP.checkCollectDeffendBuff(gameSessions[selectSession], players[selectPlayer]);
                }
            }else{
                res.sendStatus(204);
            }
        }else{
            res.sendStatus(204);
        }

        // Check state and the game ended

    }else if(gameSessions[selectSession].onState == false){
        if(gameSessions[selectSession].game == false){
            res.send(gameSessions[selectSession]);
        }else{
            res.sendStatus(204);
        }
    }else{
        res.sendStatus(204);
    }
});

// --Attack system--

app.get('/player/:playerId/maps/game/:sessionId/addplayer/ingame/attack', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    let selectPlayer1 = players.findIndex((x) => x.playerId == gameSessions[selectSession].player1);
    let selectPlayer2 = players.findIndex((x) => x.playerId == gameSessions[selectSession].player2);

    // Check state
    if(players[selectPlayer].playerId == gameSessions[selectSession].player1 || players[selectPlayer].playerId == gameSessions[selectSession].player2){
        if(gameSessions[selectSession].onState == false){

            // Check state and the game ended

            if(gameSessions[selectSession].game == false){
                res.send(gameSessions[selectSession]);
            }else{
                res.sendStatus(204);
            }
        }else{

            // Attack opponent player
            //      - Find opponent Id function to get Id
            //      - Find there player in the system by findEnemyId function
            //      - Calculate damage system
            //      - Set turn
            //      - Check player alive status if player's health equal to 0 the game will end

            var enemyId = MAP.findEnemyId(gameSessions[selectSession], players[selectPlayer]);
            let selectEnemyPlayer = players.findIndex((x) => x.playerId == enemyId);
            players[selectEnemyPlayer] = MAP.attackEnemy(players[selectPlayer], players[selectEnemyPlayer]);
            players[selectPlayer].idle = false;
            gameSessions[selectSession] = state.end(players[selectEnemyPlayer], gameSessions[selectSession]);
            if(gameSessions[selectSession].game == false){
                res.send(gameSessions[selectSession]);
            }
        }
    }else{
        res.sendStatus(204);
    }
});

// --Game result monitor--

app.get('/player/:playerId/maps/game/:sessionId/addplayer/ingame/result', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    let selectPlayer1 = players.findIndex((x) => x.playerId == gameSessions[selectSession].player1);
    let selectPlayer2 = players.findIndex((x) => x.playerId == gameSessions[selectSession].player2);

    // Check player in Gamesession

    if(players[selectPlayer].playerId == gameSessions[selectSession].player1 || players[selectPlayer].playerId == gameSessions[selectSession].player2){
        console.log(players[selectPlayer].playerId);

        // Check player, who is the winner and losser,
        // then send the result page

        if(players[selectPlayer].playerId == gameSessions[selectSession].player1){
            if(players[selectPlayer].isAlive == true){
                res.sendFile(__dirname + '/index/winner.html');
            }else if(players[selectPlayer].isAlive == false){
                res.sendFile(__dirname + '/index/losser.html');
            }
        }else if(players[selectPlayer].playerId == gameSessions[selectSession].player2){
            if(players[selectPlayer].isAlive == true){
                res.sendFile(__dirname + '/index/winner.html');
            }else if(players[selectPlayer].isAlive == false){
                res.sendFile(__dirname + '/index/losser.html');
            }
        }else{
            res.sendStatus(204);
        }
    }else{
        res.sendStatus(304);
    }
});

// --Port connection--

app.listen('8080', function(){
    console.log("Server Started!");
});