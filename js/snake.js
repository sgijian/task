
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');

    let snake = [{x: 10, y: 10}];
    let food = {x: 20, y: 20};
    let dx = 10;
    let dy = 0;
    let speed = 100;
    let score = 0;
    let isGameRunning = true; // 用来追踪游戏是否正在运行
    let needsRestart = false; // 用于标记游戏是否需要重置

    function drawFood() {
        ctx.fillStyle = "#f00";
        ctx.fillRect(food.x, food.y, 10, 10);
    }

    function moveSnake() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            document.getElementById('scoreDisplay').textContent = score;
            generateFood();
        } else {
            snake.pop();
        }
    }
    document.getElementById('startPauseBtn').addEventListener('click', function() {
        isGameRunning = !isGameRunning;
        if (isGameRunning) {
            gameLoop(); // 如果游戏从暂停状态恢复，重新开始游戏循环
        }
    });

    document.getElementById('resetBtn').addEventListener('click', function() {
        needsRestart = true; // 标记游戏需要重置
        // 可选：直接调用gameOver函数来重置游戏，或者在gameLoop中检查needsRestart标志
        // 注意：直接调用gameOver会弹出分数提示，可能不是最佳用户体验
    });

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * 40) * 10,
            y: Math.floor(Math.random() * 40) * 10
        };
    }

    function checkCollision() {
        const head = snake[0];
        if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
            gameOver();
        }
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
            }
        }
    }

    function gameOver() {
        alert("Game Over! Your score: " + score);
        snake = [{x: 10, y: 10}];
        dx = 10;
        dy = 0;
        score = 0;
        generateFood();
    }

    function gameLoop() {
        if (!isGameRunning) return
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snake.forEach(function(part) {
            ctx.fillStyle = "#0f0";
            ctx.fillRect(part.x, part.y, 10, 10);
        });

        drawFood();
        moveSnake();
        checkCollision();
        setTimeout(gameLoop, speed);
        if (needsRestart) {
            // 重置游戏逻辑
            needsRestart = false;
            snake = [{x: 10, y: 10}];
            dx = 10;
            dy = 0;
            score = 0;
            document.getElementById('scoreDisplay').textContent = score;
            generateFood();
        }



    }


    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 37 && dx !== 10) {dx = -10; dy = 0;}
        else if (e.keyCode === 38 && dy !== 10) {dx = 0; dy = -10;}
        else if (e.keyCode === 39 && dx !== -10) {dx = 10; dy = 0;}
        else if (e.keyCode === 40 && dy !== -10) {dx = 0; dy = 10;}
    });


    generateFood();
    gameLoop();
});
