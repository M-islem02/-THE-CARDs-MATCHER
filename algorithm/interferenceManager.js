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
      return true;
    }
    return false;
  },

  registerMatch() {
    this.consecutiveMismatches = 0;
  },

  distortProbability(probability) {
    const pressure = this.consecutiveMismatches / this.threshold;
    const swing = Math.round((Math.random() * 2 - 1) * this.maxDistortion * pressure);
    return probability + swing;
  },

  triggerInterference(cards) {
    const faceUp = cards.filter(card => card.matched);

    if (faceUp.length > 0) {
      const target = faceUp[Math.floor(Math.random() * faceUp.length)];
      const partner = cards[39 - target.index];
      const affected = [target, partner].filter(Boolean);

      affected.forEach(card => {
        card.matched = false;
        card.revealed = false;
        card.probability = null;
      });

      return {
        kind: 'flip-back',
        symbol: target.symbol,
        target,
        cards: affected
      };
    }

    const hidden = cards.filter(card => !card.matched && !card.revealed);
    if (hidden.length === 0) return null;

    const glimpse = hidden[Math.floor(Math.random() * hidden.length)];
    return {
      kind: 'glimpse',
      symbol: glimpse.symbol,
      target: glimpse,
      cards: [glimpse]
    };
  }
};
