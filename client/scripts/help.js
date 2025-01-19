let shipCount = 0;
let ships = new Map();
let currentGameId = -777;
let inGameLobby = false;
let players = new Map();
function createTable(userName) {
    const BOARDS = document.getElementById('tables');
    if (BOARDS.querySelector(`[data-player="${userName}"]`)) {
        console.log(`Table for ${userName} already exists`);
        return;
    }
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


let submarine = {
    length: 3,
    direction: null,
    startCoordinates: null,
    hits: 0,
    status: 'alive'
};
let carrier = {
    length: 5,
    direction: null,
    startCoordinates: null,
    hits: 0,
    status: 'alive'
};

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
            if(SHIPLENGTH == 3 && submarine.direction == null){
                submarine.direction = direction;
                submarine.startCoordinates = startCoordinates;
            } else if (SHIPLENGTH == 5){
                carrier.direction = direction;
                carrier.startCoordinates = startCoordinates;
            }
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
            console.log('Submarino: ', submarine);
            console.log('Carrier: ', carrier);
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
    const mineForm = document.getElementById('mine-placement-form');
    if (shipCount == 5) {
        confirmButton.style.display = 'block';
        addButton.style.display = 'none';
        mineForm.style.display = 'block';
        console.log("Ships: ", ships);
    } else {
        confirmButton.style.display = 'none';
        addButton.style.display = 'block';
        mineForm.style.display = 'none';
    }
}

document.getElementById('confirm-button').addEventListener('click', function () {
    console.log('Confirm button clicked');
    document.getElementById('deck').style.display = 'none';
    document.getElementById('placed-ships').style.display = 'none';
    console.log(players);
    console.log("Ships map: ", ships);
    if(!cpuMode){
        const message = JSON.stringify({
            type: 'player-ready',
            gameId: currentGameId,
            playerId: userName
        });
        ws.send(message);        
    }
});

function loadTables(players) {
    players.forEach((playerId) => {
        createTable(playerId);
    });
    const powerUps = document.getElementById('power-ups');
    powerUps.style.display = 'block';
    updatePlayerPoints(0);
    document.getElementById('send-moves-container').style.display = 'block';
}

function handleCruiseMissile(coordinates) {


}

function handleCruiseResponse(moves){

}

function displayMove(coordinates, playerId, response) {
    console.log('Displaying move:', coordinates, playerId, response);
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
                    checkSunk(ROW, col);
                }else if(response == 'hit'){
                    const hitDiv = document.createElement('div');
                    hitDiv.className = 'hit';
                    position.appendChild(hitDiv);
                    answer = 'hit';
                    checkSunk(ROW, col);
                } else if(response == 'miss'){
                    const missDiv = document.createElement('div');
                    missDiv.className = 'miss';
                    position.appendChild(missDiv);
                    answer = 'miss';
                } else if(response == 'mine'){
                    const explosionDiv = document.createElement('div');
                    explosionDiv.className = 'explosion';
                    position.appendChild(explosionDiv);
                    answer = 'mine';
                }else if(position.getAttribute('data-player') == userName && response == ''){
                    if (position.querySelector('.mine')) {
                        const mineDiv = document.createElement('div');
                        mineDiv.className = 'explosion';
                        position.appendChild(mineDiv);
                        answer = 'mine';
                        console.log('Mina encontrada en las coordenadas:', coordinates);
                    } else {
                        const missDiv = document.createElement('div');
                        missDiv.className = 'miss';
                        position.appendChild(missDiv);
                        answer = 'miss';
                        console.log('No se encontró mina en las coordenadas:', coordinates);
                    }
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

function checkSunk(row, col){
    checkShipSunk(submarine);
    checkShipSunk(carrier);
}

function checkShipSunk(ship){
    const startRow = parseInt(ship.startCoordinates[0], 10);
    const startCol = parseInt(ship.startCoordinates[1], 10);
    let hits = 0;
    for (let i = 0; i < ship.length; i++) {
        let currentRow = startRow;
        let currentCol = startCol;
        if (ship.direction == 1) {
            currentRow += i;
        } else {
            currentCol += i;
        }
        const CELL = document.querySelector(`.position[data-player="${userName}"][data-row="${currentRow}"][data-col="${currentCol}"]`);
        if (CELL && CELL.querySelector('.hit')) {
            hits ++;
        }
    }
    ship.hits = hits;
    if(hits == ship.length){
        ship.status = 'sunk';
        console.log(`${ship.length === 3 ? 'Submarine' : 'Carrier'} is sunk!`);
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
document.getElementById('vs-cpu').addEventListener('click', function (event) {
    event.preventDefault();
    cpuMode = true;
    document.getElementById('lobby').style.display = 'none';
    document.getElementById('deck').style.display = 'block';
    document.getElementById('placed-ships').style.display = 'block';
    createTable(userName);
    createTable('CPU');
    placeCPUShips();
});

function placeCPUShips(){
    const ships = [5, 4, 3, 3, 2];
    ships.forEach(shipLength => {
        let placed = false;
        while (!placed) {
            const startRow = Math.floor(Math.random() * 10);
            const startCol = Math.floor(Math.random() * 10);
            const direction = Math.floor(Math.random() * 2);

            let canPlace = true;
            for (let i = 0; i < shipLength; i++) {
                const row = direction === 0 ? startRow : startRow + i;
                const col = direction === 0 ? startCol + i : startCol;
                const cell = document.querySelector(`.position[data-player="CPU"][data-row="${row}"][data-col="${col}"]`);
                if (!cell || cell.classList.contains('ship')) {
                    canPlace = false;
                    break;
                }
            }
            if (canPlace) {
                for (let i = 0; i < shipLength; i++) {
                    const row = direction === 0 ? startRow : startRow + i;
                    const col = direction === 0 ? startCol + i : startCol;
                    const cell = document.querySelector(`.position[data-player="CPU"][data-row="${row}"][data-col="${col}"]`);
                    const shipDiv = document.createElement('div');
                    shipDiv.className = 'ship';
                    cell.appendChild(shipDiv);
                    if (direction == 0) {
                        cell.classList.add('horizontal');
                    }
                }
                placed = true;
            }
        }
    });
}

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

function validateCruiseMissileMove(move) {
    if (move.length !== 2) return false;
    const row = parseInt(move[0], 10);
    const col = parseInt(move[1], 10);
    if (isNaN(row) || isNaN(col)) return false;
    if (row < 1 || row > 8 || col < 1 || col > 8) return false;
    return true;
}
let turn = true;

function handlePlayerMove(coordinates) {
    console.log("HandlePlayerMove called");
    const [row, col] = coordinates.split('').map(Number);
    const cell = document.querySelector(`.position[data-player="CPU"][data-row="${row}"][data-col="${col}"]`);
    if (cell) {
        if (cell.querySelector('.ship')) {
            const hitDiv = document.createElement('div');
            hitDiv.className = 'hit';
            cell.appendChild(hitDiv);
            console.log('Hit on CPU ship!');
        } else {
            const missDiv = document.createElement('div');
            missDiv.className = 'miss';
            cell.appendChild(missDiv);
            console.log('Missed on CPU board.');
        }
        if(checkGameOver('CPU')){
            endGame('Player');
        }
    }
}
let cpuMoves = new Set();
function handleCPUMove() {
    let move;
    let row, col;
    do {
        row = Math.floor(Math.random() * 10);
        col = Math.floor(Math.random() * 10);
        move = `${row}${col}`;
    } while (cpuMoves.has(move));
    cpuMoves.add(move);
    const cell = document.querySelector(`.position[data-player="${userName}"][data-row="${row}"][data-col="${col}"]`);
    console.log("HandleCPUMove called");
    if (cell) {
        if (cell.classList.contains('ship')) {
            const hitDiv = document.createElement('div');
            hitDiv.className = 'hit';
            cell.appendChild(hitDiv);
            console.log('CPU hit your ship!');
        } else {
            const missDiv = document.createElement('div');
            missDiv.className = 'miss';
            cell.appendChild(missDiv);
            console.log('CPU missed.');
        }
        if(checkGameOver(userName)){
            endGame('CPU');
        }
    }
}
let cpuMode = false;
let playerMoves = new Set();
document.getElementById('send-moves-form').addEventListener('submit', function (event) {
    event.preventDefault();
    let type = 'move';
    const moveInput = event.target.querySelector('input[type="text"]').value;
    if(playerMoves.has(moveInput)){
        alert('Ya has atacado a esta casilla. Por favor, selecciona otra.');
        return;
    }
    console.log('Move input:', moveInput);
    if (cpuMode) {
        if (turn) {
            // Player's turn
            handlePlayerMove(moveInput);
            turn = false;
            setTimeout(() => {
                handleCPUMove();
                turn = true;
            }, 1000); // Delay for CPU move
        }
        event.target.querySelector('input[type="text"]').value = '';
        return;
    }
    if (cruiseMissileMode) {
        if (validateCruiseMissileMove(moveInput)) {
            type = 'cruise'
            updatePlayerPoints(-15);
        } else {
            alert('Invalid move for cruise missile. Please enter a valid coordinate.');
        }
    }
    moveInput.value = '';
    const message = JSON.stringify({
        type: type,
        coordinates: moveInput,
        gameId: currentGameId,
        playerId: userName
    });
    ws.send(message);
    if(emp != 0){
        emp --;
    }
    empAttack();
    console.log("Turnos EMP restantes: ", emp);
});


const onlineGames = document.getElementById('online-games');
const connectedPlayers = document.getElementById('connected-players');
const connectedPlayersUl = document.getElementById('connected-players-ul');
const matchId = document.getElementById('match-id');

function updatePlayerList(players){
    const connectedPlayersUl = document.getElementById('connected-players-ul');
    connectedPlayersUl.innerHTML = '';
    players.forEach((playerId) => {
        const li = document.createElement('li');
        li.textContent = playerId;
        connectedPlayersUl.appendChild(li);
    });
    connectedPlayers.style.display = "block";
}

function updateOnlineGamesList(games){
    const onlineGamesUl = document.getElementById('online-games-ul');
    onlineGamesUl.innerHTML = '';
    games.forEach((gameId) => {
        const li = document.createElement('li');
        li.textContent = gameId;
        onlineGamesUl.appendChild(li);
        console.log(gameId);
    });
    onlineGames.style.display = "block";
    console.log('online games list updated');
}

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
                console.log('Connected to server:', data.message,'current game ids: ',data.gameIds);
                updateOnlineGamesList(data.gameIds);
                break;
            case 'move':
                console.log('Move received:', data);
                console.log('Coordinates:', data.move, "Type: ", typeof(data.move));
                displayMove(data.move, data.sender, '');
                updatePlayerPoints(0);
                checkGameOver(userName);
                break;
            case 'not-turn':
                alert('No es tu turno todavia');
                playerMoves.delete(data.move);
                break;
            case 'response':
                console.log('Received from player: ', data.playerId);
                console.log('It was a: ', data.response);
                if(data.response == 'hit'){
                    updatePlayerPoints(5);
                }
                if(data.response == 'mine'){
                    randomHit();
                }
                console.log(data);
                displayMove(data.coordinates, data.playerId, data.response);
                break;
            case 'cruise':
                console.log('Mensaje cruise: ', data);
                handleMultipleAttacks(data.moves, 'cruise-response');
                break;
            case 'cruise-response':
                console.log('Mensjae cruise-response: ', data);
                data.moves.forEach(move => {
                    displayMove(move.coordinates, data.playerId, move.response);
                });
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
                matchId.innerHTML = `ID de la sala: ${data.gameId}`;
                players.set(data.creatorId, { playerId: data.creatorId });
                console.log("Players map on create-game: ", players);
                document.getElementById('create-game').style = 'display: none;';
                document.getElementById('join-game').style = 'display: none;';
                document.getElementById('start-game').style = 'display: block;';
                document.getElementById('game-id').style = 'display: none;';
                document.getElementById('match-id').style = 'display: flex;';
                document.getElementById('connected-players').style = 'display: block;';
                updateOnlineGamesList(data.gameIds);
                break;
            case 'join-game':
                console.log('A player with the id of', data.playerId, 'has joined the game!');
                currentGameId = data.gameId;
                updatePlayerList(data.players);
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
                createTable(userName);
                break;
            case 'all-players-ready':
                console.log('All ready, starting game');
                loadTables(data.players);
                break;
            case 'sonar':
                console.log('Sonar received:', data);
                scanTable(data.coordinates, data.playerId);
                break;
            case 'sonar-response':
                console.log('Sonar response received:', data);
                const answ = data.response == 'hit' ? 'Se' : 'No se';
                alert(`${answ} ha encontrado un barco en las coordenadas ${data.coordinates}`);
                break;
            case 'attack-planes':
                console.log('Attack planes: ', data);
                handleMultipleAttacks(data.moves, 'attack-planes-response');
                break;
            case 'attack-planes-response':
                console.log('Attack planes response received:', data);
                data.moves.forEach(move => {
                    displayMove(move.coordinates, data.playerId, move.response);
                });
                break;  
            case 'emp-attack':
                console.log('EMP received');
                alert("Has recibido un ataque EMP");
                emp = 3;
                empAttack();
                break;
            case 'game-created':
                const onlineGamesUl = document.getElementById('online-games-ul');
                onlineGamesUl.appendChild 
                console.log('A game with the id of _ was created by the player _');
                alert("New Game created, nigga");
                
                break;
            case 'all-games':
                console.log(data);
                console.log(data.gameIds);
                break;
            case 'player-out':
                console.log('Player out: ', data);
                handlePlayerOut(data);
                break;
            default:
                console.log('Unknown message type:', data);
        }
    } catch (e) {
        console.error('Error parsing JSON:', e, 'Data received:', event.data);
    }
};

function handlePlayerOut(data) {
    alert('Jugador ', data.playerId, ' ha sido hundido');
    const { playerId } = data;
    const playerTable = document.querySelector(`.table[data-player="${playerId}"]`);
    if (playerTable) {
        playerTable.style.display = 'none';
    }
}

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

let isCollapsed = false; 
window.addEventListener('wheel', function(event) {
    const section = document.getElementById('inicio');
    
    if (event.deltaY > 0 && !isCollapsed) { 
        section.classList.add('collapsed'); 
        isCollapsed = true; 
    } else if (event.deltaY < 0 && isCollapsed) { 
        section.classList.remove('collapsed'); 
        isCollapsed = false; 
    }
});

// codiguito para los sonidos
const hoverSound = document.getElementById('hover-sound');
const clickSound = document.getElementById('click-medium-sound')
const menuItems = document.querySelectorAll('.menu-hover-fill a, button, input, footer a');
let hoverSoundsAllowed = true;
let clickSoundsAllowed = true;

function playSound() {
    if(hoverSoundsAllowed){
    hoverSound.currentTime = 0; 
    hoverSound.play(); 
    }
}


function playClickSound() {
    if(clickSoundsAllowed){
    clickSound.currentTime = 0; 
    clickSound.play();
    } 
}


menuItems.forEach(item => {
    item.addEventListener('mouseover', playSound);
    item.addEventListener('click', playClickSound);
});

const dropdownBtn = document.getElementById('navbar-dropdown-btn');
const dropdownMenu = document.getElementById('dropdown-menu');

dropdownBtn.addEventListener('click', function() {
    dropdownMenu.style = 'display: block;';
});


let muteSoundsOption = document.getElementById('mute-sounds');


function toggleSoundsText(option) {
    if (option.innerText === 'Apagar Sonidos de la interfaz') {
        option.innerText = 'Encender Sonidos de la interfaz';
        clickSoundsAllowed = false;
        hoverSoundsAllowed = false;
    } else {
        option.innerText = 'Apagar Sonidos de la interfaz';
        clickSoundsAllowed = true;
        hoverSoundsAllowed = true;
    }
}

muteSoundsOption.addEventListener('click', function() {
    toggleSoundsText(muteSoundsOption);
});

document.addEventListener('mouseup', function(e) {
    if (!dropdownMenu.contains(e.target)) {
        dropdownMenu.style.display = 'none';
    }
});


//POWER-UPS
let playerPoints = 100;

document.getElementById('sonar').addEventListener('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    sonar();
    updatePlayerPoints(-5);
});

document.getElementById('attack-planes').addEventListener('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    attackPlanes();
    updatePlayerPoints(-10);
});

let mineCoordinates = '';
document.getElementById('mine-placement-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById('mine-placement-form'));
    const clickedButton = event.submitter.id;
    const BOARD = document.querySelector(`.battleship-board[data-player="${userName}"]`);
    if (clickedButton == 'add-mine') {
        mineCoordinates = formData.get('mine');
        const row = parseInt(mineCoordinates[0], 10);
        const col = parseInt(mineCoordinates[1], 10);
        const CELL = BOARD.querySelector(`.position[data-player="${userName}"][data-row="${row}"][data-col="${col}"]`);
        if (CELL.classList.contains('mine')) {
            alert('Ya hay una mina en esta casilla.');
            return;
        }
        if (CELL.classList.contains('ship')) {
            alert('No puedes poner una mina en una casilla con un barco.');
            return;
        }
        if (mineCoordinates.length != 2 || row > 9 || col > 9) {
            alert('Coordenadas inválidas.');
            return;
        }
        seaMine(mineCoordinates, BOARD);
        document.getElementById('add-mine').style.display = 'none';
        document.getElementById('remove-mine').style.display = 'block';
    } else if (clickedButton == 'remove-mine') {
        removeSeaMine(mineCoordinates, BOARD);
        document.getElementById('add-mine').style.display = 'block';
        document.getElementById('remove-mine').style.display = 'none';
    }
});

document.getElementById('defensive-shield').addEventListener('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    defensiveShield();
});
let cruiseMissileMode = false;
document.getElementById('cruise-missile').addEventListener('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    cruiseMissileMode = !cruiseMissileMode;
    this.classList.toggle('active', cruiseMissileMode);
    console.log('Cruise missile mode:', cruiseMissileMode);
    cruiseMissileMode ? alert('Modo de misil de crucero activado') : alert('Modo de misil de crucero desactivado');
});

document.getElementById('quick-repair').addEventListener('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    quickRepair();
});

let emp = 0;
function empAttack(){
    const powerUps = document.getElementById('power-ups');
    if(emp != 0){
        powerUps.style.display = 'none';
    }else{
        powerUps.style.display = 'block';
    }
}

document.getElementById('emp-attack').addEventListener('click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    updatePlayerPoints(-25);
    const message = JSON.stringify({
        type: 'emp-attack',
        gameId: currentGameId,
        playerId: userName
    });
    ws.send(message);
});

function seaMine(coordinates, BOARD){
    const ROW = parseInt(coordinates[0]);
    const col = parseInt(coordinates[1]);
    const CELL = BOARD.querySelector(`.position[data-player="${userName}"][data-row="${ROW}"][data-col="${col}"]`);
    const mineDiv = document.createElement('div');
    mineDiv.className = 'mine';
    CELL.appendChild(mineDiv);
    updatePlayerPoints(-5);
}

function removeSeaMine(coordinates, BOARD){
    const ROW = parseInt(coordinates[0]);
    const col = parseInt(coordinates[1]);
    const CELL = BOARD.querySelector(`.position[data-player="${userName}"][data-row="${ROW}"][data-col="${col}"]`);
    CELL.classList.remove('mine');
    updatePlayerPoints(5);
}

function randomHit(){
    const BOARD = document.querySelector(`.battleship-board[data-player="${userName}"]`);
    const ROW = Math.floor(Math.random() * 10);
    const COL = Math.floor(Math.random() * 10);
    const CELL = BOARD.querySelector(`.position[data-player="${userName}"][data-row="${ROW}"][data-col="${COL}"]`);
    if (CELL.classList.contains('ship')) {
        const hitDiv = document.createElement('div');
        hitDiv.className = 'hit';
        CELL.appendChild(hitDiv);
    } else {
        const missDiv = document.createElement('div');
        missDiv.className = 'miss';
        CELL.appendChild(missDiv);
    }
}

function updatePlayerPoints(points){
    playerPoints += points;
    document.getElementById('player-points').textContent = `Puntos: ${playerPoints}`;
    displayPowerUps(playerPoints);
}

function displayPowerUps(points){
    console.log(points);
    const sonar = document.getElementById('sonar');
    const sonarContainer = document.getElementById('sonar-container')
    const attackPlanes = document.getElementById('attack-planes');
    const attackPlanesContainer = document.getElementById('air-strike-container');
    const defensiveShield = document.getElementById('defensive-shield');
    const defensiveShieldContainer = document.getElementById('force-field-container');
    const cruiseMissile = document.getElementById('cruise-missile');
    const cruiseMissileContainer = document.getElementById('cruiser-missile-container');
    const quickRepair = document.getElementById('quick-repair');
    const quickRepairContainer = document.getElementById('quick-fix-container');
    const empAttack = document.getElementById('emp-attack');
    const empAttackContainer = document.getElementById('emp-container');
    if(points>= 5){
        console.log('mostrando sonar');
        sonar.style.display = 'block';
        sonarContainer.style.display = 'flex';
    }else{
        sonar.style.display = 'none';
        sonarContainer.style.display = 'none';
    } 
    if(points >=10){
        attackPlanes.style.display = 'block';
        attackPlanesContainer.style.display = 'flex';
        quickRepair.style.display = 'block';
        quickRepairContainer.style.display = 'flex';
    }else{
        attackPlanes.style.display = 'none';
        attackPlanesContainer.style.display = 'none';
        quickRepair.style.display = 'none';
        quickRepairContainer.style.display = 'none';
    }
    if(points >= 15){
        defensiveShield.style.display = 'block';
        defensiveShieldContainer.style.display = 'flex';
        cruiseMissile.style.display = 'block';
        cruiseMissileContainer.style.display = 'flex';
    }else{
        defensiveShield.style.display = 'none';
        defensiveShieldContainer.style.display = 'none';
        cruiseMissile.style.display = 'none';
        cruiseMissileContainer.style.display = 'none';
    }
    if(points >= 20){
        empAttack.style.display = 'block';
        empAttackContainer.style.display = 'flex';
    }else{
        empAttack.style.display = 'none';
        empAttackContainer.style.display = 'none';
    }
    if(carrier.status == 'sunk'){
        attackPlanes.style.display = 'none';
        attackPlanesContainer.style.display = 'none';
    }
    if(submarine.status == 'sunk'){
        sonar.style.display = 'none';
        sonarContainer.style.display = 'none';
    }
}

function scanTable(coordinates, playerId){
    let response = '';
    const BOARD = document.querySelector(`.battleship-board[data-player="${userName}"]`);
    const ROW = parseInt(coordinates[0]);
    const COL = parseInt(coordinates[1]);
    const CELL = BOARD.querySelector(`.position[data-player="${userName}"][data-row="${ROW}][data-col="${COL}"]`);
    if(CELL.classList.contains('ship')){
        response = 'hit';
    }else{
        response = 'miss';
    }
    const message = JSON.stringify({
        type: 'sonar-response',
        gameId: currentGameId,
        playerId: playerId,
        coordinates: coordinates,
        response: response
    });
    ws.send(message);
    console.log("Sonar-response: ", message);
}

function sonar(){
    const ROW = Math.floor(Math.random() * 10);
    const COL = Math.floor(Math.random() * 10);
    const coordinates = `${ROW}${COL}`;
    const message = JSON.stringify({
        type: 'sonar',
        gameId: currentGameId,
        playerId: userName,
        coordinates: coordinates
    });
    ws.send(message);
    console.log("Sonar: ", message)
}

function attackPlanes(){
    const moves = [];
    for(let i = 0; i<5; i++){
        const row = Math.floor(Math.random() *10);
        const col = Math.floor(Math.random() *10);
        moves.push({row, col});
        playerMoves.add(`${row}${col}`);
    }
    const message = JSON.stringify({
        type: 'attack-planes',
        gameId: currentGameId,
        playerId: userName,
        moves: moves
    });
    ws.send(message);
}

function handleMultipleAttacks(moves, type) {
    const BOARD = document.querySelector(`.battleship-board[data-player="${userName}"]`);
    const responses = moves.map(move => {
        const { row, col } = move;
        const CELL = BOARD.querySelector(`.position[data-player="${userName}"][data-row="${row}"][data-col="${col}"]`);
        let response;
        if (CELL.classList.contains('ship')) {
            if(!CELL.classList.contains('hit')){
                const hitDiv = document.createElement('div');
                hitDiv.className = 'hit';
                CELL.appendChild(hitDiv);
                response = 'hit';
            }
        } else {
            const missDiv = document.createElement('div');
            missDiv.className = 'miss';
            CELL.appendChild(missDiv);
            response = 'miss';
        }
        return { coordinates: `${row}${col}`, response };
    });

    const message = JSON.stringify({
        type: type,
        gameId: currentGameId,
        playerId: userName,
        moves: responses
    });

    ws.send(message);
}


function checkGameOver(player) {
    const cells = document.querySelectorAll(`.position[data-player="${player}"] .ship`);
    let hitCount = 0;
    for (let cell of cells) {
        if (cell.classList.contains('hit')) {
            hitCount++;
        }
    }
    if (hitCount === 17) {
        const message = JSON.stringify({
            type: 'player-out',
            gameId: currentGameId,
            playerId: player
        });
        ws.send(message);
        return true;
    }
    return false;
}

function endGame(winner) {
    alert(`${winner} wins the game!`);
}