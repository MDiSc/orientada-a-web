import { WebSocketServer, WebSocket } from 'ws';

const wsServer = new WebSocketServer({ port: 8080 });
const players = new Map();
const games = {};

function iteratePlayers(gameId, callback) {
    const game = games[gameId]; // Busca el juego por su ID

    if (!game) {
        console.error(`No se encontró el juego con ID: ${gameId}`);
        return;
    }

    // Recorre la lista de jugadores
    game.players.forEach((playerId) => {
        callback(playerId); // Ejecuta la función callback para cada jugador
    });
}

function sendMessage(socket, message) {
    const messageString = JSON.stringify(message);
    socket.send(messageString);
    console.log(`Sent to ${socket.url}: ${messageString}`);
}

function generateGameId() {
    return Math.random().toString(36).substring(2, 10);
}

function handleCreateGame(gameId,creatorId) {
    // Se genera un ID de juego único y se crea un nuevo juego con el jugador como único participante.
    
    games[gameId] = { id: gameId, players: [creatorId], started: false, turn: 0 };

    // Se envía un mensaje de confirmación al jugador.
    const targetWsSendGameCreateed = players.get(creatorId);
    targetWsSendGameCreateed.send(`{ "type": "gameCreated", "gameId": ${gameId}, "creatorId": ${creatorId} }`);
}

function handleJoinGame(socket, gameId) {
    const game = games[gameId];
    if (!game) {
        sendMessage(socket, { type: 'error', message: 'Game not found' });
        return;
    }
    if (game.players.length >= 4) {
        sendMessage(socket, { type: 'error', message: 'Game is full' });
        return;
    }
    game.players.push(socket);
    game.players.forEach((player) => {
        if (player !== socket) {
            sendMessage(player, { type: 'playerJoined', gameId, playerCount: game.players.length });
        }
    });
    sendMessage(socket, { type: 'playerJoined', gameId, playerCount: game.players.length });
}

wsServer.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        console.log('Raw data received:', data.toString());

        let parsedData;
        try {
            parsedData = JSON.parse(data);
        } catch (e) {
            console.error('Error parsing JSON:', e, 'Data received:', data);
            return;
        }

        if (!parsedData.type) {
            console.error('Invalid message: missing type', parsedData);
            return;
        }

        try {
            switch(parsedData.type){
                case 'connection':
                    if (!parsedData.playerId) {
                        console.error('Invalid connection message: missing playerId', parsedData);
                        return;
                    }
                    console.log(parsedData.playerUsername,' connected with id: ', parsedData.playerId);
                    players.set(parsedData.playerId, ws);
                    break;
                case 'create-game':
                    if (!parsedData.gameId || !parsedData.playerId) {
                        console.error('Invalid create-game message: missing gameId or playerId', parsedData);
                        return;
                    }
                    console.log('Game created game with id: ', parsedData.gameId, ' and player id: ', parsedData.playerId);
                    handleCreateGame(parsedData.gameId,parsedData.playerId);
                    const targetWsSendGameCreated = players.get(parsedData.playerId);
                    targetWsSendGameCreated.send(JSON.stringify(parsedData));
                    break;
                case 'join-game':
                    if (!parsedData.gameId || !parsedData.playerId) {
                        console.error('Invalid join-game message: missing gameId or playerId', parsedData);
                        return;
                    }
                    console.log('Player joined game with id: ', parsedData.gameId, ' and player id: ', parsedData.playerId);
                    players.set(parsedData.playerId, ws);
                    iteratePlayers(parsedData.gameId, (playerId) => {
                        const targetWsJoiningPlayer = playerId;
                        targetWsJoiningPlayer.send(JSON.stringify(parsedData));
                    });
                    break;
                case 'send-move':
                    if (!parsedData.coordinates || !parsedData.gameId || !parsedData.sender || !parsedData.receiver) {
                        console.error('Invalid send-move message: missing coordinates, gameId, sender, or receiver', parsedData);
                        return;
                    }
                    console.log('Move sent: ', parsedData.coordinates, 'game id: ', parsedData.gameId, 'from player: ', parsedData.sender);
                    const targetWsSendMove = players.get(parsedData.receiver);
                    if (targetWsSendMove && targetWsSendMove.readyState === WebSocket.OPEN) {
                        targetWsSendMove.send(JSON.stringify(parsedData));
                    } else {
                        console.log('Player not connected or WebSocket not open');
                    }
                    break;           
                case 'move':
                    if (!parsedData.coordinates || !parsedData.gameId || !parsedData.sender || !parsedData.receiver) {
                        console.error('Invalid move message: missing coordinates, gameId, sender, or receiver', parsedData);
                        return;
                    }
                    console.log('Move received: ', parsedData);
                    console.log('Sending move to player: ', parsedData.receiver);
                    const targetWs = players.get(parsedData.receiver);
                    if (targetWs && targetWs.readyState === WebSocket.OPEN) {
                        targetWs.send(JSON.stringify(parsedData));
                    } else {
                        console.log('Player not connected or WebSocket not open');
                    }
                    break;
                default:
                    console.log('Unknown message type: ', parsedData);
            }
        } catch (e) {
            console.error('Error handling message:', e, 'Parsed data:', parsedData);
        }
    });

    ws.on('close', () => {
        try {
            for (const [playerId, clientWs] of players.entries()) {
                if (clientWs === ws) {
                    players.delete(playerId);
                    break;
                }
            }
        } catch (e) {
            console.error('Error handling close event:', e);
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});