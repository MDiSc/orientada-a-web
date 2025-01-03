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

function placeShip(shipType, startCoordinates, direction) {
    const board = document.getElementById('battleship-board-player1');
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
function deleteShip(shipType, startCoordinates, direction) {
    const board = document.getElementById('battleship-board-player1');
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
}