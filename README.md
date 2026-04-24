# GREED ISLAND : THE CARDs MATCHER

## CHALLENGE 01

You enter the 67th floor of Greed Island's Central Tower. The room is empty except for 40 cards laid face down in a perfect grid. Hisoka appears from the shadows and turns a simple memory game into a probability challenge.

This project is a high-difficulty Memory Match game built with vanilla JavaScript, HTML, and CSS. The player must find all 20 pairs before the 60-second timer reaches zero while using probability hints, pattern detection, and Hunter Log advice.

Repository: `https://github.com/M-islem02/-THE-CARDs-MATCHER`

## Required Project Structure

```text
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
```

## Features

- 40 cards arranged in an 8x5 grid.
- 20 unique symbols, each appearing exactly twice.
- 60-second countdown timer.
- Score system: each successful pair gives `+10` points.
- Move counter that tracks every card flip.
- Probability overlay on face-down cards.
- Best Move Suggestion button that highlights the highest-probability card.
- Hunter Logs panel for gameplay events and strategy hints.
- Hidden mirror pattern: card `i` is paired with card `39 - i`.
- Nen interference after 3 consecutive mismatches flips a random revealed card face-down (or flashes a hidden card if none is revealed yet).
- A correct match resets the mismatch streak to zero.
- On-screen planning warnings as the streak approaches the 3-mismatch threshold.

## Game Rules

1. Flip two cards.
2. If the symbols match, the pair stays revealed, the score increases by `+10`, and the mismatch streak resets to zero.
3. If the symbols do not match, both cards flip back down.
4. Finish all 20 pairs before the timer reaches `0`.
5. Every 3 consecutive mismatches trigger Hisoka's Nen interference on a random revealed card. Plan to avoid reaching 3 in a row.

## Probability Engine

After each flip, every face-down card displays a probability number. This number estimates how likely the card is to match the currently revealed card.

The engine uses:

- remaining hidden cards
- current selected card
- known cards from previous flips
- adjacency bonus of `+20%`
- hidden mirror-pattern boost
- Hisoka distortion during mismatch pressure

The probability is helpful, but it is not guaranteed. A high value can still fail.

## Pattern Detection

The cards are not fully random. The deck is arranged with a mirror rule:

```text
pairIndex = 39 - currentIndex
```

Examples:

- card `0` matches card `39`
- card `1` matches card `38`
- card `19` matches card `20`

Board positions:

```text
[ 0][ 1][ 2][ 3][ 4][ 5][ 6][ 7]
[ 8][ 9][10][11][12][13][14][15]
[16][17][18][19][20][21][22][23]
[24][25][26][27][28][29][30][31]
[32][33][34][35][36][37][38][39]
```

## Nen Memory Interference

Hisoka's interference activates after 3 mismatches in a row. Plan your flips to avoid reaching this threshold.

When it triggers and at least one card is face-up:

- one random revealed card is chosen
- that card and its mirror partner are flipped back face-down
- the remembered positions for that symbol are erased from the game memory
- the player must rediscover the pair

When it triggers and no card has been matched yet:

- one random face-down card is flashed briefly so the Nen effect is still visible
- the card re-hides after a short moment — memorize it while you can

If the player makes a successful match before reaching 3 mismatches, the mismatch counter resets to zero. Watch the Hunter Logs for the "one more mistake" warning when the streak reaches 2.

## Hunter Logs — What Each Line Means

> "Probability is not destiny. The 93% card still fails 7% of the time. Trust nothing."
>
> — Hisoka

The percentage is not a guarantee. A `93%` reading still carries a `7%` chance of being wrong. Never trust probabilities blindly.

> "Adjacent cards share aura. Check neighbors. They are 20% more likely."
>
> — Killua

Cards adjacent to the revealed one gain a `+20%` bonus. If you flip index `10`, neighbors like `2, 3, 9, 11, 17, 18, 19` are more likely matches.

> "Hisoka's interference triggers after 3 mismatches. Plan flips in batches of 2."
>
> — Kurapika

After `3` consecutive mistakes, Hisoka flips a random revealed card back face-down. If no card is revealed yet, a random hidden card flashes briefly instead. A correct match before the third mistake resets the counter to zero — so plan to avoid `3` consecutive mistakes.

> "The probability numbers lie sometimes. Watch for sudden drops."
>
> — Gon

Probabilities recalculate on every flip. A sudden drop signals Hisoka's distortion is twisting the numbers under mismatch pressure.

> "A perfect game is 20 moves."
>
> — Biscuit

Strategically, the ideal is `20` clean matches. The `MOVES` counter increments on every flip, so the practical goal is to keep the move count as low as possible.

> "The symbols aren't random. There's a hidden pattern."
>
> — Anonymous

Every card at index `i` is paired with the card at `(39 - i)`. Card `0` pairs with `39`, card `1` pairs with `38`, and so on.

Examples:

- `0 ↔ 39` opposite corners
- `1 ↔ 38`
- `19 ↔ 20` center of the board

## File Responsibilities

- `index.html`: page layout, HUD, side panel, game area, and script loading.
- `style.css`: visual theme, colors, grid layout, card states, responsive design, and text styling.
- `app.js`: main game loop, card flipping, scoring, timer, matching, logs, and hints.
- `algorithm/probabilityEngine.js`: probability calculation and best-move selection.
- `algorithm/patternDetector.js`: hidden mirror-pattern detection.
- `algorithm/interferenceManager.js`: mismatch streaks, probability distortion, and Nen interference.
- `components/CardGrid.js`: renders the card grid.
- `components/ProbabilityOverlay.js`: updates probability text on hidden cards.
- `components/ScorePanel.js`: updates score, timer, moves, and matched-pair display.

## How To Run

Open `index.html` directly in a modern browser.

You can also serve the folder locally:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000
```

## Submission Notes

- No build tools are required.
- No backend is required.
- The project uses only HTML, CSS, and vanilla JavaScript.
- The repository follows the exact required structure.
