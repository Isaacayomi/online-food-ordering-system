# Contributing to CampusEats

Thanks for helping with the Group 8 project. This guide describes how we collaborate so that everyone's work is reviewable and the history stays clean.

## Branch model

Three levels of branches:

```
main            Production. Protected - never commit here.
  └── dev       Integration. Protected - merged code lives here while features accumulate.
        ├── feature/<name>     New pages or features
        ├── fix/<name>         Bug fixes
        └── docs/<name>        Documentation and reports
```

**Rules:**

- Never commit directly to `main` or `dev`.
- Always create a branch off the latest `dev`, make your changes there, and open a pull request into `dev`.
- Only `main` is ever pushed to by the project lead, via a pull request from `dev`.

## Getting started

```sh
git clone <repo-url>
git checkout dev
git pull origin dev
git checkout -b feature/<your-feature>
```

Now make your changes. When finished:

```sh
git add .
git commit -m "feat: add menu category filter"
git push -u origin feature/<your-feature>
```

Then open a pull request on GitHub **into `dev`** (never `main`).

## Branch naming

- `feature/login-page`
- `fix/cart-total-bug`
- `docs/report-chapter-2`

## Commit message conventions

Use Conventional Commits so history reads clearly:

| Prefix | Use for |
| --- | --- |
| `feat:` | New functionality |
| `fix:` | Bug fixes |
| `docs:` | Documentation only |
| `style:` | Formatting, no code change |
| `refactor:` | Code change that adds no feature/fix |
| `chore:` | Tooling, config, housekeeping |

Examples:

- `feat: add add-to-cart button on menu cards`
- `fix: round cart totals to two decimal places`
- `docs: draft problem statement section`

Both should be specific and short. Reference an issue number when one exists, e.g. `feat: add search bar (#12)`.

## Pull request process

1. Before opening a PR, pull the latest `dev` and rebase your branch onto it so there are no conflicts:

   ```sh
   git fetch origin
   git rebase origin/dev
   ```

2. Open the PR **into `dev`**. Fill in the pull request template with what changed, how it was tested, and any screenshots.
3. The project lead reviews the PR. Address any review comments in follow-up commits on the same branch.
4. When approved, the lead merges it into `dev`.
5. Do not merge your own PR.

## CSS ownership

Every member gets their own page and page stylesheet; the shared files are owned by the lead. Follow these rules so we never fight over the same file:

| File | Who edits it |
| --- | --- |
| `css/base.css` | Lead only - design tokens, reset, typography. Others only use the tokens (e.g. `var(--color-primary)`). |
| `css/components.css` | Lead + whoever builds the header/footer. Shared, reusable classes (buttons, cards, forms, nav). Others **use** the classes, never edit the file. |
| `css/pages/index.css` | Owner of the landing page. |
| `css/pages/menu.css` | Owner of the menu page. |
| `css/pages/cart.css` | Owner of the cart page, and so on for every page. |

Each page HTML already links, in order: `base.css`, `components.css`, then its own `css/pages/<page>.css`. Put page-specific styling only in your page file - not in the shared files, and not in inline `<style>` tags.

Prefer existing component classes (`.btn`, `.card`, `.form-group`) from `components.css` over duplicating styles in your page CSS. Use the design tokens from `base.css` for colours, spacing and radius so the look stays consistent.

## Review policy

- Every PR into `dev` requires at least one approving review.
- `main` is protected so it can only be updated through an approved PR from `dev`.
- Reviewers should check: code runs locally, no console errors, markup is accessible, and the change matches the project's existing style.

## Before you request a review

Run the app yourself first:

```sh
node server.js        # or: python3 -m http.server 8000
```

And verify:

- [ ] The app loads with no console errors.
- [ ] The pages you touched work on a normal desktop and phone-sized window.
- [ ] Forms validate and show clear error messages.
- [ ] No user input is inserted into the DOM without escaping.
- [ ] The shared header/footer still render, and the cart badge updates.
- [ ] You have not committed secrets, local config or junk files.