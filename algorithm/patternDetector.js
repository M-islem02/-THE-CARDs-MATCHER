function detectPattern(cards) {
  const patterns = [];

  cards.forEach(card => {
    if (card.revealed && !card.matched) {
      const mirrorIndex = 39 - card.index;
      const mirror = cards[mirrorIndex];
      if (mirror && !mirror.matched && !mirror.revealed) {
        patterns.push({
          card: card,
          mirror: mirror,
          confidence: 75
        });
      }
    }
  });

  return patterns;
}

function applyPatternBoost(cards, patterns) {
  patterns.forEach(p => {
    if (p.mirror && !p.mirror.matched && !p.mirror.revealed) {
      const base = p.mirror.probability === null ? 1 : p.mirror.probability;
      p.mirror.probability = Math.min(99, base + 15);
    }
  });
}
