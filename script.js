// 1. DOM elements
const gameGrid = document.getElementById("gameGrid"); // use this container
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const winMessage = document.getElementById("winMessage");
const restartBtn = document.getElementById("restartBtn");

// 2. Game state
let flippedCards = [];
let reveals = 0;
let matches = 0;
let timer = 0;
let timerInterval = null;

// Timer

function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      timer++;
      timerDisplay.textContent = timer;
    }, 1000);
  }
}

// Shuffle cards

function shuffleCards() {
  const cards = document.querySelectorAll(".card"); // dynamic cards
  cards.forEach((card) => {
    card.style.order = Math.floor(Math.random() * 100);
  });
}

// Flip a card

function flipCard() {
  startTimer();
  if (this.classList.contains("cardFlipped") || flippedCards.length === 2)
    return;
  this.classList.add("cardFlipped");
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    reveals++;
    movesDisplay.textContent = reveals;
    checkMatch();
  }
}

// Check match

function checkMatch() {
  const firstCard = flippedCards[0].dataset.name;
  const secondCard = flippedCards[1].dataset.name;

  if (firstCard === secondCard) {
    setTimeout(() => {
      flippedCards.forEach((card) => card.classList.add("matched"));
      flippedCards = [];
      matches++;
      if (matches === document.querySelectorAll(".card").length / 2) {
        showWinMessage();
      }
    }, 500);
  } else {
    setTimeout(() => {
      flippedCards.forEach((card) => card.classList.remove("cardFlipped"));
      flippedCards = [];
    }, 1000);
  }
}

// Show win message

function showWinMessage() {
  clearInterval(timerInterval);
  winMessage.style.display = "block";
}

// Restart game

restartBtn.addEventListener("click", () => {
  flippedCards = [];
  reveals = 0;
  matches = 0;
  timer = 0;
  timerDisplay.textContent = timer;
  movesDisplay.textContent = reveals;
  clearInterval(timerInterval);
  timerInterval = null;

  gameGrid.innerHTML = ""; // Clear old cards
  fetchCards(); // Fetch fresh cards

  winMessage.style.display = "none";
});

// Fetch cards dynamically

async function fetchCards() {
  try {
    const res = await fetch("http://localhost:3000/cards"); // backend API
    const cardsData = await res.json();

    gameGrid.innerHTML = ""; // Clear container

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

    // Add click event listeners to new cards
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => card.addEventListener("click", flipCard));

    shuffleCards();
  } catch (err) {
    console.error("Error fetching cards:", err);
    gameGrid.innerHTML = "<p>Failed to load cards. Check backend server.</p>";
  }
}

// Initialize game

fetchCards();
