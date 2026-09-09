document.addEventListener("DOMContentLoaded", () => {
  const itemsList = document.querySelector("#cart-items");
  const emptyState = document.querySelector("#empty-cart");
  const countLabel = document.querySelector("#cart-item-count");
  const subtotalEl = document.querySelector("#subtotal");
  const deliveryEl = document.querySelector("#delivery");
  const totalEl = document.querySelector("#total");
  const checkoutButton = document.querySelector("#checkout-button");
  const clearButton = document.querySelector("#clear-cart");

  if (!itemsList) return;

  const money = (value) => `₦${Number(value).toLocaleString("en-NG")}`;

  function cardHTML(item) {
    const lineTotal = item.price * item.qty;
    return `
      <article class="cart-item" data-id="${item.id}" data-price="${item.price}">
        <div class="cart-item-art">${item.image ? `<img src="${item.image}" alt="${item.name}">` : "CE"}</div>
        <div>
          <h3>${item.name}</h3>
          <p>${money(item.price)} each</p>
          <strong>${money(lineTotal)}</strong>
        </div>
        <div class="cart-actions">
          <button class="remove-item" type="button" aria-label="Remove item">×</button>
          <div class="quantity-control">
            <button class="quantity-button" data-step="-1" type="button">−</button>
            <span class="quantity">${item.qty}</span>
            <button class="quantity-button" data-step="1" type="button">+</button>
          </div>
        </div>
      </article>`;
  }

  function render() {
    const items = Cart.getItems();
    const { subtotal, delivery, total } = Cart.totals(items);
    const empty = items.length === 0;

    itemsList.innerHTML = items.map(cardHTML).join("");
    itemsList.hidden = empty;
    emptyState.hidden = !empty;

    countLabel.textContent = `(${items.length})`;
    subtotalEl.textContent = money(subtotal);
    deliveryEl.textContent = empty ? "—" : money(delivery);
    totalEl.textContent = money(total);

    checkoutButton.classList.toggle("is-disabled", empty);
    if (empty) {
      checkoutButton.setAttribute("aria-disabled", "true");
      checkoutButton.addEventListener("click", preventIfEmpty);
    } else {
      checkoutButton.removeAttribute("aria-disabled");
      checkoutButton.removeEventListener("click", preventIfEmpty);
    }
  }

  function preventIfEmpty(event) {
    event.preventDefault();
  }

  itemsList.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const card = button.closest(".cart-item");
    const id = card?.dataset.id;
    if (!id) return;

    if (button.matches(".remove-item")) {
      Cart.remove(id);
    } else if (button.matches(".quantity-button")) {
      const step = Number(button.dataset.step);
      step > 0 ? Cart.increment(id) : Cart.decrement(id);
    }
  });

  clearButton?.addEventListener("click", () => {
    Cart.clear();
  });

  window.addEventListener("cartchange", render);

  render();
});