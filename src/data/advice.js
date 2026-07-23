/**
 * advice.js — Pool of humorous recommendations
 *
 * Organized by score tier. The app randomly picks from the appropriate tier.
 * To customize: add/remove entries in any tier array.
 */

const advice = {
  // 0–20: Freshly Compiled
  fresh: [
    'System nominal. No intervention required. You are suspiciously functional.',
    'Recommendation: Continue existing. You are performing above expected parameters.',
    'TouchGrass() returned: already touching. Impressive.',
    'Warning: Dangerously well-rested. Other humans may become suspicious.',
  ],

  // 21–40: Mildly Toasted
  mild: [
    'Recommendation: Schedule 1 (one) nap. Execute: NapProtocol.init()',
    'Consider reducing screen brightness. Your retinas filed a complaint.',
    'Mild stress detected. Nothing a questionable amount of snacks can\'t fix.',
    'System suggestion: Pet a dog. Any dog. Immediately.',
  ],

  // 41–60: Medium Rare
  medium: [
    'Stress levels rising. Deploy emergency comfort food subroutine.',
    'Your brain has requested a reboot. Please comply within 24 hours.',
    'Recommendation: Close 47 of your 50 browser tabs. Keep the music one.',
    'Warning: Burnout trajectory detected. Countermeasure: do literally nothing for 1 hour.',
    'System.out.println("Please go outside.");',
  ],

  // 61–80: Deep Fried
  deep: [
    'CRITICAL: Execute TouchGrass() immediately. This is not a suggestion.',
    'Your stress levels have exceeded the warranty. We are not liable for further damage.',
    'Recommendation: Uninstall responsibilities. Reinstall after a 72-hour nap.',
    'Emergency protocol: Step away from ALL screens. Yes, including this one.',
    'Alert: Your coping mechanism of "I\'m fine" has been deprecated.',
    'sudo rm -rf /stress — WARNING: This may also delete your personality.',
  ],

  // 81–95: Absolutely Cooked
  cooked: [
    'MAYDAY MAYDAY. All systems critical. Deploy emergency self-care or accept your fate.',
    'You are now running on pure spite and caffeine. Godspeed, soldier.',
    'Recommendation: Have you tried turning yourself off and back on again?',
    'Your burnout level has achieved sentience. It is now filing its own complaints.',
    'ALERT: You have reached "reply to emails with just 👍" levels of cooked.',
    'System recommendation: Cry in the shower. It\'s multitasking.',
  ],

  // 96–100: Beyond Recovery
  beyond: [
    'ERROR: Recommendations module has crashed. Even we can\'t help you now.',
    'You have transcended burnout. You are now a cautionary tale in a productivity blog.',
    'Recommendation: Contact your nearest pillow. Establish permanent residency.',
    'FATAL: Life.exe has stopped responding. Would you like to send an error report? (No one will read it.)',
    'Achievement unlocked: You are the reason AI was invented — to replace you while you rest.',
  ],
};

export default advice;
