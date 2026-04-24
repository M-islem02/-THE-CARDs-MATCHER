// app.js — Main game logic

const SYMBOLS = ['🔥', '💧', '🌿', '⚡', '🌙', '☀️', '❄️', '🌊', '🐉', '👁️',
  '💎', '🗡️', '🛡️', '🌸', '🦋', '🕷️', '⚔️', '🏔️', '🌀', '💀'];

let cards = [];
let selected = null;
let score = 0;
let moves = 0;
let timer = 60;
let timerInterval = null;
let gameActive = false;
let logs = [];
let lockBoard = false;
let activeHintCard = null;

let memoryState = {
  symbolToSeenIndexes: {},
  unmatchedKnownIndexes: new Set(),
  knownMirrorPartners: new Set()
};

function initGame() {
  const deck = createMirroredDeck();

  cards = deck.map((symbol, index) => ({
    index,
    symbol,
    revealed: false,
    matched: false,
    probability: null,
    element: null
  }));

  selected = null;
  score = 0;
  moves = 0;
  timer = 60;
  gameActive = true;
  lockBoard = false;
  logs = [];
  activeHintCard = null;
  memoryState = {
    symbolToSeenIndexes: {},
    unmatchedKnownIndexes: new Set(),
    knownMirrorPartners: new Set()
  };
  interference.reset();

  renderGrid();
  recalculateAndRenderProbabilities();
  updateHUD();
  clearInterval(timerInterval);
  timerInterval = setInterval(tick, 1000);
  document.getElementById('overlay').classList.add('hidden');
  addLog('Start: 40 cards, mirror i -> 39 - i, adjacent cards gain +20%.', 'warn');
}

function createMirroredDeck() {
  const symbols = [...SYMBOLS];
  for (let i = symbols.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
  }

  const deck = new Array(40);
  for (let i = 0; i < 20; i += 1) {
    deck[i] = symbols[i];
    deck[39 - i] = symbols[i];
  }

  return deck;
}

function tick() {
  if (!gameActive) return;
  timer -= 1;
  updateHUD();
  if (timer <= 0) {
    timer = 0;
    updateHUD();
    endGame(false);
  }
}

function renderGrid() {
  const grid = document.getElementById('card-grid');
  cards.forEach(card => {
    const el = document.createElement('div');
    el.className = 'card face-down';
    el.innerHTML = '<div class="card-inner"><span class="card-symbol">?</span></div>';
    el.addEventListener('click', () => flipCard(card));
    card.element = el;
  });

  if (typeof renderCardGrid === 'function') {
    renderCardGrid(cards, grid);
  } else {
    grid.innerHTML = '';
    cards.forEach(card => grid.appendChild(card.element));
  }
}

function flipCard(card) {
  if (!gameActive || lockBoard) return;
  if (card.revealed || card.matched) return;
  if (selected === card) return;

  card.revealed = true;
  moves += 1;
  rememberCard(card);
  updateCardElement(card);
  updateHUD();

  if (!selected) {
    selected = card;
    card.element.classList.add('selected');
    addLog(`Flip: revealed ${card.symbol} at position ${card.index + 1}.`, 'warn');
    recalculateAndRenderProbabilities();
    addTopProbabilityLog();
    return;
  }

  const first = selected;
  selected = null;
  first.element.classList.remove('selected');
  lockBoard = true;

  if (first.symbol === card.symbol) {
    first.matched = true;
    card.matched = true;
    score += 10;
    interference.registerMatch();
    resolveMatchedIndexes(first.index, card.index);
    addLog(`✓ Match: ${card.symbol} +10`, 'match');
    updateCardElement(first);
    updateCardElement(card);
    lockBoard = false;
    recalculateAndRenderProbabilities();
    updateHUD();

    const remaining = cards.filter(c => !c.matched);
    if (remaining.length === 0) {
      endGame(true);
    }
    return;
  }

  addLog(`✗ Mismatch: ${first.symbol} vs ${card.symbol}`, 'miss');
  const triggered = interference.registerMismatch();
  updateHUD();

  setTimeout(() => {
    first.revealed = false;
    card.revealed = false;
    updateCardElement(first);
    updateCardElement(card);

    if (triggered) {
      const disrupted = interference.triggerInterference(cards);
      if (disrupted) {
        eraseRememberedPair(disrupted.symbol);
        const positions = disrupted.cards.map(target => target.index + 1).join(' & ');
        addLog(`⚠ Hisoka's Nen erased ${disrupted.symbol} at positions ${positions}.`, 'warn');
        disrupted.cards.forEach(target => {
          if (!target.element) return;
          target.element.classList.add('interference');
          setTimeout(() => {
            target.element.classList.remove('interference');
            updateCardElement(target);
          }, 500);
        });
        updateHUD();
      }
    }

    lockBoard = false;
    recalculateAndRenderProbabilities();
  }, 800);
}

function rememberCard(card) {
  if (!memoryState.symbolToSeenIndexes[card.symbol]) {
    memoryState.symbolToSeenIndexes[card.symbol] = [];
  }

  const seenIndexes = memoryState.symbolToSeenIndexes[card.symbol];
  if (!seenIndexes.includes(card.index)) {
    seenIndexes.push(card.index);
  }

  updateKnownIndexSets();
}

function updateKnownIndexSets() {
  memoryState.unmatchedKnownIndexes = new Set();
  memoryState.knownMirrorPartners = new Set();

  Object.keys(memoryState.symbolToSeenIndexes).forEach(symbol => {
    const indexes = memoryState.symbolToSeenIndexes[symbol]
      .filter(idx => cards[idx] && !cards[idx].matched);

    if (indexes.length === 1) {
      memoryState.unmatchedKnownIndexes.add(indexes[0]);
    }

    if (indexes.length === 2) {
      const mirrorA = 39 - indexes[0];
      const mirrorB = 39 - indexes[1];
      if (mirrorA === indexes[1] || mirrorB === indexes[0]) {
        memoryState.knownMirrorPartners.add(indexes[0]);
        memoryState.knownMirrorPartners.add(indexes[1]);
      }
    }
  });
}

function resolveMatchedIndexes(indexA, indexB) {
  Object.keys(memoryState.symbolToSeenIndexes).forEach(symbol => {
    memoryState.symbolToSeenIndexes[symbol] = memoryState.symbolToSeenIndexes[symbol]
      .filter(idx => idx !== indexA && idx !== indexB);
  });
  updateKnownIndexSets();
}

function eraseRememberedPair(symbol) {
  if (memoryState.symbolToSeenIndexes[symbol]) {
    delete memoryState.symbolToSeenIndexes[symbol];
  }
  updateKnownIndexSets();
}

function recalculateAndRenderProbabilities() {
  calculateProbabilities(cards, selected, memoryState, interference);
  const patterns = detectPattern(cards);
  applyPatternBoost(cards, patterns);

  cards.forEach(updateCardElement);
  if (typeof updateOverlay === 'function') {
    updateOverlay(cards);
  }
}

function clearHintHighlight() {
  if (activeHintCard && activeHintCard.element) {
    activeHintCard.element.classList.remove('hint');
  }
  activeHintCard = null;
}

function updateCardElement(card) {
  const el = card.element;
  if (!el) return;
  el.className = 'card';

  if (card.matched) {
    el.classList.add('matched');
    el.innerHTML = `<div class="card-inner"><span class="card-symbol">${card.symbol}</span></div>`;
    return;
  }

  if (card.revealed) {
    el.classList.add('revealed');
    el.innerHTML = `<div class="card-inner"><span class="card-symbol">${card.symbol}</span></div>`;
    return;
  }

  el.classList.add('face-down');
  const prob = card.probability;
  const probClass = prob >= 60 ? 'high' : prob >= 30 ? 'mid' : 'low';
  const probText = prob !== null ? `<span class="card-prob ${probClass}">${prob}%</span>` : '';
  el.innerHTML = `<div class="card-inner"><span class="card-symbol">?</span>${probText}</div>`;
}

function updateHUD() {
  const matched = cards.filter(c => c.matched).length / 2;

  if (typeof updateScorePanel === 'function') {
    updateScorePanel(score, timer, moves, matched);
  } else {
    document.getElementById('score-val').textContent = score;
    document.getElementById('timer-val').textContent = timer;
    document.getElementById('moves-val').textContent = moves;
    document.getElementById('pairs-val').textContent = `${matched}/20`;
  }

  const timerEl = document.getElementById('timer-val');
  timerEl.className = 'hud-value' + (timer <= 10 ? ' danger' : '');

  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i < interference.consecutiveMismatches);
  });
}

function addLog(msg, type) {
  logs.unshift({ msg, type });
  if (logs.length > 10) logs.pop();

  const container = document.getElementById('log-container');
  container.innerHTML = logs.map(l => `<div class="log-item ${l.type}">${l.msg}</div>`).join('');
}

function addTopProbabilityLog() {
  const top = cards
    .filter(c => !c.matched && !c.revealed && c.probability !== null)
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 6)
    .map(c => `${c.index + 1}:${c.probability}%`)
    .join(' | ');

  if (top) {
    addLog(`Top probabilities: ${top}`, 'warn');
    const best = getBestMove(cards);
    if (best) {
      addLog(`Best target now: position ${best.index + 1} at ${best.probability}%.`, 'warn');
    }
  }
}

function showHint() {
  if (!gameActive || lockBoard) return;

  clearHintHighlight();
  recalculateAndRenderProbabilities();
  const best = getBestMove(cards);
  if (!best || !best.element) {
    addLog('No hint available right now.', 'warn');
    return;
  }

  activeHintCard = best;
  best.element.classList.add('hint');
  addLog(`Hint: choose position ${best.index + 1} (${best.probability}%).`, 'warn');
  setTimeout(() => {
    if (activeHintCard === best && best.element) {
      best.element.classList.remove('hint');
      activeHintCard = null;
    }
  }, 1600);
}

function endGame(win) {
  gameActive = false;
  lockBoard = true;
  clearInterval(timerInterval);

  const overlay = document.getElementById('overlay');
  overlay.classList.remove('hidden');
  document.getElementById('overlay-title').textContent = win ? '✓ VICTORY' : '✗ FAILED';
  document.getElementById('overlay-msg').textContent = win
    ? 'You survived Hisoka\'s game.'
    : 'Time expired. Hisoka is... disappointed.';
  document.getElementById('overlay-score').textContent = `Score: ${score}`;
  document.getElementById('overlay-moves').textContent = `Moves: ${moves}`;
}

window.onload = initGame;
