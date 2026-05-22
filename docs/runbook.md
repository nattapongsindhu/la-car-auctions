# Runbook — Operational Procedures

## Ingesting Auction Data

**Steps:**
1. Navigate to [opgla.com/Auctions](http://opgla.com/Auctions)
2. Find the "Next Week Auctions" table
3. Select all table rows (`Ctrl+A` in the table area, or select manually)
4. Copy (`Ctrl+C`)
5. Open the app → **Vehicle Scraper** tab
6. Paste into the text area (`Ctrl+V`)
7. Click **Synchronize Live Production Data**

**Expected result:** Vehicle count updates; table populates with risk badges.

---

## Troubleshooting: "No vehicles found"

**Symptom:** Sync button pressed, vehicle count stays 0.

**Diagnosis steps:**

| Check | What to look for |
|-------|-----------------|
| Input format | Is the pasted content HTML (contains `<tr>`, `<td>`)? If so, HTML parser runs. Otherwise plain-text parser runs. |
| Row structure | HTML parser requires ≥7 `<td>` cells per row. Inspect pasted HTML in browser DevTools. |
| VIN column | VIN must be 17 chars, alphanumeric, in column index 5 (0-based). |
| Plain-text | Each line needs at least 2 words before the VIN (make + model). |

**Fix:** If OPG changed their table structure, update cell index mapping in `lib/parsers/index.ts` → `parseOpgHtmlTable()`.

---

## Troubleshooting: Risk Badges Seem Wrong

**Symptom:** Recent Toyota shows HIGH RISK, or old BMW shows CLEAN.

**Check:** Open `lib/risk/index.ts`:
- `EUROPEAN_PREFIXES` — make sure the problematic make starts with one of these
- `CLEAN_MAKES` — confirm the make is listed
- `computeDmvFee()` — verify `CURRENT_YEAR` matches `new Date().getFullYear()`
- Fee thresholds: HIGH if `dmvFee > 1500`, CLEAN if `dmvFee < 1000`

---

## Troubleshooting: "Check DMV" Button Doesn't Copy VIN

**Symptom:** DMV tab opens but VIN not in clipboard.

**Cause:** Browser blocked clipboard API (common in non-HTTPS or after user denial).

**Fix:** The `try/catch` in `handleCheckDmv` silently handles this. The DMV tab still opens. User can manually type the VIN shown in the table.

---

## Troubleshooting: Vercel Build Fails

**Common causes:**

| Error | Fix |
|-------|-----|
| TypeScript error | Run `npm run typecheck` locally and fix before pushing |
| Node version mismatch | `.nvmrc` pins `20.9.0`; `package.json` engines enforces `>=20.9.0` |
| Import not found | Check relative path depth (`../../`) from `app/ui/` to `lib/` or `types/` |
| JSON import fails | Ensure `resolveJsonModule: true` in `tsconfig.json` |

---

## Deployment Procedure

```bash
# 1. Make changes on a feature branch
git checkout -b feat/my-change

# 2. Verify locally
npm run typecheck
npm run build

# 3. Push and open PR
git push origin feat/my-change

# 4. CI checks must pass (typecheck + build + audit)
# 5. Merge to main — Vercel auto-deploys
```

**Rollback:** In Vercel dashboard → Deployments → select previous "Ready" deployment → Promote to Production.

---

## Dependency Updates

Dependabot opens PRs weekly. Review process:
1. Check the PR diff — confirm only version bumps
2. Run `npm audit` after merging to verify no new vulnerabilities
3. Test build locally if the updated package is in the critical path (next, react, typescript)
