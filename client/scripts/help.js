let loggedInPlayers = [];
let playerPasswords = [];
let supportedPLayers = ['player1','player2','player3','player4'];

let playersList = [];

console.log(typeof playersList);

class Player{
    constructor(username,password){
        this.username = username;
        this.password = password;
    }
}

/*function savePlayer(player) {
    playersList.push(player); // Agrega el nuevo jugador a la lista
     // Convertir la lista de jugadores a formato JSON
     const jsonData = JSON.stringify(playersList, null, 2); // El segundo parámetro es para formatear el JSON

     // Guardar el archivo
     fs.writeFile('players.json', jsonData, (err) => {
         if (err) {
             console.error('Error al guardar el archivo:', err);
         } else {
             console.log('Archivo players.json guardado exitosamente.');
         }
     });
}*/

function savePlayer2(player){
    let playerToSave = JSON.stringify(player);
    let parsedPlayer = JSON.parse(playerToSave);
    console.log(`Player to save ${playerToSave}`);
    console.log(parsedPlayer);
}

function savePlayersToJSON() {
    const jsonPlayers = JSON.stringify(playersList); // Convertir a JSON
    localStorage.setItem('players.json', jsonPlayers); // Guardar en localStorage
}

function loadPlayers(){}

function printPlayers(players) {
    players.forEach(player => {
        console.log(`Username: ${player.username}, Password: ${player.password}`);
    });
}
function validateLogIn(user,password){
    
    if(playersList.some(player => (player.username === user))){
        if(playersList.some(player => ((player.username === user)&&(player.password===password)))){
            alert('Log In Succesful!');
            return true;
        }else{
            alert('Invalid password');
            return false;
        }
    }    
    else{
        alert('User not registered');
        return false;
    }    
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('log-in');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const loginBox = document.querySelector('a[data-text=iniciar-sesion]');
        const username = document.getElementById('username-log-in').value;
        const password = document.getElementById('password-log-in').value;
    
        if(validateLogIn(username,password)){
            form.style = 'display: none';
            loginBox.innerHTML = `Hello, ${username}`;
        } 
    });
});


let shipCount = 0;

const socket = new WebSocket('ws://localhost:8080');
socket.addEventListener('open', function (event) {
    console.log('Connected to WebSocket server');
});
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    const message = JSON.parse(event.data);
    if (message.type == 'updateBoard') {
        updateBoard(message.boardId, message.boardData);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registro-usuario');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const gameMode = document.querySelector('input[name="game-mode"]:checked').value;
        const player = document.querySelector('input[name="player"]:checked').value;
        console.log(username, password, gameMode, player);
        const deck = document.getElementById('deck');
        const placedShips = document.getElementById('placed-ships');
        deck.style.display = 'block';
        placedShips.style.display = 'block';
        createTable(`battleship-board-1`, username);
        form.style.display = 'none';

    });
});
function createTable(name, userName){
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
    placeShip(shipType, startCoordinates, direction);
});

function placeShip(shipType, startCoordinates, direction) {
    const board = document.getElementById('battleship-board-1');
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
        shipCount++;
        console.log('Ship count:', shipCount);

        const shipTypeSelect = document.getElementById('ship-type');
        shipTypeSelect.options[shipTypeSelect.selectedIndex].remove();

        checkShips();
    } catch (error) {
        console.error('Error placing ship:', error);
        alert('Ocurrió un error al colocar el barco. Por favor, inténtelo de nuevo.');
    }
}
function deleteShip(shipType, startCoordinates, direction) {
    const board = document.getElementById('battleship-board-1');
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
    tables.innerHTML = '';
    for(let i = 1; i <= playerCount; i++){
        createTable(`battleship-board-${i}`, i, 'normal');
    }
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
