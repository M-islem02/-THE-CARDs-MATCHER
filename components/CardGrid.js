// CardGrid.js — renders the 8x5 grid
function renderCardGrid(cards, container) {
  container.innerHTML = '';
  container.style.display = 'grid';
  container.style.gridTemplateColumns = 'repeat(8, 1fr)';
  container.style.gap = '8px';
  cards.forEach(card => container.appendChild(card.element));
}
