# QA Checklist

Run through these before the defence demo and record results in the table. Also verify the app on 2+ browsers (e.g. Chrome, Firefox) and a phone-sized window.

> Status: **all pages are implemented and merged** (cart page, checkout, My Orders, contact validation, home and about). Run the full checklist below before the defence demo and record results.

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
- [ ] Menu loads ONLY the 18 local Nigerian dishes — no auto-loaded live feed; if images fail, a neutral placeholder shows (never a broken image)
- [ ] Category chips filter correctly; "All" restores everything
- [ ] Search narrows local results instantly; no phony matches (e.g. "jollof" finds local dishes)
- [ ] Searching an unknown dish (e.g. "pizza") shows a loading spinner, then up to 6 live results tagged "Live results for …"
- [ ] "Load More" reveals 9 more cards and hides when the list ends
- [ ] **Signed out:** clicking Add to Cart shows a sign-in/register toast and does **not** add anything
- [ ] **Signed in:** clicking Add to Cart adds the item, flashes "Added ✓", and the header badge increments
- [ ] Live-search results can be added to cart (signed in)

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
- [ ] Placing an order clears the cart and shows a success confirmation; order lands in My Orders as "Pending"
- [ ] Order history persists after refresh; empty state shows "No orders yet"

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
| --- | --- | --- | --- | --- |
| | | | | |
| | | | | |