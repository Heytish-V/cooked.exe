/**
 * questionSelector.js — Balanced question selection from the pool
 *
 * Picks `count` questions (default 10) from the full pool,
 * guaranteeing at least 1 question from each of the 6 categories,
 * then filling remaining slots randomly from unused questions.
 * Final array is shuffled so categories feel random.
 */

/**
 * Fisher-Yates shuffle (in-place).
 * @param {Array} arr
 * @returns {Array} the same array, shuffled
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Select a balanced set of questions from the pool.
 * @param {Array} pool — full question pool
 * @param {number} count — how many to pick (default 10)
 * @returns {Array} selected questions, shuffled
 */
export function selectQuestions(pool, count = 10) {
  // Group by category
  const byCategory = {};
  for (const q of pool) {
    if (!byCategory[q.category]) {
      byCategory[q.category] = [];
    }
    byCategory[q.category].push(q);
  }

  // Shuffle each category's questions
  for (const cat of Object.keys(byCategory)) {
    shuffle(byCategory[cat]);
  }

  const selected = [];
  const usedIds = new Set();

  // Step 1: Pick 1 from each category (guaranteed coverage)
  for (const cat of Object.keys(byCategory)) {
    const q = byCategory[cat][0];
    selected.push(q);
    usedIds.add(q.id);
  }

  // Step 2: Fill remaining slots from unused questions
  const remaining = pool.filter((q) => !usedIds.has(q.id));
  shuffle(remaining);

  const slotsLeft = count - selected.length;
  for (let i = 0; i < slotsLeft && i < remaining.length; i++) {
    selected.push(remaining[i]);
  }

  // Step 3: Shuffle the final selection so order feels random
  shuffle(selected);

  return selected;
}
