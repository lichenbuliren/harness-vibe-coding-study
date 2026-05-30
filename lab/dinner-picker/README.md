# Dinner Picker

Dinner Picker is the first real lab project for the harness + vibe coding study.

It is a mobile-first React + TypeScript app for keeping a small dish pool and
drawing a random answer to "what should I eat today?"

## Features

- Add dishes to a local pool.
- Choose one simple tag per dish.
- Delete dishes.
- Draw a random recommendation.
- Persist the dish pool and latest pick in `localStorage`.
- Keep the experience mobile-friendly and slightly ritual-like.

## Commands

```bash
npm install
npm test -- --run
npm run lint
npm run build
npm run dev -- --host 0.0.0.0
```

When the dev server is running with `--host 0.0.0.0`, a phone on the same local
network can open the reported network URL.

