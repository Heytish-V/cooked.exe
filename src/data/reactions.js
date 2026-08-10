/**
 * reactions.js — System reaction text + GIF search terms
 *
 * Reactions escalate as the quiz progresses:
 *   early  (questions 1–3):  mild, observational
 *   mid    (questions 4–7):  growing concern
 *   late   (questions 8–10): dramatic, alarmed
 *
 * Each entry has:
 *   - texts: array of possible reaction strings (one picked randomly)
 *   - gif: search term for Giphy/Tenor
 */

const reactions = {
  early: {
    zen: {
      texts: ['Noted.', 'Okay.', 'System nominal.', 'Acknowledged.'],
      gif: 'nodding approval okay',
    },
    mild: {
      texts: ['Okay, that tracks.', 'Fair enough.', 'Logged.', 'Interesting.'],
      gif: 'thinking hmm curious',
    },
    cooked: {
      texts: ['Interesting.', 'Noted with concern.', 'Flagging this.', 'Hmm.'],
      gif: 'concerned worried nervous',
    },
    nuclear: {
      texts: [
        'Interesting. Very interesting.',
        'That\'s... a data point.',
        'Recording that.',
        'Okay then.',
      ],
      gif: 'shocked surprised wide eyes',
    },
  },

  mid: {
    zen: {
      texts: [
        'At least something works.',
        'A rare positive signal.',
        'Not all hope is lost.',
        'Okay, one less alarm.',
      ],
      gif: 'relieved sigh phew',
    },
    mild: {
      texts: ['Hmm...', 'Mildly concerning.', 'Noted.', 'Pattern forming...'],
      gif: 'suspicious squinting thinking',
    },
    cooked: {
      texts: [
        'That\'s... concerning.',
        'Adding to the file.',
        'The data is not looking great.',
        'Stress markers rising.',
      ],
      gif: 'stressed overwhelmed panicking',
    },
    nuclear: {
      texts: ['Bro.', 'Oh no.', 'This is escalating.', 'Yikes.'],
      gif: 'everything fine fire dog meme',
    },
  },

  late: {
    zen: {
      texts: [
        'Okay, some hope remains.',
        'A bright spot in the wreckage.',
        'At least this isn\'t broken.',
        'One functional subsystem found.',
      ],
      gif: 'hope light relief',
    },
    mild: {
      texts: [
        'Running out of good news here.',
        'The picture is forming...',
        'Almost done processing you.',
        'Compiling results...',
      ],
      gif: 'tired exhausted sleepy',
    },
    cooked: {
      texts: [
        'We need to talk.',
        'This is going exactly where I thought.',
        'Diagnosis forming...',
        'The algorithm is concerned.',
      ],
      gif: 'disaster falling apart chaos',
    },
    nuclear: {
      texts: ['💀', 'No comment.', '...', 'I\'ve seen enough.'],
      gif: 'skull dead inside rip funeral',
    },
  },
};

/**
 * Get the quiz phase based on question index (0-based) and total count.
 * @param {number} index — current question index (0-based)
 * @param {number} total — total number of questions
 * @returns {'early' | 'mid' | 'late'}
 */
export function getPhase(index, total) {
  const progress = index / total;
  if (progress < 0.3) return 'early';
  if (progress < 0.7) return 'mid';
  return 'late';
}

/**
 * Pick a random reaction for the given phase and tier.
 * @param {'early' | 'mid' | 'late'} phase
 * @param {'zen' | 'mild' | 'cooked' | 'nuclear'} tier
 * @returns {{ text: string, gif: string }}
 */
export function getReaction(phase, tier) {
  const bucket = reactions[phase]?.[tier] || reactions.mid.mild;
  const text = bucket.texts[Math.floor(Math.random() * bucket.texts.length)];
  return { text, gif: bucket.gif };
}

export default reactions;
