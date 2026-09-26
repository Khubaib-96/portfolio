# Khubaib's portfolio

Static cyberpunk portfolio. No dependencies or build step.

Run `python3 -m http.server 8000` and open http://localhost:8000.
Run `node --test test.mjs` to check navigation and music controls.
Deploy this folder to any static host, keeping the `public/images` path.

## Image files

Add real JPEG images to **public/images/** with these exact names, then refresh.
Until then, CSS illustrations fill the image spaces without broken image icons.

| Filename | Placement | Suggested size |
| --- | --- | --- |
| `khubaib-portrait.jpg` | Homepage portrait | 900 × 1100 |
| `cyberpunk-city.jpg` | Background outside the screen | 2400 × 1600 |
| `ai-agent-lens.jpg` | AI Agent Lens preview | 1600 × 900 |
| `koh-e-atlas.jpg` | Koh-e-Atlas preview | 1600 × 900 |
| `weather-forecasting.jpg` | Weather research preview | 1600 × 900 |

Convert PNG/WebP files to JPEG instead of just renaming their extensions.
Images use a centered cover crop. Leave margins around diagram labels.

Content and image paths live in `index.html`; styling in `style.css`; navigation in `app.js`.
All content stays readable without JavaScript. Current role and project descriptions come from the supplied README.

## Music

Add your MP3 as **public/audio/track.mp3**, then refresh. Play/Stop controls sit in the center of the bottom monitor bezel. Music starts only when Play is pressed and loops across tabs. Stop returns to the beginning. Missing or unsupported audio displays “TRACK UNAVAILABLE”.
