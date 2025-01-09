let shipCount = 0;
let ships = new Map();
let currentGameId = -777;
let inGameLobby = false;
let players = new Map();
function createTable(userName) {
    const BOARDS = document.getElementById('tables');
    const BOARD = document.createElement('div');
    BOARD.setAttribute('data-player', userName);
    BOARD.className = 'battleship-board';
    for (let i = 0; i < 11; i++) {
        const CELL = document.createElement('div');
        CELL.className = "border";
        i == 0 ? CELL.textContent = '' : CELL.textContent = i - 1;
        CELL.id = i - 1;
        BOARD.appendChild(CELL);
    }
    for (let i = 0; i < 10; i++) {
        const rowHeader = document.createElement('div');
        rowHeader.className = 'border';
        rowHeader.id = i;
        rowHeader.textContent = i;
        BOARD.appendChild(rowHeader);
        for (let j = 0; j < 10; j++) {
            CELL = document.createElement('div');
            CELL.className = "position";
            CELL.setAttribute('data-player', userName);
            CELL.setAttribute('data-row', i);
            CELL.setAttribute('data-col', j);
            BOARD.appendChild(CELL);
        }
    }
    BOARDS.appendChild(BOARD);
    console.log('Table created for', userName);
    console.log(BOARD);
}
document.getElementById('ship-placement-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const SHIPTYPE = document.getElementById('ship-type').value;
    const STARTCOORDINATES = document.getElementById('start-coordinates').value;
    const direction = document.getElementById('direction').value;
    console.log('Ship type:', SHIPTYPE);
    console.log('Start coordinates:', STARTCOORDINATES);
    console.log('Direction:', direction);
    placeShip(SHIPTYPE, STARTCOORDINATES, direction, 1);
});

function placeShip(shipType, startCoordinates, direction, time) {
    const STARTROW = parseInt(startCoordinates[0]);
    const STARTCOL = parseInt(startCoordinates[1]);
    const SHIPLENGTH = parseInt(shipType);
    const BOARD = document.querySelector(`.battleship-board[data-player="${userName}"]`);
    if (direction == 0 && (STARTCOL + SHIPLENGTH > 10)) {
        alert('El barco está fuera de los límites horizontales.');
        return;
    }
    if (direction == 1 && (STARTROW + SHIPLENGTH > 10)) {
        alert('El barco está fuera de los límites verticales.');
        return;
    }
    try {
        for (let i = 0; i < SHIPLENGTH; i++) {
            const ROW = direction == 0 ? STARTROW : STARTROW + i;
            const col = direction == 0 ? STARTCOL + i : STARTCOL;
            const CELL = BOARD.querySelector(`.position[data-player="${userName}"][data-row="${ROW}"][data-col="${col}"]`);

            if (!CELL) {
                alert(`Cell not found at row ${ROW}, col ${col}`);
                return;
            }
            if (CELL.classList.contains('ship')) {
                alert('El barco interfiere con otro barco existente o está fuera de los límites.');
                return;
            }
        }
        for (let i = 0; i < SHIPLENGTH; i++) {
            const ROW = direction == 0 ? STARTROW : STARTROW + i;
            const col = direction == 0 ? STARTCOL + i : STARTCOL;
            const CELL = BOARD.querySelector(`.position[data-player="${userName}"][data-row="${ROW}"][data-col="${col}"]`);
            CELL.classList.add('ship');
            CELL.classList.add(`ship-${SHIPLENGTH}`);
                if (direction==0){
                    CELL.classList.add('horizontal');
                }

        }
        shipCount++;

        if (time == 1) {
            checkShips();
            const COORD = `${STARTROW}${STARTCOL}`;
            ships.set(startCoordinates, {
                startCoordinates: COORD,
                direction: direction,
                length: SHIPLENGTH
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
    const BOARD = document.querySelector(`.battleship-board[data-player="${userName}"]`);
    const STARTROW = parseInt(startCoordinates[0]);
    const STARTCOL = parseInt(startCoordinates[1]);
    const SHIPLENGTH = parseInt(shipType);
    for (let i = 0; i < SHIPLENGTH; i++) {
        const ROW = direction == 0 ? STARTROW : STARTROW + i;
        const col = direction == 0 ? STARTCOL + i : STARTCOL;
        const CELL = BOARD.querySelector(`.position[data-player="${userName}"][data-row="${ROW}"][data-col="${col}"]`);
        if (CELL) {
            CELL.classList.remove('ship');
            CELL.classList.remove(`ship-${SHIPLENGTH}`);
            CELL.classList.remove('horizontal');
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
    document.getElementById('send-moves-container').style.display = 'block';
    console.log(players);
    console.log("Ships map: ", ships);
    loadTables(players);
});

function loadTables(players) {
    players.forEach((player, playerId) => {
        if (playerId != userName) {
            createTable(playerId);
            const BOARD = document.querySelector(`[data-player="${playerId}"]`);
            if (BOARD) {
                const CELLS = BOARD.querySelectorAll('[data-position]');
                CELLS.forEach(CELL => {
                    CELL.classList.remove('ship');
                });
            } else {
                console.error('Board not found for player:', playerId);
            }
        }
    });
}


function displayMove(coordinates, playerId, response) {
    if (!coordinates || coordinates.length !== 2) {
        console.error("Error: coordinates is undefined or invalid");
        return;
    }

    const ROW = parseInt(coordinates[0], 10);
    const col = parseInt(coordinates[1], 10);
    if (isNaN(ROW) || isNaN(col)) {
        console.error("Error: Invalid coordinates format");
        return;
    }

    const positions = document.querySelectorAll('.position');
    if (!positions.length) {
        console.error("Error: No positions found");
        return;
    }
    let answer = '';
    positions.forEach(position => {
        const positionRow = parseInt(position.dataset.row, 10);
        const positionCol = parseInt(position.dataset.col, 10);
        
        if (positionRow === ROW && positionCol === col) {
            if (position.querySelector('.hit') || position.querySelector('.miss')) {
                return;
            }
            if(position.getAttribute('data-player') != playerId){
                if (position.classList.contains('ship') && response == '') {
                    const hitDiv = document.createElement('div');
                    hitDiv.className = 'hit';
                    position.appendChild(hitDiv);
                    answer = 'hit';
                } else if(position.getAttribute('data-player' == playerId) && response == ''){
                    const missDiv = document.createElement('div');
                    missDiv.className = 'miss';
                    position.appendChild(missDiv);
                    answer = 'miss';
                } else if(response == 'hit'){
                    const hitDiv = document.createElement('div');
                    hitDiv.className = 'hit';
                    position.appendChild(hitDiv);
                    answer = 'hit';
                } else if(response == 'miss'){
                    const missDiv = document.createElement('div');
                    missDiv.className = 'miss';
                    position.appendChild(missDiv);
                    answer = 'miss';
                }
            }

        }
    });
    if(response == '' && playerId != userName){
        const MESSAGE = JSON.stringify({
            type: 'response',
            gameId: currentGameId,
            playerId: userName,
            coordinates: coordinates,
            response: answer
        })
        ws.send(MESSAGE);
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

document.getElementById('send-moves-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const moveInput = event.target.querySelector('input[type="text"]').value;
    console.log('Move input:', moveInput);
    const message = JSON.stringify({
        type: 'move',
        coordinates: moveInput,
        gameId: currentGameId,
        playerId: userName
    });
    ws.send(message);
    moveInput.value = '';
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
                console.log('Coordinates:', data.move, "Type: ", typeof(data.move));
                displayMove(data.move, data.sender, '');
                break;
            case 'response':
                console.log('Received from player: ', data.playerId);
                console.log('It was a: ', data.response);
                console.log(data);
                displayMove(data.coordinates, data.playerId, data.response);
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