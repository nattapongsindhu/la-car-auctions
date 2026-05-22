# Security Controls

## Data Handling Model

| Concern | Control |
|---------|---------|
| Data source | Publicly viewable OPG auction listings only |
| Ingestion method | Manual clipboard paste — no automated scraping |
| Data storage | Browser `localStorage` only — no backend, no database |
| Credential handling | No credentials, tokens, or API keys collected or transmitted |
| PII exposure | VINs are public auction identifiers; no personal data collected |

## Input Handling

- All pasted HTML/plain-text is processed through a typed parsing pipeline
- Raw HTML is parsed via `DOMParser` to extract text content only — `innerHTML` and `dangerouslySetInnerHTML` are never used
- Extracted fields are mapped to a strict `Vehicle` type before any render or storage
- Malformed rows are silently skipped; errors are surfaced via UI state, not raw exceptions

## Client-Side Persistence

- Data stored in `localStorage` under key `opg-vehicles`
- Schema validated on load via `Array.isArray()` guard
- Corrupt data falls back to bundled demo dataset, not an error state
- No cross-origin data sharing; no cookies; no service workers

## Dependency Security

- Dependabot monitors npm packages weekly (grouped by ecosystem area)
- Dependabot monitors GitHub Actions weekly
- `npm audit --audit-level=moderate` runs in CI on every push
- CodeQL TypeScript scan runs on every push and weekly schedule

## Secret Management

- No secrets currently used in the application
- Future secrets: store in Vercel Environment Variables (server-only) or GitHub Actions Secrets
- `NEXT_PUBLIC_` prefix is reserved for browser-safe config only — never for sensitive values
- `.env.example` documents the variable contract; `.env.local` is gitignored

## CI/CD Security Posture

- All CI jobs run with `permissions: contents: read` (minimal scope)
- CodeQL runs with `permissions: security-events: write` only
- Branch protection should require CI checks to pass before merge
- No force-push to `main`
