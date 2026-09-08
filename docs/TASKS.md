# Open Streams & Task Briefs

> Status tracker for the remaining work. Each stream works from its own `feature/<name>` branch off `dev`, then opens a pull request **into `dev`**. The lead has already shipped the shared foundation — `docs/DATA_CONTRACT.md`, `js/storage.js`, `js/utils.js`, the **models** (`js/cart.js`, `js/auth.js`), the header/footer component, and the menu + live API layer — so nobody builds against air. **Every dish has a price** — from `data.js` `Menu.CATALOG` + the `PRICE_TABLET`; never invent one.

---

## Before you start (everyone — do this once)

1. Get the latest branches (run this if your clone predates the recreation of `dev`):

   ```sh
   git fetch origin
   ```

2. Move to `dev` — it now contains the full shared foundation (menu, auth, cart model, header/footer, docs) — and create your stream branch from it:

   ```sh
   git checkout dev
   git pull origin dev
   git checkout -b feature/<your-stream>
   ```

   > Don't base your work on `main` — `main` is only updated from `dev` at the end, and is currently behind `dev`.

3. Run the app while you work:

   ```sh
   node server.js          # opens http://localhost:3000  (use PORT=8080 node server.js if 3000 is busy)
   ```

4. When finished:

   ```sh
   git add .
   git commit -m "feat: <what you did>"
   git push -u origin feature/<your-stream>
   ```

   Then open a pull request on GitHub **into `dev`**. Do not merge your own PR — the lead reviews and merges it.

**Rules for every stream:**

- **Never touch shared files:** `js/storage.js`, `js/utils.js`, `js/cart.js`, `js/auth.js`, `js/data.js`, `js/components.js`, `css/base.css`, `css/components.css`.
- Page-specific CSS goes only in `css/pages/<page>.css`.
- Keep the existing script order and append your page's script **after** `js/components.js`.
- All prices come from the data layer; never hardcode a dish price.

---

## Done (merged foundation)

- **Stream 1 · Menu & API** — 18-dish Nigerian catalogue with real photos and auto-curated prices; live TheMealDB feed; on-demand live search with loading spinner; category chips; search; Load More; offline-safe placeholders; logo favicon.
- **Stream 4 core · Auth & utilities** — registration, sign in, sign out, demo-account seeding; shared header/footer via `js/components.js`; auth-aware header state; **auth-gated cart** (signed-out add-to-cart shows a sign-in/register toast); `js/utils.js`, `js/storage.js`.

---

## Stream 2 · Cart page

**Branch:** `feature/cart-page` — base it on `dev` (see "Before you start").

**Context:** the cart **model** is done (`Cart.getItems/add/increment/decrement/remove/clear/count/totals` → `foodCart`, dispatches `cartchange` on every change). The navbar cart icon + `#cart-badge` already live in `js/components.js`/`components.css` and update automatically. Your job is the cart **page**.

**Tasks:**
1. **Replace the demo in `pages/cart.html` + `css/pages/cart.css`.** The current page is a static 2-item demo — throw it out and render from `Cart.getItems()`. The existing HTML is a scaffold with the hooks you'll need: `#cart-items`, `#cart-item-count`, `#clear-cart`, `#empty-cart` (hidden), `#subtotal`, `#delivery`, `#total`, `#checkout-button`. Each line shows image, name, unit price, **qty stepper (− count +)**, line total, remove button.
   - Steppers call `Cart.decrement(id)` / `Cart.increment(id)`; remove calls `Cart.remove(id)`; "Clear cart" calls `Cart.clear()`.
2. Summary block (live): `Cart.totals()` → subtotal / delivery (flat ₦500, ₦0 when empty) / total. Re-render on every `cartchange` **and** on load.
3. **An empty cart must not reach checkout** — disable/hide the checkout action until items exist.
4. Empty state: hide the list, show "Your cart is empty" + a "Browse Menu" button → `menu.html`.
5. Verify items survive a **page refresh** (they should — persistence is already handled by `Cart`).
6. Add one new file `js/cart-page.js` (script tag after `js/components.js`).

**Do not touch:** `js/cart.js` unless something is truly broken — raise it in the PR instead. Also not `js/data.js`, `js/auth.js`, `js/components.js`.

**Test:** `node server.js`, open `http://localhost:3000/pages/menu.html`, add dishes, then check the cart page.

**Acceptance:** menu → cart reflects items and quantities; steppers/removal update totals live; refresh keeps the cart; header badge count matches; empty cart cannot reach checkout.

---

## Stream 3 · Checkout & My Orders

**Branch:** `feature/checkout-orders` — base it on `dev` (see "Before you start").

**Context:** `Cart` provides `totals()` (flat ₦500 delivery) and items; `Auth` (`Auth.current()` / `Auth.isSignedIn()`) gates access; `foodOrders` is your storage key; `pages/checkout.html` and `pages/orders.html` currently render an empty `<main>`.

**Tasks — Checkout (`pages/checkout.html` + `css/pages/checkout.css` + new `js/checkout.js`):**
1. Require a signed-in user (redirect to `../login.html`) **and** a non-empty cart.
2. Delivery form (name, email, phone, address) validated with `Utils` (`isEmail`, `isEmpty`) — inline field errors + a status line.
3. On success: build an order `{id, userId, items, subtotal, delivery, total, address, date, status: "Pending"}`, push it to `foodOrders` via `Storage`, clear the cart (`Cart.clear()`), show a confirmation, then redirect to `orders.html`.

**Tasks — My Orders (`pages/orders.html` + `css/pages/orders.css` + new `js/orders.js`):**
4. Require a signed-in user (redirect to `../login.html`).
5. Render that user's orders from `foodOrders` (newest first) — item summary, date, total, and a "Pending" status badge.
6. Empty state: "No orders yet" + a "Browse Menu" button → `menu.html`.

**Do not touch:** `js/cart.js`, `js/auth.js`, `js/data.js`, `js/storage.js`, `js/components.js`.

**Test:** `node server.js`. Signed-out users are sent to login; empty carts are blocked; invalid fields show errors; placing an order clears the cart, persists the order and it appears in My Orders (also after refresh).

**Acceptance:** all of the above passes.

---

## Stream 4 · Contact page validation

**Branch:** `feature/contact-validation` — base it on `dev` (see "Before you start").

**Context:** `pages/contact.html` has a working form (`novalidate`, fields: name/email/subject/message) but **no JavaScript**. `Utils` (`isEmail`, `isEmpty`) and `Storage` are already available.

**Tasks:**
1. **Create `js/contact.js`** and wire it into `pages/contact.html` — add `<script src="../js/contact.js"></script>` **before** `js/components.js`, and add a `<p class="form-status" hidden></p>` + per-field error text to the form (styled to match the auth card look; reuse `.form-status` from `css/components.css`).
2. **Validate on submit** (`preventDefault`):
   - Name: non-empty, ≥ 2 chars
   - Email: valid via `Utils.isEmail`
   - Subject: optional, ≥ 3 chars if filled
   - Message: non-empty, ≥ 10 chars
   - Show the message under each failing field; clear errors on re-submit.
3. **On success:** push `{id, name, email, subject, message, date}` into localStorage key `foodMessages` via `Storage.get/set`; show a success message ("Thanks — we'll respond within a day"); clear the form.

**Do not touch:** `storage.js`, `utils.js`, `auth.js`, `data.js`, `cart.js`, `components.js`.

**Test:** `node server.js`, open `http://localhost:3000/pages/contact.html`.

**Acceptance:** bad email + short message are blocked with visible messages; a valid submit saves to `foodMessages` and shows success; no console errors.

---

## Stream 4 · Landing / home page

**Branch:** `feature/home-page` — base it on `dev` (see "Before you start").

**Context:** `index.html` is intentionally a minimal stub (empty `<main>` + shared scripts) so the home page can be composed on top of the injected header/footer without conflicts. `css/base.css` exposes design tokens (`var(--color-primary)` etc.) and `Menu.CATALOG` has the data.

**Tasks:**
1. Build a hero + featured dishes section in `css/pages/index.css` and `index.html` (inside `<main id="main">`), pulling a few featured dishes (with images and prices) from `Menu.CATALOG`.
2. Keep it responsive and consistent with the design tokens; no inline `<style>`.
3. Do **not** touch `js/components.js` or the script order already present in `index.html`.

**Test:** `node server.js`, open `http://localhost:3000/`.

**Acceptance:** hero + featured dishes render, shared header/footer intact, responsive, no console errors.

---

## Stream 5 · About page

**Branch:** `feature/about-page` — base it on `dev` (see "Before you start").

**Context:** `pages/about.html` currently renders an empty `<main>`. `css/pages/about.css` already exists for your page styles, and the shared component classes (`.card`, `.btn`, etc.) are available.

**Tasks:**
1. Build the About page inside `<main id="main">` in `pages/about.html`: a short intro to CampusEats, what it does, and why it was built (the project brief), using the shared layout components for a consistent look.
2. Style it in `css/pages/about.css` only; keep it responsive.
3. Do **not** touch shared JS or CSS files.

**Test:** `node server.js`, open `http://localhost:3000/pages/about.html`.

**Acceptance:** page renders with the shared header/footer, is responsive, no console errors.