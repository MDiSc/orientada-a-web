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
    const shipSelect = document.getElementById('ship-type');
    const selectedOption = shipSelect.options[shipSelect.selectedIndex];
    const SHIPNAME = selectedOption.dataset.model;

    console.log('SHIPNAME ES ', SHIPNAME);

    const STARTCOORDINATES = document.getElementById('start-coordinates').value;
    const direction = document.getElementById('direction').value;
    console.log('Ship type:', SHIPTYPE);
    console.log('Start coordinates:', STARTCOORDINATES);
    console.log('Direction:', direction);
    console.log('SHIPNAME: en shipplacementform: ', SHIPNAME);
    placeShip(SHIPNAME, SHIPTYPE, STARTCOORDINATES, direction, 1);
});

let destroyer = {
    name: 'destroyer',
    length: 2,
    direction: null,
    startCoordinates: null,
    hits: 0,
    status: 'alive',
    sunkAlerted: false,
    repairs: 0
};

let cruiser = {
    name: 'cruiser',
    length: 3,
    direction: null,
    startCoordinates: null,
    hits: 0,
    status: 'alive',
    sunkAlerted: false,
    repairs: 0
};

let warship = {
    name: 'warship',
    length: 4,
    direction: null,
    startCoordinates: null,
    hits: 0,
    status: 'alive',
    sunkAlerted: false,
    repairs: 0
};

let submarine = {
    name: 'submarine',
    length: 3,
    direction: null,
    startCoordinates: null,
    hits: 0,
    status: 'alive',
    sunkAlerted: false,
    repairs: 0
};

let carrier = {
    name: 'carrier',
    length: 5,
    direction: null,
    startCoordinates: null,
    hits: 0,
    status: 'alive',
    sunkAlerted: false,
    repairs: 0
};

function placeShip(shipName, shipType, startCoordinates, direction, time) {
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
            if (direction == 0) {
                CELL.classList.add('horizontal');
            }

        }
        shipCount++;

        if (time == 1) {
            checkShips();
            const COORD = `${STARTROW}${STARTCOL}`;
            /*ships.set(startCoordinates, {
                startCoordinates: COORD,
                direction: direction,
                length: SHIPLENGTH
            });
*/
            switch (shipName) {
                case 'carrier':
                    carrier.direction = direction;
                    carrier.startCoordinates = startCoordinates;
                    break;
                case 'warship':
                    warship.direction = direction;
                    warship.startCoordinates = startCoordinates;
                    break;
                case 'submarine':
                    submarine.direction = direction;
                    submarine.startCoordinates = startCoordinates;
                    break;
                case 'cruiser':
                    cruiser.direction = direction;
                    cruiser.startCoordinates = startCoordinates;
                    break;
                case 'destroyer':
                    destroyer.direction = direction;
                    destroyer.startCoordinates = startCoordinates;
                    break;
            }

            /*if(shipName == 'submarine'){
                submarine.direction = direction;
                submarine.startCoordinates = startCoordinates;
            } else if (shipName==){
                carrier.direction = direction;
                carrier.startCoordinates = startCoordinates;
            }*/
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
            console.log('Acorazado: ', warship);
            console.log('Crucero: ', cruiser);
            console.log('Destructor: ', destroyer);
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
    if (!cpuMode) {
        const message = JSON.stringify({
            type: 'player-ready',
            gameId: currentGameId,
            playerId: userName
        });
        ws.send(message);
    }
    if(cpuMode){
        document.getElementById('send-moves-container').style.display = 'block';
    }
    playMatchSound('start');
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
            if (position.getAttribute('data-player') != playerId) {
                if (position.querySelector('.shield') && response == '') {
                    position.querySelector('.shield').remove();
                    alert('Alerta, tu escudo ha sido golpeado');
                    answer = 'shield';
                } else if (position.classList.contains('ship') && response == '') {
                    const hitDiv = document.createElement('div');
                    hitDiv.className = 'hit';
                    position.appendChild(hitDiv);
                    answer = 'hit';
                } else if (response == 'hit') {
                    const hitDiv = document.createElement('div');
                    hitDiv.className = 'hit';
                    position.appendChild(hitDiv);
                    answer = 'hit';
                } else if (response == 'miss') {
                    const missDiv = document.createElement('div');
                    missDiv.className = 'miss';
                    position.appendChild(missDiv);
                    answer = 'miss';
                } else if (response == 'mine') {
                    const explosionDiv = document.createElement('div');
                    explosionDiv.className = 'explosion';
                    position.appendChild(explosionDiv);
                    answer = 'mine';
                } else if (position.getAttribute('data-player') == userName && response == '') {
                    if (position.querySelector('.mine')) {
                        position.querySelector('.mine').remove();
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
    checkGameOver();
    if (response == '' && playerId != userName) {
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

function checkSunk() {
    checkShipSunk(submarine);
    checkShipSunk(carrier);
    checkShipSunk(warship);
    checkShipSunk(destroyer);
    checkShipSunk(cruiser);
}
function checkShipSunk(ship) {
    if (!ship || !ship.startCoordinates) {
        return;
    }    
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
            hits++;
        }
    }
    ship.hits = hits;
    if (hits == ship.length) {
        ship.status = 'sunk';
        if(!ship.sunkAlerted){
            console.log(`${ship.name} fue hundido`);
            alert(`${ship.name} fue hundido!`);
            ship.sunkAlerted = true;
        }
        updatePlayerPoints(0);
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

function placeCPUShips() {
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
    const { row, col } = move;
    const boardSize = 10;
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) {
        return false;
    }
    if (row + 2 >= boardSize || col + 2 >= boardSize) {
        return false;
    }
    return true;
}
let turn = true;

function handlePlayerMove(coordinates) {
    console.log("HandlePlayerMove called");
    if(playerMoves.has(coordinates)){
        alert('Ya has atacado a esta casilla. Por favor, selecciona otra.');
        return;
    }
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
        playerMoves.add(coordinates);
        if (checkGameOver()) {
            return;
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
        if (checkGameOver()) {
            return;
        }
    }
}
let cpuMode = false;
let playerMoves = new Set();

function loadMoves(moveInput) {
    console.log('moveinput ', moveInput);
    const moves = [];
    const row = parseInt(moveInput[0], 10);
    const col = parseInt(moveInput[1], 10);

    if (row === null || col === null) {
        console.error('Invalid move input:', moveInput);
        return;
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            moves.push({ row: row + i, col: col + j });
        }
    }

    const message = JSON.stringify({
        type: 'cruise',
        gameId: currentGameId,
        playerId: userName,
        moves: moves
    });
    console.log('movimientos antes de enviar: ', moves);
    ws.send(message);
}
document.getElementById('send-moves-form').addEventListener('submit', function (event) {
    event.preventDefault();
    let type = 'move';
    const moveInput = event.target.querySelector('input[type="text"]').value;
    if (playerMoves.has(moveInput)) {
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
            loadMoves(moveInput);
            updatePlayerPoints(-15);
            playerMoves.add(moveInput);
        } else {
            alert('Invalid move for cruise missile. Please enter a valid coordinate.', moveInput);
            playerMoves.delete(moveInput);
        }
    }
    moveInput.value = '';
    if (!cruiseMissileMode) {
        const message = JSON.stringify({
            type: type,
            coordinates: moveInput,
            gameId: currentGameId,
            playerId: userName,
        });
        ws.send(message);
    }
    if (emp != 0) {
        emp--;
    }
    if (shieldTurns == 0) {
        removeShields();
    } else {
        shieldTurns--;
    }
    if (empCooldown != 0) {
        empCooldown--;
    }
    if(cruiseMissileMode){
        cruiseMissileMode = false;
    }
    empAttack();
    console.log("Turnos EMP restantes: ", emp);
});


const onlineGames = document.getElementById('online-games');
const connectedPlayers = document.getElementById('connected-players');
const connectedPlayersUl = document.getElementById('connected-players-ul');
const matchId = document.getElementById('match-id');

function updatePlayerList(players) {
    const connectedPlayersUl = document.getElementById('connected-players-ul');
    connectedPlayersUl.innerHTML = '';
    players.forEach((playerId) => {
        const li = document.createElement('li');
        li.textContent = playerId;
        connectedPlayersUl.appendChild(li);
    });
    connectedPlayers.style.display = "block";
}

function updateOnlineGamesList(games) {
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
                console.log(data.playerUsername, ' has connected to server:', data.message, 'current game ids: ', data.gameIds);
                updateOnlineGamesList(data.gameIds);
                break;
            case 'move':
                console.log('Move received:', data);
                console.log('Coordinates:', data.move, "Type: ", typeof (data.move));
                displayMove(data.move, data.sender, '');
                checkSunk();
                updatePlayerPoints(0);
                break;
            case 'not-turn':
                alert('No es tu turno todavia');
                playerMoves.delete(data.move);
                break;
            case 'turn-over':
                document.getElementById('enviar').style.display = 'none';
                document.getElementById('air-strike-container').style.display = 'none';
                document.getElementById('cruiser-missile-container').style.display = 'none';
                turn = false;
                console.log('Turn over: ', data);
                break;
            case 'turn-active':
                document.getElementById('enviar').style.display = 'block';
                document.getElementById('air-strike-container').style.display = 'flex';
                document.getElementById('attack-planes').style.display = 'block';
                document.getElementById('cruiser-missile-container').style.display = 'flex';
                document.getElementById('cruise-missile').style.display = 'block';
                console.log('Turn active: ', data);
                turn = true;
                break;
            case 'response':
                console.log('Received from player: ', data.playerId);
                console.log('It was a: ', data.response);
                if (data.response == 'hit') {
                    updatePlayerPoints(5);
                }
                if (data.response == 'mine') {
                    randomHit();
                }
                if (data.response == 'shield') {
                    playerMoves.delete(data.coordinates);
                    alert('Tu movimiento fue bloqueado');
                }
                console.log(data);
                displayMove(data.coordinates, data.playerId, data.response);
                break;
            case 'cruise':
                console.log('Mensaje cruise: ', data);
                handleMultipleAttacks(data.moves, 'cruise-response');
                checkSunk();
                break;
            case 'cruise-response':
                console.log('Mensjae cruise-response: ', data);
                data.moves.forEach(move => {
                    if(move.response == 'mine'){
                        randomHit();
                    }
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
                document.getElementById('online-games').style = 'display: none;';
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
                document.getElementById('online-games').style = 'display: none;';
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
                checkSunk();
                break;
            case 'attack-planes-response':
                console.log('Attack planes response received:', data);
                data.moves.forEach(move => {
                    if(move.response == 'mine'){
                        randomHit();
                    }
                    displayMove(move.coordinates, data.playerId, move.response);
                });
                break;
            case 'emp-attack':
                console.log('EMP received');
                alert("Has recibido un ataque EMP");
                playMatchSound('empReceived');
                emp = 3;
                empAttack();
                break;
            case 'game-created':
                /* const onlineGamesUl = document.getElementById('online-games-ul');
                 onlineGamesUl.appendChild 
                 console.log('A game with the id of _ was created by the player _');
                 */
                break;
            case 'all-games':
                console.log(data);
                console.log(data.gameIds);
                updateOnlineGamesList(data.gameIds)
                break;
            case 'player-out':
                console.log('Player out: ', data);
                handlePlayerOut(data);
                break;
            case 'repair':
                handleRepair(data);
                break;
            default:
                console.log('Unknown message type:', data);
        }
    } catch (e) {
        console.error('Error parsing JSON:', e, 'Data received:', event.data);
    }
};

function handlePlayerOut(data) {
    const playerId = data.playerId;
    alert(`Jugador ${playerId} ha sido derrotado`);
    const playerTable = document.querySelector(`.battleship-board[data-player="${playerId}"]`);
    console.log(playerTable);
    if (playerTable) {
        playerTable.remove();
    }
    if(document.querySelectorAll('.battleship-board').length == 1){
        alert('Has ganado la partida!');
        showWinWindow(userName);
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
            areShieldsAvailable = true;
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
            areShieldsAvailable = true;
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
window.addEventListener('wheel', function (event) {
    const section = document.getElementById('inicio');

    if (event.deltaY > 0 && !isCollapsed) {
        section.classList.add('collapsed');
        isCollapsed = true;
    } else if (event.deltaY < 0 && isCollapsed) {
        section.classList.remove('collapsed');
        isCollapsed = false;
    }
});

// codiguito para los sonidos de la interfaz
const hoverSound = document.getElementById('hover-sound');
const clickSound = document.getElementById('click-medium-sound');
const menuItems = document.querySelectorAll('.menu-hover-fill a, button, input, footer a');
let hoverSoundsAllowed = true;
let clickSoundsAllowed = true;

function playSound() {
    if (hoverSoundsAllowed) {
        hoverSound.currentTime = 0;
        hoverSound.play();
    }
}

function playClickSound() {
    if (clickSoundsAllowed) {
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

dropdownBtn.addEventListener('click', function () {
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

muteSoundsOption.addEventListener('click', function () {
    toggleSoundsText(muteSoundsOption);
});

document.addEventListener('mouseup', function (e) {
    if (!dropdownMenu.contains(e.target)) {
        dropdownMenu.style.display = 'none';
    }
});


//POWER-UPS
let playerPoints = 5;

document.getElementById('sonar').addEventListener('click', function (event) {
    event.stopPropagation();
    event.preventDefault();
    sonar();
    playMatchSound('sonarLaunched');
    updatePlayerPoints(-5);
});

document.getElementById('attack-planes').addEventListener('click', function (event) {
    event.stopPropagation();
    event.preventDefault();
    attackPlanes();
    playMatchSound('airStrikeLaunched');
    updatePlayerPoints(-10);
});

let mineCoordinates = '';
document.getElementById('mine-placement-form').addEventListener('submit', function (event) {
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
        playMatchSound('minePlaced');
    } else if (clickedButton == 'remove-mine') {
        removeSeaMine(mineCoordinates, BOARD);
        document.getElementById('add-mine').style.display = 'block';
        document.getElementById('remove-mine').style.display = 'none';
    }
});
let shieldTurns = -2;

let areShieldsAvailable = true;

function removeShields() {
    const BOARD = document.querySelector(`.battleship-board[data-player="${userName}"]`);
    const shields = BOARD.querySelectorAll('.shield');
    shields.forEach(shield => {
        shield.remove();
    });
    if (areShieldsAvailable) {
        alert('Los escudos han expirado');
        areShieldsAvailable = false;
    }
}
function defensiveShield() {
    if(document.getElementById('defensive-shield-form')){
        return;
    }
    const form = document.createElement('form');
    form.id = 'defensive-shield-form';
    form.innerHTML = `
        <label for="shield-coordinates">Ingrese las coordenadas iniciales del escudo (ej. 00):</label>
        <input type="text" id="shield-coordinates" name="shield-coordinates" maxlength="2" required>
        <button type="submit">Poner escudo</button>
    `;
    const send = document.getElementById('send-moves-container');
    send.appendChild(form);

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const coordinates = document.getElementById('shield-coordinates').value;
        const row = parseInt(coordinates[0], 10);
        const col = parseInt(coordinates[1], 10);

        if (isNaN(row) || isNaN(col) || row > 7 || col > 7) {
            alert('Coordenadas invalidas');
            return;
        }
        addShield(row, col);
        form.remove();
        shieldTurns = 2;
       
        document.getElementById('defensive-shield').remove();
        document.getElementById('force-field-container').remove();
    });
}

function addShield(row, col) {
    const BOARD = document.querySelector(`.battleship-board[data-player="${userName}"]`);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const targetRow = row + i;
            const targetCol = col + j;
            const CELL = BOARD.querySelector(`.position[data-player="${userName}"][data-row="${targetRow}"][data-col="${targetCol}"]`);
            if (CELL) {
                const shieldDiv = document.createElement('div');
                shieldDiv.className = 'shield';
                CELL.appendChild(shieldDiv);
                playMatchSound('shieldLaunched');
            }
        }
    }
}

document.getElementById('defensive-shield').addEventListener('click', function (event) {
    event.stopPropagation();
    event.preventDefault();
    defensiveShield();
});
let cruiseMissileMode = false;
document.getElementById('cruise-missile').addEventListener('click', function (event) {
    event.stopPropagation();
    event.preventDefault();
    cruiseMissileMode = !cruiseMissileMode;
    this.classList.toggle('active', cruiseMissileMode);
    console.log('Cruise missile mode:', cruiseMissileMode);
    cruiseMissileMode ? alert('Modo de misil de crucero activado') : alert('Modo de misil de crucero desactivado');
});

document.getElementById('quick-repair').addEventListener('click', function (event) {
    event.stopPropagation();
    event.preventDefault();
    quickRepair();
});

let emp = 0;
function empAttack() {
    const powerUps = document.getElementById('power-ups');
    if (emp != 0) {
        powerUps.style.display = 'none';
    } else {
        powerUps.style.display = 'block';
    }
}
let empCooldown = 0;
document.getElementById('emp-attack').addEventListener('click', function (event) {
    event.stopPropagation();
    event.preventDefault();
    updatePlayerPoints(-25);
    const message = JSON.stringify({
        type: 'emp-attack',
        gameId: currentGameId,
        playerId: userName
    });
    ws.send(message);
    empCooldown = 10;
    document.getElementById('emp-attack').style.display = 'none';
    document.getElementById('emp-container').style.display = 'none';
});

function seaMine(coordinates, BOARD) {
    const ROW = parseInt(coordinates[0]);
    const col = parseInt(coordinates[1]);
    const CELL = BOARD.querySelector(`.position[data-player="${userName}"][data-row="${ROW}"][data-col="${col}"]`);
    const mineDiv = document.createElement('div');
    mineDiv.className = 'mine';
    CELL.appendChild(mineDiv);
    updatePlayerPoints(-5);
}

function removeSeaMine(coordinates, BOARD) {
    const ROW = parseInt(coordinates[0]);
    const col = parseInt(coordinates[1]);
    const CELL = BOARD.querySelector(`.position[data-player="${userName}"][data-row="${ROW}"][data-col="${col}"]`);
    CELL.querySelector('.mine').remove();
    updatePlayerPoints(5);
}

function randomHit() {
    const BOARD = document.querySelector(`.battleship-board[data-player="${userName}"]`);
    const ROW = Math.floor(Math.random() * 10);
    const COL = Math.floor(Math.random() * 10);
    const CELL = BOARD.querySelector(`.position[data-player="${userName}"][data-row="${ROW}"][data-col="${COL}"]`);
    console.log("randomHit called");

    if (CELL) {
        if (CELL.classList.contains('ship')) {
            if (CELL.querySelector('.shield')) {
                alert('Explosion bloqueada por escudo');
                CELL.querySelector('.shield').remove();
            } else {
                const hitDiv = document.createElement('div');
                hitDiv.className = 'hit';
                answer = 'hit';
                CELL.appendChild(hitDiv);
                console.log(`Hit added at (${ROW}, ${COL})`);
            }
        } else {
            const missDiv = document.createElement('div');
            missDiv.className = 'miss';
            answer = 'miss';
            CELL.appendChild(missDiv);
            console.log(`Miss added at (${ROW}, ${COL})`);
        }
    } else {
        console.error(`Cell at (${ROW}, ${COL}) not found`);
    }
    const MESSAGE = JSON.stringify({
        type: 'response',
        gameId: currentGameId,
        playerId: userName,
        coordinates: `${ROW}${COL}`,
        response: answer
    })
    ws.send(MESSAGE);
}

function updatePlayerPoints(points) {
    playerPoints += points;
    document.getElementById('player-points').textContent = `Puntos: ${playerPoints}`;
    displayPowerUps(playerPoints);
}
let airStrikeNotice 
let sonarNotice
function displayPowerUps(points) {
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
    if (points >= 5) {
        //console.log('mostrando sonar');
        if(points==5){playMatchSound('sonarReady');}
        sonar.style.display = 'block';
        sonarContainer.style.display = 'flex';
    } else {
        sonar.style.display = 'none';
        sonarContainer.style.display = 'none';
    }
    if (points >= 10) {
        if(turn){
            attackPlanes.style.display = 'block';
            attackPlanesContainer.style.display = 'flex';  
        }
        quickRepair.style.display = 'block';
        quickRepairContainer.style.display = 'flex';
        
        if(points==10){
            playMatchSound('airStrikeReady');
            setTimeout(function() {
                playMatchSound('quickFixReady');
            }, 2000);
        }
    } else {
        attackPlanes.style.display = 'none';
        attackPlanesContainer.style.display = 'none';
        quickRepair.style.display = 'none';
        quickRepairContainer.style.display = 'none';
    }
    if (points >= 15) {

        if (defensiveShield) {
            defensiveShield.style.display = 'block';
            defensiveShieldContainer.style.display = 'flex';
            if(points==15){playMatchSound('shieldReady');}
        }
        if(turn){
            cruiseMissile.style.display = 'block';
            cruiseMissileContainer.style.display = 'flex';
        }
        if(points==5){
            setTimeout(function() {
                playMatchSound('missileReady');
            }, 2000);
        }
        
    } else {
        if (defensiveShield) {
            defensiveShield.style.display = 'none';
            defensiveShieldContainer.style.display = 'none';
        }
        cruiseMissile.style.display = 'none';
        cruiseMissileContainer.style.display = 'none';
    }
    if (points >= 20) {
        if (empCooldown == 0) {
            empAttack.style.display = 'block';
            empAttackContainer.style.display = 'flex';
            if(points==20){playMatchSound('empReady');}
        }

    } else {
        empAttack.style.display = 'none';
        empAttackContainer.style.display = 'none';
    }
    if (carrier.status == 'sunk') {
        attackPlanes.style.display = 'none';
        attackPlanesContainer.style.display = 'none';
    }
    if (submarine.status == 'sunk') {
        sonar.style.display = 'none';
        sonarContainer.style.display = 'none';
    }
}

function scanTable(coordinates, playerId) {
    let response = '';
    const BOARD = document.querySelector(`.battleship-board[data-player="${userName}"]`);
    const ROW = parseInt(coordinates[0]);
    const COL = parseInt(coordinates[1]);
    const CELL = BOARD.querySelector(`.position[data-player="${userName}"][data-row="${ROW}"][data-col="${COL}"]`);
    if (CELL.classList.contains('ship')) {
        response = 'hit';
    } else {
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

function sonar() {
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

function attackPlanes() {
    const moves = [];
    for (let i = 0; i < 5; i++) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        moves.push({ row, col });
        playerMoves.add(`${row}${col}`);
        playMatchSound('airStrikeLaunched');
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
    let block = false;
    const responses = moves.map(move => {
        const { row, col } = move;
        if (row === null || col === null) {
            return { coordinates: `${row}${col}`, response: 'invalid' };
        }
        const CELL = BOARD.querySelector(`.position[data-player="${userName}"][data-row="${row}"][data-col="${col}"]`);
        let response;

        if (CELL.classList.contains('ship')) {
            if (CELL.querySelector('.shield')) {
                block = true;
                CELL.querySelector('.shield').remove();
                response = 'shield';
            } else
                if (!CELL.classList.contains('hit')) {
                    const hitDiv = document.createElement('div');
                    hitDiv.className = 'hit';
                    CELL.appendChild(hitDiv);
                    checkShipSunk();
                    response = 'hit';
                }
        }else if(CELL.querySelector('.mine')){
            CELL.querySelector('.mine').remove();
            const explosion = document.createElement('div');
            explosion.className = 'explosion';
            CELL.appendChild(explosion);
            response = 'mine';
        } else {
            if (!CELL.querySelector('.miss')) {
                const missDiv = document.createElement('div');
                missDiv.className = 'miss';
                CELL.appendChild(missDiv);
                response = 'miss';
            } else {
                response= 'x';
            }

        }
        return { coordinates: `${row}${col}`, response };
    });
    if(block){
        alert('Ataque bloqueado por escudo');
        playMatchSound('hitBlocked');
    }
    const message = JSON.stringify({
        type: type,
        gameId: currentGameId,
        playerId: userName,
        moves: responses
    });

    ws.send(message);
    if(checkGameOver()){
        return;
    }
}


function checkGameOver() {
    let playerHitCount = 0;
    let cpuHitCount = 0;

    if (cpuMode) {
        const playerCells = document.querySelectorAll(`.position[data-player="${userName}"]`);
        playerCells.forEach(cell => {
            if (cell.querySelector('.hit')) {
                playerHitCount++;
                console.log('Player hit count:', playerHitCount);
            }
        });
        const cpuCells = document.querySelectorAll(`.position[data-player="CPU"]`);
        cpuCells.forEach(cell => {
            if (cell.querySelector('.hit')) {
                cpuHitCount++;
                console.log('CPU hit count:', cpuHitCount);
            }
        });

        if (playerHitCount == 17) {
            console.log('Player has been defeated');
            showLoseWindow(userName);
            return true;
        }

        if (cpuHitCount == 17) {
            console.log('CPU has been defeated');
            showWinWindow(userName);
            return true;
        }
    } else {
        const userCells = document.querySelectorAll(`.position[data-player="${userName}"]`);
        userCells.forEach(cell => {
            if (cell.querySelector('.hit')) {
                playerHitCount++;
            }
        });

        if (playerHitCount == 17) {
            const message = JSON.stringify({
                type: 'player-out',
                gameId: currentGameId,
                playerId: userName
            });
            ws.send(message);
            console.log('Player has been defeated');
            showLoseWindow(userName);
            return true;
        }
    }
    return false;
}

function endGame(winner) {
    alert(`${winner} ha ganado!`);
}

function quickRepair() {
    if(document.getElementById('quick-repair-form')){
        return;
    }
    const form = document.createElement('form');
    form.id = 'quick-repair-form';
    form.innerHTML = `
        <label for="repair-coordinates">Ingrese coordenadas para reparar (ej. 00):</label>
        <input type="text" id="repair-coordinates" name="repair-coordinates" maxlength="2" required>
        <button type="submit">Reparar</button>
    `;
    document.getElementById('send-moves-form').appendChild(form);

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const coordinates = document.getElementById('repair-coordinates').value;
        const row = parseInt(coordinates[0], 10);
        const col = parseInt(coordinates[1], 10);

        if (isNaN(row) || isNaN(col) || row > 9 || col > 9) {
            alert('Coordenadas invalidas.');
            return;
        }
        const cell = document.querySelector(`.position[data-player="${userName}"][data-row="${row}"][data-col="${col}"]`);
        if (!cell) {
            alert('Coordenadas invalidas.');
            return;
        }
        const hitDiv = cell.querySelector('.hit');
        if (!hitDiv) {
            alert('Ningun hit encontrado en las coordenadas dadas.');
            return;
        }
        const ship = getShipAtCoordinates(row, col);
        if (ship && ship.status == 'sunk') {
            alert('No se puede reparar, barco hundido.');
            return;
        }
        if (ship && ship.repairs == 2){
            alert(`Limite de reparaciones para ${ship.name} alcanzado`);
            return;
        }

        hitDiv.remove();
        form.remove();
        playMatchSound('quickFixLaunched');
        alert('Barco Reparado!');
        ship.repairs ++;
        message = JSON.stringify({
            type: 'repair',
            gameId: currentGameId,
            playerId: userName,
            coordinates: coordinates
        });
        ws.send(message);

        updatePlayerPoints(-10);
    });
}
function getShipAtCoordinates(row, col) {
    const ships = [submarine, carrier, warship, destroyer, cruiser];
    for (const ship of ships) {
        if (!ship.startCoordinates) continue;
        const startRow = parseInt(ship.startCoordinates[0], 10);
        const startCol = parseInt(ship.startCoordinates[1], 10);
        for (let i = 0; i < ship.length; i++) {
            let currentRow = startRow;
            let currentCol = startCol;
            if (ship.direction == 1) {
                currentRow += i;
            } else {
                currentCol += i;
            }
            if (currentRow === row && currentCol === col) {
                return ship;
            }
        }
    }
    return null;
}

document.getElementById('quick-repair').addEventListener('click', function (event) {
    event.stopPropagation();
    event.preventDefault();
    quickRepair();
});

function handleRepair(data){
    const { playerId, coordinates } = data;
    const row = parseInt(coordinates[0], 10);
    const col = parseInt(coordinates[1], 10);
    const cell = document.querySelector(`.position[data-player="${playerId}"][data-row="${row}"][data-col="${col}"]`);
    if (cell) {
        const hitDiv = cell.querySelector('.hit');
        if (hitDiv) {
            hitDiv.remove();
        }
    }
    playerMoves.delete(coordinates);
}
function showWinWindow(winner) {
    const container = document.querySelector('div.tables');
    const deck = document.getElementById('deck');
    const placedShipsDiv = document.getElementById('placed-ships');
    const sendMovesDivContainer = document.getElementById('send-moves-container');
    
    deck.style.display='none';
    placedShipsDiv.style.display='none';
    sendMovesDivContainer.style.display='none';
    
    container.innerHTML = `
        <section id="win-window">
            <h2><b>«</b>MISIÓN CUMPLIDA<b>»</b></h2>
            <p>Felicidades, ${winner}. La tormenta ha pasado, y tu flota emerge victoriosa.</p>
            <p> Has demostrado que en el caos, solo los fuertes sobreviven.</p>
            <button onclick="goBackToLobbyWin()">Volver al lobby</button>
        </section>
    `;
    
}

function showLoseWindow(loser) {
    const container = document.querySelector('div.tables');
    const deck = document.getElementById('deck');
    const placedShipsDiv = document.getElementById('placed-ships');
    const sendMovesDivContainer = document.getElementById('send-moves-container');
    
    deck.style.display='none';
    placedShipsDiv.style.display='none';
    sendMovesDivContainer.style.display='none';

    container.innerHTML = `
        <section id="lose-window">
            <h2><b>«</b>MISIÓN FALLIDA<b>»</b></h2>
            <p>El mar ha hablado. Hoy no es tu día, comandante ${loser}.</p>
            <p>Regresa a la mesa de estrategia y prepárate para la próxima batalla.</p>
            <button onclick="goBackToLobbyLose()">Volver al lobby</button>
        </section>
    `;
}

function goBackToLobbyWin(){
    const winWindow = document.getElementById('win-window');
    const lobby = document.getElementById('lobby');

    winWindow.remove()
    lobby.style.display='block';    
    document.getElementById('start-game').style.display = 'none';
    document.getElementById('create-game').style.display = 'block';
    document.getElementById('join-game').style.display = 'block';
    document.getElementById('online-games').style.display = 'block';
    
    const connectedPlayer = document.getElementById('connected-players');
    const gameIdInput = document.getElementById('game-id');

    if (connectedPlayer) {
        connectedPlayer.style.display = 'none';
        console.log('Connected player element hid');
    } else {
        console.error('Element with ID "connected-player" not found.');
    }

    if (gameIdInput) {
        gameIdInput.style.display = 'block';
        console.log('Game ID input element shown');
    } else {
        console.error('Element with ID "game-id" not found.');
    }
}

function goBackToLobbyLose(){
    const loseWindow = document.getElementById('lose-window');
    const lobby = document.getElementById('lobby');
    
    loseWindow.remove()
    lobby.style.display='block';
    document.getElementById('start-game').style.display = 'none';
    document.getElementById('create-game').style.display = 'block';
    document.getElementById('join-game').style.display = 'block';
    document.getElementById('online-games').style.display = 'block';
    
    const connectedPlayer = document.getElementById('connected-players');
    const gameIdInput = document.getElementById('game-id');

    if (connectedPlayer) {
        connectedPlayer.style.display = 'none';
        console.log('Connected player element hid');
    } else {
        console.error('Element with ID "connected-player" not found.');
    }

    if (gameIdInput) {
        gameIdInput.style.display = 'block';
        console.log('Game ID input element shown');
    } else {
        console.error('Element with ID "game-id" not found.');
    }
}


//codiguito pa los sonidos de las partidas
let matchSoundsAllowed=true;

const sounds = {
    airStrikeReady: [
        new Audio('../media/match-sounds/power-ups/airstrike/airstrike-ready (1).mp3')
    ],
    airStrikeLaunched: [
        new Audio('../media/match-sounds/power-ups/airstrike/airstrike-launched.mp3')
    ],
    empReady: [
        new Audio('../media/match-sounds/power-ups/emp/emp-ready (1).mp3'),
        new Audio('../media/match-sounds/power-ups/emp/emp-ready (2).mp3')
    ],
    empLaunched: [
        new Audio('../media/match-sounds/power-ups/emp/emp-launched.mp3')
    ],
    empReceived: [
        new Audio('../media/match-sounds/power-ups/emp/emp-received (1).mp3'),
        new Audio('../media/match-sounds/power-ups/emp/emp-received (2).mp3')
    ],
    empGone: [
        new Audio('../media/match-sounds/power-ups/emp/emp-gone.mp3')
    ],
    minePlaced: [
        new Audio('../media/match-sounds/power-ups/mines/mine-placed (1).mp3'),
        new Audio('../media/match-sounds/power-ups/mines/mine-placed (2).mp3')
    ],
    missileReady: [
        new Audio('../media/match-sounds/power-ups/missile/missile-ready (1).mp3'),
        new Audio('../media/match-sounds/power-ups/missile/missile-ready (2).mp3')
    ],
    missileLaunched: [
        new Audio('../media/match-sounds/power-ups/missile/missile-launched.mp3')
    ],
    quickFixReady: [
        new Audio('../media/match-sounds/power-ups/quickfix/quick-fix-ready (1).mp3'),
        new Audio('../media/match-sounds/power-ups/quickfix/quick-fix-ready (2).mp3')
    ],
    quickFixLaunched: [
        new Audio('../media/match-sounds/power-ups/quickfix/quick-fix-launched.mp3')
    ],
    shieldReady: [
        new Audio('../media/match-sounds/power-ups/shield/shield-ready (1).mp3'),
        new Audio('../media/match-sounds/power-ups/shield/shield-ready (2).mp3')
    ],
    shieldLaunched: [
        new Audio('../media/match-sounds/power-ups/shield/shield-launched.mp3')
    ],
    sonarReady: [
        new Audio('../media/match-sounds/power-ups/sonar/sonar-ready (1).mp3'),
        new Audio('../media/match-sounds/power-ups/sonar/sonar-ready (2).mp3')
    ],
    sonarLaunched: [
        new Audio('../media/match-sounds/power-ups/sonar/sonar-launched.mp3'),
    ],
    start: [
        new Audio('../media/match-sounds/inicios/start (1).mp3'),
        new Audio('../media/match-sounds/inicios/start (2).mp3'),
        new Audio('../media/match-sounds/inicios/start (3).mp3'),
        new Audio('../media/match-sounds/inicios/start (4).mp3'),
        new Audio('../media/match-sounds/inicios/start (5).mp3'),
        new Audio('../media/match-sounds/inicios/start (6).mp3')
    ],
    gameWin: [
        new Audio('../media/match-sounds/gameovers/game-win (1).mp3'),
        new Audio('../media/match-sounds/gameovers/game-win (2).mp3'),
        new Audio('../media/match-sounds/gameovers/game-win (3).mp3'),
        new Audio('../media/match-sounds/gameovers/game-win (4).mp3'),
        new Audio('../media/match-sounds/gameovers/game-win (5).mp3')
    ],
    gameLoss: [
        new Audio('../media/match-sounds/gameovers/game-loss (1).mp3'),
        new Audio('../media/match-sounds/gameovers/game-loss (2).mp3'),
        new Audio('../media/match-sounds/gameovers/game-loss (3).mp3')
    ],
    roundWin: [
        new Audio('../media/match-sounds/rounds/round-win (1).mp3'),
        new Audio('../media/match-sounds/rounds/round-win (2).mp3')
    ],
    roundLoss: [
        new Audio('../media/match-sounds/rounds/round-loss (1).mp3'),
        new Audio('../media/match-sounds/rounds/round-loss (2).mp3')
    ],
    lastShipStanding: [
        new Audio('../media/match-sounds/last-ship-standing/last-ship-standing (1).mp3'),
        new Audio('../media/match-sounds/last-ship-standing/last-ship-standing (2).mp3')
    ],
    hitBlocked: [
        new Audio('../media/match-sounds/hit-blocked.mp3')
    ]
};




function playMatchSound(type) {
    if (sounds[type]) {
        // Selecciona un índice aleatorio del array correspondiente
        const randomIndex = Math.floor(Math.random() * sounds[type].length);
        
        // Reinicia el sonido si ya ha sido reproducido
        sounds[type][randomIndex].currentTime = 0;
        
        // Reproduce el sonido seleccionado
        sounds[type][randomIndex].play();
    } else {
        console.warn(`Tipo de sonido "${type}" no encontrado.`);
    }
}