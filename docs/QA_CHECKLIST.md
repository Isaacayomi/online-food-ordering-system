# QA Checklist

Run through these before the defence demo and record results in the table. Also verify the app on 2+ browsers (e.g. Chrome, Firefox) and a phone-sized window.

## Setup

- [ ] `git clone` works, `node server.js` (or `python3 -m http.server 8000`) serves the site
- [ ] Deployed URL loads (Vercel)
- [ ] No console errors on any page

## Header / Footer (all pages)

- [ ] Header and footer render on every page (injected component)
- [ ] Active nav link highlighted on the current page
- [ ] Cart badge shows correct total count and updates when cart changes
- [ ] Account area switches between "Sign in / Sign up" and "Hi, name / Log out"
- [ ] Mobile: hamburger opens/closes the nav; links work

## Menu

- [ ] All menu items render with image, name, category and price
- [ ] Category filter shows only matching items; "All" restores everything
- [ ] Search narrows results; no-results state shows a helpful message
- [ ] "Add to cart" from any card works and shows a toast

## Cart

- [ ] Items added appear in the cart with correct quantities
- [ ] Quantity +/- updates line total and overall total
- [ ] Remove deletes an item; empty cart shows an empty state with a CTA
- [ ] Cart persists after page refresh

## Checkout & Orders

- [ ] Empty cart cannot reach checkout
- [ ] Checkout form validates: name, valid email, valid phone, address
- [ ] Invalid fields show inline errors and focus the first bad field
- [ ] Placing an order clears the cart and shows a success confirmation
- [ ] New order appears in My Orders with status "Pending"
- [ ] Order history persists after refresh

## Auth

- [ ] Registration validates name/email/password; duplicate email rejected
- [ ] Login works with correct credentials; wrong credentials show an error
- [ ] Logout clears the session; header returns to signed-out state
- [ ] Demo account works: `demo@student.com` / `demo123`

## Security / Accessibility

- [ ] Typing `<script>` into inputs is displayed as text (escaped), never executed
- [ ] All forms have labels; focus rings visible; pages keyboard-navigable
- [ ] Skip link present and functional on each page

## Records (fill in during QA)

| Test date | Tester | Browser/device | Result (Pass/Fail) | Issues found |
| --- | --- | --- | --- | --- |
| | | | | |
| | | | | |