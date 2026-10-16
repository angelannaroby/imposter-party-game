# Who’s the Imposter?

A single-device, English-language secret-word party game for 3–12 players. Built with React, TypeScript, Vite and Tailwind CSS.

## Requirements

Node.js 22.12+ and npm.

## Getting started

```bash
npm install
npm run dev
```

The first `npm install` also creates the lockfile. Commit `package-lock.json` to the repository for reproducible installs.

## Available scripts

| Command                | Purpose                           |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start the dev server              |
| `npm run build`        | Typecheck and build               |
| `npm run preview`      | Preview production build          |
| `npm run lint`         | ESLint                            |
| `npm run test`         | Vitest unit tests                 |
| `npm run format`       | Format with Prettier              |
| `npm run format:check` | Check formatting                  |
| `npm run check`        | Formatting, lint, tests and build |

## How to play

1. Enter 3–12 unique names, a category and one imposter (or two for at least six players).
2. Pass the device to each player, who holds the secret card to reveal their private role.
3. All civilians receive the same word; imposters receive no word.
4. Each player gives a clue, then everyone discusses suspects.
5. Select exactly the specified number of suspects. Civilians win only if every selected suspect is an imposter.
6. Start another round to get another word.

## Architecture

- `src/features/game/data/words.ts`: typed English word bank.
- `src/features/game/model/types.ts`: game domain types.
- `src/features/game/model/engine.ts`: role assignment, random word selection and voting rules.
- `src/features/game/model/__tests__/`: game-engine tests.
- `src/App.tsx`: game flow and view.
- `src/styles/index.css`: responsive styles.

State is local to the game. No global state library, backend, accounts, tracking or server persistence are necessary. The app uses the browser’s cryptographic random-number generator to assign roles.

## Scope

English-only for this release. Malayalam may be added as a separate, reviewed translation later. Do not add another language before it has complete, reviewed word data and UI copy.

## Privacy

Player names and assigned roles live only in browser memory during the current session. Avoid showing the role screen to other players.

## License

No license is granted until one is added by the repository owner.
