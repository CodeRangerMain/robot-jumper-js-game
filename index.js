const cvs = document.getElementById('game');
const cxt = cvs.getContext('2d');
cxt.fillStyle = '#fff';
cxt.font = '30px Zen Dots';

let bg = new Image();
let player = new Image();
let enemyDog = new Image();
let hpPoint = new Image();
let enemyDron = new Image();
let playerXPos = 20;
let playerYPos = 300;
let playerHeight = 128;
let playerWidth = 128;
let bgX = 0;
let enemyDogX = 1100;
let enemyDogY = 340;
let enemyDronX = 1500;
let enemyDronY = 70;
let score = 0;
let gameSpeed = 10;
let bgSpeed = 6;
let bestScore = document.getElementById('score')


bg.src = 'img/Bg.png';
player.src = 'img/RobotPlayer.png';
enemyDog.src = 'img/DogEnemy.png';
enemyDron.src = 'img/drone.png'
hpPoint.src = 'img/HP.png';
// Проверяем локальное хранилище
if (localStorage.getItem('bestScoreV') === null) {
    bestScore.textContent = 'Best SCORE: 0'
}
else {
    // Записываем в 'BEST SCORE' значение из локального хранилища
    bestScore.textContent = 'Best SCORE: ' + localStorage.getItem('bestScoreV')
}

let hps = [
    {
        drawHps: () => { cxt.drawImage(hpPoint, 700, 15) }
    },
    {
        drawHps: () => { cxt.drawImage(hpPoint, 765, 15) }
    },
    {
        drawHps: () => { cxt.drawImage(hpPoint, 830, 15) }
    }
]

// Прыжок
function jump() {
    // Анимация прыжка
    let moveUp = setInterval(() => {
        if (playerYPos <= 300 && playerYPos > 50) {
            playerYPos = playerYPos - 30
        }
        else {
            clearInterval(moveUp)
            let moveDown = setInterval(() => {
                playerYPos = playerYPos + 15
                if (playerYPos >= 300) {
                    playerYPos = 300
                    clearInterval(moveDown)
                }
            }, 20);
        }
    }, 20);
}

// Вызов прыжка на десктопе
document.addEventListener('keydown', (evt) => {
    evt.preventDefault()
    if (evt.keyCode === 32) {
        if (screen.width > 550) {
            jump()

        }
    }


})
// Вызов прыжка на телефоне
document.addEventListener('click', (evt) => {
    evt.preventDefault()
    if (screen.width < 550) {
        jump()
    }
})
// Функция отрисовки
function drawGame() {
    // Спавн врагов и фона
    if (bgX <= 0
        || bgX < -950) {
        cxt.drawImage(bg, bgX, 0)
        cxt.drawImage(bg, bgX + 950, 0)
        cxt.drawImage(enemyDog, enemyDogX, enemyDogY);
        cxt.drawImage(enemyDron, enemyDronX, enemyDronY, 128, 128);
    }
    //Спавн врагов и фона(необходим для перехода)
    if (bgX <= -950) {
        enemyDronX = 1480
        bgX = 0
        enemyDogX = 1000
        cxt.drawImage(bg, bgX, 0)
        cxt.drawImage(bg, bgX + 950, 0)
        cxt.drawImage(enemyDog, enemyDogX, enemyDogY);
        cxt.drawImage(enemyDron, enemyDronX, enemyDronY, 128, 128);
    }
    // Движение объектов
    bgX = bgX - bgSpeed
    enemyDogX = enemyDogX - gameSpeed
    enemyDronX = enemyDronX - gameSpeed

    // Хитбокс протиника (Собака)
    if (enemyDogX === playerXPos && enemyDogY - 40 === playerYPos
        || enemyDogX - 100 === playerXPos && enemyDogY - 40 === playerYPos
        || enemyDogX + 100 === playerXPos && enemyDogY - 40 === playerYPos) {
        // - 1 жизнь
        hps.pop()
        enemyDogX = enemyDogX - 200
    }
    // Хитбокс протиника (Дрон) (Пока прицип DRY)
    if (enemyDronX === playerXPos && enemyDronY >= playerYPos
        || enemyDronX - 80 === playerXPos && enemyDronY >= playerYPos
        || enemyDronX + 80 === playerXPos && enemyDronY >= playerYPos) {
        // - 1 жизнь и сокрытие врага в хитбокс которого 
        hps.pop()
        enemyDronX = enemyDronX - 200
    }
    // Начисление очков
    if (enemyDronX == 20
        || enemyDogX == 20) {
        score++
    }
    // Увелечение скорости игры
    if (score == 10) {
        gameSpeed = 20;
        bgSpeed = 12;
    }
    for (let i = 0; i < hps.length; i++) {
        hps[i].drawHps()
    }
    // Проверяем колличество HP в массиве
    if (hps.length === 0) {
        // Проверяем результаты
        if (score > localStorage.getItem('bestScoreV')) {
            // Если результат больше того что мы имеем, то записываем его в локал
            localStorage.setItem('bestScoreV', score);
        }
        // Если HP пустой, перезагружаем сцену
        document.location.reload()
    }

    //Отрисовка счета и персонажа
    cxt.fillText('Score: ' + score, 705, 110)
    cxt.drawImage(player, playerXPos, playerYPos, playerWidth, playerHeight)
    if (hps.length > 0) {
        requestAnimationFrame(drawGame)
    }
}
//Проверка готовности всех вайлов и запуск игры
player.onload = drawGame()


//Получилась не расширяемая без боли игра :(

