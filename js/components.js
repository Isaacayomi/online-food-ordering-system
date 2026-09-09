const isPage = window.location.pathname.includes("/pages/");
const rootPath = isPage ? ".." : ".";
const pageName = window.location.pathname.split("/").pop() || "index.html";
const pageLink = (file) => `${isPage ? "" : "pages/"}${file}`;

const navItems = [
  ["Home", isPage ? "../index.html" : "index.html", "index.html"],
  ["About", pageLink("about.html"), "about.html"],
  ["Menu", pageLink("menu.html"), "menu.html"],
  ["Contact", pageLink("contact.html"), "contact.html"],
];

const headerHTML = `
  <header class="site-header">
    <div class="site-shell primary-nav">
      <a class="brand" href="${isPage ? "../index.html" : "index.html"}" aria-label="CampusEats home">
        <img src="${rootPath}/assets/logo-mark.svg" alt="" width="56" height="55">
        <span>CampusEats</span>
      </a>
      <button class="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false">☰</button>
      <nav class="nav-links" aria-label="Primary navigation">
        ${navItems.map(([label, href, file]) => `<a class="${pageName === file ? "is-active" : ""}" href="${href}">${label}</a>`).join("")}
        <span class="auth-state auth-state--mobile" id="auth-state-mobile"></span>
      </nav>
      <span class="nav-actions">
        <a class="cart-link user-only-action" href="${pageLink("cart.html")}" aria-label="Cart">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1.6"></circle><circle cx="18" cy="21" r="1.6"></circle><path d="M2 3h3l2.6 12.3a2 2 0 0 0 2 1.7h8.7a2 2 0 0 0 2-1.6L21.5 8H6"></path></svg>
          <span class="cart-badge" id="cart-badge" hidden>0</span>
        </a>
        <a class="header-orders-link user-only-action" href="${pageLink("orders.html")}">My Orders</a>
        <span class="auth-state" id="auth-state"></span>
        <a class="table-button" href="${pageLink("checkout.html")}">Order Now</a>
      </span>
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

document.querySelectorAll(".user-only-action").forEach((element) => {
  element.hidden = !signedIn;
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
        if (typeof Auth !== "undefined") Auth.logout();
        renderAuthState();
        renderCartBadge();
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
});