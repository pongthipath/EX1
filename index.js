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
    let result = 'Game server prototype1 \n';
    result += 'Total Sessions = '+ gameSessions.length + '\n' + JSON.stringify(gameSessions) + '\n';
    result += 'Total Players = '+ players.length + '\n' + JSON.stringify(players) + '\n';
    result += 'Players in Map = '+ map.length + '\n' + JSON.stringify(map) + '\n';
    res.set('Content-Type', 'text/plain');
    res.send(result);
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

app.get('/player/delete/:playerId', function(req, res){
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    if(selectPlayer >= 0){
        players.splice(selectPlayer, 1);
        res.sendStatus(301);
    }else{
        res.sendStatus(204);
    }
});

app.get('/player/:playerId', function(req, res){
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    if(selectPlayer >= 0){
        res.send(players[selectPlayer]);
    }else{
        res.sendStatus(304);
    }
});

app.get('/maps', function(req, res){
    res.send(map);
});

app.get('/game/:sessionId/player/:playerId/addplayer', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    if(gameSessions[selectSession].player1 === undefined ){
        gameSessions[selectSession].player1 = players[selectPlayer].playerId;
    }else if(gameSessions[selectSession].player1 !== undefined){
        gameSessions[selectSession].player2 = players[selectPlayer].playerId;
    }
    console.log(gameSessions);
    res.send(gameSessions);
});

app.get('/player/:playerId/spawn/:posX/:posY', function(req, res){
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    var posX = req.params.posX;
    var posY = req.params.posY;
    var pos = MAP.calculateMovement(posX, posY);
    console.log(pos);
    if(pos > 8){
        res.sendStatus(304);
    }else{
        players[selectPlayer].position_X = posX;
        players[selectPlayer].position_Y = posY;
        players[selectPlayer].idle = true;
        if(players[selectPlayer].playerId === req.params.playerId){
            console.log(players);
            map[pos] = players[selectPlayer];
            res.send(map);
        } 
    }
});

app.get('/test/:playerId/', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    const test = {
        'playerId': 'sOvelRoe',
        'attackPower': 1,
        'defensePower': 1,
        'health': 1,
        'speed': 1,
        'position_X': '1',
        'position_Y': '1',
        'isAlive': true,
        'idle': false
      }
    // var obj = MAP.movement(1, test);
    console.log(MAP.movement(1, test));
    // res.send(MAP.movement(1, test));
});

app.get('/game/:sessionId/player/:playerId1/:playerId2/state', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer1 = players.findIndex((x) => x.playerId == req.params.playerId1);
    let selectPlayer2 = players.findIndex((x) => x.playerId == req.params.playerId2);
    if(gameSessions[selectSession].player1 == players[selectPlayer1].playerId && players[selectPlayer1].idle == true){
        if(gameSessions[selectSession].player2 == players[selectPlayer2].playerId && players[selectPlayer2].idle == true){
            gameSessions[selectSession].onState = state.start(gameSessions[selectSession].onState);
            console.log(gameSessions);
            res.send(gameSessions[selectSession]);
        }
    }
});

app.get('/game/:sessionId/player/:playerId/moveUp', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    var posX = players[selectPlayer].position_X;
    var posY = players[selectPlayer].position_Y;
    var pos = MAP.calculateMovement(posX, posY);
    map.splice(pos);
    map[MAP.movement(1, players[selectPlayer])] = players[selectPlayer];
    players[selectPlayer].position_Y = Math.sqrt((posY + players[selectPlayer].speed) * (posY + players[selectPlayer].speed));
    res.send(map);
});

app.get('/game/:sessionId/player/:playerId/moveDown', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    var posX = players[selectPlayer].position_X;
    var posY = players[selectPlayer].position_Y;
    var pos = MAP.calculateMovement(posX, posY);
    map.splice(pos);
    map[MAP.movement(2, players[selectPlayer])] = players[selectPlayer];
    players[selectPlayer].position_Y = Math.sqrt((posY - players[selectPlayer].speed) * (posY - players[selectPlayer].speed));
    res.send(map);
});

app.get('/game/:sessionId/player/:playerId/moveLeft', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    var posX = players[selectPlayer].position_X;
    var posY = players[selectPlayer].position_Y;
    var pos = MAP.calculateMovement(posX, posY);
    map.splice(pos);
    map[MAP.movement(3, players[selectPlayer])] = players[selectPlayer];
    players[selectPlayer].position_Y = Math.sqrt((posX - players[selectPlayer].speed) * (posX - players[selectPlayer].speed));
    res.send(map);
});

app.get('/game/:sessionId/player/:playerId/moveRight', function(req, res){
    let selectSession = gameSessions.findIndex((x) => x.sessionId == req.params.sessionId);
    let selectPlayer = players.findIndex((x) => x.playerId == req.params.playerId);
    var posX = players[selectPlayer].position_X;
    var posY = players[selectPlayer].position_Y;
    var pos = MAP.calculateMovement(posX, posY);
    map.splice(pos);
    map[MAP.movement(4, players[selectPlayer])] = players[selectPlayer];
    players[selectPlayer].position_Y = Math.sqrt((posX + players[selectPlayer].speed) * (posX + players[selectPlayer].speed));
    res.send(map);
});

app.listen('8080', function(){
    console.log("Server Started!");
});