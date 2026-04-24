// interferenceManager.js
// Manages Hisoka's Nen interference — 3 mismatches = flip a revealed card back

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
    // find all revealed but not matched cards
    const revealed = cards.filter(c => c.revealed && !c.matched);
    if (revealed.length === 0) return null;
    // pick random one
    const target = revealed[Math.floor(Math.random() * revealed.length)];
    target.revealed = false;
    target.probability = null;
    return target;
  }
};
