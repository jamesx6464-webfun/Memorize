const grid = document.getElementById("grid");
const restartBtn = document.getElementById("restartBtn");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const highscoreDisplay = document.getElementById("highscore");
const difficultySelect = document.getElementById("difficulty");

const winScreen = document.getElementById("winScreen");
const finalStats = document.getElementById("finalStats");

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
let lockBoard = false;

let gridSize = 4;

/* HIGH SCORE */
function getHighscoreKey() {
    return `memory_highscore_${gridSize}`;
}

function loadHighscore() {
    const best = localStorage.getItem(getHighscoreKey());
    highscoreDisplay.textContent = best ? `Best: ${best}s` : "Best: --";
}

/* TIMER */
function startTimer() {
    interval = setInterval(() => {
        timer++;
        timerDisplay.textContent = `Time: ${timer}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
}

/* SHUFFLE */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/* BOARD */
function createBoard() {

    grid.innerHTML = "";

    flippedCards = [];
    moves = 0;
    matchedPairs = 0;
    timer = 0;

    gameStarted = false;
    lockBoard = false;

    stopTimer();

    movesDisplay.textContent = "Moves: 0";
    timerDisplay.textContent = "Time: 0s";

    gridSize = parseInt(difficultySelect.value);

    loadHighscore();

    const pairs = (gridSize * gridSize) / 2;
    const selected = emojis.slice(0, pairs);

    let cards = shuffle([...selected, ...selected]);

    grid.style.gridTemplateColumns =
        `repeat(${gridSize}, 6.25rem)`;

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

/* FLIP */
function flipCard() {

    if (lockBoard) return;

    if (
        this.classList.contains("flipped") ||
        flippedCards.includes(this)
    ) return;

    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }

    this.classList.add("flipped");
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = `Moves: ${moves}`;

        lockBoard = true;
        checkMatch();
    }
}

/* MATCH */
function checkMatch() {

    const [c1, c2] = flippedCards;

    const isMatch = c1.dataset.value === c2.dataset.value;

    if (isMatch) {

        c1.classList.add("matched");
        c2.classList.add("matched");

        flippedCards = [];
        lockBoard = false;

        matchedPairs++;

        if (matchedPairs === (gridSize * gridSize) / 2) {
            endGame();
        }

    } else {

        setTimeout(() => {

            c1.classList.remove("flipped");
            c2.classList.remove("flipped");

            flippedCards = [];
            lockBoard = false;

        }, 700);
    }
}

/* END GAME */
function endGame() {

    stopTimer();

    document.querySelectorAll(".card")
        .forEach(c => c.classList.add("disabled"));

    const key = getHighscoreKey();
    const best = localStorage.getItem(key);

    if (!best || timer < best) {
        localStorage.setItem(key, timer);
        loadHighscore();
    }

    finalStats.textContent =
        `Moves: ${moves} | Time: ${timer}s`;

    winScreen.style.display = "flex";
}

/* EVENTS */
restartBtn.addEventListener("click", createBoard);
difficultySelect.addEventListener("change", createBoard);

createBoard();