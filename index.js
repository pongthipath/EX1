const GameSession = require('./models/gamesession') ;
const Player = require('./models/player');
const map_finder = require('./gameplay/map_finder');
const MAP = require('./gameplay/map');
const app = require('express')();
const state = require('./gameplay/state');
const save_load = require('./save_load/save_load');
const save_load_player = require('./save_load/save_load_Player');
const fs = require('fs');

let gameSessions = save_load.loadAllFile();
let players = save_load_player.loadAllFile();

setInterval(function(){
    gameSessions = save_load.loadAllFile();
    players = save_load_player.loadAllFile();
    // console.log("Updated!");
}, 1000);

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
    save_load.saveFile(newGameSessions);
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
    save_load_player.saveFile(newPlayer);
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
    let game = gameSessions[selectSession];
    let currentPlayer = players[selectPlayer];
    let player1FromGS = players[selectPlayer1];
    let player2FromGS = players[selectPlayer2];

    if(gameSessions[selectSession].player1 == players[selectPlayer].playerId){
        currentPlayer.idle = false;
        var position = MAP.calculateMovement(players[selectPlayer].position_X, players[selectPlayer].position_Y);
        game = map_finder.findPlayerToDelete(position, gameSessions[selectSession]);
        game = state.init(gameSessions[selectSession], players[selectPlayer1], players[selectPlayer2]);
        game.player1 = null;
        save_load.saveGameSessionAAT(game);
        save_load_player.updatePlayer(currentPlayer);
        res.send(players[selectPlayer]);
    }else if(gameSessions[selectSession].player2 == players[selectPlayer].playerId){
        currentPlayer.idle = false;
        var position = MAP.calculateMovement(players[selectPlayer].position_X, players[selectPlayer].position_Y);
        game = map_finder.findPlayerToDelete(position, gameSessions[selectSession]);
        game = state.init(gameSessions[selectSession], players[selectPlayer1], players[selectPlayer2]);
        game.player2 = null;
        save_load.saveGameSessionAAT(game);
        save_load_player.updatePlayer(currentPlayer);
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

    var game = gameSessions[selectSession];
    var currentPlayer = players[selectPlayer];

    // Check playerId in Gamesession and current player are match

        // Check player in Gamesession 

        // If have player in player1, it will add player in player2.
        // If not, it will add into player1

        // Then, add current playerId in Gamesession

    if(gameSessions[selectSession].player1 == null || gameSessions[selectSession].player2 == null){
        if(gameSessions[selectSession].player1 == null ){
            game.player1 = currentPlayer.playerId;
            save_load.saveGameSessionAAT(game);
            save_load_player.updatePlayer(currentPlayer);
            res.send(gameSessions[selectSession]);
        }else if(gameSessions[selectSession].player1 !== null){
            game.player2 = currentPlayer.playerId;
            save_load.saveGameSessionAAT(game);
            save_load_player.updatePlayer(currentPlayer);
            res.send(gameSessions[selectSession]);
        }else{
            res.sendStatus(204);
        }
    }else{
        res.sendStatus(204);
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
        // save_load.saveGameSessionAAT(gameSessions[selectSession]);
        res.send(gameSessions[selectSession]);
    }
});

// --Spawn player to the map--
app.get('/player/:playerId/maps/game/:sessionId/addplayer/ingame/spawn', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    let selectPlayer1 = players.findIndex((x) => x.playerId == gameSessions[selectSession].player1);
    let selectPlayer2 = players.findIndex((x) => x.playerId == gameSessions[selectSession].player2);


    let game = gameSessions[selectSession];
    let currentPlayer = players[selectPlayer];
    let player1FromGS = players[selectPlayer1];
    let player2FromGS = players[selectPlayer2];

    // Check player in Gamesession 
    // Find player in map
    //  -If not have any player in the map --> Spawn player
    //  -If have 1 player in the map --> Check the position that will spawn the second player by random spawn function, if already have a player in there position 
    //      --> random until it's not have another player in that position.

    if(gameSessions[selectSession].player1 == players[selectPlayer].playerId || gameSessions[selectSession].player2 == players[selectPlayer].playerId){
        var countPlayer = map_finder.playerCount(game);
        if(countPlayer < 1){
            var playerSpawnPosition = MAP.spawnPlayerPosition(currentPlayer, game);
            currentPlayer = playerSpawnPosition;
            var position = MAP.calculateMovement(currentPlayer.position_X, currentPlayer.position_Y);
            game = map_finder.findPositionToAddPlayer(position, game, currentPlayer);
            save_load.saveGameSessionAAT(game);
            save_load_player.updatePlayer(currentPlayer);
            res.send(gameSessions[selectSession]);
        }else if(countPlayer < 2){
            var playerSpawnPosition = MAP.spawnPlayerPosition(currentPlayer, game);
            var position = MAP.calculateMovement(playerSpawnPosition.position_X, playerSpawnPosition.position_Y);
            var player1Position = map_finder.findPlayerInPosition(game, player1Position);
            if(position == player1Position){
                res.sendStatus(204);
            }else{
                currentPlayer = playerSpawnPosition;
                game = map_finder.findPositionToAddPlayer(position, game, currentPlayer);
                save_load.saveGameSessionAAT(game);
                save_load_player.updatePlayer(currentPlayer);
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

    let game = gameSessions[selectSession];
    let player1FromGS = players[selectPlayer1];
    let player2FromGS = players[selectPlayer2];

    if(game.player1 == player1FromGS.playerId || game.player2 == player2FromGS.playerId || game.player2 == player1FromGS.playerId || game.player1 == player2FromGS.playerId){
        console.log(game);
        console.log(player1FromGS);
        console.log(player2FromGS);
        game = state.init(game, player1FromGS, player2FromGS);
        game = MAP.spawnBuffPosition(game);
        save_load.saveGameSessionAAT(game);
        res.send(gameSessions[selectSession]);
    }else{
        game = state.init(game, player1FromGS, player2FromGS);
        save_load.saveGameSessionAAT(game);
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

    let game = gameSessions[selectSession];
    let currentPlayer = players[selectPlayer];
    let player1FromGS = players[selectPlayer1];
    let player2FromGS = players[selectPlayer2];

    // Check state

    if(game.onState == true){
        if(currentPlayer.idle == true){

            // Verify position have no player
            //      - Calculate player position by formular
            //      - Generate the new player position
            //      - Compare position

            var oldPosition = MAP.calculateMovement(currentPlayer.position_X, currentPlayer.position_Y);
            var rawPosition = MAP.movement(1, currentPlayer);
            var position = MAP.calculateMovement(rawPosition.position_X, rawPosition.position_Y);
            if(currentPlayer.playerId == player1FromGS.playerId){
                var checkNullPosition = map_finder.findPlayerInPosition(game, player2FromGS);
                if(checkNullPosition == position){
                    res.sendStatus(204);
                }else{

                    // Movement(player1)
                    //      - Delete the old player position
                    //      - Set player turn
                    //      - Set new player position(position_X, position_Y)
                    //      - Add player to the map by the new player position(position_X, position_Y) that already set up
                    //      - Check the buff(Attack up, Defend up), if player on that buff's positon

                    game = map_finder.findPlayerToDelete(oldPosition, game);
                    player1FromGS.idle = false;
                    player2FromGS.idle = true;
                    currentPlayer = rawPosition;
                    game = map_finder.findPositionToAddPlayer(position, game, currentPlayer);
                    currentPlayer = MAP.checkCollectAttackBuff(game, currentPlayer);
                    currentPlayer = MAP.checkCollectDeffendBuff(game, currentPlayer);
                    save_load.saveGameSessionAAT(game);
                    save_load_player.updatePlayer(currentPlayer);
                    save_load_player.updatePlayer(player1FromGS);
                    save_load_player.updatePlayer(player2FromGS);
                }
            }else if(currentPlayer.playerId == player2FromGS.playerId){
                var checkNullPosition = map_finder.findPlayerInPosition(game, player1FromGS);
                if(checkNullPosition == position){
                    res.sendStatus(204);
                }else{

                    // Movement(player2)
                    //      - Delete the old player position
                    //      - Set player turn
                    //      - Set new player position(position_X, position_Y)
                    //      - Add player to the map by the new player position(position_X, position_Y) that already set up
                    //      - Check the buff(Attack up, Defend up), if player on that buff's positon

                    game = map_finder.findPlayerToDelete(oldPosition, game);
                    player1FromGS.idle = true;
                    player2FromGS.idle = false;
                    currentPlayer = rawPosition;
                    game = map_finder.findPositionToAddPlayer(position, game, currentPlayer);
                    currentPlayer = MAP.checkCollectAttackBuff(game, currentPlayer);
                    currentPlayer = MAP.checkCollectDeffendBuff(game, currentPlayer);
                    save_load.saveGameSessionAAT(game);
                    save_load_player.updatePlayer(currentPlayer);
                    save_load_player.updatePlayer(player1FromGS);
                    save_load_player.updatePlayer(player2FromGS);
                }
            }else{
                res.sendStatus(204);
            }
        }else{
            res.sendStatus(204);
        }

        // Check state and the game ended

    }else if(game.onState == false){
        if(game.game == false){
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

    let game = gameSessions[selectSession];
    let currentPlayer = players[selectPlayer];
    let player1FromGS = players[selectPlayer1];
    let player2FromGS = players[selectPlayer2];

    // Check state

    if(game.onState == true){
        if(currentPlayer.idle == true){

            // Verify position have no player
            //      - Calculate player position by formular
            //      - Generate the new player position
            //      - Compare position

            var oldPosition = MAP.calculateMovement(currentPlayer.position_X, currentPlayer.position_Y);
            var rawPosition = MAP.movement(2, currentPlayer);
            var position = MAP.calculateMovement(rawPosition.position_X, rawPosition.position_Y);
            if(currentPlayer.playerId == player1FromGS.playerId){
                var checkNullPosition = map_finder.findPlayerInPosition(game, player2FromGS);
                if(checkNullPosition == position){
                    res.sendStatus(204);
                }else{

                    // Movement(player1)
                    //      - Delete the old player position
                    //      - Set player turn
                    //      - Set new player position(position_X, position_Y)
                    //      - Add player to the map by the new player position(position_X, position_Y) that already set up
                    //      - Check the buff(Attack up, Defend up), if player on that buff's positon

                    game = map_finder.findPlayerToDelete(oldPosition, game);
                    player1FromGS.idle = false;
                    player2FromGS.idle = true;
                    currentPlayer = rawPosition;
                    game = map_finder.findPositionToAddPlayer(position, game, currentPlayer);
                    currentPlayer = MAP.checkCollectAttackBuff(game, currentPlayer);
                    currentPlayer = MAP.checkCollectDeffendBuff(game, currentPlayer);
                    save_load.saveGameSessionAAT(game);
                    save_load_player.updatePlayer(currentPlayer);
                    save_load_player.updatePlayer(player1FromGS);
                    save_load_player.updatePlayer(player2FromGS);
                }
            }else if(currentPlayer.playerId == player2FromGS.playerId){
                var checkNullPosition = map_finder.findPlayerInPosition(game, player1FromGS);
                if(checkNullPosition == position){
                    res.sendStatus(204);
                }else{

                    // Movement(player2)
                    //      - Delete the old player position
                    //      - Set player turn
                    //      - Set new player position(position_X, position_Y)
                    //      - Add player to the map by the new player position(position_X, position_Y) that already set up
                    //      - Check the buff(Attack up, Defend up), if player on that buff's positon

                    game = map_finder.findPlayerToDelete(oldPosition, game);
                    player1FromGS.idle = true;
                    player2FromGS.idle = false;
                    currentPlayer = rawPosition;
                    game = map_finder.findPositionToAddPlayer(position, game, currentPlayer);
                    currentPlayer = MAP.checkCollectAttackBuff(game, currentPlayer);
                    currentPlayer = MAP.checkCollectDeffendBuff(game, currentPlayer);
                    save_load.saveGameSessionAAT(game);
                    save_load_player.updatePlayer(currentPlayer);
                    save_load_player.updatePlayer(player1FromGS);
                    save_load_player.updatePlayer(player2FromGS);
                }
            }else{
                res.sendStatus(204);
            }
        }else{
            res.sendStatus(204);
        }

        // Check state and the game ended

    }else if(game.onState == false){
        if(game.game == false){
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

    let game = gameSessions[selectSession];
    let currentPlayer = players[selectPlayer];
    let player1FromGS = players[selectPlayer1];
    let player2FromGS = players[selectPlayer2];
   
    // Check state

    if(game.onState == true){
        if(currentPlayer.idle == true){

            // Verify position have no player
            //      - Calculate player position by formular
            //      - Generate the new player position
            //      - Compare position

            var oldPosition = MAP.calculateMovement(currentPlayer.position_X, currentPlayer.position_Y);
            var rawPosition = MAP.movement(3, currentPlayer);
            var position = MAP.calculateMovement(rawPosition.position_X, rawPosition.position_Y);
            if(currentPlayer.playerId == player1FromGS.playerId){
                var checkNullPosition = map_finder.findPlayerInPosition(game, player2FromGS);
                if(checkNullPosition == position){
                    res.sendStatus(204);
                }else{

                    // Movement(player1)
                    //      - Delete the old player position
                    //      - Set player turn
                    //      - Set new player position(position_X, position_Y)
                    //      - Add player to the map by the new player position(position_X, position_Y) that already set up
                    //      - Check the buff(Attack up, Defend up), if player on that buff's positon

                    game = map_finder.findPlayerToDelete(oldPosition, game);
                    player1FromGS.idle = false;
                    player2FromGS.idle = true;
                    currentPlayer = rawPosition;
                    game = map_finder.findPositionToAddPlayer(position, game, currentPlayer);
                    currentPlayer = MAP.checkCollectAttackBuff(game, currentPlayer);
                    currentPlayer = MAP.checkCollectDeffendBuff(game, currentPlayer);
                    save_load.saveGameSessionAAT(game);
                    save_load_player.updatePlayer(currentPlayer);
                    save_load_player.updatePlayer(player1FromGS);
                    save_load_player.updatePlayer(player2FromGS);
                }
            }else if(currentPlayer.playerId == player2FromGS.playerId){
                var checkNullPosition = map_finder.findPlayerInPosition(game, player1FromGS);
                if(checkNullPosition == position){
                    res.sendStatus(204);
                }else{

                    // Movement(player2)
                    //      - Delete the old player position
                    //      - Set player turn
                    //      - Set new player position(position_X, position_Y)
                    //      - Add player to the map by the new player position(position_X, position_Y) that already set up
                    //      - Check the buff(Attack up, Defend up), if player on that buff's positon

                    game = map_finder.findPlayerToDelete(oldPosition, game);
                    player1FromGS.idle = true;
                    player2FromGS.idle = false;
                    currentPlayer = rawPosition;
                    game = map_finder.findPositionToAddPlayer(position, game, currentPlayer);
                    currentPlayer = MAP.checkCollectAttackBuff(game, currentPlayer);
                    currentPlayer = MAP.checkCollectDeffendBuff(game, currentPlayer);
                    save_load.saveGameSessionAAT(game);
                    save_load_player.updatePlayer(currentPlayer);
                    save_load_player.updatePlayer(player1FromGS);
                    save_load_player.updatePlayer(player2FromGS);
                }
            }else{
                res.sendStatus(204);
            }
        }else{
            res.sendStatus(204);
        }

        // Check state and the game ended

    }else if(game.onState == false){
        if(game.game == false){
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

    let game = gameSessions[selectSession];
    let currentPlayer = players[selectPlayer];
    let player1FromGS = players[selectPlayer1];
    let player2FromGS = players[selectPlayer2];
   
    // Check state

    if(game.onState == true){
        if(currentPlayer.idle == true){

            // Verify position have no player
            //      - Calculate player position by formular
            //      - Generate the new player position
            //      - Compare position

            var oldPosition = MAP.calculateMovement(currentPlayer.position_X, currentPlayer.position_Y);
            var rawPosition = MAP.movement(4, currentPlayer);
            var position = MAP.calculateMovement(rawPosition.position_X, rawPosition.position_Y);
            if(currentPlayer.playerId == player1FromGS.playerId){
                var checkNullPosition = map_finder.findPlayerInPosition(game, player2FromGS);
                if(checkNullPosition == position){
                    res.sendStatus(204);
                }else{

                    // Movement(player1)
                    //      - Delete the old player position
                    //      - Set player turn
                    //      - Set new player position(position_X, position_Y)
                    //      - Add player to the map by the new player position(position_X, position_Y) that already set up
                    //      - Check the buff(Attack up, Defend up), if player on that buff's positon

                    game = map_finder.findPlayerToDelete(oldPosition, game);
                    player1FromGS.idle = false;
                    player2FromGS.idle = true;
                    currentPlayer = rawPosition;
                    game = map_finder.findPositionToAddPlayer(position, game, currentPlayer);
                    currentPlayer = MAP.checkCollectAttackBuff(game, currentPlayer);
                    currentPlayer = MAP.checkCollectDeffendBuff(game, currentPlayer);
                    save_load.saveGameSessionAAT(game);
                    save_load_player.updatePlayer(currentPlayer);
                    save_load_player.updatePlayer(player1FromGS);
                    save_load_player.updatePlayer(player2FromGS);
                }
            }else if(currentPlayer.playerId == player2FromGS.playerId){
                var checkNullPosition = map_finder.findPlayerInPosition(game, player1FromGS);
                if(checkNullPosition == position){
                    res.sendStatus(204);
                }else{

                    // Movement(player2)
                    //      - Delete the old player position
                    //      - Set player turn
                    //      - Set new player position(position_X, position_Y)
                    //      - Add player to the map by the new player position(position_X, position_Y) that already set up
                    //      - Check the buff(Attack up, Defend up), if player on that buff's positon

                    game = map_finder.findPlayerToDelete(oldPosition, game);
                    player1FromGS.idle = true;
                    player2FromGS.idle = false;
                    currentPlayer = rawPosition;
                    game = map_finder.findPositionToAddPlayer(position, game, currentPlayer);
                    currentPlayer = MAP.checkCollectAttackBuff(game, currentPlayer);
                    currentPlayer = MAP.checkCollectDeffendBuff(game, currentPlayer);
                    save_load.saveGameSessionAAT(game);
                    save_load_player.updatePlayer(currentPlayer);
                    save_load_player.updatePlayer(player1FromGS);
                    save_load_player.updatePlayer(player2FromGS);
                }
            }else{
                res.sendStatus(204);
            }
        }else{
            res.sendStatus(204);
        }

        // Check state and the game ended

    }else if(game.onState == false){
        if(game.game == false){
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

    let game = gameSessions[selectSession];
    let currentPlayer = players[selectPlayer];
    let player1FromGS = players[selectPlayer1];
    let player2FromGS = players[selectPlayer2];

    // Check state
    if(players[selectPlayer].playerId == gameSessions[selectSession].player1 || players[selectPlayer].playerId == gameSessions[selectSession].player2){
        if(game.onState == false){

            // Check state and the game ended

            if(game.game == false){
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

            var enemyId = MAP.findEnemyId(game, currentPlayer);
            let selectEnemyPlayer = players.findIndex((x) => x.playerId == enemyId);
            players[selectEnemyPlayer] = MAP.attackEnemy(currentPlayer, players[selectEnemyPlayer]);
            currentPlayer.idle = false;
            game = state.end(players[selectEnemyPlayer], game);
            save_load.saveGameSessionAAT(game);
            save_load_player.updatePlayer(currentPlayer);
            save_load_player.updatePlayer(players[selectEnemyPlayer]);
            if(game.game == false){
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

    let game = gameSessions[selectSession];
    let currentPlayer = players[selectPlayer];
    let player1FromGS = players[selectPlayer1];
    let player2FromGS = players[selectPlayer2];

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