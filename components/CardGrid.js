function renderCardGrid(cards, container) {
  container.innerHTML = '';
  cards.forEach(card => container.appendChild(card.element));
}
