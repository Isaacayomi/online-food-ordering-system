# CampusEats - Online Food Ordering System

> Group 8 project for SEN106/SEN216: Introduction to Web Technologies.

A simple web-based food ordering platform where users can view menus, add meals to a cart, and place orders - built with pure HTML, CSS and JavaScript, with live dish search from the free [TheMealDB](https://www.themealdb.com) API.

> **Status:** Complete. Every page is shipped and merged — landing page, menu, cart, checkout, My Orders, about and contact — and the app is deployed to Vercel at [campus-eats-group8.vercel.app](https://campus-eats-group8.vercel.app).

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

The application is a pure front-end implementation: data is held in JavaScript and persisted in the browser using `localStorage`, which keeps the project easy to run, demo and deploy without a dedicated server. The menu shows the curated 18-dish local catalogue; when a search matches nothing locally, it falls back to TheMealDB and brings back live results.

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
- **Curated local menu + live pool** — the 18 Nigerian dishes load instantly, joined by a cached pool of up to ~108 TheMealDB international dishes (shuffled, price-mapped, each with a short description written from the dish's cuisine, category and main ingredients) that surfaces progressively as "Load More" is clicked; images and no-result states degrade gracefully (offline-safe placeholder).
- **Menu search & filters** — category chips plus instant search; when local results are empty, search queries TheMealDB and renders up to 6 live results (debounced, with a loading spinner).
- **Pagination** — "Load More" reveals 9 cards at a time until the list ends (local, custom and live-pool dishes all paginate together).
- **Authentication** — register, sign in and sign out with client-side validation (WebCrypto salted SHA-256 hashes); a demo account is seeded on first run. Signed-in users are redirected away from the auth pages; the header switches to "Hi, name / Sign out".
- **Auth-gated cart** — only signed-in users can add to the cart; signed-out attempts show a toast prompting sign in or account creation (nothing is added).
- **Cart model & header badge** — `js/cart.js` (add/increment/decrement/remove/clear/totals) persisted to `foodCart`, exposed through a live cart badge in the navbar.
- **Shared header/footer** — injected across pages by `js/components.js`, with mobile nav and active-link highlighting.
- **Logo favicon** — the CampusEats logo mark (also in the navbar) serves as the site favicon.
- **Landing page** — a hero over a real food photo with a single clear CTA, category shortcuts, a featured-dishes strip rendered live from the menu (with auth-gated add-to-cart), an about block, delivery info and campus testimonials.
- **Cart page** — the real cart with quantity steppers, line totals, removal, "Clear cart", live subtotal/₦500-delivery/total, an empty state and a checkout action that is disabled until items exist.
- **Checkout & My Orders** — a validated delivery-details form that creates a `Pending` order, and an order-history page (newest first) with an empty state and status-coloured badges.
- **Admin dashboard** — a seeded admin account (`admin@campuseats.com` / `admin123`) gets an "Admin" nav link and a dashboard listing every order, with per-status filter tabs and a status control (Pending → Preparing → Out for Delivery → Delivered / Cancelled) that updates orders in real time.
- **Admin menu management** — an Orders/Menu switch on the dashboard; the admin can add menu items (name, category, price, description, image via URL or a ≤300 KB upload) that appear instantly across the menu page and work in carts/checkout/orders (most recently added dishes surface first), and delete any custom item (built-in items stay read-only). The "Current menu" list also surfaces the ~108 live TheMealDB dishes behind a "Load more dishes…" button (live items carry a read-only "Live" pill). Admins browse the menu and home featured dishes **without** Add to Cart buttons, the header cart icon is hidden for them, and checkout is blocked — admin accounts manage the menu and orders, they can't place orders.
- **About page** — a platform narrative (what CampusEats is and why it was built) with a menu/account call-to-action.
- **Contact validation** — the contact form validates name/email/subject/message, saves messages to `foodMessages` and shows success feedback.

### Merged via per-stream PRs

- **Cart page** (Stream 2) — `feature/cart-page`
- **Checkout & My Orders** (Stream 3) — `feature/checkout-orders`
- **Contact page validation** (Stream 4) — `feature/contact-validation`
- **Landing / home page** (Stream 4) — `feature/home-page`
- **About page** (Stream 5) — `feature/about-page`

## Minimum Project Requirements Coverage

| Requirement               | How CampusEats meets it                                                                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTML                      | Semantic elements (`header`, `nav`, `main`, `footer`, `section`, `article`) used across all pages.                                                                           |
| CSS                       | Component stylesheet with a consistent design system (tokens, responsive breakpoints, mobile navigation, animations).                                                        |
| JavaScript                | Dynamic menu rendering, live menu search fallback, cart logic, form validation, authentication, shared component injection.                                                  |
| Git/GitHub                | Feature-branch workflow: PRs into `dev`, then an approved `dev → main` PR. See CONTRIBUTING.md.                                                                              |
| Web Hosting               | Deployed on **Vercel** (static hosting) at [campus-eats-group8.vercel.app](https://campus-eats-group8.vercel.app); auto-deploys on pushes to `main`. See docs/DEPLOYMENT.md. |
| Usability & Accessibility | Keyboard-friendly, labelled forms, `aria` attributes, focus states, `aria-live` status/toasts, responsive across breakpoints.                                                |
| Security Awareness        | Escaping of user-generated content on render, client-side validation, salted SHA-256 password hashes, and a documented review of client-side-only auth limits.               |
| Documentation             | This README, plus docs/DATA_CONTRACT.md, docs/TASKS.md, docs/QA_CHECKLIST.md, docs/PRESENTATION_OUTLINE.md and docs/DEPLOYMENT.md.                                           |
| Presentation              | Slides and live demonstration prepared for the final defence.                                                                                                                |

## Technology Stack

| Technology                    | Purpose                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| HTML5                         | Page structure and semantic markup.                                                      |
| CSS3                          | Styling, layout, responsive design and design tokens (CSS custom properties).            |
| JavaScript (vanilla, ES6+)    | All interactivity: rendering, live API calls, cart, validation, auth, shared components. |
| TheMealDB API                 | External live dish feed + search fallback (no API key required).                         |
| localStorage / sessionStorage | Persistence for users, session, cart, orders, messages and the menu cache.               |
| Git & GitHub                  | Version control and collaboration.                                                       |
| Vercel                        | Deployment and hosting of the static site (pending final merge).                         |

**Why vanilla HTML/CSS/JS?** The project brief asks us to demonstrate the core web technologies taught in SEN106/SEN216. Avoiding a framework lets the team show clear understanding of each layer, and keeps the project simple to run and host.

## Live API

Live search uses the free [TheMealDB](https://www.themealdb.com) API (no key):

- No live feed is auto-loaded — the menu shows the curated 18-dish local catalogue.
- `search.php?s=<query>` — on-demand fallback when a search matches nothing locally (up to 6 results, prices auto-curated from the local `PRICE_TABLET`). Try searching "pizza".

Dish images come from TheMealDB CDN, Unsplash and Wikimedia Commons; any failure falls back to a neutral placeholder so a card never shows a broken or empty image.

## Project Structure

```
.
├── index.html              # Landing page - hero, featured dishes, concept sections
├── login.html              # Sign in (root-level)
├── register.html           # Create account (root-level)
├── 404.html                # Custom 404 page for invalid routes
├── pages/                  # One HTML file per page
│   ├── menu.html           # Menu with categories, search + pagination
│   ├── cart.html           # Cart page with steppers and live totals
│   ├── checkout.html       # Delivery details + place order
│   ├── orders.html         # Order history
│   ├── admin.html          # Admin dashboard (status management)
│   ├── about.html          # About the platform
│   └── contact.html        # Contact form + details (validated)
├── css/
│   ├── base.css            # Design tokens, reset, [hidden] rule, typography
│   ├── components.css      # Shared component styles (header/footer/cards)
│   └── pages/              # One CSS file per page
├── js/
│   ├── components.js       # Reusable header/footer injection, auth state, cart badge
│   ├── data.js             # Menu data, price tablet, live search API layer
│   ├── menu.js             # Menu rendering, filters, pagination, live search, auth-gated cart
│   ├── cart.js             # Cart model + persistence
│   ├── auth.js             # Registration, login, sessions, demo + admin seeding
│   ├── orders.js           # Order-history rendering + status badges
│   ├── admin.js            # Admin dashboard rendering + status management
│   ├── storage.js          # localStorage helpers
│   └── utils.js            # Validation, escaping, money formatting
├── assets/                 # logo-mark.svg (navbar + favicon), images
├── docs/                   # Data contract, tasks, QA, presentation, deployment
├── .github/                # PR + issue templates
├── .gitignore
├── vercel.json             # Static site config (`cleanUrls: true`)
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

### Demo accounts

Two accounts are seeded automatically on first run:

- **Student (customer)**
  ```
  Email:    demo@student.com
  Password: demo123
  ```
- **Admin** — gets an "Admin" link in the header and a dashboard to manage order statuses
  ```
  Email:    admin@campuseats.com
  Password: admin123
  ```

## Deployment

The app is **live on Vercel**: [campus-eats-group8.vercel.app](https://campus-eats-group8.vercel.app). The deployment record — import settings, `vercel.json`, demo credentials and the earlier wrong-project mis-link that was resolved — is captured in [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

At a glance:

1. The repo was imported at [vercel.com](https://vercel.com) (framework preset "Other", empty build command, root `./`).
2. `vercel.json` uses `{"cleanUrls": true}` — no SPA rewrite, so every real page serves and unknown routes fall back to `404.html`.
3. Vercel auto-deploys on every push to `main`; no manual step is needed after a `dev → main` merge.

> Note: the app must be served over HTTP/HTTPS (as Vercel provides) - a plain `file://` open will not resolve the shared scripts correctly. `localStorage` is scoped per origin, so the local `localhost` copy and the hosted URL keep separate carts/accounts, which is expected.

## Known Limitations

Because the project is scoped to pure HTML, CSS and JavaScript, all data lives in the browser's `localStorage` and never leaves the device:

- Carts, accounts, orders and messages do not sync across devices or browsers.
- Menu edits (added/deleted items) live only in the **same browser** where the admin made them — they are `localStorage`-scoped like everything else, ready for a backend to share globally.
- The TheMealDB pool (~108 dishes) is fetched once and cached in `localStorage`, so it refreshes only when the cache is cleared.
- The admin dashboard only sees orders placed in the **same browser**. For the demo, place an order first, then sign in as the admin (`admin@campuseats.com` / `admin123`) in that same browser to update its status.
- Passwords are hashed client-side with salted SHA-256; this demonstrates security awareness but is not a substitute for server-side auth.

These are accepted for the assignment scope. The path to shared, multi-user data is a backend (e.g. Firebase/Supabase or a small Node server) on top of the existing front-end.

## Git Workflow and Collaboration

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide. In short:

- `main` - production branch, protected; it only changes through an approved PR from `dev`.
- `dev` - integration branch holding all merged stream work; teammates branch off it (`feature/<name>`) and open pull requests into it.
- The project lead reviews every pull request; no direct pushes to `main` (and teammates don't merge their own PRs).

## Documentation

- [Data contract (shared shapes & events)](docs/DATA_CONTRACT.md)
- [Completed stream roadmap](docs/TASKS.md)
- [QA / testing checklist](docs/QA_CHECKLIST.md)
- [Presentation outline](docs/PRESENTATION_OUTLINE.md)
- [Deployment record (Vercel)](docs/DEPLOYMENT.md)

## Contributors

Group 8 members. Individual contributions are visible through the commit and pull-request history on GitHub.

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.
