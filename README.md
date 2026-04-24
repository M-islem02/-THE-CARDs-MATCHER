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
- Nen interference after 3 consecutive mismatches.

## Game Rules

1. Flip two cards.
2. If the symbols match, the pair stays revealed and the score increases by `+10`.
3. If the symbols do not match, both cards flip back down.
4. Finish all 20 pairs before the timer reaches `0`.
5. Every 3 consecutive mismatches trigger Hisoka's Nen interference.

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

Hisoka's interference activates after 3 mismatches in a row.

When it triggers:

- one completed pair is selected randomly
- both cards in that pair flip back down
- the remembered positions for that pair are erased from the game memory
- the player must rediscover the pair

If the player makes a successful match before reaching 3 mismatches, the mismatch counter resets to zero.

## Hunter Logs — ماذا تعني كل جملة؟

> "Probability is not destiny. The 93% card still fails 7% of the time. Trust nothing."
>
> — Hisoka

النسبة ليست ضماناً. `93%` تعني أن هناك `7%` احتمال خطأ. لا تثق بالنسب بشكل أعمى.

> "Adjacent cards share aura. Check neighbors. They are 20% more likely."
>
> — Killua

البطاقات المجاورة لها `+20%` إضافية. إذا قلبت بطاقة في الموضع `10`، فالمواضع القريبة مثل `2, 3, 9, 11, 17, 18, 19` لها احتمال أعلى.

> "Hisoka's interference triggers after 3 mismatches. Plan flips in batches of 2."
>
> — Kurapika

بعد `3` أخطاء متتالية يتدخل Hisoka ويقلب زوجاً مكشوفاً إلى الأسفل. إذا وجدت مطابقة قبل الخطأ الثالث، يعود العداد إلى الصفر. لذلك يجب أن تخطط لتجنب `3` أخطاء متتالية.

> "The probability numbers lie sometimes. Watch for sudden drops."
>
> — Gon

الاحتمالات تتغير بعد كل نقرة. إذا رأيت انخفاضاً مفاجئاً، فهذا يعني أن Hisoka يتلاعب بالأرقام.

> "A perfect game is 20 moves."
>
> — Biscuit

أفضل نتيجة من ناحية الاستراتيجية هي `20` مطابقة مباشرة. في واجهة اللعبة، عداد `MOVES` يحسب كل نقرة، لذلك الهدف العملي هو تقليل عدد النقرات قدر الإمكان.

> "The symbols aren't random. There's a hidden pattern."
>
> — Anonymous

كل بطاقة `i` توأمها في الموضع `(39 - i)`. البطاقة `0` تقابل البطاقة `39`، والبطاقة `1` تقابل البطاقة `38`، وهكذا.

Examples:

- `0 ↔ 39` زوايا معاكسة
- `1 ↔ 38`
- `19 ↔ 20` المنتصف

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
