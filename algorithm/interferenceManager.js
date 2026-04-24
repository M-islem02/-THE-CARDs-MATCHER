// interferenceManager.js
// Manages Hisoka's Nen interference — 3 mismatches can erase a completed pair.

const interference = {
  consecutiveMismatches: 0,
  threshold: 3,
  maxDistortion: 9,

  reset() {
    this.consecutiveMismatches = 0;
  },

  registerMismatch() {
    this.consecutiveMismatches++;
    if (this.consecutiveMismatches >= this.threshold) {
      this.consecutiveMismatches = 0;
      return true; // trigger interference
    }
    return false;
  },

  registerMatch() {
    this.consecutiveMismatches = 0;
  },

  distortProbability(probability) {
    // Distortion grows as player gets closer to interference trigger.
    const pressure = this.consecutiveMismatches / this.threshold;
    const swing = Math.round((Math.random() * 2 - 1) * this.maxDistortion * pressure);
    return probability + swing;
  },

  triggerInterference(cards) {
    const matchedSymbols = [...new Set(
      cards.filter(card => card.matched).map(card => card.symbol)
    )];

    if (matchedSymbols.length === 0) return null;

    const symbol = matchedSymbols[Math.floor(Math.random() * matchedSymbols.length)];
    const disruptedCards = cards.filter(card => card.symbol === symbol && card.matched);

    disruptedCards.forEach(card => {
      card.matched = false;
      card.revealed = false;
      card.probability = null;
    });

    return {
      symbol,
      cards: disruptedCards
    };
  }
};
