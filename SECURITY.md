# Security Policy

## Supported Versions

This is a portfolio project. Security fixes are applied to the latest `main` branch only.

| Version | Supported |
|---------|-----------|
| latest (main) | ✅ |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Please email: **rogers.rockmore@gmail.com**

Include:
- Description of the issue
- Steps to reproduce
- Possible impact
- Suggested fix if available

Expect a response within 5 business days.

## Security Design Notes

- This application performs **no automated web scraping**. All data is manually provided by the user via clipboard paste.
- No credentials, API keys, or tokens are stored or transmitted.
- All vehicle data is stored exclusively in the user's own browser `localStorage` — no backend database.
- The `/api/scrape` endpoint is rate-limited by Vercel's serverless function constraints and protected against oversized payloads.
- No third-party analytics or tracking scripts are included.
