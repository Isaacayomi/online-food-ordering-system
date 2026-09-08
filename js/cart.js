const Cart = (() => {
  const money = (value) => `₦${value.toLocaleString("en-NG")}`;
  function update() {
    const items = [...document.querySelectorAll(".cart-item")];
    const subtotal = items.reduce((sum, item) => sum + Number(item.dataset.price) * Number(item.querySelector(".quantity").textContent), 0);
    const empty = !items.length;
    document.querySelector("#cart-item-count").textContent = `(${items.length})`;
    document.querySelector("#subtotal").textContent = money(subtotal);
    document.querySelector("#delivery").textContent = empty ? "—" : money(500);
    document.querySelector("#total").textContent = money(empty ? 0 : subtotal + 500);
    document.querySelector("#empty-cart").hidden = !empty;
    document.querySelector("#checkout-button").classList.toggle("is-disabled", empty);
  }
  document.addEventListener("DOMContentLoaded", () => {
    const list = document.querySelector("#cart-items"); if (!list) return;
    list.addEventListener("click", (event) => { const button = event.target.closest("button"); if (!button) return; const item = button.closest(".cart-item"); if (button.matches(".remove-item")) item.remove(); if (button.matches(".quantity-button")) { const quantity = item.querySelector(".quantity"); const next = Number(quantity.textContent) + Number(button.dataset.step); next < 1 ? item.remove() : quantity.textContent = next; } update(); });
    document.querySelector("#clear-cart").addEventListener("click", () => { list.replaceChildren(); update(); }); update();
  });
  return { update };
})();
