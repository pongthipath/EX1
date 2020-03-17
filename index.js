// import the game session module ES6
const GameSession = require('./models/gamesession') ;
const Player = require('./models/player') ;
const MAP = require('./gameplay/map');
const app = require('express')();
const state = require('./gameplay/state');

// create some books and get their descriptions
let gameSessions = [];
let players = [];
let map = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index/index.html');
});

app.get('/result', function(req, res){
       let result = {
        'sessions': gameSessions,
        'players': players,
        'maps': map
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
    var newGameSessions = new GameSession();
    gameSessions.push(newGameSessions);
    res.send(gameSessions);
});

app.get('/game/delete/:sessionId', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    if(selectSession >= 0){
        gameSessions.splice(selectSession, 1);
        res.sendStatus(301);
    }else{
        res.sendStatus(204);
    }
});

app.get('/player/create', function(req, res){
    var newPlayer = new Player();
    players.push(newPlayer);
    res.send(players);
});

app.get('/player/:playerId/maps/delete', function(req, res){
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    if(selectPlayer >= 0){
        players.splice(selectPlayer, 1);
        res.send(players[selectPlayer]);
    }else{
        res.sendStatus(204);
    }
});

app.get('/player', function(req, res){
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    
});

app.get('/player/:playerId', function(req, res){
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    console.log(req.params.playerId);
    if(selectPlayer >= 0){
        res.send(players[selectPlayer]);
    }else{
        res.sendStatus(304);
    }
});

app.get('/player/:playerId/maps', function(req, res){
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    console.log(req.params.playerId);
    if(selectPlayer >= 0){
        res.sendFile(__dirname + '/index/gameSession.html');
    }else{
        res.sendStatus(304);
    }
});

app.get('/player/:playerId/maps/game/:sessionId/addplayer/ingame/delete', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    if(gameSessions[selectSession].player1 == players[selectPlayer].playerId){
        gameSessions[selectSession].player1 = undefined;
        res.send(players[selectPlayer]);
    }else if(gameSessions[selectSession].player2 == players[selectPlayer].playerId){
        gameSessions[selectSession].player2 = undefined;
        res.send(players[selectPlayer]);
    }else{
        res.sendStatus(204);
    }
});

app.get('/player/:playerId/maps/game/:sessionId/addplayer', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    if(gameSessions[selectSession].player1 == players[selectPlayer].playerId || gameSessions[selectSession].player2 == players[selectPlayer].playerId){
        res.sendStatus(204);
    }else if(gameSessions[selectSession].player1 == undefined || gameSessions[selectSession].player2 == undefined){
        if(gameSessions[selectSession].player1 === undefined ){
            gameSessions[selectSession].player1 = players[selectPlayer].playerId;
            console.log(gameSessions);
            res.send(gameSessions);
        }else if(gameSessions[selectSession].player1 !== undefined){
            gameSessions[selectSession].player2 = players[selectPlayer].playerId;
            console.log(gameSessions);
            res.send(gameSessions);
        }else{
            res.sendStatus(204);
        }
    }
});

app.get('/player/:playerId/maps/game/:sessionId/addplayer/ingame', function(req, res){
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    console.log(req.params.playerId);
    if(selectPlayer >= 0){
        res.sendFile(__dirname + '/index/gameplays_interface.html');
    }else{
        res.sendStatus(304);
    }
});

app.get('/player/:playerId/maps/game/:sessionId/addplayer/ingame/inmap', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    if(gameSessions[selectSession].player1 == players[selectPlayer].playerId || gameSessions[selectSession].player2 == players[selectPlayer].playerId){
        res.send(map);
    }
});

app.get('/player/:playerId/maps/game/:sessionId/addplayer/ingame/spawn', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    if(gameSessions[selectSession].player1 == players[selectPlayer].playerId || gameSessions[selectSession].player2 == players[selectPlayer].playerId){
        // if(players[selectPlayer].idle == false){
            players[selectPlayer] = MAP.spawnPlayerPosition(players[selectPlayer]);
            var position = MAP.calculateMovement(players[selectPlayer].position_X, players[selectPlayer].position_Y)
            map[position] = players[selectPlayer];
            console.log(map);
            res.send(gameSessions[selectSession]);
        // }else{
        //     res.sendStatus(204);
        // }
    }    
});

// app.get('/test/:playerId/', function(req, res){

//     let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
//     let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
//     const test = {
//         'playerId': 'sOvelRoe',
//         'attackPower': 1,
//         'defensePower': 1,
//         'health': 1,
//         'speed': 1,
//         'position_X': '1',
//         'position_Y': '1',
//         'isAlive': true,
//         'idle': false
//       }
//     // var obj = MAP.movement(1, test);
//     console.log(MAP.movement(1, test));
//     // res.send(MAP.movement(1, test));
// });

app.get('/game/:sessionId/player/:playerId1/:playerId2/state', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer1 = players.findIndex((x) => x.playerId == req.params.playerId1);
    let selectPlayer2 = players.findIndex((x) => x.playerId == req.params.playerId2);
    if(gameSessions[selectSession].player1 == players[selectPlayer1].playerId || gameSessions[selectSession].player2 == players[selectPlayer2].playerId || gameSessions[selectSession].player2 == players[selectPlayer1].playerId || gameSessions[selectSession].player1 == players[selectPlayer2].playerId){
        gameSessions[selectSession] = state.init(gameSessions[selectSession], players[selectPlayer1], players[selectPlayer2]); 
        console.log(gameSessions[selectSession]);
        res.send(gameSessions[selectSession]);
    }
});

app.get('/player/:playerId/maps/game/:sessionId/addplayer/ingame/moveUp', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    if(gameSessions[selectSession].onState == true){
        var posXNow = players[selectPlayer].position_X;
        var posYNow = players[selectPlayer].position_Y;
        var posNow = MAP.calculateMovement(posXNow, posYNow);
        map.splice(posNow);
        var position = MAP.movement(1, players[selectPlayer]);
        console.log(position.posY);
        players[selectPlayer].position_Y = position.posY;
        map[MAP.calculateMovement(position.posX, position.posY)] = players[selectPlayer];
        console.log(players[selectPlayer]);
        res.send(map);
    }else{
        res.sendStatus(204);
    }
});

app.get('/player/:playerId/maps/game/:sessionId/addplayer/ingame/moveDown', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    if(gameSessions[selectSession].onState == true){
        var posXNow = players[selectPlayer].position_X;
        var posYNow = players[selectPlayer].position_Y;
        var posNow = MAP.calculateMovement(posXNow, posYNow);
        map.splice(posNow);
        var position = MAP.movement(2, players[selectPlayer]);
        console.log(position.posY);
        players[selectPlayer].position_Y = position.posY;
        map[MAP.calculateMovement(position.posX, position.posY)] = players[selectPlayer];
        console.log(players[selectPlayer]);
        res.send(map);
    }else{
        res.sendStatus(204);
    }
});

app.get('/player/:playerId/maps/game/:sessionId/addplayer/ingame/moveLeft', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    if(gameSessions[selectSession].onState == true){
        var posXNow = players[selectPlayer].position_X;
        var posYNow = players[selectPlayer].position_Y;
        var posNow = MAP.calculateMovement(posXNow, posYNow);
        map.splice(posNow);
        var position = MAP.movement(3, players[selectPlayer]);
        console.log(position.posX);
        players[selectPlayer].position_X = position.posX;
        map[MAP.calculateMovement(position.posX, position.posY)] = players[selectPlayer];
        console.log(players[selectPlayer]);
        res.send(map);
    }else{
        res.sendStatus(204);
    }
});

app.get('/player/:playerId/maps/game/:sessionId/addplayer/ingame/moveRight', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    if(gameSessions[selectSession].onState == true){
        var posXNow = players[selectPlayer].position_X;
        var posYNow = players[selectPlayer].position_Y;
        var posNow = MAP.calculateMovement(posXNow, posYNow);
        map.splice(posNow);
        var position = MAP.movement(4, players[selectPlayer]);
        console.log(position.posX);
        players[selectPlayer].position_X = position.posX;
        map[MAP.calculateMovement(position.posX, position.posY)] = players[selectPlayer];
        console.log(players[selectPlayer]);
        res.send(map);
    }else{
        res.sendStatus(204);
    }
});

app.listen('8080', function(){
    console.log("Server Started!");
});