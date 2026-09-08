# CampusEats - Online Food Ordering System

> Group 8 project for SEN106/SEN216: Introduction to Web Technologies.

A simple web-based food ordering platform where users can view menus, add meals to a cart, and place orders - built with pure HTML, CSS and JavaScript, enriched with a live dish feed from the free [TheMealDB](https://www.themealdb.com) API.

> **Status:** Functional core shipped. Menu (local Nigerian catalogue + live feed + live search), authentication, cart model and shared header/footer are implemented and verified. Remaining streams — the cart **page**, checkout + orders, contact validation and the landing/home page — are open and being completed before the public Vercel deployment.

## Table of Contents

- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Aim and Objectives](#aim-and-objectives)
- [Target Users](#target-users)
- [Features](#features)
- [Minimum Project Requirements Coverage](#minimum-project-requirements-coverage)
- [Technology Stack](#technology-stack)
- [Live API](#live-api)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [Deployment](#deployment)
- [Git Workflow and Collaboration](#git-workflow-and-collaboration)
- [Documentation](#documentation)
- [Contributors](#contributors)
- [License](#license)

## Project Overview

CampusEats is a lightweight online food ordering platform designed for university students. The application lets users browse a menu of meals and drinks partitioned by category, add items to a cart, adjust quantities, and place orders through a simple checkout flow. Order history is stored so students can track their past orders.

The application is a pure front-end implementation: data is held in JavaScript and persisted in the browser using `localStorage`, which keeps the project easy to run, demo and deploy without a dedicated server. On top of the curated local menu, a **live feed** pulls international dishes from TheMealDB, and search falls back to that API when a dish isn't in the local catalogue.

## Problem Statement

Students on campus have limited options for conveniently ordering meals between lectures, and existing food vendors often rely on phone calls and manual order tracking, which leads to:

- Long phone queues during peak hours.
- Frequent mistakes in orders taken verbally.
- No record of what was ordered or when.
- No way to review past orders.

A simple, student-focused web ordering platform solves this by letting users browse a menu, build a cart and place an order at their own pace, all from a browser.

## Aim and Objectives

**Aim:** To design and develop a functional web-based food ordering platform for students.

**Objectives:**

1. To design a responsive, accessible user interface for browsing meals and drinks.
2. To implement a shopping-cart flow where users can add, update and remove items.
3. To implement a checkout flow that captures delivery details and creates an order.
4. To persist user accounts, carts and order history in the browser using `localStorage`.
5. To implement basic authentication (sign up, sign in, sign out) with client-side validation.
6. To demonstrate security awareness through input escaping, client-side validation and hashed passwords.
7. To document the project and present the working system at the final defence.

## Target Users

- University students who want to order meals and drinks online.
- Food vendors who want an automated way to receive and track orders.
- Academic staff and course markers evaluating the project.

## Features

### Implemented

- **Local Nigerian menu** — 18 dishes across Starters, Mains, Drinks and Desserts, each with a real food photo, description and price.
- **Live dish feed** — 9 international dishes pulled from TheMealDB (Chicken, Seafood, Dessert) shown alongside the local menu; images and no-result states degrade gracefully (offline-safe placeholder).
- **Menu search & filters** — category chips plus instant search; when local results are empty, search queries TheMealDB and renders up to 6 live results tagged "Live results for …" (debounced, with a loading spinner).
- **Pagination** — "Load More" reveals 9 cards at a time until the list ends.
- **Authentication** — register, sign in and sign out with client-side validation (WebCrypto salted SHA-256 hashes); a demo account is seeded on first run. Signed-in users are redirected away from the auth pages; the header switches to "Hi, name / Sign out".
- **Auth-gated cart** — only signed-in users can add to the cart; signed-out attempts show a toast prompting sign in or account creation (nothing is added).
- **Cart model & header badge** — `js/cart.js` (add/increment/decrement/remove/clear/totals) persisted to `foodCart`, exposed through a live cart badge in the navbar.
- **Shared header/footer** — injected across pages by `js/components.js`, with mobile nav and active-link highlighting.
- **Logo favicon** — the CampusEats logo mark (also in the navbar) serves as the site favicon.

### In progress / open streams

- **Cart page** — render the real cart with quantity steppers, removal, live totals (flat ₦500 delivery) and an empty state. See `docs/TASKS.md`.
- **Checkout & My Orders** — validated delivery-details form, order creation, and an order-history page with status tracking. See `docs/TASKS.md`.
- **Contact page** — JS validation on the existing form, saving messages and showing success feedback. See `docs/TASKS.md`.
- **Landing / home page** — a home screen with hero and featured dishes.

## Minimum Project Requirements Coverage

| Requirement | How CampusEats meets it |
| --- | --- |
| HTML | Semantic elements (`header`, `nav`, `main`, `footer`, `section`, `article`) used across all pages. |
| CSS | Component stylesheet with a consistent design system (tokens, responsive breakpoints, mobile navigation, animations). |
| JavaScript | Dynamic menu rendering, live API feed + search, cart logic, form validation, authentication, shared component injection. |
| Git/GitHub | Feature-branch workflow with pull requests into the protected `main` branch. See CONTRIBUTING.md. |
| Web Hosting | Deploys to **Vercel** (static hosting) once all streams are merged; see docs/DEPLOYMENT.md. |
| Usability & Accessibility | Keyboard-friendly, labelled forms, `aria` attributes, focus states, `aria-live` status/toasts, responsive across breakpoints. |
| Security Awareness | Escaping of user-generated content on render, client-side validation, salted SHA-256 password hashes, and a documented review of client-side-only auth limits. |
| Documentation | This README, plus docs/DATA_CONTRACT.md, docs/TASKS.md, docs/QA_CHECKLIST.md, docs/PRESENTATION_OUTLINE.md and docs/DEPLOYMENT.md. |
| Presentation | Slides and live demonstration prepared for the final defence. |

## Technology Stack

| Technology | Purpose |
| --- | --- |
| HTML5 | Page structure and semantic markup. |
| CSS3 | Styling, layout, responsive design and design tokens (CSS custom properties). |
| JavaScript (vanilla, ES6+) | All interactivity: rendering, live API calls, cart, validation, auth, shared components. |
| TheMealDB API | External live dish feed + search fallback (no API key required). |
| localStorage / sessionStorage | Persistence for users, session, cart, orders, messages and the menu cache. |
| Git & GitHub | Version control and collaboration. |
| Vercel | Deployment and hosting of the static site (pending final merge). |

**Why vanilla HTML/CSS/JS?** The project brief asks us to demonstrate the core web technologies taught in SEN106/SEN216. Avoiding a framework lets the team show clear understanding of each layer, and keeps the project simple to run and host.

## Live API

The live feed and search use the free [TheMealDB](https://www.themealdb.com) API (no key):

- `filter.php?c=Chicken|Seafood|Dessert` — the 9-dish live section, cached in `sessionStorage` for the session.
- `search.php?s=<query>` — on-demand fallback when a search matches nothing locally (up to 6 results, prices auto-curated from the local `PRICE_TABLET`). Try searching "pizza".

Dish images come from TheMealDB CDN, Unsplash and Wikimedia Commons; any failure falls back to a neutral placeholder so a card never shows a broken or empty image.

## Project Structure

```
.
├── index.html              # Landing page (home stream in progress)
├── login.html              # Sign in (root-level)
├── register.html           # Create account (root-level)
├── 404.html                # Custom 404 page for invalid routes
├── pages/                  # One HTML file per page
│   ├── menu.html           # Menu with categories, search, live feed + pagination
│   ├── cart.html           # Cart page (open stream)
│   ├── checkout.html       # Delivery details + place order (open stream)
│   ├── orders.html         # Order history (open stream)
│   ├── about.html          # About the platform and team
│   └── contact.html        # Contact form + details (validation stream)
├── css/
│   ├── base.css            # Design tokens, reset, [hidden] rule, typography
│   ├── components.css      # Shared component styles (header/footer/cards)
│   └── pages/              # One CSS file per page
├── js/
│   ├── components.js       # Reusable header/footer injection, auth state, cart badge
│   ├── data.js             # Menu data, price tablet, live feed + search API layer
│   ├── menu.js             # Menu rendering, filters, pagination, live search, auth-gated cart
│   ├── cart.js             # Cart model + persistence
│   ├── auth.js             # Registration, login, sessions, demo seeding
│   ├── storage.js          # localStorage helpers
│   └── utils.js            # Validation, escaping, money formatting
├── assets/                 # logo-mark.svg (navbar + favicon), images
├── docs/                   # Data contract, tasks, QA, presentation, deployment
├── .github/                # PR + issue templates
├── .gitignore
├── vercel.json             # Static site config (being finalized, see docs/DEPLOYMENT.md)
├── server.js               # Optional local dev server (no deps) with 404 fallback
├── CONTRIBUTING.md
└── README.md
```

## Local Setup

The project is a static site; no dependencies or build step are required.

1. Clone the repository:

   ```sh
   git clone <repo-url>
   cd online-food-ordering-system
   ```

2. Serve the folder over HTTP (a plain `file://` open will not resolve the shared scripts correctly).

   Recommended - the bundled Node server (no dependencies) also serves the custom 404 page for unknown routes, matching production behaviour:

   ```sh
   node server.js
   ```

   Then open `http://localhost:3000`. If port 3000 is already in use, pick another:

   ```sh
   PORT=8080 node server.js
   ```

   Alternatives that serve real pages but do **not** show the custom 404 page on typo'd URLs:

   ```sh
   python3 -m http.server 8000
   ```

   Or with VS Code Live Server: right-click `index.html` -> "Open with Live Server".

3. Open the printed URL in a browser.

### Demo account

A demo account is seeded automatically on first run:

```
Email:    demo@student.com
Password: demo123
```

## Deployment

Deployment to **Vercel** is queued until the remaining streams are merged into `main`. The full plan — merge order, the `vercel.json` fix for multi-page static hosting, pre-deploy QA and tester handoff — is captured in [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

At a glance:

1. Merge all open-stream PRs into the protected `main` branch.
2. Finalize `vercel.json` (multi-page static config; `cleanUrls` instead of the SPA catch-all rewrite).
3. Run the pre-deploy QA walkthrough on merged `main` (`node --check`, local server smoke, tester flows).
4. Import the repo at [vercel.com](https://vercel.com) ("Add New -> Project", framework preset "Other", empty build command) and deploy; Vercel auto-deploys on pushes to `main`.

> Note: the app must be served over HTTP/HTTPS (as Vercel provides) - a plain `file://` open will not resolve the shared scripts correctly. `localStorage` is scoped per origin, so the local `localhost` copy and the hosted URL keep separate carts/accounts, which is expected.

## Git Workflow and Collaboration

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide. In short:

- `main` - production branch, protected; every change lands via a pull request.
- `feature/*`, `fix/*`, `docs/*` - branches for individual streams, opened as pull requests into `main`.
- The project lead reviews and approves every pull request; no direct pushes to `main`.

## Documentation

- [Data contract (shared shapes & events)](docs/DATA_CONTRACT.md)
- [Open streams & task briefs](docs/TASKS.md)
- [QA / testing checklist](docs/QA_CHECKLIST.md)
- [Presentation outline](docs/PRESENTATION_OUTLINE.md)
- [Deployment plan (Vercel)](docs/DEPLOYMENT.md)

## Contributors

Group 8 members. Individual contributions are visible through the commit and pull-request history on GitHub.

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.