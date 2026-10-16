# Who’s the Imposter?

An English-only, mobile-first, single-device secret-word party game for 3–12 players. Built with React 19, TypeScript, Vite and Tailwind CSS. No account or backend is required.

## Getting started

Requires Node.js 22.12+ and npm.

```bash
npm ci
npm run dev
```

## Scripts

| Script                 | Purpose                                |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | Local Vite development server          |
| `npm run build`        | TypeScript check and production bundle |
| `npm run preview`      | Preview the production bundle          |
| `npm run lint`         | ESLint                                 |
| `npm run format`       | Apply Prettier formatting              |
| `npm run format:check` | Verify Prettier formatting             |
| `npm run test`         | Vitest unit tests                      |
| `npm run test:e2e`     | Playwright mobile Chromium and WebKit  |
| `npm run check`        | Formatting, ESLint, Vitest, and build  |

Install Playwright browsers before the first E2E run: `npx playwright install chromium webkit`.

## Gameplay

1. Enter 3–12 distinct names, choose a word category and select 1–4 imposters (at least two crew members must remain).
2. Pass the device around; each player presses **I have the phone**, then **Hold to reveal** to privately see the word or an associated hint. Releasing hides the secret.
3. Tap **Pass the phone** when the card is hidden; repeat for every player.
4. Discuss who might be bluffing. The optional timer can be disabled.
5. Either vote in the app to reveal results, or choose **New game** to play another round without exposing anyone's role.

Crew members share a secret word; imposters see only a related-word hint. To win via in-app voting, the crew must identify _all_ imposters.

## Project structure

- `src/App.tsx`: game phase coordination and setup UI.
- `src/features/game/components/`: crew visuals, private reveal, discussion timer, voting, and results.
- `src/features/game/data/`: typed category and word data (352 words across 14 categories).
- `src/features/game/model/`: domain types, randomized assignments, voting rules, and hints.
- `src/features/game/model/__tests__/`: deterministic domain-level checks.
- `tests/e2e/`: phone-sized full-round tests and overflow checks.
- `src/styles/index.css`: global/mobile design, motion, and accessible reduced-motion rules.
- `.github/workflows/ci.yml`: quality and mobile browser checks.

Role assignments and player names are stored in local memory only. The site includes a service worker for offline use after the first online visit.

## Mobile acceptance checks

- Test portrait layouts at 320px, 375px, and 430px without horizontal scrolling.
- Complete rounds with 3, 6, and 12 players, including a four-imposter round.
- Ensure a secret is concealed when the reveal is released or the app loses focus.
- Confirm **New game** does not disclose previous-round answers.
- Run `npm run check` and `npm run test:e2e` before committing.
- On a deployed HTTPS site, test offline loading after an initial successful online visit.

Playwright requests reduced motion so WebKit can interact with stable controls. Regular users still receive animations unless their device requests reduced motion.

## Scope

English only for v1. Malayalam is a potential later addition. This project intentionally does not include online multiplayer, logins, or analytics. No license is granted unless the repository owner adds one.
