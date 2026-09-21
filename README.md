# Car inventory

A small car inventory UI built with React 19, Material UI and Apollo Client against a mock GraphQL API. There is no real backend - MSW intercepts `/graphql` in the browser, so the mock behaves like a live endpoint.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. The first load registers the service worker, so an occassional hard refresh is needed after the page first loads.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on port 3000 |
| `npm test` | Jest + React Testing Library |
| `npm run lint` | ESLint, zero warnings allowed |
| `npm run typecheck` | TypeScript, no emit |
| `npm run verify` | Lint, typecheck, test and build |

## Notes

Design decisions and trade-offs are in [NOTES.md](NOTES.md).