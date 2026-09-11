# Contributing to CampusEats

Thanks for helping with the Group 8 project. This guide describes how we collaborate so that everyone's work is reviewable and the history stays clean.

## Branch model

```
main                        Production. Protected - updated only through an approved PR.
  └── dev                   Integration. Work accumulates here while streams are in progress.
        ├── feature/<name>     New pages or features
        ├── fix/<name>         Bug fixes
        └── docs/<name>        Documentation and reports
```

**Rules:**

- Never commit directly to `main`.
- Teammates branch off `dev`, build their stream on `feature/<name>`, and open a pull request into `dev`.
- The project lead reviews every pull request; nothing is merged without an approving review.
- When all streams are done, the lead opens a PR from `dev` into `main` (the only path onto `main`).

## Getting started

```sh
git clone <repo-url>          # first time only
git fetch origin
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

> If you `git clone`d before `dev` was recreated, run `git fetch origin` first and then `git checkout -b feature/<your-feature> origin/dev` so your branch is based on the latest foundation.

## Branch naming

- `feature/login-page`
- `fix/cart-total-bug`
- `docs/report-chapter-2`

## Commit message conventions

Use Conventional Commits so history reads clearly:

| Prefix      | Use for                              |
| ----------- | ------------------------------------ |
| `feat:`     | New functionality                    |
| `fix:`      | Bug fixes                            |
| `docs:`     | Documentation only                   |
| `style:`    | Formatting, no code change           |
| `refactor:` | Code change that adds no feature/fix |
| `chore:`    | Tooling, config, housekeeping        |

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
3. The lead reviews the PR. Address any review comments in follow-up commits on the same branch.
4. When approved, the lead merges it into `dev`.
5. Do not merge your own PR.
6. Once every stream is merged into `dev`, the lead opens a final PR from `dev` into `main` — that is the only way `main` changes.

## CSS ownership

Every member gets their own page and page stylesheet; the shared files are owned by the lead. Follow these rules so we never fight over the same file:

| File                  | Who edits it                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `css/base.css`        | Lead only - design tokens, reset, typography. Others only use the tokens (e.g. `var(--color-primary)`).                                          |
| `css/components.css`  | Lead + whoever builds the header/footer. Shared, reusable classes (buttons, cards, forms, nav). Others **use** the classes, never edit the file. |
| `css/pages/index.css` | Owner of the landing page.                                                                                                                       |
| `css/pages/menu.css`  | Owner of the menu page.                                                                                                                          |
| `css/pages/cart.css`  | Owner of the cart page, and so on for every page.                                                                                                |

Each page HTML already links, in order: `base.css`, `components.css`, then its own `css/pages/<page>.css`. Put page-specific styling only in your page file - not in the shared files, and not in inline `<style>` tags.

Prefer existing component classes (`.btn`, `.card`, `.form-group`) from `components.css` over duplicating styles in your page CSS. Use the design tokens from `base.css` for colours, spacing and radius so the look stays consistent.

## Review policy

- Every PR into `dev` requires at least one approving review.
- `main` is protected and only changes through an approved PR from `dev`.
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

## Team / Contributors

- Nzekwe Uchechi Theresa — SWE/2023/044
- Nwobi Chukwubuikem Victory — SWE/2023/043
- Okunlola Isaac Ayomide — SWE/2024/003
- JIMOH AISHAT OMOLARA — SWE/2023/038
- ADEJUMO Isaac Oyinlola — SWE/2023/008
- Adegbenjo Testimony Oluwatosin — SWE/2023/006
- Ajekiigbe Nathanael Obaloluwa — SWE/2023/020
- AFEIYE AL FADEL UNOTSEWO — SWE/2023/017
- Odunowo Samuel Onasanya — SWE/2024/002
- Etim Favour Itoro — SWE/2023/035
- Oladipo-Ajibola Erioluwa Isaac — SWE/2023/081
- Oke Akintomiwa Victor — SWE/2023/049
- Omisope Daniel Ayomipo — SWE/2023/059
- Emilolorun Taiwo Timilehin — SWE/2023/034
- Abraham Precious Eberechi — SWE/2023/002
- Ogundipe Aduragbemi Israel — SWE/2023/045
- Ajaja Oluwadarasimi David — SWE/2023/019
- AKINTUNDE MARY OLUWADAMILOLA — MTH/2023/027
- ADETAN OreOluwa Jesutofunmi — SWE/2023/011
- Oladimeji Ayomide Emmanuel — SWE/2023/080
- Oyedele Abdulsalam Olamide — SWE/2023/065
- ROBERT-FAJIMI JASON OLUWANIFEMI — SWE/2023/082
- Ojewande Abdulfatai Ayofe — SWE/2023/048
- Adisa Abdulrazaaq Oluwatumilara — SWE/2023/015
- Adesokan Heritage Rereloluwa — SWE/2023/010
- Fadeyi Oreoluwa Omolola — SWE/2023/036
