const isPage = window.location.pathname.includes("/pages/");
const rootPath = isPage ? ".." : ".";
const pageName = window.location.pathname.split("/").pop() || "index.html";
const pageLink = (file) => `${isPage ? "" : "pages/"}${file}`;

const navItems = [
  ["Home", isPage ? "../index.html" : "index.html", "index.html"],
  ["About", pageLink("about.html"), "about.html"],
  ["Menu", pageLink("menu.html"), "menu.html", "non-admin-action"],
  ["Contact", pageLink("contact.html"), "contact.html"],
  ["My Orders", pageLink("orders.html"), "orders.html", "customer-only-action"],
  ["Admin", pageLink("admin.html"), "admin.html", "admin-only-action"],
];

const headerHTML = `
  <header class="site-header">
    <div class="site-shell primary-nav">
      <a class="brand" href="${isPage ? "../index.html" : "index.html"}" aria-label="CampusEats home">
        <img src="${rootPath}/assets/logo-mark.svg" alt="" width="56" height="55">
        <span>CampusEats</span>
      </a>
      <nav class="nav-links" aria-label="Primary navigation">
        ${navItems
          .map(([label, href, file, actionClass]) => {
            const cls = [
              pageName === file ? "is-active" : "",
              actionClass || "",
            ]
              .filter(Boolean)
              .join(" ");
            return `<a class="${cls}" href="${href}">${label}</a>`;
          })
          .join("")}
        <span class="auth-state auth-state--mobile" id="auth-state-mobile"></span>
      </nav>
      <span class="nav-actions">
        <a class="cart-link user-only-action non-admin-action" href="${pageLink("cart.html")}" aria-label="Cart">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1.6"></circle><circle cx="18" cy="21" r="1.6"></circle><path d="M2 3h3l2.6 12.3a2 2 0 0 0 2 1.7h8.7a2 2 0 0 0 2-1.6L21.5 8H6"></path></svg>
          <span class="cart-badge" id="cart-badge" hidden>0</span>
        </a>
        <span class="auth-state" id="auth-state"></span>
      </span>
      <button class="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false">☰</button>
    </div>
  </header>`;

const footerHTML = `
  <footer class="site-footer">
    <div class="site-shell footer-grid">
      <section class="footer-intro">
        <a class="brand brand--footer" href="${isPage ? "../index.html" : "index.html"}">
          <img src="${rootPath}/assets/logo-mark.svg" alt="" width="56" height="55"><span>CampusEats</span>
        </a>
        <p>Good food, delivered simply. CampusEats makes every meal break a little more delicious.</p>
        <div class="social-links social-links--footer" aria-label="Social media">
          <a href="#" aria-label="X">𝕏</a><a href="#" aria-label="Facebook">f</a><a href="#" aria-label="Instagram">◎</a><a href="#" aria-label="GitHub">⌘</a>
        </div>
      </section>
      <section class="footer-links"><h2>Pages</h2><a href="${isPage ? "../index.html" : "index.html"}">Home</a><a href="${pageLink("about.html")}">About</a><a href="${pageLink("menu.html")}">Menu</a><a href="${pageLink("contact.html")}">Contact</a><a href="${pageLink("cart.html")}">Cart</a></section>
      <section class="footer-links"><h2>Utility Pages</h2><a href="${rootPath}/login.html">Log In</a><a href="${rootPath}/register.html">Create Account</a><a href="${pageLink("orders.html")}">My Orders</a></section>
      <section class="footer-links"><h2>Contact</h2><span>Obafemi Awolowo University</span><span>Mon - Sat: 8:00am - 9:00pm</span></section>
    </div>
    <div class="site-shell footer-bottom">Copyright © 2026 CampusEats. All Rights Reserved.</div>
  </footer>`;

const ON_AUTH_PAGE = pageName === "login.html" || pageName === "register.html";

function renderAuthState() {
  const hosts = [...document.querySelectorAll(".auth-state")];
  if (!hosts.length) return;

  const signedIn = typeof Auth !== "undefined" && Boolean(Auth.current());
  const isAdmin = signedIn && Auth.isAdmin();

  document.querySelectorAll(".user-only-action").forEach((element) => {
    element.hidden = !signedIn;
  });

  document.querySelectorAll(".customer-only-action").forEach((element) => {
    element.hidden = !signedIn || isAdmin;
  });

  document.querySelectorAll(".non-admin-action").forEach((element) => {
    if (isAdmin) element.hidden = true;
  });

  document.querySelectorAll(".admin-only-action").forEach((element) => {
    element.hidden = !isAdmin;
  });

  if (signedIn) {
    const user = Auth.current();
    const name = `Hi, ${user.firstName || user.email.split("@")[0]}`;
    hosts.forEach((host) => {
      const welcome = document.createElement("span");
      welcome.className = "auth-welcome";
      welcome.textContent = name;

      const signOut = document.createElement("button");
      signOut.type = "button";
      signOut.className = "auth-button";
      signOut.textContent = "Sign out";
      signOut.addEventListener("click", () => {
        if (typeof Auth !== "undefined") {
          confirmSignOut(() => {
            Auth.logout();
            Storage.set("ceSignedOut", true);
            window.location.href = `${rootPath}/index.html`;
          });
        }
      });

      host.replaceChildren(welcome, signOut);
    });
    return;
  }

  if (ON_AUTH_PAGE) return;

  hosts.forEach((host) => {
    const loginLink = document.createElement("a");
    loginLink.className = "auth-link";
    loginLink.href = `${rootPath}/login.html`;
    loginLink.textContent = "Log In";

    const registerLink = document.createElement("a");
    registerLink.className = "auth-link";
    registerLink.href = `${rootPath}/register.html`;
    registerLink.textContent = "Register";

    host.replaceChildren(loginLink, registerLink);
  });
}

function renderCartBadge() {
  const badge = document.querySelector("#cart-badge");
  if (!badge) return;
  const count = typeof Cart !== "undefined" ? Cart.count() : 0;
  badge.textContent = String(count);
  badge.hidden = count === 0;
}

let toastEl = null;
let toastTimer = null;

function showToast(message) {
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.className = "toast";
    toastEl.setAttribute("role", "status");
    toastEl.setAttribute("aria-live", "polite");
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = message;
  toastEl.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(
    () => toastEl.classList.remove("is-visible"),
    4000,
  );
}

function confirmSignOut(onConfirm) {
  const previouslyFocused = document.activeElement;

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";

  backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="signout-title" aria-describedby="signout-message">
      <h2 class="modal-title" id="signout-title">Sign out?</h2>
      <p class="modal-message" id="signout-message">Are you sure you want to sign out of CampusEats?</p>
      <div class="modal-actions">
        <button type="button" class="modal-button" data-modal-cancel>Cancel</button>
        <button type="button" class="modal-button modal-button--danger" data-modal-confirm>Sign out</button>
      </div>
    </div>
  `;

  function close() {
    backdrop.remove();
    document.body.classList.remove("no-scroll");
    document.removeEventListener("keydown", onKeydown);
    if (previouslyFocused && typeof previouslyFocused.focus === "function") {
      previouslyFocused.focus();
    }
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      close();
      return;
    }
    if (event.key !== "Tab") return;

    const focusables = [...backdrop.querySelectorAll("button:not([disabled])")];
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) close();
  });
  backdrop
    .querySelector("[data-modal-cancel]")
    .addEventListener("click", close);
  backdrop
    .querySelector("[data-modal-confirm]")
    .addEventListener("click", () => {
      close();
      onConfirm();
    });

  document.body.classList.add("no-scroll");
  document.body.appendChild(backdrop);
  document.addEventListener("keydown", onKeydown);
  backdrop.querySelector("[data-modal-cancel]").focus();
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentHTML("afterbegin", headerHTML);
  document.body.insertAdjacentHTML("beforeend", footerHTML);

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");
  const header = document.querySelector(".site-header");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "✕" : "☰";
    document.body.classList.toggle("no-scroll", open);
    header?.classList.toggle("is-menu-open", open);
  });
  nav?.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
      document.body.classList.remove("no-scroll");
      header?.classList.remove("is-menu-open");
    }
  });

  window.addEventListener("cartchange", renderCartBadge);
  renderCartBadge();
  renderAuthState();

  if (Storage.get("ceSignedOut", false)) {
    Storage.remove("ceSignedOut");
    showToast("You've been signed out. See you soon!");
  }
});
