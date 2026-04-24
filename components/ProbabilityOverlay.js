// ProbabilityOverlay.js — updates probability display on cards
function updateOverlay(cards) {
  cards.forEach(card => {
    if (!card.element || card.matched || card.revealed) return;
    const existing = card.element.querySelector('.card-prob');
    if (existing) existing.remove();
    if (card.probability !== null) {
      const span = document.createElement('span');
      span.className = 'card-prob ' + (card.probability >= 60 ? 'high' : card.probability >= 30 ? 'mid' : 'low');
      span.textContent = card.probability + '%';
      card.element.querySelector('.card-inner').appendChild(span);
    }
  });
}
