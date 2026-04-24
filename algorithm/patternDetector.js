// patternDetector.js
// Detects hidden patterns in card arrangement

function detectPattern(cards) {
  // The hidden pattern: symbols are placed in mirrored pairs
  // Each symbol's pair is reflected across the center of the grid
  // Grid is 8x5 = 40 cards, center reflection: index i pairs with index (39 - i)
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
