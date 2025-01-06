let shipCount = 0;
let ships = new Map();
let currentGameId=-777;
let inGameLobby=false;

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

function displayMove(coordinates) {
    console.log(coordinates);
    const cell = document.getElementById(coordinates);
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
let mainUsername ='John Doe';
const playerId = generatePlayerId();
const ws = new WebSocket('ws://localhost:8080');
let playersOnline = 0;

document.addEventListener('DOMContentLoaded', function() {
    const usernameForm = document.getElementById('main-username-form');
    usernameForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newMainUsername = document.getElementById('main-username');
        mainUsername=newMainUsername.value;
        readyToConnectToServer=true;
        console.log(`The main username now is ${mainUsername}`);
        console.log(readyToConnectToServer);

        console.log('Connected to server');
        const message = JSON.stringify({
            type: 'connection',
            playerId: playerId,
            playerUsername: mainUsername
        });
        ws.send(message);
    
    });
});

const onlineGames = document.getElementById('online-games');
const connectedPlayers = document.getElementById('connected-players');
const connectedPlayersUl = document.getElementById('connected-players-ul');
const matchId = document.getElementById('match-id');
    
ws.onmessage = function(event) {
    try {
        const data = JSON.parse(event.data);
        switch (data.type) {
            case 'send-move':
                console.log('Move received:', data);
                console.log('Coordinates:', data.coordinates);
                displayMove(data.coordinates);
                break;
            case 'gameCreated':
                console.log('Game created with the id of', data.gameId);
                console.log('Creator:', data.creatorId);
                console.log('la data dice: ', data);
                currentGameId=data.gameId;
                inGameLobby=true;
                onlineGames.style = 'display: none;';
                connectedPlayers.style = 'display: block;';
                connectedPlayersUl.innerHTML = `<li>${data.creatorId}</li>`;
                matchId.innerHTML += data.gameId;
                break;
            case 'join-game':
                //if(playerId!==data.playerId){
                console.log('A player with the id of', data.playerId ,'has joined the game!');
                console.log('la data dice: ', data);
                connectedPlayersUl.innerHTML += `<li>${data.creatorId}</li>`;
                //}
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
        const id = generatePlayerId();
        const message = JSON.stringify({
            type: 'create-game',
            playerId: playerId,
            gameId: id
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
            playerId: playerId,
            gameId: gameIdInput.value
        });
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
            console.log('Sent:', message);
        } else {
            console.log('WebSocket is not open');
        }
    });
    document.getElementById('send-move').addEventListener('click', () => {
        const message = JSON.stringify({
            type: 'send-move',
            coordinates: document.getElementById('move').value,
            sender: playerId,
            receiver: receiverPlayerId,
            gameId: gameIdInput.value
        });
        if(ws.readyState === WebSocket.OPEN){
            ws.send(message);
            console.log('Sent: ', message);
        }else {
            console.log('WebSocket is not open');
        }
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    sendMessage();
});

console.log(playerId)