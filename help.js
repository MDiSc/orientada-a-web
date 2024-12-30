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

function savePlayer(player){
    let playerToSave = JSON.stringify(player);
    let parsedPlayer = JSON.parse(playerToSave);
    console.log(`Player to save ${playerToSave}`);
    console.log(parsedPlayer);
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

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registro-usuario');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const gameMode = document.querySelector('input[name="game-mode"]:checked').value;
        const player = document.querySelector('input[name="player"]:checked').value;
        const currentPlayer = document.getElementById(player);
        if(currentPlayer.dataset.exists==='false'){
            if(playersList.some(player => player.username === username)){
                alert('Username already in use! Try another one')
            }else{
                console.log(username, password, gameMode, player);
                createTable(`battleship-board-${player}`, username, gameMode);
                currentPlayer.dataset.exists='true';
                playersList.push(new Player(username,password));
                savePlayer(playersList.find(player => player.username===username));
                console.log(typeof playersList);
                printPlayers(playersList);
            }
        }else{
            alert(`${player} already created`);
        }
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
    placeShip(shipType, startCoordinates, direction);
});

function placeShip(shipType, startCoordinates, direction){
    const board = document.getElementById('battleship-board-player1');
    const startRow = parseInt(startCoordinates[0]);
    const startCol = parseInt(startCoordinates[1]);
    const shipLength = shipType;
    const cells = board.getElementsByClassName('position');
    let cellIndex = startRow * 10 + startCol;
    for(let i = 0; i < shipLength; i++){
        if(direction == 1){
            cells[cellIndex + i * 10].classList.add('ships');
            cells[cellIndex + i * 10].classList.add('ship');
        }else{
            cells[cellIndex + i].classList.add('ship');
            cells[cellIndex + i].classList.add('ship');
        }
    }
}





function togglePLayerOptions() {
    const multiPlayerRadio = document.getElementById('multi-player');
    const singlePLayerRadio = document.getElementById('single-player');
    const multiplayerDiv = document.getElementById('multiplayer-div');
    const foreverAloneDiv = document.getElementById('forever-alone-div');

    if (multiPlayerRadio.checked) {
        multiplayerDiv.style = 'display: block'; 
        foreverAloneDiv.style = 'display: block';
    } 
    if(singlePLayerRadio.checked){
        foreverAloneDiv.style = 'display: block';
        multiplayerDiv.style = 'display: none';
    }
    /*else {
        multiplayerDiv.style.display = 'none';
        foreverAloneDiv.style.display = 'none'; 
    }*/
}


document.querySelectorAll('input[name="game-mode"]').forEach(radio => {
    radio.addEventListener('change', togglePLayerOptions);
});

togglePLayerOptions();

