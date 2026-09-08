document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#catalogue-grid");
  const liveGrid = document.querySelector("#live-grid");
  const liveStatus = document.querySelector("#live-status");
  const emptyStatus = document.querySelector("#catalogue-status");
  const searchInput = document.querySelector("#menu-search");
  const chips = [...document.querySelectorAll(".filter-chip")];

  if (!grid) return;

  function cardHTML(item) {
    return `
      <article class="menu-card${item.live ? " menu-card--live" : ""}" data-category="${item.category}" data-food-id="${item.id}" data-price="${item.price}">
        <div class="menu-card-media">
          <img src="${Menu.url(item)}" alt="${Utils.escapeHTML(item.name)}" loading="lazy">
          ${item.live ? '<span class="live-tag">LIVE</span>' : ""}
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

  function allCards() {
    const list = [...grid.querySelectorAll(".menu-card")];
    if (liveGrid) list.push(...liveGrid.querySelectorAll(".menu-card"));
    return list;
  }

  function applyFilters() {
    const active = chips.find((c) => c.classList.contains("is-active"))?.dataset.filter || "all";
    const query = searchInput.value.trim().toLowerCase();
    let visible = 0;

    allCards().forEach((card) => {
      const matchCategory = active === "all" || card.dataset.category === active;
      const matchQuery = !query || card.textContent.toLowerCase().includes(query);
      card.hidden = !(matchCategory && matchQuery);
      if (!card.hidden) visible += 1;
    });

    emptyStatus.hidden = visible !== 0;
    emptyStatus.textContent = query ? `No dishes match "${searchInput.value.trim()}".` : "No dishes in this category right now.";
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => {
        c.classList.remove("is-active");
        c.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("is-active");
      chip.setAttribute("aria-pressed", "true");
      applyFilters();
    });
  });

  searchInput?.addEventListener("input", applyFilters);

  Menu.CATALOG.forEach((item) => grid.insertAdjacentHTML("beforeend", cardHTML(item)));
  applyFilters();

  document.querySelectorAll(".menu-section").forEach((section) => {
    section.addEventListener("click", (event) => {
      const button = event.target.closest(".btn-add");
      if (!button || !window.Cart) return;
      const card = button.closest(".menu-card");
      const item = {
        id: card.dataset.foodId,
        name: card.querySelector("h3").textContent,
        price: Number(card.dataset.price),
        image: card.querySelector("img").getAttribute("src"),
      };
      Cart.add(item);
      button.textContent = "Added ✓";
      window.setTimeout(() => (button.textContent = "Add to Cart"), 900);
    });
  });

  if (!liveGrid || !liveStatus) return;

  async function loadLive() {
    const cached = Menu.getCachedLive();
    if (cached.length) {
      cached.forEach((item) => liveGrid.insertAdjacentHTML("beforeend", cardHTML(item)));
    } else {
      liveStatus.hidden = false;
      liveStatus.textContent = "Loading today's international picks…";
    }

    try {
      const items = await Menu.loadLive();
      liveGrid.replaceChildren();
      items.forEach((item) => liveGrid.insertAdjacentHTML("beforeend", cardHTML(item)));
      liveStatus.hidden = true;
      applyFilters();
    } catch {
      liveStatus.hidden = false;
      liveStatus.textContent = "The live kitchen is offline — our full Nigerian menu above is ready to order.";
    }
  }

  loadLive();
});