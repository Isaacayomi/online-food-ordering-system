# Teammate Tasks

> Provisioned by the lead. Each member works from their own branch (`feature/<name>-<thing>`) and opens a PR into `dev`. The lead has already shipped `docs/DATA_CONTRACT.md`, `js/storage.js`, `js/utils.js`, and the cart **model** (`js/cart.js`) so nobody builds against air. **Every dish has a price** — from `data.js` `Menu.CATALOG` + the `PRICE_TABLET`; never invent one.

---

## nathanael — Cart page & wiring (Stream 2)

**Context:** the cart **model** is already done (`Cart.getItems/add/increment/decrement/remove/clear/count/totals` → localStorage `foodCart`, dispatches `cartchange` on every change). The navbar cart icon + `#cart-badge` already live in `js/components.js`/`components.css` and update automatically. **Your job is the cart *page*.**

**Branch:** `feature/cart-page`

**Tasks:**
1. **Replace the demo in `pages/cart.html` + `css/pages/cart.css`.** The current page is a static 2-item demo with a hardcoded `quantity`/`remove` walk — throw it out. Render from `Cart.getItems()`:
   - Each line: image, name, unit price, **qty stepper (− count +)**, line total, remove button.
   - Steppers call `Cart.decrement/increment(id)`; remove calls `Cart.remove(id)`; a "Clear cart" button calls `Cart.clear()`.
2. Summary block (live): `Cart.totals()` → subtotal / delivery (flat ₦500, —when empty) / total. Re-render on every `cartchange` **and** on load.
3. Empty state: hide the list, show "Your cart is empty" + a "Browse Menu" button → `menu.html`. Disable the checkout button when empty (keep `.is-disabled`-style handling).
4. Make sure items still load correctly **after refresh** (they should — persistence is already handled by `Cart`).
5. Do **not** touch `js/cart.js` unless something is truly broken — raise it in the PR instead.

**Acceptance:** add dishes from `pages/menu.html`, cart page reflects them, steppers/removal update totals live, refresh keeps the cart, badge in the header counts match.

---

## thessy — Contact page validation (Stream 4 support)

**Context:** `pages/contact.html` has a working form (`novalidate`, fields: name/email/subject/message) but **no JavaScript**. `Utils` (`isEmail`, `isEmpty`) and `Storage` are already available.

**Branch:** `feature/contact-validation`

**Tasks:**
1. **Create `js/contact.js`** and wire it into `pages/contact.html` — add `<script src="../js/contact.js"></script>` to the scripts block (before `js/components.js`), and add a `<p class="form-status" hidden></p>` + per-field error text to the form (styled to match the `.auth-card` look; reuse `.form-status` from `css/components.css`).
2. **Validate on submit** (`preventDefault`):
   - Name: non-empty, ≥ 2 chars
   - Email: valid via `Utils.isEmail`
   - Subject: optional, ≥ 3 chars if filled
   - Message: non-empty, ≥ 10 chars
   - Show the message under each failing field; clear on re-submit.
3. **On success:** push `{id, name, email, subject, message, date}` into localStorage key `foodMessages` via `Storage.get/set`; show a success message ("Thanks — we'll respond within a day"); clear the form.
4. Do **not** touch `storage.js`, `utils.js`, `auth.js`, `data.js`, `components.js`.

**Acceptance:** bad email + short message blocked with visible messages; valid submit saves to `foodMessages` and shows success; no console errors.

---

## Fatai — on hold (Stream 3)

Checkout + Orders stays reserved for you — the lead will brief you when it's queued.