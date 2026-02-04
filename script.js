// 1. Select all cards from the page
const cards = document.querySelectorAll(".card");

// 2. Track game state
let flippedCards = []; // Cards currently flipped (max 2)
let reveals = 0; // How many cards have been revealed
let matches = 0; // Number of matched pairs
let timer = 0; // Seconds elapsed
let timerInterval = null;

// 3. DOM elements
const movesDisplay = document.getElementById("moves"); // Reveal counter
const timerDisplay = document.getElementById("timer"); // Timer display
const winMessage = document.getElementById("winMessage"); // Win message div
const restartBtn = document.getElementById("restartBtn"); // Restart button

// 4. Start timer on first reveal
function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      timer++;
      timerDisplay.textContent = timer;
    }, 1000);
  }
}

// 5. Shuffle cards
(function shuffleCards() {
  cards.forEach((card) => {
    card.style.order = Math.floor(Math.random() * 100);
  });
})();

// 6. Function to flip a card
function flipCard() {
  startTimer(); // Start timer on first flip

  // Ignore click if card is already flipped or 2 cards are flipped
  if (this.classList.contains("cardFlipped") || flippedCards.length === 2) {
    return;
  }
  // Flip the card visually
  this.classList.add("cardFlipped");

  /* // Increment reveal counter
                                   reveals++;
                                   movesDisplay.textContent = reveals;
                                   */
  // Add card to flipped array
  flippedCards.push(this);

  // If two cards are flipped, check match
  if (flippedCards.length === 2) {
    // Increment reveal counter
    reveals++;
    movesDisplay.textContent = reveals;
    checkMatch();
  }
}

// 7. Check if two flipped cards match
function checkMatch() {
  const firstImage = flippedCards[0].querySelector(".cardBack img").src;
  const secondImage = flippedCards[1].querySelector(".cardBack img").src;

  if (firstImage === secondImage) {
    // Match found
    flippedCards = [];
    matches++;

    // Check if all pairs are matched
    if (matches === cards.length / 2) {
      setTimeout(() => showWinMessage(), 500);
    }
  } else {
    // Not a match → flip back after 1 second
    setTimeout(() => {
      flippedCards[0].classList.remove("cardFlipped");
      flippedCards[1].classList.remove("cardFlipped");
      flippedCards = [];
    }, 1000);
  }
}

// 8. Show win message
function showWinMessage() {
  clearInterval(timerInterval); // Stop timer
  winMessage.style.display = "block";
}

// 9. Restart game
restartBtn.addEventListener("click", () => {
  // Reset game state
  flippedCards = [];
  reveals = 0;
  matches = 0;
  timer = 0;
  timerDisplay.textContent = timer;
  movesDisplay.textContent = reveals;
  clearInterval(timerInterval);
  timerInterval = null;

  // Flip all cards back
  cards.forEach((card) => card.classList.remove("cardFlipped"));

  // Shuffle cards again
  cards.forEach((card) => {
    card.style.order = Math.floor(Math.random() * 100);
  });

  winMessage.style.display = "none"; // Hide win message
});

// 10. Add click event to each card
cards.forEach((card) => card.addEventListener("click", flipCard));
