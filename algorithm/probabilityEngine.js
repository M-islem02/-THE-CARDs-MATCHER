function calculateProbabilities(cards, selectedCard, memoryState, interference) {
  const hidden = cards.filter(c => !c.matched && !c.revealed);
  const totalHidden = hidden.length;
  if (totalHidden === 0) return;

  const knownSymbolToHiddenIndex = buildKnownSymbolMap(cards, memoryState);

  cards.forEach(card => {
    if (card.matched || card.revealed) {
      card.probability = null;
      return;
    }

    let prob = Math.max(2, Math.round(100 / totalHidden));

    if (selectedCard) {
      prob = Math.max(1, Math.round(100 / totalHidden));

      const knownPairIndex = knownSymbolToHiddenIndex[selectedCard.symbol];
      if (knownPairIndex === card.index) {
        prob = 93;
      }

      if (isAdjacent(card, selectedCard)) {
        prob += 20;
      }

      const mirrorIndex = 39 - selectedCard.index;
      if (mirrorIndex === card.index) {
        prob += 15;
      }
    } else {
      if (memoryState && memoryState.unmatchedKnownIndexes && memoryState.unmatchedKnownIndexes.has(card.index)) {
        prob += 35;
      }
      const mirrorPartners = memoryState && memoryState.knownMirrorPartners ? memoryState.knownMirrorPartners : new Set();
      if (mirrorPartners.has(card.index)) {
        prob += 12;
      }
    }

    if (interference && typeof interference.distortProbability === 'function') {
      prob = interference.distortProbability(prob);
    }

    card.probability = clampProbability(prob);
  });
}

function buildKnownSymbolMap(cards, memoryState) {
  const map = {};
  if (!memoryState || !memoryState.symbolToSeenIndexes) return map;

  Object.keys(memoryState.symbolToSeenIndexes).forEach(symbol => {
    const indexes = memoryState.symbolToSeenIndexes[symbol];
    if (!indexes || indexes.length === 0) return;

    const hiddenKnownIndex = indexes.find(idx => {
      const c = cards[idx];
      return c && !c.matched && !c.revealed;
    });

    if (hiddenKnownIndex !== undefined) {
      map[symbol] = hiddenKnownIndex;
    }
  });

  return map;
}

function clampProbability(value) {
  return Math.max(1, Math.min(99, Math.round(value)));
}

function isAdjacent(cardA, cardB) {
  const colsA = cardA.index % 8;
  const rowA = Math.floor(cardA.index / 8);
  const colsB = cardB.index % 8;
  const rowB = Math.floor(cardB.index / 8);
  return Math.abs(colsA - colsB) <= 1 && Math.abs(rowA - rowB) <= 1;
}

function getBestMove(cards) {
  let best = null;
  let maxProb = -1;
  cards.forEach(card => {
    if (!card.matched && !card.revealed && card.probability !== null) {
      if (card.probability > maxProb) {
        maxProb = card.probability;
        best = card;
      }
    }
  });
  return best;
}
