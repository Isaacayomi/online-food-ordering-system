# Deployment & Pre-Launch Checklist (Vercel)

This doc captures the steps to ship a public test build once every stream is
merged. **Deploying is explicitly deferred** until the remaining streams (cart,
contact, checkout/orders, home) have completed and merged their pages.

---

## 1. Merge everything to `main` first

`origin/main` is the protected trunk. Stream work lands in `dev` first (each via
its own PR, see `CONTRIBUTING.md`); `main` is only updated from `dev` once
everything is merged. **Do not deploy before `main` is the full app.**

Suggested merge order (each via its own PR):

| Order | Branch | Content | Notes |
| --- | --- | --- | --- |
| 1 | `feat/live-menu-auth` | Menu + live TheMealDB feed/search, auth, cart model, header/badge, real photos | Base integration — merge first |
| 2 | `feature/menu-page` | Earlier menu work | Conflicts expected in `js/menu.js`, `js/data.js`, `pages/menu.html`, `css/pages/menu.css` |
| 3 | `feature/contact-page` | Contact form | Conflicts in `pages/contact.html`, `css/pages/contact.css`, maybe `js/components.js` |
| 4 | cart / checkout / orders / about (as they're finished) | — | Duplicate ownership of `pages/cart.html`, `pages/checkout.html`, `pages/orders.html`, `pages/about.html` |

### Known merge conflict areas
- `js/data.js`, `js/menu.js`, `pages/menu.html`, `css/pages/menu.css`
  — the menu streams all touched these. Keep the **live menu + search** version.
- `login.html` + `register.html` live at the **repo root** (current branch).
  Teammate branches may still reference `pages/login.html` / `pages/register.html`.
  After merging, grep for stale links:
  `grep -rn "pages/login.html|pages/register.html" --include=*.html --include=*.js`.
- Shared header is injected by `js/components.js`. Any page that hardcodes its own
  header/nav should be reduced to the shared one. Pages must load
  `storage.js, utils.js, data.js, cart.js, auth.js, components.js` in that order.
- `vercel.json` exists on multiple branches — see config fix below.

### Rules for the merge review
- Every page must load the shared header + footer (`components.js`).
- Add-to-cart is **auth-gated** in `js/menu.js` — do not merge changes that
  re-add unconditional add-to-cart.
- Keep `[hidden] { display: none !important; }` in `css/base.css` (line 5).

---

## 2. Fix `vercel.json` for a multi-page static site

The current config rewrites **every** route to the 404 page, which breaks all
real pages on Vercel. Replace its contents with:

```json
{
  "cleanUrls": true
}
```

- Vercel serves existing `.html` files automatically.
- Unknown routes fall back to the repo's `404.html` (Vercel's default behavior).
- Do **not** add an SPA `/(.*)` rewrite — this is a multi-page app, not an SPA.

If clean URLs cause any issue with relative paths, remove `cleanUrls` and keep
the config empty (`{}`).

---

## 3. Pre-deploy QA on merged `main`

Run from a clean clone at `origin/main`:

1. `for f in js/*.js; do node --check "$f"; done`
2. `PORT=8080 node server.js` then walk these flows via curl/browser:
   - `/` (home), `/login.html`, `/register.html`, `/pages/menu.html`
   - Menu: shows 18 Nigerian dishes + 9 live dishes; search "pizza" returns live results.
   - Add to cart while **signed out** → sign-in prompt, nothing in cart.
   - Login via `demo@student.com` / `demo123` (auto-seeded) → header shows
     `Hi, Demo · Sign out`; cart badge increments after adding items.
   - Visit about/cart/checkout/orders/contact → none should be blank.
3. Check no page references `../pages/...` path mismatches after the
   root-level `login.html`/`register.html` move.

---

## 4. Deploy & hand off to testers

1. `git checkout main && git pull`; deploy directly from **GitHub → Vercel**
   (project root: repo root, framework: "Other").
2. Share the live link plus:
   - Demo account: `demo@student.com` / `demo123`
   - Bug reports via the GitHub Issues bug template (`.github/ISSUE_TEMPLATE/bug_report.md`)
   - A short "known limits" note (any intentionally-stubbed feature that isn't
     part of this test round) so reports focus on real bugs.