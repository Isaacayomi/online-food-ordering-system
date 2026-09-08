document.addEventListener("DOMContentLoaded", () => {
  const PAGE_SIZE = 9;
  const SEARCH_DEBOUNCE = 350;
  const grid = document.querySelector("#menu-grid");
  const status = document.querySelector("#menu-status");
  const loadMoreBtn = document.querySelector("#load-more");
  const searchInput = document.querySelector("#menu-search");
  const chips = [...document.querySelectorAll(".filter-chip")];

  if (!grid) return;

  let all = [...Menu.CATALOG];
  let shown = PAGE_SIZE;
  let liveResults = null;
  let searchingLive = false;
  let searchedQuery = "";
  let searchSeq = 0;
  let debounceTimer = null;
  let promptTimer = null;

  function showCartPrompt() {
    const promptNode = document.querySelector("#menu-cart-prompt");
    if (!promptNode) return;
    promptNode.hidden = false;
    promptNode.scrollIntoView({ block: "nearest", behavior: "smooth" });
    window.clearTimeout(promptTimer);
    promptTimer = window.setTimeout(() => {
      promptNode.hidden = true;
    }, 6000);
  }

  function cardHTML(item, flag) {
    return `
      <article class="menu-card" data-category="${item.category}" data-food-id="${item.id}" data-price="${item.price}">
        <div class="menu-card-media">
          <img src="${Menu.url(item)}" alt="${Utils.escapeHTML(item.name)}" loading="lazy" onerror="this.onerror=null;this.src=Menu.PLACEHOLDER">
          ${flag ? `<span class="card-flag">${Utils.escapeHTML(flag)}</span>` : ""}
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

  function activeFilter() {
    return chips.find((c) => c.classList.contains("is-active"))?.dataset.filter || "all";
  }

  function matchesQuery(item, query) {
    return (
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  }

  function localMatches() {
    const query = searchInput.value.trim().toLowerCase();
    const filter = activeFilter();
    return all.filter((item) => matchesQuery(item, query) && (filter === "all" || item.category === filter));
  }

  function clearStatus() {
    status.hidden = true;
    status.replaceChildren();
  }

  function render() {
    grid.replaceChildren();
    loadMoreBtn.hidden = true;

    const query = searchInput.value.trim().toLowerCase();

    if (searchingLive) {
      status.hidden = false;
      status.replaceChildren(
        Object.assign(document.createElement("span"), { className: "spinner", role: "status", "aria-label": "Loading" }),
        document.createTextNode(` Searching the live menu for "${searchInput.value.trim()}"…`)
      );
      return;
    }

    clearStatus();

    if (liveResults) {
      const filter = activeFilter();
      const items = liveResults.filter((item) => filter === "all" || item.category === filter);
      items.forEach((item) => grid.insertAdjacentHTML("beforeend", cardHTML(item, `Live results for "${searchedQuery}"`)));

      if (!items.length) {
        status.hidden = false;
        status.textContent = `No "${searchedQuery}" dishes in this category.`;
      }
      return;
    }

    const matches = localMatches();
    matches.slice(0, shown).forEach((item) => grid.insertAdjacentHTML("beforeend", cardHTML(item)));

    if (!matches.length) {
      status.hidden = false;
      status.textContent = query
        ? `No dishes match "${searchInput.value.trim()}" — we're searching the live menu…`
        : "No dishes in this category right now.";
      return;
    }

    loadMoreBtn.hidden = shown >= matches.length;
  }

  function loadMore() {
    shown += PAGE_SIZE;
    render();
  }

  function resetPaging() {
    shown = PAGE_SIZE;
    render();
  }

  function onQueryChange() {
    const query = searchInput.value.trim().toLowerCase();

    liveResults = null;
    searchingLive = false;
    searchedQuery = "";
    searchSeq += 1;

    if (query && !localMatches().length) {
      searchingLive = true;
      render();

      const token = searchSeq;
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(async () => {
        const items = await Menu.search(query);
        if (token !== searchSeq) return;
        searchingLive = false;
        liveResults = items;
        searchedQuery = query;
        render();
      }, SEARCH_DEBOUNCE);
    } else {
      resetPaging();
    }
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

  searchInput?.addEventListener("input", onQueryChange);
  loadMoreBtn?.addEventListener("click", loadMore);

  grid.addEventListener("click", (event) => {
    const button = event.target.closest(".btn-add");
    if (!button || typeof Cart === "undefined") return;

    const signedIn = typeof Auth !== "undefined" && Auth.isSignedIn();
    if (!signedIn) {
      showCartPrompt();
      button.textContent = "Sign in to order";
      window.setTimeout(() => (button.textContent = "Add to Cart"), 1600);
      return;
    }

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