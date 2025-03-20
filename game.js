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
const MUSHROOM_WIDTH = 40;
const MUSHROOM_HEIGHT = 40;
const QUESTION_BLOCK_WIDTH = 50;
const QUESTION_BLOCK_HEIGHT = 50;
const PIPE_WIDTH = 70;
const PIPE_HEIGHT = 100;
const PIRANHA_WIDTH = 50;
const PIRANHA_HEIGHT = 60;

// 视口和世界尺寸 - 大幅增加世界宽度并改进视口逻辑
const WORLD_WIDTH = 5000; // 游戏世界的总宽度从3000增加到5000
const viewportOffset = { x: 0 }; // 视口偏移
const VIEWPORT_PADDING = 200; // 增加视口边缘缓冲区，让玩家能看到更远

// 游戏状态
let score = 0;
let lives = 3;
let gameStarted = false;
let gameOver = false;
let marioIsBig = false; // 马里奥是否吃到蘑菇变大

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
    facingRight: true,
    worldX: 50 // 在整个游戏世界中的实际X坐标
};

// 创建平台
const platforms = [
    { x: 0, y: canvasHeight - GROUND_HEIGHT, width: WORLD_WIDTH, height: GROUND_HEIGHT },
    { x: 200, y: canvasHeight - 150, width: 100, height: 20 },
    { x: 400, y: canvasHeight - 200, width: 100, height: 20 },
    { x: 600, y: canvasHeight - 150, width: 100, height: 20 },
    { x: 800, y: canvasHeight - 200, width: 100, height: 20 },
    { x: 1000, y: canvasHeight - 180, width: 100, height: 20 },
    { x: 1200, y: canvasHeight - 220, width: 150, height: 20 }
];

// 创建砖块
const bricks = [
    { x: 300, y: canvasHeight - 250, width: BRICK_WIDTH, height: BRICK_HEIGHT },
    { x: 350, y: canvasHeight - 250, width: BRICK_WIDTH, height: BRICK_HEIGHT },
    { x: 500, y: canvasHeight - 300, width: BRICK_WIDTH, height: BRICK_HEIGHT },
    { x: 700, y: canvasHeight - 250, width: BRICK_WIDTH, height: BRICK_HEIGHT },
    { x: 900, y: canvasHeight - 300, width: BRICK_WIDTH, height: BRICK_HEIGHT },
    { x: 950, y: canvasHeight - 300, width: BRICK_WIDTH, height: BRICK_HEIGHT }
];

// 创建问号砖块
const questionBlocks = [
    { x: 250, y: canvasHeight - 250, width: QUESTION_BLOCK_WIDTH, height: QUESTION_BLOCK_HEIGHT, hit: false, hasMushroom: true, mushroomReleased: false },
    { x: 450, y: canvasHeight - 300, width: QUESTION_BLOCK_WIDTH, height: QUESTION_BLOCK_HEIGHT, hit: false, hasMushroom: true, mushroomReleased: false },
    { x: 750, y: canvasHeight - 250, width: QUESTION_BLOCK_WIDTH, height: QUESTION_BLOCK_HEIGHT, hit: false, hasMushroom: true, mushroomReleased: false },
    { x: 850, y: canvasHeight - 300, width: QUESTION_BLOCK_WIDTH, height: QUESTION_BLOCK_HEIGHT, hit: false, hasMushroom: false, mushroomReleased: false }, // 这个只有金币
    { x: 1100, y: canvasHeight - 250, width: QUESTION_BLOCK_WIDTH, height: QUESTION_BLOCK_HEIGHT, hit: false, hasMushroom: true, mushroomReleased: false }
];

// 创建金币
const coins = [
    { x: 300, y: canvasHeight - 300, width: COIN_SIZE, height: COIN_SIZE, collected: false },
    { x: 500, y: canvasHeight - 350, width: COIN_SIZE, height: COIN_SIZE, collected: false },
    { x: 650, y: canvasHeight - 200, width: COIN_SIZE, height: COIN_SIZE, collected: false },
    { x: 800, y: canvasHeight - 250, width: COIN_SIZE, height: COIN_SIZE, collected: false },
    { x: 1000, y: canvasHeight - 230, width: COIN_SIZE, height: COIN_SIZE, collected: false }
];

// 创建蘑菇
const mushrooms = [];

// 创建敌人
const enemies = [
    { x: 300, y: canvasHeight - GROUND_HEIGHT - ENEMY_HEIGHT, width: ENEMY_WIDTH, height: ENEMY_HEIGHT, velocityX: -2 },
    { x: 600, y: canvasHeight - GROUND_HEIGHT - ENEMY_HEIGHT, width: ENEMY_WIDTH, height: ENEMY_HEIGHT, velocityX: -2 },
    { x: 900, y: canvasHeight - GROUND_HEIGHT - ENEMY_HEIGHT, width: ENEMY_WIDTH, height: ENEMY_HEIGHT, velocityX: -2 }
];

// 创建管道
const pipes = [
    { x: 400, y: canvasHeight - GROUND_HEIGHT - PIPE_HEIGHT, width: PIPE_WIDTH, height: PIPE_HEIGHT, hasPiranha: true },
    { x: 800, y: canvasHeight - GROUND_HEIGHT - PIPE_HEIGHT, width: PIPE_WIDTH, height: PIPE_HEIGHT, hasPiranha: true },
    { x: 1200, y: canvasHeight - GROUND_HEIGHT - PIPE_HEIGHT, width: PIPE_WIDTH, height: PIPE_HEIGHT, hasPiranha: true }
];

// 创建食人花
const piranhas = pipes.map(pipe => {
    if (pipe.hasPiranha) {
        return {
            x: pipe.x + (pipe.width - PIRANHA_WIDTH) / 2,
            y: pipe.y - PIRANHA_HEIGHT / 2, // 一开始只露出一半
            width: PIRANHA_WIDTH,
            height: PIRANHA_HEIGHT,
            maxY: pipe.y - PIRANHA_HEIGHT + 10, // 完全露出的位置
            minY: pipe.y + pipe.height / 2, // 完全藏进管道的位置
            direction: -1, // -1向上移动，1向下移动
            moveSpeed: 0.5, // 移动速度
            moveCounter: 0, // 移动计数
            restCounter: 0, // 休息计数
            isResting: false, // 是否正在休息
            pipeX: pipe.x, // 所在管道的X坐标
            pipeWidth: pipe.width // 所在管道的宽度
        };
    }
    return null;
}).filter(piranha => piranha !== null);

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

// 更精确的碰撞检测
function getCollisionDirection(obj1, obj2) {
    const dx = (obj1.x + obj1.width / 2) - (obj2.x + obj2.width / 2);
    const dy = (obj1.y + obj1.height / 2) - (obj2.y + obj2.height / 2);
    const width = (obj1.width + obj2.width) / 2;
    const height = (obj1.height + obj2.height) / 2;
    const crossWidth = width * dy;
    const crossHeight = height * dx;
    
    let direction = '';
    
    if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
        if (crossWidth > crossHeight) {
            direction = (crossWidth > -crossHeight) ? 'bottom' : 'left';
        } else {
            direction = (crossWidth > -crossHeight) ? 'right' : 'top';
        }
    }
    
    return direction;
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

    // 更新世界位置
    mario.worldX += mario.velocityX;
    
    // 限制玩家不能超出世界左边界
    if (mario.worldX < 0) mario.worldX = 0;
    if (mario.worldX > WORLD_WIDTH - mario.width) mario.worldX = WORLD_WIDTH - mario.width;
    
    // 更新视口偏移 - 大幅改进视口跟随逻辑，提供更开阔的视野
    if (mario.worldX > canvasWidth / 4) { // 从1/3改为1/4，让玩家看到更多前方内容
        // 确保视口不会超出世界边界，同时保持足够的前视距离
        const targetOffset = mario.worldX - canvasWidth / 4;
        viewportOffset.x = Math.min(targetOffset, WORLD_WIDTH - canvasWidth);
    }
    
    // 更新玩家在画布上的位置
    mario.x = mario.worldX - viewportOffset.x;
    mario.y += mario.velocityY;

    // 重置跳跃状态
    mario.isJumping = true;

    // 平台碰撞检测
    platforms.forEach(platform => {
        const platformOnScreen = {
            x: platform.x - viewportOffset.x,
            y: platform.y,
            width: platform.width,
            height: platform.height
        };
        
        if (
            mario.y + mario.height > platformOnScreen.y &&
            mario.y + mario.height < platformOnScreen.y + platformOnScreen.height + 10 &&
            mario.x + mario.width > platformOnScreen.x &&
            mario.x < platformOnScreen.x + platformOnScreen.width &&
            mario.velocityY > 0
        ) {
            mario.y = platformOnScreen.y - mario.height;
            mario.velocityY = 0;
            mario.isJumping = false;
        }
    });

    // 砖块碰撞检测 - 使用改进的碰撞检测逻辑
    bricks.forEach(brick => {
        const brickOnScreen = {
            x: brick.x - viewportOffset.x,
            y: brick.y,
            width: brick.width,
            height: brick.height
        };
        
        if (checkCollision(mario, brickOnScreen)) {
            const direction = getCollisionDirection(mario, brickOnScreen);
            
            // 从底部碰撞（撞砖块底部）
            if (direction === 'bottom' && mario.velocityY < 0) {
                mario.velocityY = 0;
                mario.y = brickOnScreen.y + brickOnScreen.height;
            } 
            // 从顶部碰撞（站在砖块上）
            else if (direction === 'top' && mario.velocityY > 0) {
                mario.y = brickOnScreen.y - mario.height;
                mario.velocityY = 0;
                mario.isJumping = false;
            }
            // 从左侧碰撞
            else if (direction === 'left') {
                mario.worldX = brick.x - mario.width;
                mario.x = mario.worldX - viewportOffset.x;
            } 
            // 从右侧碰撞
            else if (direction === 'right') {
                mario.worldX = brick.x + brick.width;
                mario.x = mario.worldX - viewportOffset.x;
            }
        }
    });

    // 问号砖块碰撞检测
    questionBlocks.forEach(block => {
        const blockOnScreen = {
            x: block.x - viewportOffset.x,
            y: block.y,
            width: block.width,
            height: block.height
        };
        
        if (checkCollision(mario, blockOnScreen) && !block.hit) {
            const direction = getCollisionDirection(mario, blockOnScreen);
            
            // 从底部碰撞（撞问号砖块底部）
            if (direction === 'bottom' && mario.velocityY < 0) {
                mario.velocityY = 0;
                mario.y = blockOnScreen.y + blockOnScreen.height;
                
                // 标记砖块被撞击
                block.hit = true;
                
                // 生成蘑菇或金币
                if (block.hasMushroom && !block.mushroomReleased) {
                    block.mushroomReleased = true;
                    // 创建新蘑菇
                    mushrooms.push({
                        x: block.x,
                        y: block.y - MUSHROOM_HEIGHT,
                        width: MUSHROOM_WIDTH,
                        height: MUSHROOM_HEIGHT,
                        velocityX: 2, // 蘑菇向右移动
                        velocityY: 0,
                        collected: false
                    });
                } else {
                    // 如果没有蘑菇或蘑菇已经被释放，则生成金币
                    score += 100;
                    // 创建金币动画效果
                    coins.push({
                        x: block.x + block.width/4,
                        y: block.y - COIN_SIZE,
                        width: COIN_SIZE,
                        height: COIN_SIZE,
                        collected: false,
                        animationTime: 30 // 金币显示的时间
                    });
                    updateScore();
                }
            } 
            // 从顶部碰撞（站在问号砖块上）
            else if (direction === 'top' && mario.velocityY > 0) {
                mario.y = blockOnScreen.y - mario.height;
                mario.velocityY = 0;
                mario.isJumping = false;
            }
            // 从侧面碰撞
            else if (direction === 'left') {
                mario.worldX = block.x - mario.width;
                mario.x = mario.worldX - viewportOffset.x;
            } 
            else if (direction === 'right') {
                mario.worldX = block.x + block.width;
                mario.x = mario.worldX - viewportOffset.x;
            }
        } else if (checkCollision(mario, blockOnScreen) && block.hit) {
            const direction = getCollisionDirection(mario, blockOnScreen);
            
            // 撞击已被击中的砖块，只处理物理碰撞
            if (direction === 'top' && mario.velocityY > 0) {
                mario.y = blockOnScreen.y - mario.height;
                mario.velocityY = 0;
                mario.isJumping = false;
            } else if (direction === 'left') {
                mario.worldX = block.x - mario.width;
                mario.x = mario.worldX - viewportOffset.x;
            } else if (direction === 'right') {
                mario.worldX = block.x + block.width;
                mario.x = mario.worldX - viewportOffset.x;
            } else if (direction === 'bottom' && mario.velocityY < 0) {
                mario.velocityY = 0;
                mario.y = blockOnScreen.y + blockOnScreen.height;
            }
        }
    });

    // 金币碰撞检测
    coins.forEach(coin => {
        const coinOnScreen = {
            x: coin.x - viewportOffset.x,
            y: coin.y,
            width: coin.width,
            height: coin.height,
            collected: coin.collected
        };
        
        if (!coin.collected && checkCollision(mario, coinOnScreen)) {
            coin.collected = true;
            score += 100;
            updateScore();
        }
    });

    // 蘑菇逻辑更新
    mushrooms.forEach((mushroom, index) => {
        // 应用重力
        mushroom.velocityY += GRAVITY / 2;
        
        // 移动蘑菇
        mushroom.x += mushroom.velocityX;
        mushroom.y += mushroom.velocityY;
        
        // 蘑菇与平台的碰撞检测
        platforms.forEach(platform => {
            if (
                mushroom.x + mushroom.width > platform.x &&
                mushroom.x < platform.x + platform.width &&
                mushroom.y + mushroom.height > platform.y &&
                mushroom.y + mushroom.height < platform.y + platform.height
            ) {
                mushroom.y = platform.y - mushroom.height;
                mushroom.velocityY = 0;
            }
        });
        
        // 蘑菇与砖块的碰撞检测
        bricks.concat(questionBlocks).forEach(brick => {
            if (
                mushroom.x + mushroom.width > brick.x &&
                mushroom.x < brick.x + brick.width &&
                mushroom.y + mushroom.height > brick.y &&
                mushroom.y + mushroom.height < brick.y + brick.height
            ) {
                mushroom.y = brick.y - mushroom.height;
                mushroom.velocityY = 0;
            }
            
            // 蘑菇遇到障碍物就改变方向
            if (
                (mushroom.x + mushroom.width > brick.x && mushroom.x < brick.x) ||
                (mushroom.x < brick.x + brick.width && mushroom.x + mushroom.width > brick.x + brick.width)
            ) {
                if (
                    mushroom.y + mushroom.height > brick.y &&
                    mushroom.y < brick.y + brick.height
                ) {
                    mushroom.velocityX *= -1;
                }
            }
        });
        
        // 蘑菇到达世界边界就转向
        if (mushroom.x <= 0 || mushroom.x + mushroom.width >= WORLD_WIDTH) {
            mushroom.velocityX *= -1;
        }
        
        // 马里奥与蘑菇的碰撞检测
        const mushroomOnScreen = {
            x: mushroom.x - viewportOffset.x,
            y: mushroom.y,
            width: mushroom.width,
            height: mushroom.height
        };
        
        if (!mushroom.collected && checkCollision(mario, mushroomOnScreen)) {
            mushroom.collected = true;
            score += 1000;
            updateScore();
            
            // 马里奥变大逻辑
            if (!marioIsBig) {
                marioIsBig = true;
                mario.height = MARIO_HEIGHT * 1.5;
                // 调整位置，防止嵌入地面
                mario.y = mario.y - (MARIO_HEIGHT * 0.5);
            }
        }
    });
    
    // 过滤已收集的蘑菇
    for (let i = mushrooms.length - 1; i >= 0; i--) {
        if (mushrooms[i].collected) {
            mushrooms.splice(i, 1);
        }
    }

    // 敌人移动和碰撞检测 - 修复敌人穿墙问题
    enemies.forEach(enemy => {
        const oldX = enemy.x; // 保存移动前的位置
        enemy.x += enemy.velocityX;

        // 敌人碰到边界就转向
        if (enemy.x <= 0 || enemy.x + enemy.width >= WORLD_WIDTH) {
            enemy.velocityX *= -1;
            enemy.x = oldX; // 恢复位置
        }

        // 检测敌人与砖块和管道的碰撞
        let collided = false;
        
        // 敌人与砖块的碰撞
        bricks.concat(questionBlocks).forEach(brick => {
            if (
                enemy.x + enemy.width > brick.x &&
                enemy.x < brick.x + brick.width &&
                enemy.y + enemy.height > brick.y &&
                enemy.y < brick.y + brick.height
            ) {
                enemy.velocityX *= -1;
                enemy.x = oldX; // 恢复位置
                collided = true;
            }
        });
        
        // 敌人与管道的碰撞
        if (!collided) {
            pipes.forEach(pipe => {
                if (
                    enemy.x + enemy.width > pipe.x &&
                    enemy.x < pipe.x + pipe.width &&
                    enemy.y + enemy.height > pipe.y &&
                    enemy.y < pipe.y + pipe.height
                ) {
                    enemy.velocityX *= -1;
                    enemy.x = oldX; // 恢复位置
                }
            });
        }

        // 显示在屏幕上的敌人位置
        const enemyOnScreen = {
            x: enemy.x - viewportOffset.x,
            y: enemy.y,
            width: enemy.width,
            height: enemy.height
        };

        // 检测和平台的碰撞
        platforms.forEach(platform => {
            const platformOnScreen = {
                x: platform.x - viewportOffset.x,
                y: platform.y,
                width: platform.width,
                height: platform.height
            };
            
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
        if (checkCollision(mario, enemyOnScreen)) {
            // 从上方跳到敌人头上
            if (mario.velocityY > 0 && mario.y + mario.height < enemyOnScreen.y + enemyOnScreen.height / 2) {
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
                    mario.worldX = 50;
                    mario.x = mario.worldX - viewportOffset.x;
                    mario.y = canvasHeight - GROUND_HEIGHT - MARIO_HEIGHT;
                    mario.velocityY = 0;
                    viewportOffset.x = 0; // 重置视口
                }
            }
        }
    });

    // 管道碰撞检测
    pipes.forEach(pipe => {
        const pipeOnScreen = {
            x: pipe.x - viewportOffset.x,
            y: pipe.y,
            width: pipe.width,
            height: pipe.height
        };
        
        if (checkCollision(mario, pipeOnScreen)) {
            const direction = getCollisionDirection(mario, pipeOnScreen);
            
            // 从顶部碰撞（站在管道上）
            if (direction === 'top' && mario.velocityY > 0) {
                mario.y = pipeOnScreen.y - mario.height;
                mario.velocityY = 0;
                mario.isJumping = false;
            }
            // 从侧面碰撞
            else if (direction === 'left') {
                mario.worldX = pipe.x - mario.width;
                mario.x = mario.worldX - viewportOffset.x;
            } 
            else if (direction === 'right') {
                mario.worldX = pipe.x + pipe.width;
                mario.x = mario.worldX - viewportOffset.x;
            }
        }
    });
    
    // 食人花逻辑更新 - 修复靠近管道不出来的问题
    piranhas.forEach(piranha => {
        // 检查马里奥是否在管道正上方（而不是检查附近）
        const isPlayerDirectlyAbove = 
            mario.worldX + mario.width > piranha.pipeX && 
            mario.worldX < piranha.pipeX + piranha.pipeWidth && 
            Math.abs(mario.y + mario.height - piranha.maxY) < 30;
        
        if (piranha.isResting) {
            // 食人花正在休息
            piranha.restCounter++;
            if (piranha.restCounter > 120) { // 休息2秒
                piranha.isResting = false;
                piranha.restCounter = 0;
                
                // 仅当玩家站在管道正上方时，食人花才不出现
                if (isPlayerDirectlyAbove) {
                    piranha.direction = 0; // 保持隐藏
                } else {
                    piranha.direction = -1; // 向上移动
                }
            }
        } else {
            // 正常移动
            piranha.y += piranha.direction * piranha.moveSpeed;
            
            // 如果达到最大或最小高度，改变方向或休息
            if (piranha.y <= piranha.maxY) {
                piranha.y = piranha.maxY;
                piranha.moveCounter++;
                
                // 在顶部停留一段时间
                if (piranha.moveCounter > 180) { // 3秒
                    piranha.direction = 1; // 向下移动
                    piranha.moveCounter = 0;
                }
            } else if (piranha.y >= piranha.minY) {
                piranha.y = piranha.minY;
                piranha.isResting = true; // 开始休息
                piranha.direction = 0; // 停止移动
            }
            
            // 只有当玩家站在管道正上方时，食人花才会回缩
            if (isPlayerDirectlyAbove && piranha.y < piranha.minY) {
                piranha.direction = 1; // 向下移动（缩回）
            }
        }
        
        // 马里奥与食人花的碰撞检测
        const piranhaOnScreen = {
            x: piranha.x - viewportOffset.x,
            y: piranha.y,
            width: piranha.width,
            height: piranha.height
        };
        
        if (checkCollision(mario, piranhaOnScreen)) {
            // 碰到食人花会受伤
            lives--;
            updateLives();
            
            if (lives <= 0) {
                gameOver = true;
                document.getElementById('start-button').textContent = '重新开始';
            } else {
                // 重置马里奥位置
                mario.worldX = 50;
                mario.x = mario.worldX - viewportOffset.x;
                mario.y = canvasHeight - GROUND_HEIGHT - MARIO_HEIGHT;
                mario.velocityY = 0;
                viewportOffset.x = 0; // 重置视口
                
                // 如果变大了，恢复正常大小
                if (marioIsBig) {
                    marioIsBig = false;
                    mario.height = MARIO_HEIGHT;
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
            mario.worldX = 50;
            mario.x = mario.worldX - viewportOffset.x;
            mario.y = canvasHeight - GROUND_HEIGHT - MARIO_HEIGHT;
            mario.velocityY = 0;
            viewportOffset.x = 0; // 重置视口
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
        // 只绘制视口内的平台
        const platformOnScreen = {
            x: platform.x - viewportOffset.x,
            y: platform.y,
            width: platform.width,
            height: platform.height
        };
        
        if (platformOnScreen.x < canvasWidth && platformOnScreen.x + platformOnScreen.width > 0) {
            if (platform.y === canvasHeight - GROUND_HEIGHT) {
                // 地面
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(platformOnScreen.x, platformOnScreen.y, platformOnScreen.width, platformOnScreen.height);
                
                // 草
                ctx.fillStyle = '#228B22';
                ctx.fillRect(platformOnScreen.x, platformOnScreen.y, platformOnScreen.width, 10);
            } else {
                // 其他平台
                ctx.fillStyle = '#A0522D';
                ctx.fillRect(platformOnScreen.x, platformOnScreen.y, platformOnScreen.width, platformOnScreen.height);
            }
        }
    });

    // 绘制砖块
    ctx.fillStyle = '#B87333';
    bricks.forEach(brick => {
        // 只绘制视口内的砖块
        const brickOnScreen = {
            x: brick.x - viewportOffset.x,
            y: brick.y,
            width: brick.width,
            height: brick.height
        };
        
        if (brickOnScreen.x < canvasWidth && brickOnScreen.x + brickOnScreen.width > 0) {
            ctx.fillRect(brickOnScreen.x, brickOnScreen.y, brickOnScreen.width, brickOnScreen.height);
            
            // 砖块花纹
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(brickOnScreen.x + 5, brickOnScreen.y + 5, brickOnScreen.width - 10, 2);
            ctx.fillRect(brickOnScreen.x + 5, brickOnScreen.y + brickOnScreen.height - 7, brickOnScreen.width - 10, 2);
            ctx.fillStyle = '#B87333'; // 重置颜色
        }
    });

    // 绘制问号砖块
    questionBlocks.forEach(block => {
        // 只绘制视口内的问号砖块
        const blockOnScreen = {
            x: block.x - viewportOffset.x,
            y: block.y,
            width: block.width,
            height: block.height
        };
        
        if (blockOnScreen.x < canvasWidth && blockOnScreen.x + blockOnScreen.width > 0) {
            if (!block.hit) {
                // 未击中的问号砖块（黄色带问号）
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(blockOnScreen.x, blockOnScreen.y, blockOnScreen.width, blockOnScreen.height);
                
                // 绘制问号
                ctx.fillStyle = 'black';
                ctx.font = '30px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('?', blockOnScreen.x + blockOnScreen.width / 2, blockOnScreen.y + blockOnScreen.height / 1.5);
            } else {
                // 已击中的问号砖块（变灰）
                ctx.fillStyle = '#A9A9A9';
                ctx.fillRect(blockOnScreen.x, blockOnScreen.y, blockOnScreen.width, blockOnScreen.height);
            }
        }
    });
    
    // 绘制金币
    ctx.fillStyle = '#FFD700';
    coins.forEach(coin => {
        if (!coin.collected) {
            // 只绘制视口内的金币
            const coinOnScreen = {
                x: coin.x - viewportOffset.x,
                y: coin.y,
                width: coin.width,
                height: coin.height
            };
            
            if (coinOnScreen.x < canvasWidth && coinOnScreen.x + coinOnScreen.width > 0) {
                ctx.beginPath();
                ctx.arc(coinOnScreen.x + coinOnScreen.width/2, coinOnScreen.y + coinOnScreen.height/2, coinOnScreen.width/2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });

    // 绘制蘑菇
    mushrooms.forEach(mushroom => {
        if (!mushroom.collected) {
            // 只绘制视口内的蘑菇
            const mushroomOnScreen = {
                x: mushroom.x - viewportOffset.x,
                y: mushroom.y,
                width: mushroom.width,
                height: mushroom.height
            };
            
            if (mushroomOnScreen.x < canvasWidth && mushroomOnScreen.x + mushroomOnScreen.width > 0) {
                // 绘制蘑菇帽子（红色）
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(mushroomOnScreen.x, mushroomOnScreen.y, mushroomOnScreen.width, mushroomOnScreen.height / 2);
                
                // 绘制蘑菇茎（白色）
                ctx.fillStyle = 'white';
                ctx.fillRect(mushroomOnScreen.x, mushroomOnScreen.y + mushroomOnScreen.height / 2, mushroomOnScreen.width, mushroomOnScreen.height / 2);
                
                // 绘制蘑菇斑点（白色圆点）
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(mushroomOnScreen.x + 10, mushroomOnScreen.y + 10, 5, 0, Math.PI * 2);
                ctx.arc(mushroomOnScreen.x + 30, mushroomOnScreen.y + 10, 5, 0, Math.PI * 2);
                ctx.fill();
                
                // 绘制蘑菇眼睛
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(mushroomOnScreen.x + 15, mushroomOnScreen.y + 25, 3, 0, Math.PI * 2);
                ctx.arc(mushroomOnScreen.x + 25, mushroomOnScreen.y + 25, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });

    // 绘制敌人
    ctx.fillStyle = '#8B0000';
    enemies.forEach(enemy => {
        if (enemy.y < canvasHeight) {
            // 只绘制视口内的敌人
            const enemyOnScreen = {
                x: enemy.x - viewportOffset.x,
                y: enemy.y,
                width: enemy.width,
                height: enemy.height
            };
            
            if (enemyOnScreen.x < canvasWidth && enemyOnScreen.x + enemyOnScreen.width > 0) {
                ctx.fillRect(enemyOnScreen.x, enemyOnScreen.y, enemyOnScreen.width, enemyOnScreen.height);
                
                // 敌人眼睛
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(enemyOnScreen.x + 10, enemyOnScreen.y + 15, 5, 0, Math.PI * 2);
                ctx.arc(enemyOnScreen.x + enemyOnScreen.width - 10, enemyOnScreen.y + 15, 5, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(enemyOnScreen.x + 10, enemyOnScreen.y + 15, 2, 0, Math.PI * 2);
                ctx.arc(enemyOnScreen.x + enemyOnScreen.width - 10, enemyOnScreen.y + 15, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#8B0000'; // 重置颜色
            }
        }
    });

    // 绘制管道
    pipes.forEach(pipe => {
        // 只绘制视口内的管道
        const pipeOnScreen = {
            x: pipe.x - viewportOffset.x,
            y: pipe.y,
            width: pipe.width,
            height: pipe.height
        };
        
        if (pipeOnScreen.x < canvasWidth && pipeOnScreen.x + pipeOnScreen.width > 0) {
            // 绘制管道主体（绿色）
            ctx.fillStyle = '#00AA00';
            ctx.fillRect(pipeOnScreen.x, pipeOnScreen.y, pipeOnScreen.width, pipeOnScreen.height);
            
            // 绘制管道顶部边缘（深绿色）
            ctx.fillStyle = '#006600';
            ctx.fillRect(pipeOnScreen.x - 5, pipeOnScreen.y, pipeOnScreen.width + 10, 10);
            
            // 绘制管道高光
            ctx.fillStyle = '#00CC00';
            ctx.fillRect(pipeOnScreen.x + 5, pipeOnScreen.y + 10, 10, pipeOnScreen.height - 10);
        }
    });
    
    // 绘制食人花
    piranhas.forEach(piranha => {
        // 只绘制视口内的食人花
        const piranhaOnScreen = {
            x: piranha.x - viewportOffset.x,
            y: piranha.y,
            width: piranha.width,
            height: piranha.height
        };
        
        if (piranhaOnScreen.x < canvasWidth && piranhaOnScreen.x + piranhaOnScreen.width > 0 && piranha.y < piranha.minY) {
            // 绘制茎（绿色）
            ctx.fillStyle = '#00AA00';
            ctx.fillRect(piranhaOnScreen.x + piranhaOnScreen.width/2 - 5, piranhaOnScreen.y + 20, 10, piranhaOnScreen.height - 20);
            
            // 绘制叶子（绿色）
            ctx.fillStyle = '#00AA00';
            ctx.beginPath();
            ctx.ellipse(piranhaOnScreen.x + 10, piranhaOnScreen.y + 40, 15, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(piranhaOnScreen.x + piranhaOnScreen.width - 10, piranhaOnScreen.y + 40, 15, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制头部（红色）
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(piranhaOnScreen.x + piranhaOnScreen.width/2, piranhaOnScreen.y + 20, piranhaOnScreen.width/2, 0, Math.PI, true);
            ctx.fill();
            
            // 绘制一个白色半圆代表下嘴唇
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(piranhaOnScreen.x + piranhaOnScreen.width/2, piranhaOnScreen.y + 20, piranhaOnScreen.width/2 - 5, 0, Math.PI, false);
            ctx.fill();
            
            // 绘制眼睛（白色，带黑色瞳孔）
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(piranhaOnScreen.x + 15, piranhaOnScreen.y + 10, 8, 0, Math.PI * 2);
            ctx.arc(piranhaOnScreen.x + piranhaOnScreen.width - 15, piranhaOnScreen.y + 10, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(piranhaOnScreen.x + 15, piranhaOnScreen.y + 10, 4, 0, Math.PI * 2);
            ctx.arc(piranhaOnScreen.x + piranhaOnScreen.width - 15, piranhaOnScreen.y + 10, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // 绘制马里奥 - 根据是否变大调整大小
    if (mario.facingRight) {
        ctx.fillStyle = 'red';
        ctx.fillRect(mario.x, mario.y, mario.width, mario.height);
        
        // 绘制特征，根据马里奥大小调整
        const headHeight = marioIsBig ? 15 : 10;
        const faceHeight = marioIsBig ? 30 : 20;
        const bodyHeight = mario.height - headHeight - faceHeight;
        
        // 帽子
        ctx.fillRect(mario.x - 5, mario.y, mario.width + 10, headHeight);
        
        // 脸
        ctx.fillStyle = '#FFA07A';
        ctx.fillRect(mario.x, mario.y + headHeight, mario.width, faceHeight);
        
        // 眼睛
        ctx.fillStyle = 'white';
        ctx.fillRect(mario.x + mario.width - 15, mario.y + headHeight + 5, 10, 10);
        ctx.fillStyle = 'black';
        ctx.fillRect(mario.x + mario.width - 10, mario.y + headHeight + 8, 4, 4);
        
        // 胡子
        ctx.fillStyle = 'black';
        ctx.fillRect(mario.x + mario.width - 20, mario.y + headHeight + 15, 15, 3);
        
        // 裤子
        ctx.fillStyle = 'blue';
        ctx.fillRect(mario.x, mario.y + headHeight + faceHeight, mario.width, bodyHeight);
    } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(mario.x, mario.y, mario.width, mario.height);
        
        // 绘制特征，根据马里奥大小调整
        const headHeight = marioIsBig ? 15 : 10;
        const faceHeight = marioIsBig ? 30 : 20;
        const bodyHeight = mario.height - headHeight - faceHeight;
        
        // 帽子
        ctx.fillRect(mario.x - 5, mario.y, mario.width + 10, headHeight);
        
        // 脸
        ctx.fillStyle = '#FFA07A';
        ctx.fillRect(mario.x, mario.y + headHeight, mario.width, faceHeight);
        
        // 眼睛
        ctx.fillStyle = 'white';
        ctx.fillRect(mario.x + 5, mario.y + headHeight + 5, 10, 10);
        ctx.fillStyle = 'black';
        ctx.fillRect(mario.x + 6, mario.y + headHeight + 8, 4, 4);
        
        // 胡子
        ctx.fillStyle = 'black';
        ctx.fillRect(mario.x + 5, mario.y + headHeight + 15, 15, 3);
        
        // 裤子
        ctx.fillStyle = 'blue';
        ctx.fillRect(mario.x, mario.y + headHeight + faceHeight, mario.width, bodyHeight);
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
    marioIsBig = false;
    viewportOffset.x = 0;
    
    mario.worldX = 50;
    mario.x = 50;
    mario.y = canvasHeight - GROUND_HEIGHT - MARIO_HEIGHT;
    mario.velocityX = 0;
    mario.velocityY = 0;
    mario.height = MARIO_HEIGHT; // 重置Mario的高度
    
    // 重置敌人
    enemies.forEach((enemy, index) => {
        if (index === 0) {
            enemy.x = 300;
            enemy.y = canvasHeight - GROUND_HEIGHT - ENEMY_HEIGHT;
            enemy.velocityX = -2;
        } else if (index === 1) {
            enemy.x = 600;
            enemy.y = canvasHeight - GROUND_HEIGHT - ENEMY_HEIGHT;
            enemy.velocityX = -2;
        } else {
            enemy.x = 900;
            enemy.y = canvasHeight - GROUND_HEIGHT - ENEMY_HEIGHT;
            enemy.velocityX = -2;
        }
    });
    
    // 重置金币
    coins.forEach(coin => {
        coin.collected = false;
    });
    
    // 清空蘑菇数组
    mushrooms.length = 0;
    
    // 重置问号砖块
    questionBlocks.forEach(block => {
        block.hit = false;
        block.mushroomReleased = false;
    });
    
    // 重置食人花
    piranhas.forEach(piranha => {
        piranha.y = piranha.minY;
        piranha.direction = -1;
        piranha.moveCounter = 0;
        piranha.restCounter = 0;
        piranha.isResting = true;
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