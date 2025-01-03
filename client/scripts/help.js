let shipCount = 0;

const socket = new WebSocket('ws://localhost:8080');
socket.addEventListener('open', function (event) {
    console.log('Connected to WebSocket server');
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const deck = document.getElementById('deck');
        const placedShips = document.getElementById('placed-ships');
        deck.style.display = 'block';
        placedShips.style.display = 'block';
        createTable(`battleship-board-1`, username);
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
