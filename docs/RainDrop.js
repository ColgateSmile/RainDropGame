const rainContainer = document.getElementById('rain-container');
const bottomBorder = document.getElementById('bottom-border');
const answerInput = document.getElementById('answer-input');
const heartsDisplay = document.getElementById('hearts');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');
const timerDisplay = document.getElementById('timer');
let lives = 3;
let score = 0;
let currentLevel = 1;
let raindropInterval;
let levelInterval;
let timerInterval;
let secondsElapsed = 0;
const difficulty = localStorage.getItem('selectedDifficulty') || 'easy';
let correctAnswers = 0;
let totalAnswers = 0;

function generateRandomMathQuestion() {
    const num1 = Math.floor(Math.random() * 10 * currentLevel);
    const num2 = Math.floor(Math.random() * 10 * currentLevel);
    let question;
    let answer;
    let operator;

    switch (difficulty) {
        case 'easy':
            if (Math.random() > 0.5) {
                operator = '+';
                answer = num1 + num2;
            } else {
                operator = '-';
                answer = num1 - num2;
            }
            break;
        case 'medium':
            const operation = Math.random();
            if (operation < 0.33) {
                operator = '+';
                answer = num1 + num2;
            } else if (operation < 0.66) {
                operator = '-';
                answer = num1 - num2;
            } else {
                operator = '×';
                answer = num1 * num2;
            }
            break;
        case 'hard':
            const hardOperation = Math.random();
            if (hardOperation < 0.25) {
                operator = '+';
                answer = num1 + num2;
            } else if (hardOperation < 0.5) {
                operator = '-';
                answer = num1 - num2;
            } else if (hardOperation < 0.75) {
                operator = '×';
                answer = num1 * num2;
            } else {
                operator = '÷';
                answer = (num1 * num2) / num2; // Ensure division results in an integer
                question = `${num1 * num2} ${operator} ${num2}`;
                return { question, answer };
            }
            break;
        default:
            operator = '+';
            answer = num1 + num2;
            break;
    }

    question = `<span class="number">${num1}</span><br><span class="operator">${operator}</span><br><span class="number">${num2}</span>`;
    return { question, answer };
}

function createRaindrop() {
    const { question, answer } = generateRandomMathQuestion();
    const raindrop = document.createElement('div');
    raindrop.classList.add('raindrop');
    raindrop.style.left = `${Math.random() * 100}vw`;
    raindrop.style.animationDuration = `${Math.random() * 5 + 5}s`;
    raindrop.innerHTML = question;
    raindrop.dataset.answer = answer;
    rainContainer.appendChild(raindrop);

    raindrop.addEventListener('animationend', () => {
        if (!raindrop.classList.contains('popped')) {
            lives -= 1;
            updateLives();
            if (lives === 0) {
                endGame();
            }
        }
        raindrop.remove();
    });
}

function generateRain() {
    raindropInterval = setInterval(createRaindrop, 4000 - (currentLevel * 200));
}

function updateLives() {
    heartsDisplay.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heartsDisplay.appendChild(heart);
    }
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function updateTimer() {
    secondsElapsed++;
    const minutes = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
    const seconds = String(secondsElapsed % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

function endGame() {
    const accuracy = ((correctAnswers / totalAnswers) * 100).toFixed(2);
    const gameOverText = `Game Over<br>Accuracy: ${accuracy}%`;
    document.querySelector('.glitch').innerHTML = gameOverText;
    document.querySelector('.glitch').dataset.glitch = gameOverText;
    gameOverDisplay.style.display = 'flex';
    clearInterval(raindropInterval);
    clearInterval(levelInterval);
    clearInterval(timerInterval);
    answerInput.style.display = 'none'; // Hide input field
}

function retryGame() {
    gameOverDisplay.style.display = 'none';
    answerInput.style.display = 'block'; // Show input field
    lives = 3;
    score = 0;
    currentLevel = 1;
    secondsElapsed = 0;
    correctAnswers = 0;
    totalAnswers = 0;
    updateLives();
    updateScore();
    startTimer();
    generateRain();
    levelInterval = setInterval(() => {
        currentLevel += 0.1;
    }, 10000);
}

function goToMenu() {
    window.location.href = 'index.html';
}

answerInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const answer = parseInt(answerInput.value);
        const raindrops = document.querySelectorAll('.raindrop');
        totalAnswers++;
        raindrops.forEach(raindrop => {
            if (parseInt(raindrop.dataset.answer) === answer) {
                raindrop.classList.add('popped');
                raindrop.style.background = '#00ff00';
                setTimeout(() => {
                    raindrop.remove();
                }, 500);
                correctAnswers++;
                score += 10;
                updateScore();
            }
        });
        answerInput.value = '';
    }
});

updateLives();
updateScore();
startTimer();
generateRain();
levelInterval = setInterval(() => {
    currentLevel += 0.1;
}, 10000);

// Collision detection for raindrops reaching the bottom
setInterval(() => {
    const raindrops = document.querySelectorAll('.raindrop');
    raindrops.forEach(raindrop => {
        const raindropRect = raindrop.getBoundingClientRect();
        const bottomBorderRect = bottomBorder.getBoundingClientRect();
        if (
            raindropRect.bottom >= bottomBorderRect.top &&
            !raindrop.classList.contains('popped')
        ) {
            lives -= 1;
            updateLives();
            raindrop.remove();
            if (lives === 0) {
                endGame();
            }
        }
    });
}, 100);
