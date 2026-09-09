# Project Roadmap — Completed Streams

> Every stream below has been shipped and merged into `dev`, then into `main` (the only path onto the protected production branch). Each stream was built on its own `feature/<name>` branch off `dev` and landed via an approved pull request into `dev`. Live app: [campus-eats-group8.vercel.app](https://campus-eats-group8.vercel.app).

## 1. Menu & API — ✅ merged

**Branch:** `feat/live-menu-auth` (foundation)

- 18-dish Nigerian catalogue (`js/data.js` `Menu.CATALOG`) with real food photos and prices (never an un-priced dish — `PRICE_TABLET` auto-prices live items).
- Live TheMealDB feed (Chicken / Seafood / Dessert, 3 each, cached in `foodMenu`) — **retired post-merge**: the menu no longer auto-loads a live feed; on-demand live search (`Menu.search`) covers unknown dishes instead.
- On-demand live search (`Menu.search`) — unknown queries (e.g. "pizza") return up to 6 tagged live results, cached per query.
- Category chips, instant search with spinner, "Load More" pagination (9 at a time).
- Offline-safe image placeholder (`Menu.PLACEHOLDER`) — a card never shows a broken image.
- Logo favicon.

**Files:** `js/data.js`, `js/menu.js`, `pages/menu.html`, `css/pages/menu.css`, `assets/`.

## 2. Auth & utilities — ✅ merged

**Branch:** `feat/live-menu-auth` (foundation)

- Registration, sign in, sign out with client-side validation; demo account seeded on first run (`demo@student.com` / `demo123`).
- WebCrypto salted SHA-256 password hashes; signed-in users redirected away from the auth pages.
- Shared header/footer injected by `js/components.js` with mobile nav and active-link highlighting.
- Auth-gated cart: signed-out add-to-cart shows a sign-in/register toast and adds nothing.
- `js/utils.js` (`money`, `isEmpty`, `isEmail`, `escapeHTML`) and `js/storage.js` (namespaced localStorage helpers).

**Files:** `js/auth.js`, `js/auth-pages.js`, `js/utils.js`, `js/storage.js`, `js/components.js`, `css/components.css`, `css/base.css`, `login.html`, `register.html`, `css/pages/login.css`, `css/pages/auth.css`.

## 3. Cart page — ✅ merged

**Branch:** `feature/cart-page`

- Real cart rendered from `Cart.getItems()` — image, name, unit price, quantity stepper (− count +), line total, remove button.
- Quantity steppers call `Cart.decrement/increment`; remove calls `Cart.remove`; "Clear cart" calls `Cart.clear()`.
- Live summary from `Cart.totals()` (subtotal / flat ₦500 delivery / total), re-rendered on `cartchange` and on load.
- Empty state ("Your cart is empty") with a "Browse Menu" CTA; an empty cart cannot reach checkout.
- Items survive a page refresh (persistence via `Cart` → `foodCart`).

**Files:** `pages/cart.html`, `css/pages/cart.css`, `js/cart-page.js`.

## 4. Checkout & My Orders — ✅ merged

**Branch:** `feature/checkout-orders`

- Checkout requires a signed-in user (else redirect to login) and a non-empty cart.
- Delivery form (name, email, phone, address) validated with `Utils` (`isEmail`, `isEmpty`) — inline field errors and a status line.
- On success: an order `{id, userId, items, subtotal, delivery, total, address, date, status: "Pending"}` is saved to `foodOrders`, the cart is cleared, and the user is redirected to My Orders with a success toast.
- My Orders lists that user's orders (newest first) with item summary, date, total and a status badge; an empty state offers a "Browse Menu" CTA.

**Files:** `pages/checkout.html`, `css/pages/checkout.css`, `js/checkout.js`, `pages/orders.html`, `css/pages/orders.css`, `js/orders.js`.

## 5. Contact page validation — ✅ merged

**Branch:** `feature/contact-validation`

- `js/contact.js` validates the existing `novalidate` form on submit: name (≥ 2 chars), email (`Utils.isEmail`), optional subject (≥ 3 chars if filled), message (≥ 10 chars), with per-field error text.
- Valid submits save `{id, name, email, subject, message, date}` to `foodMessages` and show "Thanks — we'll respond within a day", then clear the form.
- Reuses `.form-status` styling from `css/components.css` to match the auth cards.

**Files:** `pages/contact.html`, `js/contact.js` (page CSS reuses shared components).

## 6. Landing / home page — ✅ merged

**Branch:** `feature/home-page`

- Hero over the CampusEats design image with a single "Explore Menu" CTA.
- Browse Our Menu category cards, a featured-dishes strip rendered live from `Menu.CATALOG` (image, ₦ price, auth-gated add-to-cart via `js/home.js`), an about block with CampusEats delivery info, delivery info list and campus-student testimonials.
- Concept copy only — no blog or event-services sections.

**Files:** `index.html`, `css/pages/index.css`, `js/home.js`.

## 7. About page — ✅ merged

**Branch:** `feature/about-page`

- Static platform-narrative page: hero ("Our story"), "What is CampusEats", "Why we built it", four capability cards (Browse / Cart / Checkout & track / Account) and a menu/account CTA.
- Styled entirely in `css/pages/about.css` using the design tokens; no JS.

**Files:** `pages/about.html`, `css/pages/about.css`.

## 8. Admin dashboard — ✅ merged

**Branch:** `feature/admin-dashboard`

- Auth gains a `role` field, `Auth.isAdmin()`, and a seeded demo admin (`admin@campuseats.com` / `admin123`) alongside the existing demo student.
- Header shows an admin-only "Admin" link (hidden for non-admin roles) via `admin-only-action` in `js/components.js`.
- `pages/admin.html` + `js/admin.js`: gates non-admins to the login page, lists every order across all users (newest first) with the customer's name, and offers status filter tabs with counts.
- Per-order status `<select>` updates `status` + `updatedAt` in `foodOrders`; statuses follow `Pending → Preparing → Out for Delivery → Delivered`, plus `Cancelled` (defined once in `js/admin.js` `ORDER_STATUSES`).
- My Orders and the admin page both render colour-coded status badges (`order-status--<key>` modifiers in `css/pages/orders.css`).

**Files:** `pages/admin.html`, `css/pages/admin.css`, `js/admin.js`, `js/auth.js`, `js/components.js`, `js/orders.js`, `css/pages/orders.css`.

---

## Delivery rules that were enforced on every stream

- Shared files (`js/storage.js`, `js/utils.js`, `js/cart.js`, `js/auth.js`, `js/data.js`, `js/components.js`, `css/base.css`, `css/components.css`) were owned by the lead; teammates only used them, never edited them.
- Page-specific CSS lived only in `css/pages/<page>.css`.
- Page scripts appended after `js/components.js` (contact page loads before it, per the brief).
- All prices came from the data layer; no dish price was ever hardcoded on a page.
- Every page loads the shared header/footer and shows no console errors.
