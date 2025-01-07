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
function handleJoinGame(socket, gameId, playerId) {
    const game = games.get(gameId);
    if (!game) {
        sendMessage(socket, { type: 'error', message: 'Game not found' });
        return;
    }
    if (game.players.length >= 4) {
        sendMessage(socket, { type: 'error', message: 'Game is full' });
        return;
    }
    game.players.push(playerId);
    players.set(playerId, socket);
    game.players.forEach((player) => {
        const playerSocket = players.get(player);
        if (playerSocket) {
            sendMessage(playerSocket, { type: 'join-game', gameId, playerId, playerCount: game.players.length });
        }
    });
}

/**
 * Maneja los movimientos de los jugadores.
 *
 * @param {WebSocket} socket - La conexión WebSocket del jugador.
 * @param {string} gameId - El ID del juego.
 * @param {string} move - El movimiento del jugador.
 */
function handleMove(socket, gameId, move) {
    const game = games.get(gameId);
    if (!game) {
        sendMessage(socket, { type: 'error', message: 'Game not found' });
        return;
    }
    if (!game.started) {
        sendMessage(socket, { type: 'error', message: 'Game not started' });
        return;
    }
    if (game.players[game.turn] !== socket) {
        sendMessage(socket, { type: 'error', message: 'Not your turn' });
        return;
    }
    game.players.forEach((player) => {
        if (player !== socket) {
            sendMessage(player, { type: 'move', gameId, move });
        }
    });
    sendMessage(socket, { type: 'move', gameId, move });
    game.turn = (game.turn + 1) % game.players.length;
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
        case 'move':
            handleMove(socket, message.gameId, message.coordinates);
            break;
        case 'leave-game':
            handleLeaveGame(socket, message.gameId);
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