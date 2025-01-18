import { WebSocketServer, WebSocket } from 'ws';

const players = new Map();
const games = new Map();

/**
 * Genera un ID de sala aleatorio de 8 caracteres de longitud.
 *
 * @returns {string} - Un ID de sala generado aleatoriamente.
 */
function generateGameId() {
    return Math.random().toString(36).substring(2, 10);
}

/**
 * Envía un mensaje a través de la conexión WebSocket y lo imprime en la consola.
 *
 * @param {WebSocket} socket - La conexión WebSocket del jugador.
 * @param {Object} message - El mensaje a enviar.
 */
function sendMessage(socket, message) {
    const messageString = JSON.stringify(message);
    socket.send(messageString);
    console.log(`Sent to ${socket.url}: ${messageString}`);
}

/**
 * Maneja la creación de un nuevo juego.
 *
 * @param {WebSocket} socket - La conexión WebSocket del jugador.
 * @param {string} playerId - El ID del jugador que crea el juego.
 */
function handleCreateGame(socket, playerId) {
    let gameId;
    do {
        gameId = generateGameId();
    } while (games.has(gameId));

    const game = { id: gameId, players: [playerId], started: false, turn: 0 };
    games.set(gameId, game);
    players.set(playerId, socket);
    sendMessage(socket, { type: 'create-game', gameId, creatorId: playerId });
    console.log(`Game created with ID: ${gameId} by player: ${playerId}`);
}

/**
 * Maneja la unión a un juego existente.
 *
 * @param {WebSocket} socket - La conexión WebSocket del jugador.
 * @param {string} gameId - El ID del juego al que unirse.
 * @param {string} playerId - El ID del jugador que se une al juego.
 */
function handleJoinGame(socket, gameId, joiner) {
    const game = games.get(gameId);
    if (!game) {
        sendMessage(socket, { type: 'error', message: 'Game not found' });
        return;
    }
    if (game.players.length >= 4) {
        sendMessage(socket, { type: 'error', message: 'Game is full' });
        return;
    }

    game.players.push(joiner);
    players.set(joiner, socket);

    game.players.forEach((player) => {
        const playerSocket = players.get(player);
        if (playerSocket) {
            sendMessage(playerSocket, {
                type: 'join-game',
                gameId,
                playerId: joiner,
                playerCount: game.players.length,
                players: game.players
            });
        }
    });
    console.log(`Player ${joiner} joined game ${gameId}`);
}
function handleStartGame(socket, gameId) {
    const game = games.get(gameId);
    if (!game) {
        sendMessage(socket, { type: 'error', message: 'Game not found' });
        return;
    }
    if (game.started) {
        sendMessage(socket, { type: 'error', message: 'Game already started' });
        return;
    }
    if (game.players.length < 2) {
        sendMessage(socket, { type: 'error', message: 'Not enough players to start' });
        return;
    }
    game.started = true;
    game.players.forEach((playerId) => {
        const playerSocket = players.get(playerId);
        if (playerSocket) {
            sendMessage(playerSocket, { type: 'start-game', gameId });
        }
    });
    console.log(`Game with ID: ${gameId} has started`);
}

function parseMove(move) {
    if (move.length !== 2) {
        console.error("Invalid move format");
        return null;
    }
    const row = parseInt(move[0], 10);
    const col = parseInt(move[1], 10);
    if (isNaN(row) || isNaN(col)) {
        console.error("Invalid move coordinates");
        return null;
    }
    return { row, col };
}

/**
 * Maneja los movimientos de los jugadores.
 *
 * @param {WebSocket} socket - La conexión WebSocket del jugador.
 * @param {string} gameId - El ID del juego.
 * @param {string} move - El movimiento del jugador.
 * @param {string} sender - El ID del jugador.
 * @param {string} type -Tipo, si move o cruise.
 */
function handleMove(socket, gameId, move, sender, type) {
    console.log(`Received move ${move} for game ${gameId}`, "Type of move: ", typeof (move));
    const game = games.get(gameId);
    if (!game) {
        sendMessage(socket, { type: 'error', message: 'Game not found' });
        return;
    }
    if (!game.started) {
        sendMessage(socket, { type: 'error', message: 'Game not started' });
        return;
    }
    const playerId = [...players.entries()].find(([id, s]) => s === socket)?.[0];
    if (game.players[game.turn] !== playerId) {
        sendMessage(socket, { type: 'error', message: 'Not your turn' });
        return;
    }
    const coordinates = parseMove(move);
    if (!coordinates) {
        sendMessage(socket, { type: 'error', message: 'Invalid move' });
        return;
    }
    game.players.forEach((playerId) => {
        const playerSocket = players.get(playerId);
        if (playerSocket && playerSocket !== socket) {
            sendMessage(playerSocket, { type: type, gameId, move, sender });
        }
    });
    sendMessage(socket, { type: type, gameId, move, sender });
    game.turn = (game.turn + 1) % game.players.length;
}

function handleEmp(socket, gameId, sender) {
    const game = games.get(gameId);
    if (!game) {
        sendMessage(socket, { type: 'error', message: 'Game not found' });
        return;
    }
    const playerId = [...players.entries()].find(([id, s]) => s === socket)?.[0];
    if (!playerId) {
        sendMessage(socket, { type: 'error', message: 'Player not found' });
        return;
    }
    console.log('Received EMP: ', gameId, playerId, socket);
    game.players.forEach((playerId) => {
        const playerSocket = players.get(playerId);
        if (playerSocket && playerSocket !== socket) {
            sendMessage(playerSocket, { type: 'emp-attack', gameId, sender });
        }
    });
    //sendMessage(socket, { type: 'emp-attack', gameId, sender });
}

/**
 * @param {WebSocket} socket - La conexión WebSocket del jugador.
 * @param {string} gameId - El ID del juego.
 * @param {string} coordinates - Las coordenadas del movimiento.
 * @param {string} response - La respuesta del jugador (hit o miss).
 */
function handleResponse(socket, gameId, coordinates, response) {
    console.log(`Received response ${response} for move at ${coordinates} from game ${gameId}`);
    const game = games.get(gameId);
    if (!game) {
        sendMessage(socket, { type: 'error', message: 'Game not found' });
        return;
    }
    const playerId = [...players.entries()].find(([id, s]) => s === socket)?.[0];
    if (!playerId) {
        sendMessage(socket, { type: 'error', message: 'Player not found' });
        return;
    }
    game.players.forEach((playerId) => {
        const playerSocket = players.get(playerId);
        if (playerSocket && playerSocket !== socket) {
            console.log(`Sending response to player ${playerId}`);
            sendMessage(playerSocket, { type: 'response', playerId, coordinates, response });
        }
    });
}


/**
 * Maneja el abandono de un juego.
 *
 * @param {WebSocket} socket - La conexión WebSocket del jugador.
 * @param {string} gameId - El ID del juego.
 */
function handleLeaveGame(socket, gameId) {
    if (!gameId) {
        sendMessage(socket, { type: 'error', message: 'No game ID specified' });
        return;
    }

    const game = games.get(gameId);
    if (!game) {
        sendMessage(socket, { type: 'error', message: `No game found with ID "${gameId}"` });
        return;
    }

    game.players = game.players.filter((player) => player !== socket);

    if (game.players.length === 0) {
        games.delete(gameId);
    } else {
        game.players.forEach((player) =>
            sendMessage(player, { type: 'playerLeft', gameId, playerCount: game.players.length }),
        );
    }

    sendMessage(socket, { type: 'leftGame', gameId });
}

/**
 * Maneja la desconexión de un jugador.
 *
 * @param {WebSocket} socket - La conexión WebSocket del jugador.
 */
function handleDisconnect(socket) {
    for (const gameId of games.keys()) {
        const game = games.get(gameId);
        if (game.players.includes(socket)) {
            handleLeaveGame(socket, gameId);
            break;
        }
    }
}

function handleSonar(socket, gameId, sender, coordinates) {
    const game = games.get(gameId);
    if (!game) {
        sendMessage(socket, { type: 'error', message: 'Game not found' });
        return;
    }
    game.players.forEach((playerId) => {
        const playerSocket = players.get(playerId);
        if (playerSocket && playerId !== sender) {
            console.log(`Sending sonar to player ${playerId}`);
            sendMessage(playerSocket, {
                type: 'sonar',
                gameId: gameId,
                playerId: sender,
                coordinates: coordinates
            });
        }
    });
}
function handleSonarResponse(socket, gameId, coordinates, response) {
    console.log(`Received response ${response} for move at ${coordinates} from game ${gameId}`);
    const game = games.get(gameId);
    if (!game) {
        sendMessage(socket, { type: 'error', message: 'Game not found' });
        return;
    }
    game.players.forEach((player) => {
        const playerSocket = players.get(player);
        if (playerSocket) {
            sendMessage(playerSocket, {
                type: 'sonar-response',
                gameId: gameId,
                playerId: playerId,
                coordinates: coordinates,
                response: response
            });
        }
    });
}

function handleAttackPlanes(socket, gameId, sender, moves) {
    const game = games.get(gameId);
    if (!game) {
        sendMessage(socket, { type: 'error', message: 'Game not found' });
        return;
    }
    const playerId = [...players.entries()].find(([id, s]) => s === socket)?.[0];
    if (!playerId) {
        sendMessage(socket, { type: 'error', message: 'Player not found' });
        return;
    }
    game.players.forEach((playerId) => {
        const playerSocket = players.get(playerId);
        if (playerSocket && playerSocket !== socket) {
            console.log(`Sending response to player ${playerId}`);
            sendMessage(playerSocket, {
                type: 'attack-planes',
                gameId: gameId,
                playerId: playerId,
                moves: moves,
                senderId: sender
            });
        }
    });

}

function handlePlayerReady(socket, gameId, playerId) {
    const game = games.get(gameId);
    if (!game) {
        sendMessage(socket, { type: 'error', message: 'Game not found' });
        return;
    }
    game.playersReady = game.playersReady || new Set();
    game.playersReady.add(playerId);

    if (game.playersReady.size == game.players.length) {
        game.players.forEach((playerId) => {
            const playerSocket = players.get(playerId);
            if (playerSocket) {
                sendMessage(playerSocket, { type: 'all-players-ready', gameId, players: game.players});
            }
        });
        console.log(`All players are ready for game ${gameId}`);
    }
}

function handleAttackPlanesResponse(socket, gameId, sender, moves) {
    const game = games.get(gameId);
    if (!game) {
        sendMessage(socket, { type: 'error', message: 'Game not found' });
        return;
    }
    const playerId = [...players.entries()].find(([id, s]) => s === socket)?.[0];
    if (!playerId) {
        sendMessage(socket, { type: 'error', message: 'Player not found' });
        return;
    }
    game.players.forEach((playerId) => {
        const playerSocket = players.get(playerId);
        if (playerSocket && playerSocket !== socket) {
            console.log(`Sending attack plane response to player ${playerId}`);
            sendMessage(playerSocket, {
                type: 'attack-planes-response',
                gameId: gameId,
                playerId: playerId,
                moves: moves,
                sender: sender
            });
        }
    });
}
/**
 * Maneja los mensajes recibidos a través de la conexión WebSocket.
 *
 * @param {WebSocket} socket - La conexión WebSocket del jugador.
 * @param {Object} message - El mensaje recibido.
 */
function handleMessage(socket, message) {
    switch (message.type) {
        case 'connection':
            sendMessage(socket, { type: 'connection', message: 'Connected to server' });
            break;
        case 'create-game':
            handleCreateGame(socket, message.playerId);
            break;
        case 'join-game':
            handleJoinGame(socket, message.gameId, message.playerId);
            break;
        case 'start-game':
            handleStartGame(socket, message.gameId);
            break;
        case 'player-ready':
            handlePlayerReady(socket, message.gameId, message.playerId);
            break;
        case 'move':
            handleMove(socket, message.gameId, message.coordinates, message.playerId, message.type);
            break;
        case 'cruise':
            handleMove(socket, message.gameId, message.coordinates, message.playerId, 'cruise');
            break;
        case 'response':
            handleResponse(socket, message.gameId, message.coordinates, message.response, message.playerId);
            break;
        case 'leave-game':
            handleLeaveGame(socket, message.gameId);
            break;
        case 'sonar':
            console.log('Sonar received on server', message);
            handleSonar(socket, message.gameId, message.playerId, message.coordinates);
            break;
        case 'sonar-response':
            console.log('Sonar response received on server', message);
            handleSonarResponse(socket, message.gameId, message.playerId, message.coordinates, message.response);
            break;
        case 'attack-planes':
            handleAttackPlanes(socket, message.gameId, message.playerId, message.moves);
            break;
        case 'attack-planes-response':
            handleAttackPlanesResponse(socket, message.gameId, message.playerId, message.moves);
            break;
        case 'emp-attack':
            handleEmp(socket, message.gameId, message.playerId);
            break;
        default:
            sendMessage(socket, { type: 'error', message: 'Unknown message type' });
            console.error(`Unknown message type: ${message.type}`);
    }
}

// Inicia el servidor WebSocket
const wsServer = new WebSocketServer({ port: 8080 });

wsServer.on('connection', (ws) => {
    ws.on('message', (data) => {
        const message = JSON.parse(data);
        handleMessage(ws, message);
    });

    ws.on('close', () => {
        handleDisconnect(ws);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});