const grid = document.getElementById("grid");
const restartBtn = document.getElementById("restartBtn");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const highscoreDisplay = document.getElementById("highscore");
const difficultySelect = document.getElementById("difficulty");

const emojis = [
    "🍎","🍌","🍇","🍓","🍍","🥝","🍒","🍉",
    "🍑","🥑","🍋","🍊","🍐","🥥","🌽","🍔"
];

let flippedCards = [];
let moves = 0;
let matchedPairs = 0;

let timer = 0;
let interval = null;
let gameStarted = false;
let gridSize = 4;

function getHighscoreKey() {
    return `memory_highscore_${gridSize}`;
}

function loadHighscore() {
    const best = localStorage.getItem(getHighscoreKey());
    highscoreDisplay.textContent = best
        ? `Best: ${best}s`
        : "Best: --";
}

function startTimer() {
    interval = setInterval(() => {
        timer++;
        timerDisplay.textContent = `Time: ${timer}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createBoard() {

    grid.innerHTML = "";

    flippedCards = [];
    moves = 0;
    matchedPairs = 0;
    timer = 0;
    gameStarted = false;

    stopTimer();

    movesDisplay.textContent = "Moves: 0";
    timerDisplay.textContent = "Time: 0s";

    gridSize = parseInt(difficultySelect.value);

    loadHighscore();

    const pairs = (gridSize * gridSize) / 2;
    const selected = emojis.slice(0, pairs);

    let cards = shuffle([...selected, ...selected]);

    grid.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;

    cards.forEach(value => {

        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.value = value;

        card.innerHTML = `
            <div class="card-inner">
                <div class="front">?</div>
                <div class="back">${value}</div>
            </div>
        `;

        card.addEventListener("click", flipCard);

        grid.appendChild(card);
    });
}

function flipCard() {

    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }

    if (
        this.classList.contains("flipped") ||
        flippedCards.length === 2
    ) return;

    this.classList.add("flipped");
    flippedCards.push(this);

    if (flippedCards.length === 2) {

        moves++;
        movesDisplay.textContent = `Moves: ${moves}`;

        checkMatch();
    }
}

function checkMatch() {

    const [card1, card2] = flippedCards;

    if (card1.dataset.value === card2.dataset.value) {

        matchedPairs++;
        flippedCards = [];

        if (matchedPairs === (gridSize * gridSize) / 2) {

            stopTimer();

            setTimeout(() => {

                alert(`You won in ${moves} moves and ${timer}s!`);

                const key = getHighscoreKey();
                const best = localStorage.getItem(key);

                if (!best || timer < best) {
                    localStorage.setItem(key, timer);
                    loadHighscore();
                }

            }, 300);
        }

    } else {

        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            flippedCards = [];
        }, 800);
    }
}

restartBtn.addEventListener("click", createBoard);
difficultySelect.addEventListener("change", createBoard);

createBoard();