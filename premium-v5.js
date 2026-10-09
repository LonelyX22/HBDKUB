/* HBD Mom V5: progressive enhancement, independent of the eight-scene engine. */
(() => {
  'use strict';
  const button = document.getElementById('gift-unlock-btn');
  const message = document.getElementById('gift-message');
  const stage = button?.closest('.gift-orbit');
  if (!button || !message || !stage) return;

  // No timer-driven effects: the animation only runs when Mom opens the gift.
  button.addEventListener('click', () => {
    const opened = stage.classList.toggle('gift-opened');
    button.setAttribute('aria-expanded', String(opened));
    message.hidden = !opened;
    button.textContent = opened ? 'เก็บของขวัญไว้ในใจ ♡' : 'แตะเปิดของขวัญพิเศษ 🎁';
  });

  // Give a visible focus ring to keyboard users. Hover effects are handled by CSS.
  document.documentElement.classList.add('premium-v5-ready');
})();
