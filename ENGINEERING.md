# Engineering Standards

## Stack

- **Framework:** Expo SDK 55 with expo-router
- **Language:** TypeScript (~5.9)
- **Runtime:** React Native 0.83 / React 19
- **Package manager:** pnpm
- **Platforms:** iOS, Android, Web

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm start

# Run on platform
pnpm ios      # iOS simulator
pnpm android  # Android
pnpm web      # Web

# Type check
pnpm typecheck

# Lint
pnpm lint
```

## Branching & Commits

- Branch from `main`; PRs back to `main`
- Commit message format:
  - `feat: description`
  - `fix: description`
  - `docs: description`
  - `chore: description`
- Always include `Co-Authored-By: Paperclip <noreply@paperclip.ing>` on Paperclip agent commits

## Code Standards

- **TypeScript strict mode** — all files must pass `pnpm typecheck` before merge
- **No `any`** — use `unknown` + type guards instead
- **No commented-out code** — delete it; git has history
- **Small, focused PRs** — one logical change per PR
- **Test at least manually** on one platform before requesting review

## CI / CD

- All PRs and pushes to `main` run: `pnpm typecheck` and `pnpm lint`
- Both must pass before merge
- CI config: `.github/workflows/ci.yml`

## Project Structure

```
src/
  app/           # expo-router pages (file-based routing)
  components/    # Shared UI components
  constants/     # App constants
  hooks/         # Shared React hooks
  global.css     # Global styles
```

## Architecture Principles

1. **Simple first, abstract later** — don't over-engineer at the start
2. **Colocation** — keep component logic close to the component
3. **Explicit over implicit** — avoid magic; make dependencies obvious
4. **Ship and learn** — perfect is the enemy of shipped
