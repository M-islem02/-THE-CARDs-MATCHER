// ScorePanel.js — updates score, timer, moves display
function updateScorePanel(score, timer, moves, pairs) {
  document.getElementById('score-val').textContent = score;
  document.getElementById('timer-val').textContent = timer;
  document.getElementById('moves-val').textContent = moves;
  document.getElementById('pairs-val').textContent = pairs + '/20';
}
