let shipCount = 0;
let ships = new Map();

const socket = new WebSocket('ws://localhost:8080');
socket.addEventListener('open', function (event) {
    console.log('Connected to WebSocket server');
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const deck = document.getElementById('deck');
        const placedShips = document.getElementById('placed-ships');
        deck.style.display = 'block';
        placedShips.style.display = 'block';
        createTable(`battleship-board-0`, 'P1');
        form.style.display = 'none';
    });
});
function createTable(name, userName, gameMode){
    const boards = document.getElementById('tables');
    const board = document.createElement('div');
    board.className = name;
    for(let i = 0; i < 11; i++){
        const cell = document.createElement('div');
        cell.className = "border";
        if(i == 0){
            cell.textContent = userName;
        }else{
            cell.textContent = i-1;
        }
        cell.id = i-1;
        board.appendChild(cell);
    }
    for (let i = 0; i < 10; i++) { 
        const rowHeader = document.createElement('div'); 
        rowHeader.className = 'border'; 
        rowHeader.id = i; 
        rowHeader.textContent = i; 
        board.appendChild(rowHeader); 
        for (let j = 0; j < 10; j++) { 
            cell = document.createElement('div'); 
            cell.className = 'position'; 
            cell.id = i.toString() + j.toString();
            board.appendChild(cell); 
        } 
    }
    board.id = name;
    console.log(board.id);
    boards.appendChild(board);
}
document.getElementById('ship-placement-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const shipType = document.getElementById('ship-type').value;
    const startCoordinates = document.getElementById('start-coordinates').value;
    const direction = document.getElementById('direction').value;
    console.log('Ship type:', shipType);
    console.log('Start coordinates:', startCoordinates);
    console.log('Direction:', direction);
    placeShip(0, shipType, startCoordinates, direction);
});

function placeShip(id, shipType, startCoordinates, direction) {
    const board = document.getElementById(`battleship-board-${id}`);
    const startRow = parseInt(startCoordinates[0]);
    const startCol = parseInt(startCoordinates[1]);
    const shipLength = parseInt(shipType);
    const cells = board.getElementsByClassName('position');

    if (direction == 0 && (startCol + shipLength > 10)) {
        alert('El barco está fuera de los límites horizontales.');
        return;
    }
    if (direction == 1 && (startRow + shipLength > 10)) {
        alert('El barco está fuera de los límites verticales.');
        return;
    }
    try {
        // Validate and place the ship
        for (let i = 0; i < shipLength; i++) {
            let currentIndex = direction == 0 ? `${startRow}${startCol + i}` : `${startRow + i}${startCol}`;
            if (!cells[currentIndex] || cells[currentIndex].classList.contains('ship')) {
                alert('El barco interfiere con otro barco existente o está fuera de los límites.');
                return;
            }
        }
        for (let i = 0; i < shipLength; i++) {
            let currentIndex = direction == 0 ? `${startRow}${startCol + i}` : `${startRow + i}${startCol}`;
            if (cells[currentIndex]) {
                cells[currentIndex].classList.add('ship');
            }
        }
        const COORD = `${startRow}${startCol}`;
        ships.set(startCoordinates, {
            startCoordinates: COORD,
            direction: direction,
            length: shipLength
        });

        const placedShips = document.getElementById('placed-ships');
        const listItem = document.createElement('li');
        listItem.textContent = `${shipType} casillas en ${startCoordinates} ${direction == 0 ? 'horizontal' : 'vertical'}`;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.addEventListener('click', function() {
            deleteShip(shipType, startCoordinates, direction);
            listItem.remove();
            shipTypeSelect.add(new Option(`${shipType} casillas`, shipType));
            
        });
        listItem.appendChild(deleteBtn);
        placedShips.appendChild(listItem);

        const shipTypeSelect = document.getElementById('ship-type');
        shipTypeSelect.options[shipTypeSelect.selectedIndex].remove();
    } catch (error) {
        console.error('Error placing ship:', error);
        alert('Ocurrió un error al colocar el barco. Por favor, inténtelo de nuevo.');
    }
}
function deleteShip(id, shipType, startCoordinates, direction) {
    const board = document.getElementById(`battleship-board-${id}`);
    const startRow = parseInt(startCoordinates[0]);
    const startCol = parseInt(startCoordinates[1]);
    const shipLength = parseInt(shipType);
    const cells = board.getElementsByClassName('position');

    for (let i = 0; i < shipLength; i++) {
        let currentIndex = direction == 0 ? `${startRow}${startCol + i}` : `${startRow + i}${startCol}`;
        if (cells[currentIndex]) {
            cells[currentIndex].classList.remove('ship');
        }
    }
    ships.delete(startCoordinates);
    shipCount--;
    checkShips();
}
function checkShips() {
    const addButton = document.getElementById('add-button');
    const confirmButton = document.getElementById('confirm-button');
    if (shipCount == 5) {
        confirmButton.style.display = 'block';
        addButton.style.display = 'none';
    } else {
        confirmButton.style.display = 'none';
        addButton.style.display = 'block';
    }
}

document.getElementById('confirm-button').addEventListener('click', function() {
    document.getElementById('deck').style.display = 'none';
    document.getElementById('placed-ships').style.display = 'none';
    const playerCount = parseInt(document.querySelector('input[name="player"]:checked').value);

    const tables = document.getElementById('tables');
    console.log(tables);
    tables.innerHTML = '';
    shipCount = 0;
    loadTables(playerCount, ships);
});

function updateBoard(boardId, boardData) {
    const board = document.getElementById(boardId);
    if (!board) return;
    const cells = board.getElementsByClassName('position');
    boardData.forEach((cellData, index) => {
        if (cellData === 1) {
            cells[index].classList.add('ship');
        } else {
            cells[index].classList.remove('ship');
        }
    });
}
function loadTables(playerCount, ships){
    const board = document.getElementById(`battleship-board-0`);
    if (board) {
        const cells = board.getElementsByClassName('position');
        for (let cell of cells) {
            cell.classList.remove('ship');
        }
    }
    for(let i = 0; i<playerCount; i++){
        createTable(`battleship-board-${i+1}`, `P${i+1}`);
        const BOARD = document.getElementById('battleship-board-'+(i+1));
        if(BOARD){
            const CELLS = BOARD.getElementsByClassName('position');
            for(let cell of CELLS){
                cell.classList.remove('ship');
            }
        }
        if(i == 0){
            const CELLS = BOARD.getElementsByClassName('position');
            ships.forEach((ship) => {
                const {length, direction, startCoordinates: coordinates} = ship; 
                const startRow = parseInt(coordinates[0]);
                const startCol = parseInt(coordinates[1]);
                for (let i = 0; i < length; i++) {
                    let currentIndex = direction == 0 ? `${startRow}${startCol + i}` : `${startRow + i}${startCol}`;
                    if (CELLS[currentIndex]) {
                        CELLS[currentIndex].classList.add('ship');
                    }
                }
            })
        }

    }
}

const games = {};

/**
 * Genera un ID de sala aleatorio de 8 caracteres de longitud.
 *
 * @returns {string} - Un ID de sala generado aleatoriamente.
 */
function generateGameId() {
    return Math.random().toString(36).substring(2, 10);
}

/**
 * Maneja los mensajes recibidos a través de la conexión WebSocket.
 *
 * @param {WebSocket} socket - La conexión WebSocket del jugador.
 * @param {Object} message - El mensaje recibido.
 */
function handleMessage(socket, message) {
    // Básicamente, se intercambia un "único mensaje" que contiene un "tipo" y una carga útil adicional. Dependiendo del
    // tipo de mensaje, se realiza una acción específica. Por eso usamos un "switch":
    switch (message.type) {
        case 'create':
            // Si el mensaje es de tipo "create", se maneja la creación de un nuevo juego. Solo se necesita la conexión
            // WebSocket del jugador para crear un nuevo juego.
            handleCreateGame(socket);
            break;
        case 'join':
            // Para manejar la unión a un juego existente, se necesita la conexión WebSocket del jugador y el ID del
            // juego al cual el jugador se desea unir.
            handleJoinGame(socket, message.gameId);
            break;
        case 'start':
            // Para manejar el inicio de un juego, se necesita la conexión WebSocket del jugador y el ID del juego a
            // iniciar.
            handleStartGame(socket, message.gameId);
            break;
        case 'move':
            // Para manejar los movimientos de los jugadores, se necesita la conexión WebSocket del jugador, el ID del
            // juego y el movimiento del jugador. El movimiento se reenvía a todos los jugadores en el juego.
            handleMove(socket, message.gameId, message.move);
            break;
        case 'leave':
            // Para manejar el abandono de un juego, se necesita la conexión WebSocket del jugador y el ID del juego.
            handleLeaveGame(socket, message.gameId);
            break;
        default:
            // Si el tipo de mensaje no es reconocido, se envía un mensaje de error al jugador.
            sendMessage(socket, { type: 'error', message: 'Unknown message type' });
    }
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
 */
function handleCreateGame(socket) {
    // Se genera un ID de juego único y se crea un nuevo juego con el jugador como único participante.
    const gameId = generateGameId();
    games[gameId] = { id: gameId, players: [socket], started: false, turn: 0 };

    // Se envía un mensaje de confirmación al jugador.
    sendMessage(socket, { type: 'gameCreated', gameId });
}

/**
 * Maneja la unión a un juego existente.
 *
 * @param {WebSocket} socket - La conexión WebSocket del jugador.
 * @param {string} gameId - El ID del juego al que unirse.
 */
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

/**
 * Maneja el inicio de un juego.
 *
 * @param {WebSocket} socket - La conexión WebSocket del jugador.
 * @param {string} gameId - El ID del juego a iniciar.
 */
function handleStartGame(socket, gameId) {
    const game = games[gameId];
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
    game.players.forEach((player) => {
        if (player !== socket) {
            sendMessage(player, { type: 'gameStarted', gameId });
        }
    });
    sendMessage(socket, { type: 'gameStarted', gameId });
}

/**
 * Maneja los movimientos de los jugadores.
 *
 * @param {WebSocket} socket - La conexión WebSocket del jugador.
 * @param {string} gameId - El ID del juego.
 * @param {string} move - El movimiento del jugador.
 */
function handleMove(socket, gameId, move) {
    const game = games[gameId];
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

    const game = games[gameId];

    if (!game) {
        sendMessage(socket, { type: 'error', message: `No game found with ID "${gameId}"` });
        return;
    }

    game.players = game.players.filter((player) => player !== socket);

    if (game.players.length === 0) {
        delete games[gameId];
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
    for (const gameId in games) {
        const game = games[gameId];
        if (game.players.includes(socket)) {
            handleLeaveGame(socket, gameId);
            break;
        }
    }
}

Deno.serve({ hostname: '127.0.0.1', port: 8080 }, (req) => {
    if (req.headers.get('upgrade') != 'websocket') {
        return new Response(null, { status: 501 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.addEventListener('open', () => {
        console.log('A client connected!');
    });

    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        handleMessage(socket, message);
    });

    socket.addEventListener('close', () => {
        handleDisconnect(socket);
    });

    return response;
});
