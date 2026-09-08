# Open Streams & Task Briefs

> Status tracker for the remaining work. Each stream works from its own feature branch and opens a pull request into the protected `main` branch. The lead has already shipped the shared foundation — `docs/DATA_CONTRACT.md`, `js/storage.js`, `js/utils.js`, the **models** (`js/cart.js`, `js/auth.js`), the header/footer component, and the menu + live API layer — so nobody builds against air. **Every dish has a price** — from `data.js` `Menu.CATALOG` + the `PRICE_TABLET`; never invent one.

## Done (merged foundation)

- **Menu & API (Stream 1)** — 18-dish Nigerian catalogue with real photos and auto-curated prices; live TheMealDB feed; on-demand live search with loading spinner; category chips; search; Load More; offline-safe placeholders; logo favicon.
- **Auth & utilities (Stream 4 core)** — registration, sign in, sign out, demo-account seeding; shared header/footer via `js/components.js`; auth-aware header state; **auth-gated cart** (signed-out add-to-cart shows a sign-in/register toast); `js/utils.js`, `js/storage.js`.

## Open — Stream 2 · Cart page

**Context:** the cart **model** is done (`Cart.getItems/add/increment/decrement/remove/clear/count/totals` → `foodCart`, dispatches `cartchange` on every change). The navbar cart icon + `#cart-badge` already live in `js/components.js`/`components.css` and update automatically. The job is the cart **page**.

**Tasks:**
1. **Replace the demo in `pages/cart.html` + `css/pages/cart.css`.** The current page is a static 2-item demo with a hardcoded quantity/remove walk — throw it out. Render from `Cart.getItems()`:
   - Each line: image, name, unit price, **qty stepper (− count +)**, line total, remove button.
   - Steppers call `Cart.decrement/increment(id)`; remove calls `Cart.remove(id)`; a "Clear cart" button calls `Cart.clear()`.
2. Summary block (live): `Cart.totals()` → subtotal / delivery (flat ₦500, —when empty) / total. Re-render on every `cartchange` **and** on load.
3. Route guard: an **empty cart must not reach checkout** — disable/hide the checkout action until items exist.
4. Empty state: hide the list, show "Your cart is empty" + a "Browse Menu" button → `menu.html`.
5. Make sure items still load correctly **after refresh** (persistence is already handled by `Cart`).
6. Do **not** touch `js/cart.js` unless something is truly broken — raise it in the PR instead.

**Acceptance:** add dishes from `pages/menu.html`, cart page reflects them, steppers/removal update totals live, refresh keeps the cart, badge in the header counts match, empty cart cannot reach checkout.

---

## Open — Stream 3 · Checkout & My Orders

**Context:** `Cart` provides `totals()` (flat ₦500 delivery) and items; `Auth.current()`/`Auth.isSignedIn()` gate access; `foodOrders` is the reserved storage key; `pages/checkout.html` and `pages/orders.html` currently render an empty `<main>`.

**Tasks:**
1. **Checkout page (`pages/checkout.html` + `css/pages/checkout.css` + `js/checkout.js`):**
   - Require a signed-in user (redirect to `login.html` otherwise) **and** a non-empty cart.
   - Validated delivery form (name, email, phone, address) using `Utils` (`isEmail`, `isEmpty`) with inline field errors and a `form-status` line.
   - On success: build an order `{id, items, subtotal, delivery, total, address, date, status: "Pending"}`, push to `foodOrders`, clear the cart, show a confirmation and redirect to `orders.html`.
2. **My Orders page (`pages/orders.html` + `css/pages/orders.css` + `js/orders.js`):**
   - Render `foodOrders` (newest first) with item summary, total and status badge ("Pending").
   - Empty state: "No orders yet" + a "Browse Menu" button.
3. Do **not** touch `js/cart.js`, `js/auth.js`, `js/data.js`, `js/components.js`.

**Acceptance:** signed-out users are sent to login; empty carts are blocked; invalid form fields show errors; placing an order clears the cart, persists the order and shows it in My Orders (also after refresh).

---

## Open — Stream 4 · Contact page validation

**Context:** `pages/contact.html` has a working form (`novalidate`, fields: name/email/subject/message) but **no JavaScript**. `Utils` (`isEmail`, `isEmpty`) and `Storage` are already available.

**Tasks:**
1. **Create `js/contact.js`** and wire it into `pages/contact.html` — add `<script src="../js/contact.js"></script>` to the scripts block (before `js/components.js`), and add a `<p class="form-status" hidden></p>` + per-field error text to the form (styled to match the auth card look; reuse `.form-status` from `css/components.css`).
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

## Open — Stream 4 · Landing / home page

**Context:** `index.html` is intentionally a minimal stub (empty `<main>` + shared scripts) so the home page can be composed on top of the injected header/footer without conflicts.

**Tasks:**
1. Build a hero + featured dishes section in `css/pages/index.css` and `index.html` (inside `<main id="main">`), reusing `Menu.CATALOG` picks (e.g. a few featured dishes with images and prices).
2. Keep it responsive and consistent with the design tokens in `css/base.css`.
3. Do **not** touch `js/components.js` or the script order already present in `index.html`.

**Acceptance:** home renders a hero and featured dishes, keeps the shared header/footer, is responsive, adds no console errors.