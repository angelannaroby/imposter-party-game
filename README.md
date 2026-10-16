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

1. Enter 3–12 unique names, choose a category, and select 1–4 imposters (with at least two civilians).
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

## Updated mobile game flow

- Imposters receive a broad **category hint** during their private reveal, but never the exact word.
- Hold to reveal a role, then **release before handing over**. Role details are hidden when the browser loses focus or changes visibility, and continuing is disabled while the card is showing.
- Groups voting aloud can use **New game · skip voting** on the discussion or voting screen. This asks for confirmation before discarding the round.
- In-app voting remains available for groups that prefer to select all suspects on the device.
- Game screens have fewer instructional captions; the setup screen and README explain the rules.

### Phone acceptance checklist

1. Test portrait layouts at 320px, 375px and 430px; no sideways scrolling or clipped action buttons.
2. Start rounds with 3, 6, and 12 players, including a four-imposter round with at least 6 players.
3. During every reveal, hold and release the card; the next player must never see the previous player's word or hint.
4. Switch browser tabs or lock the screen while holding the role card; the secret must be concealed on return.
5. Complete a round using in-app voting, then start another round.
6. Complete a round without voting: tap **New game · skip voting** and confirm.
7. Verify text is readable at large mobile font sizes and reduced-motion preferences work.

### Suggested incremental commits

1. `feat: improve mobile round flow with private hints and skip voting`
2. `feat: add expressive game screen polish and test imposter hints`
3. `docs: document mobile game flow and acceptance criteria`

The original app remains a client-only game: no network multiplayer, account, or backend is required.

## Gameplay update: in-person groups

- **New game** on the discussion and voting screens immediately starts another round with the same crew and settings. No browser confirmation dialog.
- **Reveal answers · voted in person** lets the group reveal the actual imposters and word without selecting suspects in the app. Hide the answers again if you wish.
- The discussion screen has an optional 60/90/120-second timer; leave it Off for unlimited discussion.
- Game stages scroll to the top when advancing, so each new screen starts in view on a phone.

## Visual refresh and voting privacy

The discussion screen intentionally never reveals the secret word or imposter identities. For groups voting in person, use **New game** to start the next round without exposing answers. The game stage screens share CSS-drawn space characters and respect reduced-motion preferences.

## Stage: role reveal and results polish

- The private reveal control says **Hold to reveal**. Press and hold (touch, mouse, Space, or Enter); releasing or losing focus conceals the role.
- The next-player button says **Pass the phone**. Its action remains disabled while a role is visible.
- Results now use animated space effects, illustrated crew, a winner badge, individual imposter identities, and a highlighted secret word.
- Return to settings does not open a browser confirmation. The **New game** action in discussion and voting remains immediate and never reveals answers.
- Motion respects `prefers-reduced-motion`.

### Release checks

Run `npm install`, `npm run format`, and `npm run check`. On a phone, test holding/releasing a role, a backgrounded browser, long names, and four-imposter results.

## Stage 4: Mobile voting

Voting uses reusable, seat-based crew avatars across player setup, voting, and results. Choose exactly the configured number of suspects to confirm. Groups voting in person can use **New game** without revealing secret roles. The game is English-only.

## Stage 5 — mobile release checks

The app is installable on Android and iOS from the deployed HTTPS site. For offline play, **open the deployed game once while online**, then reopen it after the service worker finishes caching app resources. Updates require an online visit; the phone browser controls installation (Android: Install app; iOS Safari: Share → Add to Home Screen).

```bash
npm install
npm run check
npx playwright install chromium webkit
npm run test:e2e
```

CI runs formatting, linting, unit tests, build, and mobile browser E2E tests. Playwright runs Pixel 7 Chromium and iPhone 13 WebKit emulations; these don't replace manual checks on real devices.

### Release checklist

- Complete a full round, including revealing a role and voting, on Android Chrome and iPhone Safari.
- Test at 320 px width; check there is no horizontal overflow.
- Verify that leaving the tab while holding a secret closes it.
- Confirm **New game** does not show the previous round's answer.
- After opening the deployed app online, disable the network and reload to test offline use.
- Ensure the deployed page offers Add to Home Screen / Install.

Architecture: the service worker in `public/sw.js` stores the built HTML and fetched local assets. Bump `CACHE_NAME` whenever modifying caching behavior. No analytics or account data is required for gameplay.
