const cards = document.querySelectorAll('.card');
const slots = document.querySelectorAll('.slot');
let dragged = null;

cards.forEach(card => {
  card.addEventListener('dragstart', () => {
    dragged = card;
    setTimeout(() => card.style.opacity = '0.5', 0);
  });
  card.addEventListener('dragend', () => {
    card.style.opacity = '1';
    dragged = null;
    checkAllFilled();
  });
});

slots.forEach(slot => {
  slot.addEventListener('dragover', e => e.preventDefault());
  slot.addEventListener('drop', () => {
    if (!slot.hasChildNodes() && dragged) {
      slot.appendChild(dragged);
      slot.classList.add('filled');
    }
  });
});

function checkAllFilled() {
  const filled = Array.from(slots).every(slot => slot.hasChildNodes());
  document.getElementById('checkBtn').disabled = !filled;
}

document.getElementById('checkBtn').addEventListener('click', () => {
  const placed = Array.from(slots).map(slot => parseInt(slot.firstChild.dataset.order));
  const correct = placed.every((val, idx, arr) => idx === 0 || arr[idx - 1] <= val);
  if (correct) {
    alert('Bravo ! L\'ordre est correct.');
  } else {
    alert('L\'ordre est incorrect, veuillez réessayer.');
  }
});

// Timer de jeu (2 minutes)
let timeLeft = 120;
const timerEl = document.getElementById('timer');
const interval = setInterval(() => {
  if (timeLeft <= 0) {
    clearInterval(interval);
    disableGame();
    alert('Temps écoulé !');
    return;
  }
  timeLeft--;
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  timerEl.textContent = `${minutes}:${seconds}`;
}, 1000);

function disableGame() {
  cards.forEach(card => { card.draggable = false; });
  document.getElementById('checkBtn').disabled = true;
}
