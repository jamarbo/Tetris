const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scale = 30; // Tamaño de cada celda
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let tetrominoes = [
    // T
    [
        [0, 1, 0],
        [1, 1, 1]
    ],
    // O
    [
        [1, 1],
        [1, 1]
    ],
    // L
    [
        [0, 1],
        [0, 1],
        [1, 1]
    ],
    // Z
    [
        [1, 1, 0],
        [0, 1, 1]
    ]
    //... puedes agregar más formas aquí
];

let tetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
let tetroX = Math.floor(columns / 2) - Math.ceil(tetromino[0].length / 2);
let tetroY = 0;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibuja el tetromino
    for(let y = 0; y < tetromino.length; y++) {
        for(let x = 0; x < tetromino[y].length; x++) {
            if(tetromino[y][x]) {
                ctx.fillRect((tetroX + x) * scale, (tetroY + y) * scale, scale, scale);
            }
        }
    }

    tetroY++;

    requestAnimationFrame(draw);
}

draw();



// ... Anteriores definiciones ...

let board = Array.from({ length: rows }, () => Array(columns).fill(0));
let score = 0;

document.addEventListener('keydown', control);

function control(event) {
    switch (event.keyCode) {
        case 37: // Left arrow
            moveTetromino(-1, 0);
            break;
        case 39: // Right arrow
            moveTetromino(1, 0);
            break;
        case 40: // Down arrow
            moveTetromino(0, 1);
            break;
        case 38: // Up arrow
            rotateTetromino();
            break;
    }
}

function moveTetromino(dirX, dirY) {
    if (!collides(tetroX + dirX, tetroY + dirY, tetromino)) {
        tetroX += dirX;
        tetroY += dirY;
    } else if (dirY === 1) { 
        mergeToBoard();
        checkForLine();
        resetTetromino();
    }
}

function collides(x, y, tetromino) {
    for (let row = 0; row < tetromino.length; row++) {
        for (let col = 0; col < tetromino[row].length; col++) {
            if (tetromino[row][col] &&
               (board[row + y] && board[row + y][col + x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function mergeToBoard() {
    for (let y = 0; y < tetromino.length; y++) {
        for (let x = 0; x < tetromino[y].length; x++) {
            if (tetromino[y][x]) {
                board[y + tetroY][x + tetroX] = 1;
            }
        }
    }
}

function resetTetromino() {
    tetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    tetroX = Math.floor(columns / 2) - Math.ceil(tetromino[0].length / 2);
    tetroY = 0;

    if (collides(tetroX, tetroY, tetromino)) {
        board = Array.from({ length: rows }, () => Array(columns).fill(0));
    }
}

function checkForLine() {
    outer: for (let y = rows - 1; y >= 0; y--) {
        for (let x = 0; x < columns; x++) {
            if (board[y][x] === 0) {
                continue outer;
            }
        }

        board.splice(y, 1);
        board.unshift(Array(columns).fill(0));

        score += 10;
    }
}

function rotateTetromino() {
    const rotated = tetromino[0].map((_, index) => tetromino.map(row => row[index])).reverse();

    if (!collides(tetroX, tetroY, rotated)) {
        tetromino = rotated;
    }
}

function drawBoard() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            if (board[y][x]) {
                ctx.fillRect(x * scale, y * scale, scale, scale);
            }
        }
    }
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText("Score: " + score, 10, 10);
}

// En la función draw, añadir al final:

drawBoard();
drawScore();
