let shipCount = 0;
let ships = new Map();
let currentGameId = -777;
let inGameLobby = false;
let players = new Map();
function createTable(userName) {
    const boards = document.getElementById('tables');
    const board = document.createElement('div');
    board.setAttribute('data-player', userName);
    board.className = 'battleship-board';
    for (let i = 0; i < 11; i++) {
        const cell = document.createElement('div');
        cell.className = "border";
        i == 0 ? cell.textContent = '' : cell.textContent = i - 1;
        cell.id = i - 1;
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
            cell.className = "position";
            cell.setAttribute('data-player', userName);
            cell.setAttribute('data-row', i);
            cell.setAttribute('data-col', j);
            board.appendChild(cell);
        }
    }
    boards.appendChild(board);
    console.log('Table created for', userName);
    console.log(board);
}
document.getElementById('ship-placement-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const shipType = document.getElementById('ship-type').value;
    const startCoordinates = document.getElementById('start-coordinates').value;
    const direction = document.getElementById('direction').value;
    console.log('Ship type:', shipType);
    console.log('Start coordinates:', startCoordinates);
    console.log('Direction:', direction);
    placeShip(shipType, startCoordinates, direction, 1);
});

function placeShip(shipType, startCoordinates, direction, time) {
    const startRow = parseInt(startCoordinates[0]);
    const startCol = parseInt(startCoordinates[1]);
    const shipLength = parseInt(shipType);
    const board = document.querySelector(`.battleship-board[data-player="${userName}"]`);
    if (direction == 0 && (startCol + shipLength > 10)) {
        alert('El barco está fuera de los límites horizontales.');
        return;
    }
    if (direction == 1 && (startRow + shipLength > 10)) {
        alert('El barco está fuera de los límites verticales.');
        return;
    }
    try {
        for (let i = 0; i < shipLength; i++) {
            const row = direction == 0 ? startRow : startRow + i;
            const col = direction == 0 ? startCol + i : startCol;
            const cell = board.querySelector(`.position[data-player="${userName}"][data-row="${row}"][data-col="${col}"]`);

            if (!cell) {
                alert(`Cell not found at row ${row}, col ${col}`);
                return;
            }
            if (cell.classList.contains('ship')) {
                alert('El barco interfiere con otro barco existente o está fuera de los límites.');
                return;
            }
        }
        for (let i = 0; i < shipLength; i++) {
            const row = direction == 0 ? startRow : startRow + i;
            const col = direction == 0 ? startCol + i : startCol;
            const cell = board.querySelector(`.position[data-player="${userName}"][data-row="${row}"][data-col="${col}"]`);
            cell.classList.add('ship');

        }
        shipCount++;

        if (time == 1) {
            checkShips();
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
            deleteBtn.addEventListener('click', function () {
                deleteShip(shipType, startCoordinates, direction);
                listItem.remove();
                shipTypeSelect.add(new Option(`${shipType} casillas`, shipType));
            });
            listItem.appendChild(deleteBtn);
            placedShips.appendChild(listItem);

            const shipTypeSelect = document.getElementById('ship-type');
            shipTypeSelect.options[shipTypeSelect.selectedIndex].remove();
        }
    } catch (error) {
        console.error('Error placing ship:', error);
        alert('Ocurrió un error al colocar el barco. Por favor, inténtelo de nuevo.');
    }
}
function deleteShip(shipType, startCoordinates, direction) {
    const board = document.querySelector(`.battleship-board[data-player="${userName}"]`);
    const startRow = parseInt(startCoordinates[0]);
    const startCol = parseInt(startCoordinates[1]);
    const shipLength = parseInt(shipType);
    for (let i = 0; i < shipLength; i++) {
        const row = direction == 0 ? startRow : startRow + i;
        const col = direction == 0 ? startCol + i : startCol;
        const cell = board.querySelector(`.position[data-player="${userName}"][data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.classList.remove('ship');
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
        console.log("Ships: ", ships);
    } else {
        confirmButton.style.display = 'none';
        addButton.style.display = 'block';
    }
}

document.getElementById('confirm-button').addEventListener('click', function () {
    console.log('Confirm button clicked');
    document.getElementById('deck').style.display = 'none';
    document.getElementById('placed-ships').style.display = 'none';
    console.log(players);
    console.log("Ships map: ", ships);
    loadTables(players);
});

function loadTables(players) {
    players.forEach((player, playerId) => {
        if (playerId != userName) {
            createTable(playerId);
            const board = document.querySelector(`[data-player="${playerId}"]`);
            if (board) {
                const cells = board.querySelectorAll('[data-position]');
                cells.forEach(cell => {
                    cell.classList.remove('ship');
                });
            } else {
                console.error('Board not found for player:', playerId);
            }
        }
    });
}

function displayMove(coordinates) {
    console.log(coordinates);
    const { playerId, row, col } = coordinates;
    const cell = document.querySelector(`[data-player-id="${playerId}"][data-row="${row}"][data-col="${col}"]`);
    if (cell) {
        const div = document.createElement('div');
        if (cell.classList.contains('ship')) {
            div.className = 'hit';
        } else {
            div.className = 'miss';
        }
        cell.appendChild(div);
    } else {
        console.error('Cell not found for coordinates:', coordinates);
    }
}

function generatePlayerId() {
    return Math.floor(Math.random() * 1000);
}
let readyToConnectToServer = false;
let userName = 'John Doe';
const playerId = generatePlayerId();
const ws = new WebSocket('ws://localhost:8080');

document.addEventListener('DOMContentLoaded', function () {
    const usernameForm = document.getElementById('main-username-form');
    usernameForm.addEventListener('submit', function (event) {
        event.preventDefault();
        userName = document.getElementById('main-username').value;
        readyToConnectToServer = true;
        const message = JSON.stringify({
            type: 'connection',
            playerId: playerId,
            playerUsername: userName
        });
        ws.send(message);
        document.getElementById('inicio').style.display = 'none';
        document.getElementById('lobby').style.display = 'block';
    });
});

document.getElementById('start-game').addEventListener('click', function (event) {
    event.preventDefault();
    const message = JSON.stringify({
        type: 'start-game',
        gameId: currentGameId
    });
    ws.send(message);
    document.getElementById('lobby').style.display = 'none';
    document.getElementById('deck').style.display = 'block';
    document.getElementById('placed-ships').style.display = 'block';
    console.log("userName: ", userName);
    createTable(userName);
});





const onlineGames = document.getElementById('online-games');
const connectedPlayers = document.getElementById('connected-players');
const connectedPlayersUl = document.getElementById('connected-players-ul');
const matchId = document.getElementById('match-id');

function addPlayerToList(playerId) {
    const li = document.createElement('li');
    li.textContent = playerId;
    connectedPlayersUl.appendChild(li);
}
ws.onmessage = function (event) {
    try {
        const data = JSON.parse(event.data);
        switch (data.type) {
            case 'connection':
                console.log('Connected to server:', data.message);
                break;
            case 'move':
                console.log('Move received:', data);
                console.log('Coordinates:', data.coordinates);
                displayMove(data.coordinates);
                break;
            case 'create-game':
                console.log('Game created with the id of', data.gameId);
                console.log('Creator:', data.creatorId);
                console.log('la data dice: ', data);
                currentGameId = data.gameId;
                inGameLobby = true;
                onlineGames.style = 'display: none;';
                connectedPlayers.style = 'display: block;';
                connectedPlayersUl.innerHTML = `<li>${data.creatorId}</li>`;
                matchId.innerHTML += data.gameId;
                players.set(data.creatorId, { playerId: data.creatorId });
                console.log("Players map on create-game: ", players);
                document.getElementById('create-game').style = 'display: none;';
                document.getElementById('join-game').style = 'display: none;';
                document.getElementById('start-game').style = 'display: block;';
                document.getElementById('game-id').style = 'display: none;';
                break;
            case 'join-game':
                console.log('A player with the id of', data.playerId, 'has joined the game!');
                console.log('la data dice: ', data);
                addPlayerToList(data.playerId);
                players.set(data.playerId, { playerId: data.playerId });
                document.getElementById('create-game').style = 'display: none;';
                document.getElementById('join-game').style = 'display: none;';
                document.getElementById('start-game').style = 'display: block;';
                document.getElementById('game-id').style = 'display: none;';                
                break;
            case 'start-game':
                console.log('The game has started!');
                document.getElementById('lobby').style.display = 'none';
                document.getElementById('deck').style.display = 'block';
                document.getElementById('placed-ships').style.display = 'block';
                break;
            default:
                console.log('Unknown message type:', data);
        }
    } catch (e) {
        console.error('Error parsing JSON:', e, 'Data received:', event.data);
    }
};
function sendMessage() {
    const gameIdInput = document.getElementById('game-id');

    document.getElementById('create-game').addEventListener('click', () => {
        console.log('click');
        const message = JSON.stringify({
            type: 'create-game',
            playerId: userName
        });
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
            console.log('Sent:', message);
        } else {
            console.log('WebSocket is not open');
        }
    });

    document.getElementById('join-game').addEventListener('click', () => {
        const message = JSON.stringify({
            type: 'join-game',
            playerId: userName,
            gameId: gameIdInput.value
        });
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
            console.log('Sent:', message);
        } else {
            console.log('WebSocket is not open');
            console.log(message);
        }
    });
    document.getElementById('send-move').addEventListener('click', () => {
        const message = JSON.stringify({
            type: 'move',
            coordinates: document.getElementById('move').value,
            sender: playerId,
            receiver: receiverPlayerId,
            gameId: gameIdInput.value
        });
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
            console.log('Sent: ', message);
        } else {
            console.log('WebSocket is not open');
        }
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    sendMessage();
});

//codiguito para el inicio

let isCollapsed = false; // Estado del colapso

window.addEventListener('wheel', function(event) {
    const section = document.getElementById('inicio');
    
    if (event.deltaY > 0 && !isCollapsed) { // Si se hace scroll hacia abajo
        section.classList.add('collapsed'); // Colapsa la sección
        isCollapsed = true; // Cambia el estado
    } else if (event.deltaY < 0 && isCollapsed) { // Si se hace scroll hacia arriba
        section.classList.remove('collapsed'); // Expande la sección
        isCollapsed = false; // Cambia el estado
    }
});

// Obtener el elemento de audio
const hoverSound = document.getElementById('hover-sound');
const clickSound = document.getElementById('click-medium-sound')

// Obtener todos los enlaces dentro de la lista
const menuItems = document.querySelectorAll('.menu-hover-fill a, button, input, footer a');

// Función para reproducir sonido
function playSound() {
    hoverSound.currentTime = 0; // Reiniciar el sonido para que se reproduzca desde el inicio
    hoverSound.play(); // Reproducir el sonido
}

// Función para reproducir sonido de clic
function playClickSound() {
    clickSound.currentTime = 0; // Reiniciar el sonido para que se reproduzca desde el inicio
    clickSound.play(); // Reproducir el sonido
}

// Añadir un evento mouseover a cada enlace
menuItems.forEach(item => {
    item.addEventListener('mouseover', playSound);
    item.addEventListener('click', playClickSound);
});
