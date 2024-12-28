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
    const headers = [ userName, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    for(let i = 0; i < 11; i++){
        const cell = document.createElement('div');
        cell.className = "border";
        cell.id = headers[i];
        cell.textContent = headers[i];
        board.appendChild(cell);
    }
    for (let i = 0; i < 10; i++) { 
        const rowHeader = document.createElement('div'); 
        rowHeader.className = 'border'; 
        rowHeader.id = i; 
        rowHeader.textContent = i+1; 
        board.appendChild(rowHeader); 
        for (let j = 0; j < 10; j++) { 
            cell = document.createElement('div'); 
            cell.className = 'position'; 
            cell.id = i; 
            board.appendChild(cell); 
        } 
    }
    boards.appendChild(board);
}