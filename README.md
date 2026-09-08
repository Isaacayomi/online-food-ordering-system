# CampusEats - Online Food Ordering System

> Group 8 project for SEN106/SEN216: Introduction to Web Technologies.

A simple web-based food ordering platform where users can view menus, add meals to a cart, and place orders - built with pure HTML, CSS and JavaScript.

> **Status:** Skeleton stage. Structure, pages and documentation are in place; features are being implemented next.

## Table of Contents

- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Aim and Objectives](#aim-and-objectives)
- [Target Users](#target-users)
- [Features](#features)
- [Minimum Project Requirements Coverage](#minimum-project-requirements-coverage)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [Deployment](#deployment)
- [Git Workflow and Collaboration](#git-workflow-and-collaboration)
- [Documentation](#documentation)
- [Contributors](#contributors)
- [License](#license)

## Project Overview

CampusEats is a lightweight online food ordering platform designed for university students. The application allows users to browse a menu of meals and drinks partitioned by category, add items to a cart, adjust quantities, and place orders through a simple checkout flow. Order history is stored so students can track their past orders.

The application is a pure front-end implementation: data is held in JavaScript and persisted in the browser using `localStorage`, which keeps the project easy to run, demo and deploy without a dedicated server.

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
6. To demonstrate security awareness through input escaping and validation of user input.
7. To document the project and present the working system at the final defence.

## Target Users

- University students who want to order meals and drinks online.
- Food vendors who want an automated way to receive and track orders.
- Academic staff and course markers evaluating the project.

## Features

The intended features of the platform, currently being implemented:

- Landing page introducing the platform.
- Menu page with meal cards, category filtering and search.
- Cart page with quantity controls, totals and item removal.
- Checkout page with validated delivery details form.
- My Orders page showing placed orders and their status.
- Authentication: registration, sign in and sign out.
- Reusable header and footer injected across all pages via a shared component.
- Responsive layout for mobile, tablet and desktop.
- Accessible markup (semantic HTML, labels, focus states, skip link).

## Minimum Project Requirements Coverage

| Requirement | How CampusEats meets it |
| --- | --- |
| HTML | Semantic elements (`header`, `nav`, `main`, `footer`, `section`, `article`) used across all pages. |
| CSS | Component stylesheet with a consistent design system, responsive breakpoints and mobile navigation. |
| JavaScript | Dynamic menu rendering, cart logic, form validation, search/filter, authentication and shared component injection. |
| Git/GitHub | Feature-branch workflow with pull requests into `dev` and protected `main`. See CONTRIBUTING.md. |
| Web Hosting | Deployed to Vercel (static hosting). See Deployment below. |
| Usability & Accessibility | Keyboard-friendly, labelled forms, aria attributes, sufficient contrast, tested on multiple screen sizes. |
| Security Awareness | Escaping of all user-generated content on render, client-side validation, hashed passwords (demo-only) and a documented review of the limitations of client-side-only auth. |
| Documentation | This README, plus docs/REPORT_OUTLINE.md, docs/PRESENTATION_OUTLINE.md and docs/QA_CHECKLIST.md. |
| Presentation | Slides and live demonstration prepared for the final defence. |

## Technology Stack

| Technology | Purpose |
| --- | --- |
| HTML5 | Page structure and semantic markup. |
| CSS3 | Styling, layout, responsive design and design tokens (CSS custom properties). |
| JavaScript (vanilla, ES6+) | All interactivity: rendering, cart, checkout, validation, auth, shared components. |
| localStorage | Browser-side persistence for users, session, cart and orders. |
| Git & GitHub | Version control and collaboration. |
| Vercel | Deployment and hosting of the static site. |

**Why vanilla HTML/CSS/JS?** The project brief asks us to demonstrate the core web technologies taught in SEN106/SEN216. Avoiding a framework lets the team show clear understanding of each layer, and keeps the project simple to run and host.

## Project Structure

```
.
├── index.html              # Landing page
├── 404.html                # Custom 404 page for invalid routes
├── pages/                  # One HTML file per page
│   ├── menu.html           # Menu with categories + search
│   ├── cart.html           # Cart contents and quantities
│   ├── checkout.html       # Delivery details + place order
│   ├── orders.html         # Order history
│   ├── about.html          # About the platform and team
│   ├── contact.html        # Contact form + details
│   ├── login.html          # Sign in
│   └── register.html       # Create account
├── css/
│   ├── base.css            # Design tokens, reset, typography (lead)
│   ├── components.css      # Shared component styles (lead + header/footer owner)
│   └── pages/              # One CSS file per page, owned by that page's member
├── js/
│   ├── components.js       # Reusable header/footer injection
│   ├── data.js             # Menu data source
│   ├── cart.js             # Cart logic + persistence
│   ├── auth.js             # Registration, login, orders
│   ├── storage.js          # localStorage helpers
│   └── utils.js            # Validation, escaping, formatting
├── assets/
│   ├── images/             # Food and UI images
│   └── screenshots/        # Captures for README/report/slides
├── docs/                   # Report, presentation and QA outlines
├── .github/                # PR + issue templates
├── .gitignore
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

A demo account is intended to be seeded on first run (once the auth module is implemented) so a fresh browser can be demonstrated instantly:

```
Email:    demo@student.com
Password: demo123
```

## Deployment

The project deploys to **Vercel**, which serves the static site with no build step or configuration required.

How to deploy:

1. Push the repository to GitHub.
2. Log in at [vercel.com](https://vercel.com) and choose **Add New -> Project**.
3. Import the `online-food-ordering-system` repository.
4. Vercel detects a static site automatically - leave the framework preset on "Other" with an empty build command and output directory.
5. Click **Deploy**. Vercel generates a live URL immediately and auto-deploys on every push to `main`.

Unknown routes are handled by `404.html` (validated by the `vercel.json` rewrite), so a typo'd URL shows the custom 404 page instead of a bare error.

> Note: the app must be served over HTTP/HTTPS (as Vercel provides) - a plain `file://` open will not resolve the shared scripts correctly. `localStorage` is scoped per origin, so the local `localhost` copy and the hosted URL keep separate carts/accounts, which is expected.

## Git Workflow and Collaboration

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide. In short:

- `main` - production branch, protected, deploys to Vercel.
- `dev` - integration branch where all completed work is merged.
- `feature/*`, `fix/*`, `docs/*` - branches for individual work, opened as pull requests into `dev`.
- The project lead reviews and approves every pull request; no direct pushes to `main` or `dev`.

## Documentation

- [Presentation outline](docs/PRESENTATION_OUTLINE.md)
- [QA / testing checklist](docs/QA_CHECKLIST.md)

## Contributors

Group 8 members. Individual contributions are visible through the commit and pull-request history on GitHub.

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.