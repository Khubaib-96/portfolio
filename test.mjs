import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

test('navigation and music handle normal operation, stopped playback, and missing tracks', async () => {
  const html = readFileSync(new URL('index.html', import.meta.url), 'utf8');
  const pages = [...html.matchAll(/<section id="([^"]+)" data-title="([^"]+)"/g)]
    .map(([, id, title]) => ({ id, dataset: { title } }));
  const links = pages.map(page => ({ hash: `#${page.id}`, setAttribute(key, value) { this[key] = value; }, removeAttribute(key) { delete this[key]; } }));
  const viewport = { scrollTop: 300 };
  let focused = false;
  const controls = Object.fromEntries(['music', 'music-play', 'music-stop', 'music-status'].map(id => [id, {
    events: {}, addEventListener(event, callback) { this.events[event] = callback; },
  }]));
  const music = controls.music;
  music.play = async () => music.events.playing();
  music.pause = () => music.events.pause();
  const document = {
    getElementById: id => controls[id],
    querySelectorAll: selector => selector === 'nav a' ? links : pages,
    querySelector: selector => selector === '.viewport' ? viewport : { focus() { focused = true; } },
  };
  let onHashChange;
  const location = { hash: '#research' };
  runInNewContext(readFileSync(new URL('app.js', import.meta.url), 'utf8'), {
    document, location, window: { scrollTo() {}, addEventListener(_, callback) { onHashChange = callback; } },
  });
  assert.equal(pages.filter(page => !page.hidden)[0].id, 'research');
  assert.equal(document.title, 'Research · Muhammad Khubaib');
  assert.equal(viewport.scrollTop, 0);
  for (const hash of ['#projects', '#about', '#systems', '#home', '#unknown']) {
    location.hash = hash;
    onHashChange();
    const expected = hash === '#unknown' ? '#home' : hash;
    assert.deepEqual(pages.filter(page => !page.hidden).map(page => `#${page.id}`), [expected]);
    assert.deepEqual(links.filter(link => link['aria-current'] === 'page').map(link => link.hash), [expected]);
  }
  location.hash = '#research';
  onHashChange();
  location.hash = '#main';
  onHashChange();
  assert.equal(pages.filter(page => !page.hidden)[0].id, 'research');
  assert.equal(focused, true);
  await controls['music-play'].events.click();
  assert.equal(controls['music-status'].textContent, 'NOW PLAYING:\nThe Rising Sun');
  assert.equal(controls['music-play'].disabled, true);
  music.currentTime = 42;
  controls['music-stop'].events.click();
  assert.equal(music.currentTime, 0);
  assert.equal(controls['music-status'].textContent, 'MUSIC OFF');
  assert.equal(controls['music-play'].disabled, false);
  music.play = async () => { throw new Error('Missing file'); };
  await controls['music-play'].events.click();
  assert.equal(controls['music-status'].textContent, 'TRACK UNAVAILABLE');
  // A stop while play() is pending must not turn into a missing-track error.
  music.play = () => new Promise((_, reject) => {
    music.pause = () => reject(Object.assign(new Error('Stopped'), { name: 'AbortError' }));
  });
  const pending = controls['music-play'].events.click();
  controls['music-stop'].events.click();
  await pending;
  assert.equal(controls['music-status'].textContent, 'MUSIC OFF');
  music.events.error();
  assert.equal(controls['music-status'].textContent, 'TRACK UNAVAILABLE');
});
