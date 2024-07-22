const rainContainer = document.getElementById('rain-container');
const dayNightToggle = document.getElementById('day-night');
const lofiMusic = document.getElementById('lofi-music');

function createRaindrop() {
    const raindrop = document.createElement('div');
    raindrop.classList.add('raindrop');
    raindrop.style.left = `${Math.random() * 100}vw`;
    raindrop.style.animationDuration = `${Math.random() * 3 + 2}s`;
    rainContainer.appendChild(raindrop);

    raindrop.addEventListener('animationend', () => {
        raindrop.remove();
    });
}

function generateRain() {
    return setInterval(createRaindrop, 500);
}



function startGame() {
    window.location.href = 'RainDrop.html';
}

let rainInterval = generateRain();
dayNightToggle.addEventListener('change', () => {
    if (dayNightToggle.checked) {
        clearInterval(rainInterval);
        Array.from(rainContainer.children).forEach(raindrop => raindrop.remove());
    } else {
        rainInterval = generateRain();
    }
});

generateRain();
