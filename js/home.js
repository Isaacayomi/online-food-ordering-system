(function () {
  const grid = document.getElementById("featured-dishes");
  if (!grid) return;

  const FEATURED_IDS = [
    "jollof-chicken",
    "egusi-pounded-yam",
    "chapman",
    "puff-puff",
  ];

  const dishes = FEATURED_IDS.map((id) =>
    Menu.CATALOG.find((dish) => dish.id === id)
  ).filter(Boolean);

  let toastEl = null;
  let toastTimer = null;

  function showCartToast() {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");

      const login = document.createElement("a");
      login.href = "login.html";
      login.textContent = "sign in";
      const register = document.createElement("a");
      register.href = "register.html";
      register.textContent = "register";

      toastEl.append("Please ", login, " or ", register, " to add items to your cart.");
      document.body.appendChild(toastEl);
    }
    toastEl.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove("is-visible"), 4000);
  }

  grid.innerHTML = dishes
    .map(
      (dish) => `
      <article class="feature-dish">
        <img src="${Menu.url(dish)}" alt="${Utils.escapeHTML(dish.name)}" loading="lazy">
        <div class="feature-dish__body">
          <h3>${Utils.escapeHTML(dish.name)}</h3>
          <p class="feature-price">${Utils.money(dish.price)}</p>
          <button class="btn-add" type="button" data-add="${dish.id}">Add to Cart</button>
        </div>
      </article>`
    )
    .join("");

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (!button || typeof Cart === "undefined") return;

    const dish = dishes.find((item) => item.id === button.dataset.add);
    if (!dish) return;

    const signedIn = typeof Auth !== "undefined" && Auth.isSignedIn();
    if (!signedIn) {
      showCartToast();
      button.textContent = "Sign in to order";
      window.setTimeout(() => (button.textContent = "Add to Cart"), 1600);
      return;
    }

    Cart.add({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
    });
    button.textContent = "Added ✓";
    window.setTimeout(() => (button.textContent = "Add to Cart"), 900);
  });
})();