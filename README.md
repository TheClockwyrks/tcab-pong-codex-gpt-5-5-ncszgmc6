# Carom

Carom is a top-down paddle duel for the browser. Two bright paddles face off
across a dark field, with a fast ball that ricochets off the walls and a pair of
fixed center obstacles. Move your paddle while striking the ball to add spin and
bend the next shot into awkward bank angles.

The game runs entirely in the browser on the Simple 2D engine. There are no
runtime assets, network calls, accounts, servers, or API keys.

## Install

```bash
npm ci
```

## Development

```bash
npm run dev
```

Vite serves the game with hot reload. Open the local URL it prints and play in
the browser.

## Production Build

```bash
npm run build
```

The static site is written to `dist/`, with `dist/index.html` as the entry
point. The directory can be served as-is from any static file server.

## Controls

- Player 1: `W` and `S`
- Player 2 in Versus: `ArrowUp` and `ArrowDown`
- Solo: either `W`/`S` or the arrow keys move the human paddle
- Confirm menu item: `Enter` or `Space`
- Pause or resume: `P` or `Escape`
- Back from menus: `Escape`
- Mute: `M`

First to 11 wins, with a two-point lead required.
