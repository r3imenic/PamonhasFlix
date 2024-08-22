const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configurações do jogo
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
const paddleSpeed = 8;  // Velocidade das palhetas
let ballSpeedX = 4;
let ballSpeedY = 2;
const speedIncrement = 0.5;  // Incremento da velocidade a cada colisão
const winningScore = 5;     // Pontuação necessária para vencer

// Posições iniciais
let paddle1Y = (canvas.height - paddleHeight) / 2;
let paddle2Y = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;

// Pontuação
let score1 = 0;
let score2 = 0;
let gameOver = false;

// Controle das palhetas
const keys = {};

// Desenha o estado atual do jogo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha as palhetas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight); // Palheta esquerda
    ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight); // Palheta direita

    // Desenha a bola
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // Desenha a pontuação
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(score1 + ' - ' + score2, canvas.width / 2, 30);

    // Checa se o jogo terminou
    if (gameOver) {
        ctx.font = '36px Arial';
        ctx.fillText(score1 >= winningScore ? 'Jogador 1 Venceu!' : 'Jogador 2 Venceu!', canvas.width / 2, canvas.height / 2);
        ctx.font = '24px Arial';
        ctx.fillText('Pressione Espaço para Reiniciar', canvas.width / 2, canvas.height / 2 + 40);
        return;
    }
}

// Atualiza a lógica do jogo
function update() {
    if (gameOver) return;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Checa colisão com o topo e fundo
    if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Checa colisão com as palhetas
    if (ballX - ballSize < paddleWidth && ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        ballSpeedX += (ballSpeedX > 0 ? speedIncrement : -speedIncrement);  // Incrementa a velocidade
        ballSpeedY += (ballSpeedY > 0 ? speedIncrement : -speedIncrement);  // Incrementa a velocidade
    } else if (ballX + ballSize > canvas.width - paddleWidth && ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        ballSpeedX += (ballSpeedX > 0 ? speedIncrement : -speedIncrement);  // Incrementa a velocidade
        ballSpeedY += (ballSpeedY > 0 ? speedIncrement : -speedIncrement);  // Incrementa a velocidade
    }

    // Checa se a bola saiu do campo
    if (ballX - ballSize < 0) {
        score2++;
        checkGameOver();
        resetBall();
    } else if (ballX + ballSize > canvas.width) {
        score1++;
        checkGameOver();
        resetBall();
    }

    // Movimenta as palhetas
    if (keys['ArrowUp'] && paddle2Y > 0) {
        paddle2Y -= paddleSpeed;
    }
    if (keys['ArrowDown'] && paddle2Y < canvas.height - paddleHeight) {
        paddle2Y += paddleSpeed;
    }
    if (keys['KeyW'] && paddle1Y > 0) {
        paddle1Y -= paddleSpeed;
    }
    if (keys['KeyS'] && paddle1Y < canvas.height - paddleHeight) {
        paddle1Y += paddleSpeed;
    }
}

// Verifica se o jogo acabou
function checkGameOver() {
    if (score1 >= winningScore || score2 >= winningScore) {
        gameOver = true;
    }
}

// Redefine a posição da bola e a pontuação após um ponto
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 4;
    ballSpeedY = 2;
}

// Reinicia o jogo
function restartGame() {
    score1 = 0;
    score2 = 0;
    gameOver = false;
    resetBall();
}

// Configura os eventos de teclado
function setupControls() {
    document.addEventListener('keydown', (event) => {
        keys[event.code] = true;

        // Reinicia o jogo se a tecla Espaço for pressionada e o jogo estiver acabado
        if (event.code === 'Space' && gameOver) {
            restartGame();
        }
    });

    document.addEventListener('keyup', (event) => {
        keys[event.code] = false;
    });
}

// Função principal do jogo
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Inicializa o jogo
setupControls();
gameLoop();

