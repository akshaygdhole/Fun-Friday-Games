# Fun Friday Games

Team games in **React** (Vite): quiz with score dock, icebreakers, Taboo-style rounds, categories, drawing prompts, rapid-fire, two truths and a lie, and a shared two-team scoreboard (same `localStorage` key as before: `fun_friday_score_v1`).

## Develop

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually [http://localhost:5173](http://localhost:5173)).

## Production build

```bash
npm run build
```

Static output is in `dist/`. Serve that folder with any static host (Netlify, GitHub Pages, `npx serve dist`, etc.).

## Customize content

- Quiz: `src/data/questions.js`
- Icebreakers: `src/data/prompts.js`
- Other games: `src/data/*.js`

## Routes

| Path | Page |
|------|------|
| `/` | Hub |
| `/quiz` | Team quiz |
| `/scoreboard` | Full scoreboard |
| `/icebreakers` | Icebreaker prompts |
| `/games/taboo` | Taboo |
| `/games/categories` | Categories |
| `/games/draw` | Draw & guess |
| `/games/truths-lies` | Two truths & a lie |
| `/games/rapidfire` | Rapid-fire |

For GitHub Pages with a project URL (`/Fun-Friday-Games/`), set `base` in `vite.config.js` (see [Vite base](https://vitejs.dev/config/shared-options.html#base)).
