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
      </nav>
      <a class="table-button" href="${pageLink("checkout.html")}">Order Now</a>
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
      <section class="footer-links"><h2>Utility Pages</h2><a href="${pageLink("login.html")}">Log In</a><a href="${pageLink("register.html")}">Create Account</a><a href="${pageLink("orders.html")}">My Orders</a></section>
      <section class="footer-links"><h2>Contact</h2><span>Obafemi Awolowo University</span><span>Mon - Sat: 8:00am - 9:00pm</span></section>
    </div>
    <div class="site-shell footer-bottom">Copyright © 2026 CampusEats. All Rights Reserved.</div>
  </footer>`;

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
});
