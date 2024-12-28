document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registro-usuario');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const gameMode = document.querySelector('input[name="game-mode"]:checked').value;
        const player = document.querySelector('input[name="player"]:checked').value;
        console.log(username, password, gameMode, player);
        createTable(`battleship-board-${player}`, username, gameMode);
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