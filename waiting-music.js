/* เพลงสำหรับหน้ารอ นับจาก 0:00 — ไม่กระทบเพลงเซอร์ไพรส์ที่เริ่ม 3:15 */
(() => {
  'use strict';

  const waitingAudio = document.getElementById('waiting-music');
  const releaseGate = document.getElementById('release-gate');
  const button = document.getElementById('waiting-music-toggle');
  const icon = document.getElementById('waiting-music-icon');
  const label = document.getElementById('waiting-music-label');
  const hint = document.getElementById('waiting-music-hint');
  if (!waitingAudio || !releaseGate || !button || !icon || !label || !hint) return;

  const WAITING_VOLUME = 0.32; // ปรับความดังเพลงหน้ารอได้ระหว่าง 0 ถึง 1
  let finished = false;
  waitingAudio.volume = WAITING_VOLUME;

  function updateButton() {
    const playing = !waitingAudio.paused;
    button.classList.toggle('is-playing', playing);
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', playing ? 'หยุดเพลงชั่วคราว' : 'เปิดเพลงระหว่างรอ');
    label.textContent = playing ? 'พักเพลงสักครู่ ♡' : 'กดเปิดเพลงฟังระหว่างรอ 💗';
    icon.textContent = playing ? '❚❚' : '♫';
    if (playing) hint.textContent = 'กำลังเล่นตั้งแต่ต้นเพลง · ปรับเสียงได้ที่เครื่อง ♫';
  }

  async function playWaitingSong() {
    if (finished || !document.body.classList.contains('release-locked')) return;
    try {
      await waitingAudio.play();
    } catch (error) {
      // Chrome/Safari/มือถืออาจบล็อก autoplay ที่มีเสียง ต้องกดปุ่มเอง
      if (!finished) hint.textContent = 'แตะปุ่มด้านบนเพื่อเปิดเพลงนะครับ ♫';
    }
  }

  function stopForSurprise() {
    finished = true;
    waitingAudio.pause();
    waitingAudio.currentTime = 0;
    button.disabled = true;
    button.setAttribute('aria-pressed', 'false');
    // เพลงหน้าเซอร์ไพรส์เป็นคนละไฟล์ จึงยังเริ่มที่ 3:15 ตามเดิม
  }

  button.addEventListener('click', () => {
    if (finished) return;
    if (waitingAudio.paused) playWaitingSong();
    else waitingAudio.pause();
  });
  waitingAudio.addEventListener('play', updateButton);
  waitingAudio.addEventListener('pause', updateButton);
  waitingAudio.addEventListener('error', () => {
    if (finished) return;
    button.disabled = true;
    label.textContent = 'ไม่สามารถเปิดเพลงได้';
    hint.textContent = 'กรุณาตรวจสอบไฟล์ assets/waiting-song.mp3';
  });
  document.addEventListener('hbd:release-unlocked', stopForSurprise, { once: true });

  if (!document.body.classList.contains('release-locked')) {
    stopForSurprise();
    return;
  }
  updateButton();
  // เปิดเว็บแล้วพยายามเริ่มเพลงจาก 0:00 ถ้าเบราว์เซอร์อนุญาต
  // มิฉะนั้นปุ่มเล่นเพลงยังใช้งานได้ตามปกติ
  playWaitingSong();
})();
