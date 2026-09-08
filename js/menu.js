document.addEventListener("DOMContentLoaded", () => {
  const PAGE_SIZE = 9;
  const grid = document.querySelector("#menu-grid");
  const status = document.querySelector("#menu-status");
  const loadMoreBtn = document.querySelector("#load-more");
  const searchInput = document.querySelector("#menu-search");
  const chips = [...document.querySelectorAll(".filter-chip")];

  if (!grid) return;

  let all = [...Menu.CATALOG];
  let shown = PAGE_SIZE;

  function cardHTML(item) {
    const imageURL = Menu.url(item);
    const fallbackURL = Menu.fallback(item);
    return `
      <article class="menu-card" data-category="${item.category}" data-food-id="${item.id}" data-price="${item.price}">
        <div class="menu-card-media">
          <img src="${imageURL}" alt="${Utils.escapeHTML(item.name)}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackURL}'">
        </div>
        <div class="menu-card-body">
          <div class="menu-card-top">
            <h3>${Utils.escapeHTML(item.name)}</h3>
            <span class="price">${Utils.money(item.price)}</span>
          </div>
          <p>${Utils.escapeHTML(item.description)}</p>
          <button class="btn-add" type="button">Add to Cart</button>
        </div>
      </article>`;
  }

  function currentMatches() {
    const active = chips.find((c) => c.classList.contains("is-active"))?.dataset.filter || "all";
    const query = searchInput.value.trim().toLowerCase();
    return all.filter((item) => {
      const matchCategory = active === "all" || item.category === active;
      const matchQuery = !query || item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
      return matchCategory && matchQuery;
    });
  }

  function render() {
    const matches = currentMatches();
    grid.replaceChildren();
    matches.slice(0, shown).forEach((item) => grid.insertAdjacentHTML("beforeend", cardHTML(item)));

    status.hidden = matches.length !== 0;
    status.textContent = searchInput.value.trim()
      ? `No dishes match "${searchInput.value.trim()}".`
      : "No dishes in this category right now.";

    loadMoreBtn.hidden = !matches.length || shown >= matches.length;
  }

  function loadMore() {
    shown += PAGE_SIZE;
    render();
  }

  function resetPaging() {
    shown = PAGE_SIZE;
    render();
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => {
        c.classList.remove("is-active");
        c.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("is-active");
      chip.setAttribute("aria-pressed", "true");
      resetPaging();
    });
  });

  searchInput?.addEventListener("input", resetPaging);
  loadMoreBtn?.addEventListener("click", loadMore);

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

  render();

  async function loadLive() {
    try {
      const live = await Menu.loadLive();
      if (live.length) {
        all = [...Menu.CATALOG, ...live];
        render();
      }
    } catch {
      status.hidden = false;
      status.textContent = "Live dishes are unavailable right now — the Nigerian menu above is ready to order.";
      loadMoreBtn.hidden = true;
    }
  }

  loadLive();
});