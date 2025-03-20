// 游戏常量
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const SPEED = 5;
const GROUND_HEIGHT = 40;
const MARIO_WIDTH = 40;
const MARIO_HEIGHT = 60;
const BRICK_WIDTH = 50;
const BRICK_HEIGHT = 50;
const COIN_SIZE = 30;
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 40;

// 游戏状态
let score = 0;
let lives = 3;
let gameStarted = false;
let gameOver = false;

// 画布设置
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// 游戏对象
const mario = {
    x: 50,
    y: canvasHeight - GROUND_HEIGHT - MARIO_HEIGHT,
    width: MARIO_WIDTH,
    height: MARIO_HEIGHT,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    facingRight: true
};

// 创建平台
const platforms = [
    { x: 0, y: canvasHeight - GROUND_HEIGHT, width: canvasWidth, height: GROUND_HEIGHT },
    { x: 200, y: canvasHeight - 150, width: 100, height: 20 },
    { x: 400, y: canvasHeight - 200, width: 100, height: 20 },
    { x: 600, y: canvasHeight - 150, width: 100, height: 20 }
];

// 创建砖块
const bricks = [
    { x: 300, y: canvasHeight - 250, width: BRICK_WIDTH, height: BRICK_HEIGHT },
    { x: 350, y: canvasHeight - 250, width: BRICK_WIDTH, height: BRICK_HEIGHT },
    { x: 500, y: canvasHeight - 300, width: BRICK_WIDTH, height: BRICK_HEIGHT }
];

// 创建金币
const coins = [
    { x: 300, y: canvasHeight - 300, width: COIN_SIZE, height: COIN_SIZE, collected: false },
    { x: 500, y: canvasHeight - 350, width: COIN_SIZE, height: COIN_SIZE, collected: false },
    { x: 650, y: canvasHeight - 200, width: COIN_SIZE, height: COIN_SIZE, collected: false }
];

// 创建敌人
const enemies = [
    { x: 300, y: canvasHeight - GROUND_HEIGHT - ENEMY_HEIGHT, width: ENEMY_WIDTH, height: ENEMY_HEIGHT, velocityX: -2 },
    { x: 600, y: canvasHeight - GROUND_HEIGHT - ENEMY_HEIGHT, width: ENEMY_WIDTH, height: ENEMY_HEIGHT, velocityX: -2 }
];

// 按键状态
const keys = {
    left: false,
    right: false,
    up: false
};

// 事件监听器
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
    if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') && !mario.isJumping) {
        keys.up = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') keys.up = false;
});

// 移动设备控制
document.getElementById('left-button').addEventListener('mousedown', () => keys.left = true);
document.getElementById('right-button').addEventListener('mousedown', () => keys.right = true);
document.getElementById('jump-button').addEventListener('mousedown', () => {
    if (!mario.isJumping) keys.up = true;
});

document.getElementById('left-button').addEventListener('mouseup', () => keys.left = false);
document.getElementById('right-button').addEventListener('mouseup', () => keys.right = false);
document.getElementById('jump-button').addEventListener('mouseup', () => keys.up = false);

// 触摸事件支持
document.getElementById('left-button').addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys.left = true;
});
document.getElementById('right-button').addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys.right = true;
});
document.getElementById('jump-button').addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!mario.isJumping) keys.up = true;
});

document.getElementById('left-button').addEventListener('touchend', () => keys.left = false);
document.getElementById('right-button').addEventListener('touchend', () => keys.right = false);
document.getElementById('jump-button').addEventListener('touchend', () => keys.up = false);

// 开始游戏按钮
document.getElementById('start-button').addEventListener('click', () => {
    if (gameOver) {
        resetGame();
    }
    gameStarted = true;
    document.getElementById('start-button').textContent = '重新开始';
});

// 检测碰撞
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// 更新游戏状态
function update() {
    if (!gameStarted || gameOver) return;

    // 应用重力
    mario.velocityY += GRAVITY;

    // 水平移动
    if (keys.left) {
        mario.velocityX = -SPEED;
        mario.facingRight = false;
    } else if (keys.right) {
        mario.velocityX = SPEED;
        mario.facingRight = true;
    } else {
        mario.velocityX = 0;
    }

    // 跳跃
    if (keys.up && !mario.isJumping) {
        mario.velocityY = JUMP_FORCE;
        mario.isJumping = true;
    }

    // 更新位置
    mario.x += mario.velocityX;
    mario.y += mario.velocityY;

    // 边界检测
    if (mario.x < 0) mario.x = 0;
    if (mario.x + mario.width > canvasWidth) mario.x = canvasWidth - mario.width;

    // 重置跳跃状态
    mario.isJumping = true;

    // 平台碰撞检测
    platforms.forEach(platform => {
        if (
            mario.y + mario.height > platform.y &&
            mario.y + mario.height < platform.y + platform.height + 10 &&
            mario.x + mario.width > platform.x &&
            mario.x < platform.x + platform.width &&
            mario.velocityY > 0
        ) {
            mario.y = platform.y - mario.height;
            mario.velocityY = 0;
            mario.isJumping = false;
        }
    });

    // 砖块碰撞检测
    bricks.forEach(brick => {
        if (checkCollision(mario, brick)) {
            // 从下方碰撞
            if (mario.velocityY < 0 && mario.y + mario.height <= brick.y + 20) {
                mario.velocityY = 0;
                mario.y = brick.y + brick.height;
            } 
            // 从上方碰撞
            else if (mario.velocityY > 0 && mario.y >= brick.y - mario.height) {
                mario.y = brick.y - mario.height;
                mario.velocityY = 0;
                mario.isJumping = false;
            }
            // 从侧面碰撞
            else if (mario.facingRight) {
                mario.x = brick.x - mario.width;
            } else {
                mario.x = brick.x + brick.width;
            }
        }
    });

    // 金币碰撞检测
    coins.forEach(coin => {
        if (!coin.collected && checkCollision(mario, coin)) {
            coin.collected = true;
            score += 100;
            updateScore();
        }
    });

    // 敌人移动和碰撞检测
    enemies.forEach(enemy => {
        enemy.x += enemy.velocityX;

        // 敌人碰到边界就转向
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvasWidth) {
            enemy.velocityX *= -1;
        }

        // 检测和平台的碰撞
        platforms.forEach(platform => {
            if (
                enemy.x + enemy.width > platform.x &&
                enemy.x < platform.x + platform.width &&
                enemy.y + enemy.height >= platform.y &&
                enemy.y + enemy.height <= platform.y + 10
            ) {
                enemy.y = platform.y - enemy.height;
            }
        });

        // 玛丽与敌人碰撞
        if (checkCollision(mario, enemy)) {
            // 从上方跳到敌人头上
            if (mario.velocityY > 0 && mario.y + mario.height < enemy.y + enemy.height / 2) {
                enemy.velocityX = 0;
                enemy.y = canvasHeight + 100; // 移出屏幕
                score += 200;
                updateScore();
                mario.velocityY = JUMP_FORCE / 2; // 弹起
            } else {
                // 从其他方向碰撞，玛丽受伤
                lives--;
                updateLives();
                
                if (lives <= 0) {
                    gameOver = true;
                    document.getElementById('start-button').textContent = '重新开始';
                } else {
                    // 重置玛丽位置
                    mario.x = 50;
                    mario.y = canvasHeight - GROUND_HEIGHT - MARIO_HEIGHT;
                    mario.velocityY = 0;
                }
            }
        }
    });

    // 掉落死亡
    if (mario.y > canvasHeight) {
        lives--;
        updateLives();
        
        if (lives <= 0) {
            gameOver = true;
            document.getElementById('start-button').textContent = '重新开始';
        } else {
            // 重置玛丽位置
            mario.x = 50;
            mario.y = canvasHeight - GROUND_HEIGHT - MARIO_HEIGHT;
            mario.velocityY = 0;
        }
    }
}

// 更新分数显示
function updateScore() {
    document.getElementById('score').textContent = `分数: ${score}`;
}

// 更新生命数显示
function updateLives() {
    document.getElementById('lives').textContent = `生命: ${lives}`;
}

// 绘制游戏对象
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 绘制背景
    ctx.fillStyle = '#6B8CFF';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 绘制平台
    ctx.fillStyle = '#8B4513';
    platforms.forEach(platform => {
        if (platform.y === canvasHeight - GROUND_HEIGHT) {
            // 地面
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // 草
            ctx.fillStyle = '#228B22';
            ctx.fillRect(platform.x, platform.y, platform.width, 10);
        } else {
            // 其他平台
            ctx.fillStyle = '#A0522D';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }
    });

    // 绘制砖块
    ctx.fillStyle = '#B87333';
    bricks.forEach(brick => {
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        
        // 砖块花纹
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(brick.x + 5, brick.y + 5, brick.width - 10, 2);
        ctx.fillRect(brick.x + 5, brick.y + brick.height - 7, brick.width - 10, 2);
    });

    // 绘制金币
    ctx.fillStyle = '#FFD700';
    coins.forEach(coin => {
        if (!coin.collected) {
            ctx.beginPath();
            ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // 绘制敌人
    ctx.fillStyle = '#8B0000';
    enemies.forEach(enemy => {
        if (enemy.y < canvasHeight) {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            // 敌人眼睛
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(enemy.x + 10, enemy.y + 15, 5, 0, Math.PI * 2);
            ctx.arc(enemy.x + enemy.width - 10, enemy.y + 15, 5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(enemy.x + 10, enemy.y + 15, 2, 0, Math.PI * 2);
            ctx.arc(enemy.x + enemy.width - 10, enemy.y + 15, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // 绘制马里奥
    if (mario.facingRight) {
        ctx.fillStyle = 'red';
        ctx.fillRect(mario.x, mario.y, mario.width, mario.height);
        
        // 帽子
        ctx.fillRect(mario.x - 5, mario.y, mario.width + 10, 10);
        
        // 脸
        ctx.fillStyle = '#FFA07A';
        ctx.fillRect(mario.x, mario.y + 10, mario.width, 20);
        
        // 眼睛
        ctx.fillStyle = 'white';
        ctx.fillRect(mario.x + mario.width - 15, mario.y + 15, 10, 10);
        ctx.fillStyle = 'black';
        ctx.fillRect(mario.x + mario.width - 10, mario.y + 18, 4, 4);
        
        // 胡子
        ctx.fillStyle = 'black';
        ctx.fillRect(mario.x + mario.width - 20, mario.y + 25, 15, 3);
        
        // 裤子
        ctx.fillStyle = 'blue';
        ctx.fillRect(mario.x, mario.y + 30, mario.width, 30);
    } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(mario.x, mario.y, mario.width, mario.height);
        
        // 帽子
        ctx.fillRect(mario.x - 5, mario.y, mario.width + 10, 10);
        
        // 脸
        ctx.fillStyle = '#FFA07A';
        ctx.fillRect(mario.x, mario.y + 10, mario.width, 20);
        
        // 眼睛
        ctx.fillStyle = 'white';
        ctx.fillRect(mario.x + 5, mario.y + 15, 10, 10);
        ctx.fillStyle = 'black';
        ctx.fillRect(mario.x + 6, mario.y + 18, 4, 4);
        
        // 胡子
        ctx.fillStyle = 'black';
        ctx.fillRect(mario.x + 5, mario.y + 25, 15, 3);
        
        // 裤子
        ctx.fillStyle = 'blue';
        ctx.fillRect(mario.x, mario.y + 30, mario.width, 30);
    }

    // 如果游戏未开始
    if (!gameStarted) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('点击"开始游戏"按钮开始', canvasWidth / 2, canvasHeight / 2);
    }

    // 如果游戏结束
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束', canvasWidth / 2, canvasHeight / 2 - 30);
        ctx.fillText(`最终分数: ${score}`, canvasWidth / 2, canvasHeight / 2 + 20);
    }
}

// 重置游戏
function resetGame() {
    score = 0;
    lives = 3;
    gameOver = false;
    
    mario.x = 50;
    mario.y = canvasHeight - GROUND_HEIGHT - MARIO_HEIGHT;
    mario.velocityX = 0;
    mario.velocityY = 0;
    
    enemies.forEach((enemy, index) => {
        if (index === 0) {
            enemy.x = 300;
            enemy.y = canvasHeight - GROUND_HEIGHT - ENEMY_HEIGHT;
            enemy.velocityX = -2;
        } else {
            enemy.x = 600;
            enemy.y = canvasHeight - GROUND_HEIGHT - ENEMY_HEIGHT;
            enemy.velocityX = -2;
        }
    });
    
    coins.forEach(coin => {
        coin.collected = false;
    });
    
    updateScore();
    updateLives();
}

// 游戏循环
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// 开始游戏循环
gameLoop();