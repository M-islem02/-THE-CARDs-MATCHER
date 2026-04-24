# card-matcher

High-difficulty memory match game (vanilla JavaScript) with:
- 40 cards (8x5 grid), 20 symbol pairs
- 60-second countdown
- move counter and score tracking
- probability overlay on every face-down card
- pattern detection and memory-based probability engine
- Nen interference after 3 consecutive mismatches
- optional best-move suggestion (hint)

## Required Folder Structure

card-matcher/
├── index.html
├── style.css
├── app.js
├── algorithm/
│   ├── probabilityEngine.js
│   ├── patternDetector.js
│   └── interferenceManager.js
├── components/
│   ├── CardGrid.js
│   ├── ProbabilityOverlay.js
│   └── ScorePanel.js
└── README.md

## How To Run

1. Open index.html in any modern browser.
2. Click New Game.
3. Flip cards to find all 20 pairs before time expires.

No build tools and no backend required.

## Game Mechanics

- 40 Cards: 8 columns x 5 rows, 20 unique symbols duplicated once.
- Timer: 60 seconds total.
- Moves: every flip increments move counter.
- Match: +10 score and mismatch streak resets.
- Nen Interference: after 3 mismatches in a row, a random currently revealed, unmatched card is forced face-down again.
- Hint: Show Hint highlights the current highest-probability hidden card.

## Probability Engine

The overlay percentages are recalculated dynamically using:
- memory of previously seen symbol positions
- active selection context (probability to match selected card)
- adjacency boost (+20%)
- hidden mirror pattern boost
- interference distortion (small probability noise when mismatch pressure is high)

Important: probabilities are guidance, not certainty.

## Pattern Detector

The detector checks mirrored board positions (index i and 39-i) and boosts candidate card probabilities when a revealed card suggests a likely mirrored partner.

## Hunter Logs

The side panel logs key events, including:
- card flips and positions
- matches and mismatches
- top six probability snapshots
- current best probability target
- Nen interference events

## Quotes

"Probability is not destiny. The 93% card still fails 7% of the time. Trust nothing."

"Adjacent cards share aura. If you flip a dragon, check its neighbors. They are 20% more likely to be dragons too."

"Hisoka's interference triggers after 3 mismatches. Plan your flips in batches of 2 to reset the counter."

"The probability numbers lie sometimes. Hisoka distorts them. Watch for sudden drops - that's his Bungee Gum stretching the truth."

"A perfect game is 20 moves. One flip per pair, then the match. Anything more is inefficiency."

"PS - The symbols aren't random. There's a hidden pattern in their arrangement. Find it, and probability becomes certainty."
