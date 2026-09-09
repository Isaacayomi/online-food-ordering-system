# Deployment Record (Vercel)

The app is **live**: [https://campus-eats-group8.vercel.app](https://campus-eats-group8.vercel.app)

This doc records how the deployment is set up, what was fixed along the way, and how to redeploy — so it never needs to be planned again.

---

## Live configuration

| Item                  | Value                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Live URL              | `https://campus-eats-group8.vercel.app`                                                                             |
| Source                | This repo, **`main`** branch                                                                                        |
| Root directory        | `./` (repo root)                                                                                                    |
| Framework preset      | **Other** (static files; no build step)                                                                             |
| Build command         | None / empty                                                                                                        |
| Install command       | None                                                                                                                |
| Environment variables | None (the `EXAMPLE_NAME` placeholder import env was removed)                                                        |
| Deploy trigger        | Automatic — every push to `main`                                                                                    |
| Demo accounts         | Student `demo@student.com` / `demo123`; Admin `admin@campuseats.com` / `admin123` (both auto-seeded on first visit) |

## `vercel.json`

The config that ships in the repo is the multi-page static config — no SPA rewrite:

```json
{
  "cleanUrls": true
}
```

- Vercel serves every real `.html` file automatically.
- Unknown routes fall back to the repo's `404.html` (Vercel's default behavior).

> **Do not** add an `/(.*)` rewrite — this is a multi-page app, not an SPA. That mistake was the original `vercel.json` bug fixed in `main`.

## Incident note: the first Vercel project served the wrong site

Before the correct import, the URL environment displayed a Bootstrap "Online Food Delivery" page that existed in **no** commit of this repo — the deployed Vercel project was linked to a different/older source. **Resolution:** that project was retired/replaced, and the repo was imported fresh as a new project (`Framework preset = Other`, branch `main`, no build/env). After a fresh import, confirm the deployed HTML title reads `CampusEats | Online Food Ordering` and that `/assets/hero.png` returns 200.

## Pre-deploy QA (already run before the merge)

All open streams were merged into `dev`, then `dev` was merged into `main` via an approved PR. Before that final merge:

- `for f in js/*.js; do node --check "$f"; done`
- `PORT=8080 node server.js` smoke walkthrough: `/`, `/login.html`, `/register.html`, `/pages/menu.html`, plus about/cart/checkout/orders/contact — none blank, no console errors.
- Menu shows 18 Nigerian dishes (no auto-loaded live feed); search "pizza" returns live search results.
- Signed-out add-to-cart shows the sign-in toast and adds nothing.
- Demo login → header shows `Hi, Demo · Sign out`; cart badge increments.
- Auth-gated cart, checkout and My Orders flows verified.

## Redeploying (after future changes)

No manual step is needed — Vercel auto-deploys on pushes to `main`. If you ever need a manual redeploy:

1. Push to `main` (via a merge of `dev`), or
2. In the Vercel dashboard: project → **Deployments** → latest → **Redeploy**.

## Tester handoff

Share the live link plus:

- Demo accounts: student `demo@student.com` / `demo123`; admin `admin@campuseats.com` / `admin123`
- Bug reports via the GitHub Issues bug template (`.github/ISSUE_TEMPLATE/bug_report.md`)
- Known limits (any intentionally-stubbed feature) so tester reports focus on real bugs.
