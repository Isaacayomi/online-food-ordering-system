# QA Checklist

Run through these before the defence demo and record results in the table. Also verify the app on 2+ browsers (e.g. Chrome, Firefox) and a phone-sized window.

> Status: **all pages are implemented and merged** (cart page, checkout, My Orders, contact validation, home, about and admin dashboard). Run the full checklist below before the defence demo and record results.

## Setup

- [ ] `git clone` works; `node server.js` (or `PORT=8080 node server.js`, or `python3 -m http.server 8000`) serves the site
- [ ] Deployed URL loads (Vercel): https://campus-eats-group8.vercel.app
- [ ] No console errors on any page

## Header / Footer (all pages)

- [ ] Header and footer render on every page (injected component)
- [ ] Active nav link highlighted on the current page
- [ ] Cart badge shows correct total count and updates when cart changes
- [ ] Account area switches between "Log In / Register" and "Hi, name / Sign out"
- [ ] Signed-in users get redirected away from `login.html`/`register.html`
- [ ] Logo favicon shows in the browser tab on every page
- [ ] Mobile: hamburger opens/closes the nav; links work

## Menu

- [ ] All local menu items render with image, name, category and price (18 Nigerian dishes)
- [ ] The 18 local dishes load instantly, then a spinner appears while ~108 TheMealDB dishes load (first visit); repeat visits are instant via the cached pool
- [ ] "Load More" reveals 9 more cards at a time — local items first, then custom items, then the live pool — until the list ends
- [ ] Category chips filter correctly across local, custom and live-pool dishes; "All" restores everything
- [ ] Search narrows local results instantly; no phony matches (e.g. "jollof" finds local dishes)
- [ ] Searching an unknown dish (e.g. "pizza") shows a loading spinner, then up to 6 live results
- [ ] A bad image URL in the pool falls back to the neutral placeholder (never a broken image)
- [ ] **Signed out:** clicking Add to Cart shows a sign-in/register toast and does **not** add anything
- [ ] **Signed in:** clicking Add to Cart adds the item, flashes "Added ✓", and the header badge increments
- [ ] Live-search results can be added to cart (signed in)
- [ ] Admin-added custom items render like built-ins (image, name, category chip, price) and can be filtered/searched/add to cart

## Cart

- [ ] Items added appear in the cart with correct quantities
- [ ] Quantity +/- updates line total and overall total
- [ ] Remove deletes an item; "Clear cart" empties it
- [ ] Empty cart shows an empty state with a "Browse Menu" CTA
- [ ] Cart persists after page refresh
- [ ] An empty cart cannot reach checkout

## Checkout & Orders

- [ ] Signed-out users are sent to login
- [ ] Empty cart cannot reach checkout
- [ ] Checkout form validates: name, valid email, valid phone, address
- [ ] Invalid fields show inline errors and focus the first bad field
- [ ] Placing an order clears the cart and redirects to My Orders with a success toast; order lands in My Orders as "Pending"
- [ ] Order history persists after refresh; empty state shows "No orders yet"
- [ ] Status badges render in the correct colour per status (pending amber / preparing blue / out-for-delivery purple / delivered green / cancelled red)

## Admin dashboard

- [ ] Header shows an "Admin" link only when signed in as the demo admin
- [ ] Non-admins visiting `/pages/admin` are redirected to login
- [ ] Dashboard lists every order in the system with the customer's name
- [ ] Status tabs filter correctly and show per-status counts
- [ ] Changing an order's status persists after refresh
- [ ] Updated status flows through to the customer's My Orders page
- [ ] Admin account works: `admin@campuseats.com` / `admin123`
- [ ] Orders ↔ Menu switch works and remembers nothing stale (each panel renders fresh)
- [ ] Signed in as admin: menu page and home featured dishes render without "Add to Cart"; header cart icon is hidden
- [ ] Signed in as admin: `/pages/checkout` shows an "Admins can't place orders" notice instead of the form

## Admin menu management

- [ ] Non-admins are redirected to login (same gate as the dashboard)
- [ ] "Add a menu item" accepts name, category, price, description and an image URL, and validates: empty name, bad category, price ≤ ₦0, and non-URL images are rejected with a toast
- [ ] Adding an item (image URL) shows it in the "Current menu" list and on the menu page under the right category — and it can be added to cart and checked out
- [ ] Uploading an image (> 300 KB) is rejected; a smaller file shows a preview and saves as a data URL
- [ ] A bad image URL falls back to the neutral placeholder (never a broken image)
- [ ] Deleted custom items vanish from the admin list and the menu page; built-in items show a disabled "Built-in" delete control; deleting a custom item confirms through the app's custom modal (not the browser dialog), and Cancel/backdrop/Escape close without deleting
- [ ] The "Current menu" list shows live TheMealDB dishes (with a disabled "Live" pill) alongside built-in and custom items — no "N items" count text
- [ ] "Load more dishes…" on the admin menu list reveals more items and hides when all are shown; a loading note + spinner appear while the live pool is fetched for the first time
- [ ] The admin menu list refreshes when a custom item is added/removed (including from another tab)
- [ ] Existing carts/orders snapshot their item data and are unaffected by menu edits
- [ ] Storage-full guard triggers a toast when the browser quota is hit

## Auth

- [ ] Registration validates name/email/password; duplicate email rejected
- [ ] Login works with correct credentials; wrong credentials show an error
- [ ] Logout clears the session; header returns to signed-out state
- [ ] Demo account works: `demo@student.com` / `demo123`

## Contact

- [ ] Bad email + short message are blocked with visible per-field errors
- [ ] Valid submit saves to `foodMessages` and shows success; form clears

## Security / Accessibility

- [ ] Typing `<script>` into inputs is displayed as text (escaped), never executed
- [ ] All forms have labels; focus rings visible; pages keyboard-navigable
- [ ] Most `aria` attributes present (nav toggle, live regions/toasts, status messages)
- [ ] Toast prompts are announced by screen readers (`aria-live`)

## Records (fill in during QA)

| Test date | Tester | Browser/device | Result (Pass/Fail) | Issues found |
| --------- | ------ | -------------- | ------------------ | ------------ |
|           |        |                |                    |              |
|           |        |                |                    |              |
