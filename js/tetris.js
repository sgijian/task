const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');
const blockSize = 30;
canvas.width = blockSize * 10; // 先设定画布宽度
canvas.height = blockSize * 20; // 先设定画布高度
const widthInBlocks = canvas.width / blockSize;
const heightInBlocks = canvas.height / blockSize;
let speed = 500; // 初始速度，单位为毫秒
let timerId = null;
let gameBoard = createGameBoard();
let currentShape = getRandomShape();
let currentShapeX = Math.floor(widthInBlocks / 2 - currentShape[0].length / 2);
let currentShapeY = 0;
let score = 0;
let level = 1; // 初始化等级
const initialLevelUpScore = 10; // 第一次升级所需分数
function updateScoreboard(scoreDelta = 0) {
    score += scoreDelta;
    const scoreboardElement = document.getElementById('scoreboard');
    scoreboardElement.textContent = `得分: ${score}`;

    // 计算下次升级所需的分数
    const nextLevelUpScore = initialLevelUpScore * Math.pow(2, level - 1);

    // 检查玩家是否升级
    if (score >= nextLevelUpScore) {
        level++; // 等级提升
        // 触发玩家升级事件
        const event = new Event('playerLeveledUp');
        document.dispatchEvent(event);
        console.log(`升级到第${level}级`);
    }
}
    // 检查玩家是否升级
    if (score % 20 === 0) { // 假设每100分升级一次
        // 触发玩家升级事件
        const event = new Event('playerLeveledUp');
        document.dispatchEvent(event);
    }



// 在checkAndRemoveFullLines函数内部，消除满行后调用updateScoreboard
function checkAndRemoveFullLines() {
    for (let i = heightInBlocks - 1; i >= 0; i--) {
        let isFull = true;
        for (let j = 0; j < widthInBlocks; j++) {
            if (!gameBoard[i][j]) {
                isFull = false;
                break;
            }
        }
        if (isFull) {
            gameBoard.splice(i, 1);
            gameBoard.unshift(Array(widthInBlocks).fill(0));
            score += 10;
            updateScoreboard(); // 添加这一行，确保分数增加后更新计分板
        }
    }
}
updateScoreboard();
function createGameBoard() {
    let board = [];
    for (let i = 0; i < heightInBlocks; i++) {
        board[i] = [];
        for (let j = 0; j < widthInBlocks; j++) {
            board[i][j] = 0;
        }
    }
    return board;
}

function getRandomShape() {
    const shapes = [
        [[1, 1, 1, 1]], // I
        [[1, 1], [1, 1]], // O
        [[1, 1, 0], [0, 1, 1]], // S
        [[0, 1, 1], [1, 1, 0]], // Z
        [[1, 1, 1], [0, 1, 0]], // L
        [[0, 1, 0], [1, 1, 1]], // J
        [[1, 1, 0], [0, 1, 1]] // T
    ];
    return shapes[Math.floor(Math.random() * shapes.length)];
}

function drawBlock(x, y, color = 'blue') {
    ctx.fillStyle = color;
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
}

function drawGameBoard() {
    for (let i = 0; i < heightInBlocks; i++) {
        for (let j = 0; j < widthInBlocks; j++) {
            if (gameBoard[i][j]) {
                drawBlock(j, i);
            }
        }
    }
}

function drawCurrentShape() {
    for (let i = 0; i < currentShape.length; i++) {
        for (let j = 0; j < currentShape[i].length; j++) {
            if (currentShape[i][j]) {
                drawBlock(currentShapeX + j, currentShapeY + i, 'red');
            }
        }
    }
}

function rotateShape() {
    const rotatedShape = [];
    for (let i = 0; i < currentShape[0].length; i++) {
        rotatedShape[i] = [];
        for (let j = currentShape.length - 1; j >= 0; j--) {
            rotatedShape[i][j] = currentShape[j][i];
        }
    }
    return rotatedShape;
}

function checkCollision(newX, newY, newShape) {
    for (let i = 0; i < newShape.length; i++) {
        for (let j = 0; j < newShape[i].length; j++) {
            if (newShape[i][j]) {
                let x = newX + j;
                let y = newY + i;
                if (y >= heightInBlocks || x < 0 || x >= widthInBlocks || gameBoard[y][x]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function placeShape() {
    for (let i = 0; i < currentShape.length; i++) {
        for (let j = 0; j < currentShape[i].length; j++) {
            if (currentShape[i][j]) {
                gameBoard[currentShapeY + i][currentShapeX + j] = 1;
            }
        }
    }
    checkAndRemoveFullLines();
    currentShape = getRandomShape();
    currentShapeX = Math.floor(widthInBlocks / 2 - currentShape[0].length / 2);
    currentShapeY = 0;
    if (checkCollision(currentShapeX, currentShapeY, currentShape)) {
        // Game Over logic could be implemented here
        console.log("Game Over");
    }
}

function checkAndRemoveFullLines() {
    for (let i = heightInBlocks - 1; i >= 0; i--) {
        let isFull = true;
        for (let j = 0; j < widthInBlocks; j++) {
            if (!gameBoard[i][j]) {
                isFull = false;
                break;
            }
        }
        if (isFull) {
            gameBoard.splice(i, 1);
            gameBoard.unshift(Array(widthInBlocks).fill(0));
            score += 10;
            console.log('Score increased:', score); // 添加这一行，用于调试
            updateScoreboard(); // 添加这一行，确保分数增加后更新计分板
        }
    }
}

// 更新计分板
let instantDrop = false; // 保留标志变量


document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        // 移除之前的instantDrop逻辑，改为直接移动方块到最底部
        let newY = currentShapeY;
        while (!checkCollision(currentShapeX, newY + 1, currentShape)) {
            newY++;
        }
        currentShapeY = newY;
        placeShape();
    } else if (e.key === 'ArrowLeft') {
        currentShapeX--;
        if (checkCollision(currentShapeX, currentShapeY, currentShape)) {
            currentShapeX++;
        }
    } else if (e.key === 'ArrowRight') {
        currentShapeX++;
        if (checkCollision(currentShapeX, currentShapeY, currentShape)) {
            currentShapeX--;
        }
    } else if (e.key === 'ArrowUp') {
        const rotated = rotateShape();
        if (!checkCollision(currentShapeX, currentShapeY, rotated)) {
            currentShape = rotated;

        }
    }

});

let paused = false; // 添加暂停标志

// 获取按钮元素
const pauseButton = document.getElementById('pauseButton');
const restartButton = document.getElementById('restartButton');

// 暂停按钮点击事件处理
pauseButton.addEventListener('click', () => {
    paused = !paused;
    if (!paused) {
        animate();
    } else {
        clearTimeout(timerId);
    }
});


restartButton.addEventListener('click', () => {

    clearTimeout(timerId);
    paused = false;
    score = 0;
    gameBoard = createGameBoard();
    currentShape = getRandomShape();
    currentShapeX = Math.floor(widthInBlocks / 2 - currentShape[0].length / 2);
    currentShapeY = 0;
    speed = 500;
    updateScoreboard();
    animate();
});
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGameBoard();
    drawCurrentShape();


    if (instantDrop) {
        while (!checkCollision(currentShapeX, currentShapeY + 1, currentShape)) {
            currentShapeY++;
        }
        instantDrop = false;
        placeShape();
    } else if (!checkCollision(currentShapeX, currentShapeY + 1, currentShape)) {
        currentShapeY++;
    } else {
        placeShape();
        if (speed > 100) {
            speed -= 15;
        }
    }

    checkAndRemoveFullLines();

    timerId = setTimeout(() => {
        requestAnimationFrame(animate);
    }, speed);
}
function changeBackgroundBasedOnLevel() {
    const imageUrl = `../image/backgrounds/background${level}.jpg`;
    document.body.style.backgroundImage = `url(${imageUrl})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
}


document.addEventListener('playerLeveledUp', () => {
    console.log("玩家升级，更换背景...");
    changeBackgroundBasedOnLevel();
});


changeBackgroundBasedOnLevel();
    updateScoreboard();
    animate();

