# Presentation Outline

Group 8 - Online Food Ordering System. One speaker per major section; keep total demo + talk ~10-15 minutes.

## 1. Introduction (1 slide)

- Project title, group number, team members
- The problem: manual food ordering inconvenience for students

## 2. Aim and Objectives (1 slide)

## 3. Target Users (1 slide)

## 4. Technologies and Why (1 slide)

- HTML, CSS, JavaScript (vanilla), localStorage, TheMealDB external API
- Why: demonstrate core web technologies, easy to run and host, plus live data without a backend

## 5. Major Features (1-2 slides)

- Local Nigerian menu + live TheMealDB feed (category filters, search, Load More)
- Live search: unknown dishes are pulled from the API and rendered as tagged results
- Cart and quantity management (auth-gated add-to-cart with sign-in toast)
- Checkout flow and order history
- Authentication (register / login / logout)

## 6. System Architecture and Design (1 slide)

- Page flow diagram: Home -> Menu -> Cart -> Checkout -> Orders
- Client-to-API: TheMealDB feed/search layer with session cache and offline fallbacks
- Data model: localStorage keys (users, session, cart, orders, menu cache)

## 7. Live Demonstration (3-5 minutes)

- Show: browse + filter menu, live feed, search (try "pizza"), add to cart, checkout, view orders
- Show: signed-out add-to-cart shows the sign-in toast; login with demo account `demo@student.com` / `demo123`
- Show: responsive mobile view + empty/error states

## 8. Implementation Highlights (1-2 slides)

- Reusable header/footer component
- Dynamic menu rendering from data (local catalogue + live API feed)
- Form validation and input escaping
- WebCrypto-salted password hashing and auth-gated cart
- Mobile nav and accessibility

## 9. Client-Server Interaction (1 slide)

- Client-side only in this version; live external API (TheMealDB) for the feed/search with caching
- Where a backend would fit (orders, payments, real delivery); future API plan

## 10. Testing Carried Out (1 slide)

- Summary of QA checklist results, devices/browsers tested

## 11. Git / GitHub Collaboration (1 slide)

- Branch model (main/dev/feature), pull request workflow, owner approval

## 12. Security, Usability, Accessibility (1 slide)

## 13. Challenges and Solutions (1 slide)

## 14. Future Improvements (1 slide)

## 15. Thank You / Q&A