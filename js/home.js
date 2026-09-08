document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#featured-grid");
  if (!grid) return;

  const picks = Menu.CATALOG.filter((item) => item.category === "mains").slice(0, 3);

  grid.innerHTML = picks
    .map(
      (item) => `
      <article class="menu-card" data-food-id="${item.id}" data-price="${item.price}">
        <div class="menu-card-media">
          <img src="${Menu.url(item)}" alt="${Utils.escapeHTML(item.name)}" loading="lazy">
        </div>
        <div class="menu-card-body">
          <div class="menu-card-top">
            <h3>${Utils.escapeHTML(item.name)}</h3>
            <span class="price">${Utils.money(item.price)}</span>
          </div>
          <p>${Utils.escapeHTML(item.description)}</p>
          <button class="btn-add" type="button">Add to Cart</button>
        </div>
      </article>`
    )
    .join("");

  grid.addEventListener("click", (event) => {
    const button = event.target.closest(".btn-add");
    if (!button || !window.Cart) return;
    const card = button.closest(".menu-card");
    Cart.add({
      id: card.dataset.foodId,
      name: card.querySelector("h3").textContent,
      price: Number(card.dataset.price),
      image: card.querySelector("img").getAttribute("src"),
    });
    button.textContent = "Added ✓";
    window.setTimeout(() => (button.textContent = "Add to Cart"), 900);
  });
});