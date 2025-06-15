const cards = document.querySelectorAll('.card');
const slots = document.querySelectorAll('.slot');

function shuffleCards() {
  const container = document.querySelector('.cards');
  const array = Array.from(container.children);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  array.forEach(card => container.appendChild(card));
}

shuffleCards();
let dragged = null;

cards.forEach(card => {
  card.addEventListener('dragstart', () => {
    // remove filled class from previous slot if dragging from one
    const parent = card.parentElement;
    if (parent && parent.classList.contains('slot')) {
      parent.classList.remove('filled');
    }
    card.classList.remove('correct', 'incorrect');
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
  cards.forEach(card => card.classList.remove('correct', 'incorrect'));
  let allCorrect = true;
  slots.forEach((slot, idx) => {
    const card = slot.firstChild;
    if (parseInt(card.dataset.order) === idx + 1) {
      card.classList.add('correct');
    } else {
      card.classList.add('incorrect');
      allCorrect = false;
    }
  });
  if (allCorrect) {
    alert("Bravo ! L'ordre est correct.");
  } else {
    alert("L'ordre est incorrect, veuillez réessayer.");
  }
});

// Timer de jeu (2 minutes)
let timeLeft = 120;
const timerEl = document.getElementById('timer');
timerEl.textContent = '02:00';
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
