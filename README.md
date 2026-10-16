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

## How to play

1. Enter 3–12 unique names, a category and one imposter (or two for at least six players).
2. Pass the device to each player, who holds the secret card to reveal their private role.
3. All civilians receive the same word; imposters receive no word.
4. Each player gives a clue, then everyone discusses suspects.
5. Select exactly the specified number of suspects. Civilians win only if every selected suspect is an imposter.
6. Start another round to get another word.

## Scope

English-only for this release. Malayalam may be added as a separate, reviewed translation later.

## Privacy

Player names and assigned roles live only in browser memory during the current session. Avoid showing the role screen to other players.
