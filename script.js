// DOM ELEMENTS

const gameGrid = document.getElementById("gameGrid");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const winMessage = document.getElementById("winMessage");
const restartBtn = document.getElementById("restartBtn");

// SOUND EFFECTS

const clickSound = new Audio("assets/sounds/Click.mp3");
const matchSound = new Audio("assets/sounds/Match.mp3");
const notMatchSound = new Audio("assets/sounds/Not match.mp3");
const winSound = new Audio("assets/sounds/win.mp3");

// GAME STATE

let flippedCards = [];
let reveals = 0;
let matches = 0;
let timer = 0;
let timerInterval = null;
let canClick = false;

// TIMER

function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      timer++;
      timerDisplay.textContent = timer;
    }, 1000);
  }
}

// SHUFFLE

function shuffleCards() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.style.order = Math.floor(Math.random() * 100);
  });
}

// FLIP CARD

function flipCard() {
  if (!canClick) return;

  if (this.classList.contains("cardFlipped") || flippedCards.length === 2)
    return;

  startTimer();

  this.classList.add("cardFlipped");

  // Play click sound
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});

  flippedCards.push(this);

  if (flippedCards.length === 2) {
    reveals++;
    movesDisplay.textContent = reveals;
    checkMatch();
  }
}

// CHECK MATCH

function checkMatch() {
  const firstCard = flippedCards[0].dataset.name;
  const secondCard = flippedCards[1].dataset.name;

  if (firstCard === secondCard) {
    // Play match sound
    matchSound.currentTime = 0;
    matchSound.play().catch(() => {});

    setTimeout(() => {
      flippedCards.forEach((card) => card.classList.add("matched"));
      flippedCards = [];
      matches++;

      if (matches === document.querySelectorAll(".card").length / 2) {
        showWinMessage();
      }
    }, 500);
  } else {
    // Play not match sound
    notMatchSound.currentTime = 0;
    notMatchSound.play().catch(() => {});

    setTimeout(() => {
      flippedCards.forEach((card) => card.classList.remove("cardFlipped"));
      flippedCards = [];
    }, 1000);
  }
}

// PREVIEW MODE (1,5 seconds)

function previewCards() {
  const cards = document.querySelectorAll(".card");

  canClick = false;

  // Flip all cards
  cards.forEach((card) => card.classList.add("cardFlipped"));

  setTimeout(() => {
    cards.forEach((card) => card.classList.remove("cardFlipped"));
    canClick = true;
  }, 1500);
}

// WIN MESSAGE

function showWinMessage() {
  clearInterval(timerInterval);

  winSound.currentTime = 0;
  winSound.play().catch(() => {});

  winMessage.style.display = "block";
}

// RESTART GAME

restartBtn.addEventListener("click", () => {
  flippedCards = [];
  reveals = 0;
  matches = 0;
  timer = 0;

  timerDisplay.textContent = timer;
  movesDisplay.textContent = reveals;

  clearInterval(timerInterval);
  timerInterval = null;

  gameGrid.innerHTML = "";
  winMessage.style.display = "none";

  fetchCards();
});

// FETCH CARDS

async function fetchCards() {
  try {
    const res = await fetch("http://localhost:3000/cards");
    const cardsData = await res.json();

    gameGrid.innerHTML = "";

    cardsData.forEach((card) => {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");
      cardDiv.dataset.name = card.name;

      cardDiv.innerHTML = `
        <div class="cardInner">
          <div class="cardFront"></div>
          <div class="cardBack">
            <img src="${card.image_url}" alt="${card.name}" />
          </div>
        </div>
      `;

      gameGrid.appendChild(cardDiv);
    });

    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => card.addEventListener("click", flipCard));

    shuffleCards();
    previewCards(); 
  } catch (err) {
    console.error("Error fetching cards:", err);
    gameGrid.innerHTML = "<p>Failed to load cards. Check backend server.</p>";
  }
}

// INITIALIZE GAME

fetchCards();
