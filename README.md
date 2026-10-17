# FindTheFake 🚀

A colourful, mobile-first imposter party game built for one phone and a room full of suspicious friends.

Everyone except the imposters receives the same secret word. Imposters get a related hint instead, then try to blend in while the group exchanges clues and figures out who's faking it.

**Live game:** [FindTheFake](https://findthefake.vercel.app/)

## Features

- **One-phone party play:** 3–12 players, with 1–4 imposters depending on group size.
- **Private role reveals:** Hold to reveal your word or hint; release before passing the phone.
- **Word-specific imposter hints:** Related clues rather than generic category descriptions.
- **Varied categories:** English word collections plus **മല്ലു മൂവീസ്**, **മലയാളി വൈബ്സ്**, and **പഴയകാല ഓർമ്മകൾ** with Malayalam-script answers and hints.
- **Flexible rounds:** Discuss with an optional timer, vote in the app, or move straight to a new round after voting in person.
- **Playful space theme:** Animated crew characters, colourful cards, and a touch-friendly mobile interface.
- **Installable experience:** PWA support and offline access after the initial online visit.
- **Accessibility considerations:** Semantic controls, keyboard interaction, and reduced-motion support.

## How it works

1. Add player names, choose a category, and set the number of imposters.
2. Pass the phone around. Each player privately reveals their role.
3. Take turns giving clues, then discuss who might be faking it.
4. Vote for the suspected imposters in the app, or vote aloud and start another round without revealing the answers on screen.

No accounts or backend are required. Game state stays on the device for the current session.

## Tech stack

| Area | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS, custom CSS, Lucide icons |
| Unit tests | Vitest |
| End-to-end tests | Playwright (mobile Chromium and WebKit) |
| Code quality | ESLint, Prettier, strict TypeScript |
| CI | GitHub Actions |
| Deployment | Vercel |
| Offline support | Web app manifest and service worker |

## Architecture

The project uses a small, feature-oriented structure to keep game data, domain logic, and presentation separate.

```text
src/
├── features/
│   └── game/
│       ├── components/       # Game screens and reusable crew UI
│       ├── data/             # Categories and curated word banks
│       └── model/            # Types, role assignment, and game rules
├── styles/                   # Global and responsive styles
├── App.tsx                   # Round flow and screen composition
└── main.tsx                  # Application entry point

tests/e2e/                    # Mobile browser flows
public/                       # PWA assets and service worker
.github/workflows/            # CI checks
```

The game runs entirely in the browser. Player roles and secret words aren't sent to a server. The PWA caches application resources for offline access after an initial online load.

## Run locally

Requires Node.js 22 and npm.

```bash
npm ci
npm run dev
```

Useful scripts:

```bash
npm run check       # Format check, ESLint, unit tests, and production build
npm run test:e2e    # Mobile Playwright tests
npm run build       # TypeScript check and production build
```

For a first Playwright run, install the browsers with `npx playwright install chromium webkit`.

## Project focus

FindTheFake is a small party game, but it is built with the same attention to maintainability, predictable state transitions, mobile usability, testing, and automated quality checks as a larger frontend application.

## License

No license is currently provided. All rights reserved unless a license is added to the repository.
