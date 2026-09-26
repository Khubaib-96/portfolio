const pages = [...document.querySelectorAll('main > section')];
const links = [...document.querySelectorAll('nav a')];

function showPage() {
  const selected = pages.find(page => page.id === location.hash.slice(1)) || pages[0];
  for (const page of pages) page.hidden = page !== selected;
  for (const link of links) {
    if (link.hash === `#${selected.id}`) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  document.title = `${selected.dataset.title} · Muhammad Khubaib`;
  document.querySelector('.viewport').scrollTop = 0;
}

showPage();
window.addEventListener('hashchange', () => {
  if (location.hash !== '#main') {
    showPage();
    window.scrollTo(0, 0);
  }
  document.querySelector('main > section:not([hidden]) h1').focus({ preventScroll: true });
});

const music = document.getElementById('music');
const play = document.getElementById('music-play');
const stop = document.getElementById('music-stop');
const status = document.getElementById('music-status');

play.addEventListener('click', async () => {
  status.textContent = 'LOADING…';
  try {
    await music.play();
  } catch (error) {
    if (error.name !== 'AbortError') status.textContent = 'TRACK UNAVAILABLE';
  }
});
stop.addEventListener('click', () => {
  music.pause();
  music.currentTime = 0;
  play.disabled = false;
  status.textContent = 'MUSIC OFF';
});
music.addEventListener('playing', () => {
  play.disabled = true;
  status.textContent = 'NOW PLAYING:\nThe Rising Sun';
});
music.addEventListener('pause', () => {
  play.disabled = false;
  status.textContent = 'MUSIC OFF';
});
music.addEventListener('error', () => {
  play.disabled = false;
  status.textContent = 'TRACK UNAVAILABLE';
});
