const suits = ["♠", "♥", "♦", "♣"];
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];

const drawBtn = document.getElementById("drawBtn");
const sortBtn = document.getElementById("sortBtn");
const cardContainer = document.getElementById("cardContainer");
const logContainer = document.getElementById("logContainer");
const cardCountInput = document.getElementById("cardCount");

let cards = [];
let sortLogs = [];

function getCardValue(card) {
  if (typeof card.value === "number") return card.value;
  return { J: 11, Q: 12, K: 13, A: 14 }[card.value];
}

function generateRandomCards(count) {
  const deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }

  const shuffled = deck.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function renderCards(cards) {
  cardContainer.innerHTML = "";
  for (let card of cards) {
    const div = document.createElement("div");
    div.classList.add("card-box");

    const isRed = card.suit === "♥" || card.suit === "♦";
    div.classList.add(isRed ? "red" : "black");

    div.innerHTML = `
      <div>${card.value}</div>
      <div>${card.suit}</div>
    `;
    cardContainer.appendChild(div);
  }
}

function renderLog() {
  logContainer.innerHTML = "";

  for (let i = sortLogs.length - 1; i >= 0; i--) {
    const logStep = sortLogs[i];

    const stepDiv = document.createElement("div");
    stepDiv.classList.add("mb-3", "p-2", "border", "rounded", "bg-light");

    const actionText = document.createElement("div");
    actionText.innerHTML = `<strong>${logStep.action}</strong>`;

    const cardsDiv = document.createElement("div");
    cardsDiv.className = "d-flex flex-wrap mt-2";

    for (let card of logStep.cards) {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card-box");
      const isRed = card.suit === "♥" || card.suit === "♦";
      cardDiv.classList.add(isRed ? "red" : "black");
      cardDiv.innerHTML = `<div>${card.value}</div><div>${card.suit}</div>`;
      cardsDiv.appendChild(cardDiv);
    }

    stepDiv.appendChild(actionText);
    stepDiv.appendChild(cardsDiv);
    logContainer.appendChild(stepDiv);
  }
}

function bubbleSort(cards) {
  sortLogs = []; // clear previous logs
  const arr = [...cards]; // make a shallow copy to avoid mutating the original array
  const len = arr.length;

  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      const val1 = getCardValue(arr[j]);
      const val2 = getCardValue(arr[j + 1]);

      let action = `Comparing ${arr[j].value}${arr[j].suit} and ${arr[j + 1].value}${arr[j + 1].suit}`;

      if (val1 > val2) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        action += " — Swapped";
      } else {
        action += " — No Swap";
      }

      // Save a snapshot of current array + action
      const snapshot = arr.map(card => ({ ...card }));
      sortLogs.push({ cards: snapshot, action });
    }
  }

  return arr;
}

// 🎴 Draw button
drawBtn.addEventListener("click", () => {
  const count = parseInt(cardCountInput.value);
  cards = generateRandomCards(count);
  renderCards(cards);
  sortLogs = [];
});

// 🔄 Sort button
sortBtn.addEventListener("click", () => {
  const sortedCards = bubbleSort(cards);
  renderCards(sortedCards);
  renderLog();
});