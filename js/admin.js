document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("#main");

  if (typeof Auth === "undefined" || !Auth.isSignedIn() || !Auth.isAdmin()) {
    window.location.href = "../login.html";
    return;
  }

  const ORDER_STATUSES = [
    "Pending",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  const CATEGORIES = ["starters", "mains", "drinks", "desserts"];
  const MAX_IMAGE_BYTES = 300 * 1024;

  const statusKey = (status) =>
    String(status || "Pending")
      .toLowerCase()
      .replace(/\s+/g, "-");

  const getOrders = () =>
    Storage.get("foodOrders", []).sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

  const users = Storage.get("foodUsers", []);

  const userName = (userId) => {
    const user = users.find((entry) => entry.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : "Unknown user";
  };

  const money = (value) => `₦${Number(value).toLocaleString("en-NG")}`;

  const labelFor = (category) =>
    category.charAt(0).toUpperCase() + category.slice(1);

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

  function countStatuses() {
    const counts = {};
    ORDER_STATUSES.forEach((status) => (counts[status] = 0));
    getOrders().forEach((order) => {
      const status = order.status || "Pending";
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }

  const MENU_PAGE_SIZE = 18;
  let menuShown = MENU_PAGE_SIZE;
  let menuLoadingLive = false;

  let activePanel = "orders";
  let activeFilter = "all";

  function orderCardHTML(order) {
    const date = new Date(order.date).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const status = order.status || "Pending";

    return `
      <article class="order-card" data-id="${Utils.escapeHTML(order.id)}">
        <div class="order-header">
          <div>
            <h2>Order #${Utils.escapeHTML(order.id)}</h2>
            <div class="order-meta">
              <span class="order-customer">${Utils.escapeHTML(userName(order.userId))}</span>
              <span class="order-date">${Utils.escapeHTML(date)}</span>
            </div>
          </div>

          <span class="order-status order-status--${statusKey(status)}">
            ${Utils.escapeHTML(status)}
          </span>
        </div>

        <ul class="order-items">
          ${order.items
            .map(
              (item) => `
            <li class="order-item">
              <div class="order-item-info">
                <span class="order-item-name">${Utils.escapeHTML(item.name)}</span>
                <span class="order-item-meta">${item.qty} × ${money(item.price)}</span>
              </div>
              <strong>${money(Number(item.price) * item.qty)}</strong>
            </li>
          `,
            )
            .join("")}
        </ul>

        <div class="order-total">
          <span>Total</span>
          <span>${money(order.total)}</span>
        </div>

        <div class="status-control">
          <label for="status-${Utils.escapeHTML(order.id)}">Update status</label>
          <select id="status-${Utils.escapeHTML(order.id)}" class="status-select" data-order-id="${Utils.escapeHTML(order.id)}">
            ${ORDER_STATUSES.map(
              (option) => `
              <option value="${option}" ${option === status ? "selected" : ""}>${option}</option>
            `,
            ).join("")}
          </select>
        </div>
      </article>
    `;
  }

  function panelTabsHTML() {
    return `
      <div class="admin-panel-tabs" role="tablist" aria-label="Admin sections">
        <button class="admin-tab ${activePanel === "orders" ? "is-active" : ""}" type="button" data-panel="orders" aria-pressed="${activePanel === "orders"}">
          Orders
        </button>
        <button class="admin-tab ${activePanel === "menu" ? "is-active" : ""}" type="button" data-panel="menu" aria-pressed="${activePanel === "menu"}">
          Menu
        </button>
      </div>
    `;
  }

  function ordersPanelHTML() {
    const orders = getOrders();
    const counts = countStatuses();
    return `
      <div class="admin-stats" aria-label="Order statistics">
        <span class="stat-chip"><strong data-count="total">${orders.length}</strong> Total</span>
        ${ORDER_STATUSES.map(
          (status) => `
          <span class="stat-chip stat-chip--${statusKey(status)}">
            <strong data-count="${Utils.escapeHTML(status)}">${counts[status] || 0}</strong> ${Utils.escapeHTML(status)}
          </span>
        `,
        ).join("")}
      </div>

      <div class="admin-tabs" role="tablist" aria-label="Filter orders by status">
        <button class="admin-tab ${activeFilter === "all" ? "is-active" : ""}" data-filter="all" type="button">
          All <span>(${orders.length})</span>
        </button>
        ${ORDER_STATUSES.map(
          (status) => `
          <button class="admin-tab ${activeFilter === status ? "is-active" : ""}" data-filter="${Utils.escapeHTML(status)}" type="button">
            ${Utils.escapeHTML(status)} <span>(${counts[status] || 0})</span>
          </button>
        `,
        ).join("")}
      </div>

      <div class="orders-list" id="orders-list"></div>
    `;
  }

  function menuPanelHTML() {
    return `
      <section class="admin-menu" aria-label="Menu management">
        <form class="admin-add-form" id="add-menu-form" novalidate>
          <h2>Add a menu item</h2>
          <div class="form-grid">
            <div class="form-field">
              <label for="item-name">Name</label>
              <input id="item-name" name="name" type="text" required placeholder="e.g. Jollof & Grilled Chicken" />
            </div>
            <div class="form-field">
              <label for="item-category">Category</label>
              <select id="item-category" name="category">
                ${CATEGORIES.map(
                  (category) =>
                    `<option value="${category}">${labelFor(category)}</option>`,
                ).join("")}
              </select>
            </div>
            <div class="form-field">
              <label for="item-price">Price (₦)</label>
              <input id="item-price" name="price" type="number" min="1" step="any" required placeholder="e.g. 2500" />
            </div>
            <div class="form-field form-field--wide">
              <label for="item-description">Description</label>
              <textarea id="item-description" name="description" rows="3" placeholder="Short description shown on the menu card."></textarea>
            </div>

            <div class="form-field form-field--wide">
              <label for="item-image">Image</label>
              <div class="image-input-row">
                <input id="item-image" name="image" type="url" placeholder="Paste an image URL (https://…)" />
                <span class="image-input-or">or</span>
                <label class="image-upload" for="item-image-file">Upload image</label>
                <input id="item-image-file" name="image-file" type="file" accept="image/*" hidden />
              </div>
              <p class="form-note">Paste an image URL or upload one (max 300 KB). </p>
              <div class="image-preview" id="image-preview" hidden>
                <img id="image-preview-img" alt="Preview" />
                <button type="button" class="preview-clear" id="image-preview-clear" aria-label="Clear image">✕</button>
              </div>
            </div>
          </div>

          <button class="admin-submit" type="submit">Add to menu</button>
        </form>

        <div class="menu-admin-head">
          <h2>Current menu</h2>
        </div>
        <div class="menu-admin-status" id="menu-admin-status" hidden></div>
        <div class="admin-menu-grid" id="menu-admin-list"></div>
        <div class="menu-admin-load-wrap">
          <button class="menu-admin-load-btn" id="menu-admin-load" type="button" hidden>Load more dishes…</button>
        </div>
      </section>
    `;
  }

  function render() {
    main.innerHTML = `
      <section class="admin-page">
        <div class="admin-wrap">

          <div class="admin-hero">
            <h1>Admin Dashboard</h1>
            <p>${activePanel === "menu" ? "Add and manage the items on the CampusEats menu." : "Review and update every CampusEats order."}</p>
          </div>

          ${panelTabsHTML()}

          ${activePanel === "orders" ? ordersPanelHTML() : menuPanelHTML()}
        </div>
      </section>
    `;

    if (activePanel === "menu") {
      renderMenuList();
      ensureLivePool();
    } else renderList();
  }

  function renderList() {
    const list = document.querySelector("#orders-list");
    if (!list) return;
    const orders = getOrders();
    const filtered =
      activeFilter === "all"
        ? orders
        : orders.filter(
            (order) => (order.status || "Pending") === activeFilter,
          );

    list.innerHTML = filtered.length
      ? filtered.map(orderCardHTML).join("")
      : `<div class="empty-admin">No ${activeFilter === "all" ? "" : activeFilter + " "}orders here yet.</div>`;
  }

  function menuCardHTML(item) {
    const deleteControl = item.custom
      ? `<button class="btn-delete" type="button" data-delete-item="${Utils.escapeHTML(item.id)}">Delete</button>`
      : item.live
        ? `<button class="btn-delete is-live" type="button" disabled title="Live dish from TheMealDB — read only">Live</button>`
        : `<button class="btn-delete is-disabled" type="button" disabled title="Built-in menu item — can't be deleted">Built-in</button>`;
    return `
      <article class="menu-admin-card">
        <img class="menu-admin-thumb" src="${Menu.url(item)}" alt="${Utils.escapeHTML(item.name)}" loading="lazy" onerror="this.onerror=null;this.src=Menu.PLACEHOLDER">
        <div class="menu-admin-info">
          <div class="menu-admin-top">
            <h3>${Utils.escapeHTML(item.name)}</h3>
            <span class="menu-admin-price">${money(item.price)}</span>
          </div>
          <span class="menu-admin-cat">${labelFor(item.category)}</span>
          <p>${Utils.escapeHTML(item.description || "No description yet.")}</p>
        </div>
        ${deleteControl}
      </article>
    `;
  }

  function renderMenuList() {
    const list = document.querySelector("#menu-admin-list");
    const load = document.querySelector("#menu-admin-load");
    const status = document.querySelector("#menu-admin-status");
    if (!list) return;

    const items = Menu.all();
    const visible = items.slice(0, menuShown);

    if (menuLoadingLive && status) {
      status.hidden = false;
      status.replaceChildren(
        Object.assign(document.createElement("span"), {
          className: "spinner",
          role: "status",
          "aria-label": "Loading",
        }),
        document.createTextNode(" Loading live dishes from TheMealDB…"),
      );
    } else if (status) {
      status.hidden = true;
      status.replaceChildren();
    }

    list.innerHTML = visible.length
      ? visible.map(menuCardHTML).join("")
      : `<div class="empty-admin">The menu is empty right now.</div>`;

    if (load) load.hidden = visible.length >= items.length;
  }

  async function ensureLivePool() {
    if (Menu.getCachedLive().length || menuLoadingLive) return;
    menuLoadingLive = true;
    renderMenuList();
    try {
      await Menu.loadLive();
    } catch (err) {
      // offline or rate-limited — show built-in + custom dishes only
    } finally {
      menuLoadingLive = false;
      renderMenuList();
    }
  }

  function renderCounts() {
    const orders = getOrders();
    const counts = countStatuses();

    document.querySelectorAll("[data-count]").forEach((strong) => {
      const key = strong.dataset.count;
      strong.textContent = key === "total" ? orders.length : counts[key] || 0;
    });

    document.querySelectorAll(".admin-tabs .admin-tab").forEach((tab) => {
      const key = tab.dataset.filter;
      const span = tab.querySelector("span");
      if (span) {
        span.textContent = `(${key === "all" ? orders.length : counts[key] || 0})`;
      }
    });
  }

  function showImagePreview(src) {
    const preview = document.querySelector("#image-preview");
    const image = document.querySelector("#image-preview-img");
    if (!preview || !image) return;
    if (!src) {
      preview.hidden = true;
      image.removeAttribute("src");
      return;
    }
    image.src = src;
    preview.hidden = false;
  }

  function handleAddItem(event) {
    event.preventDefault();
    const form = event.target;
    const get = (id) => form.querySelector(`#${id}`);
    const name = String(get("item-name").value || "").trim();
    const category = get("item-category").value;
    const price = Number(get("item-price").value);
    const description = String(get("item-description").value || "").trim();
    const image = String(get("item-image").value || "").trim();

    if (!name) return showToast("Give the item a name.");
    if (!CATEGORIES.includes(category))
      return showToast("Pick a valid category.");
    if (!Number.isFinite(price) || price <= 0)
      return showToast("Enter a valid price larger than ₦0.");
    if (image && !/^(https?:\/\/|data:image\/)/i.test(image))
      return showToast("Enter a valid image URL or upload a photo.");

    const added = Menu.add({ name, category, price, description, image });
    if (!added) return showToast("Could not save — browser storage is full. Use an image URL instead.");

    form.reset();
    showImagePreview("");
    renderMenuList();
    showToast(`Added "${name}" to the menu.`);
  }

  function handleImageFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      showToast("Image is too large — keep it under 300 KB.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      document.querySelector("#item-image").value = reader.result;
      showImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  main.addEventListener("click", (event) => {
    const panel = event.target.closest("[data-panel]");
    if (panel) {
      activePanel = panel.dataset.panel;
      activeFilter = "all";
      render();
      return;
    }

    const loadMenu = event.target.closest("#menu-admin-load");
    if (loadMenu) {
      menuShown += MENU_PAGE_SIZE;
      renderMenuList();
      return;
    }

    const deleteButton = event.target.closest("[data-delete-item]");
    if (deleteButton) {
      const id = deleteButton.dataset.deleteItem;
      const item = Menu.all().find((entry) => entry.id === id);
      if (!item) return;
      confirmModal({
        title: "Delete menu item?",
        message: `Delete "${Utils.escapeHTML(item.name)}" from the menu? This can't be undone.`,
        confirmLabel: "Delete",
        danger: true,
      }).then((ok) => {
        if (!ok) return;
        Menu.remove(id);
        renderMenuList();
        showToast(`Removed "${item.name}" from the menu.`);
      });
      return;
    }

    const tab = event.target.closest(".admin-tab");
    if (!tab) return;
    activeFilter = tab.dataset.filter;
    render();
  });

  main.addEventListener("change", (event) => {
    const select = event.target.closest(".status-select");
    if (select) {
      const orderId = select.dataset.orderId;
      const newStatus = select.value;
      const orders = Storage.get("foodOrders", []);

      const order = orders.find((entry) => entry.id === orderId);
      if (!order || order.status === newStatus) return;

      order.status = newStatus;
      order.updatedAt = Date.now();
      Storage.set("foodOrders", orders);

      const card = select.closest(".order-card");
      if (card) {
        const badge = card.querySelector(".order-status");
        if (badge) {
          badge.className = badge.className
            .split(" ")
            .filter((className) => !className.startsWith("order-status--"))
            .concat(`order-status--${statusKey(newStatus)}`)
            .join(" ");
          badge.textContent = newStatus;
        }

        if (activeFilter !== "all" && newStatus !== activeFilter) {
          card.remove();
          const list = document.querySelector("#orders-list");
          if (list && !list.children.length) {
            list.innerHTML = `<div class="empty-admin">No ${activeFilter} orders here yet.</div>`;
          }
        }
      }

      renderCounts();
      showToast(`Order #${orderId} marked as ${newStatus}.`);
      return;
    }

    const fileInput = event.target.closest("#item-image-file");
    if (fileInput) handleImageFile(event);
  });

  main.addEventListener("input", (event) => {
    if (event.target.id === "item-image") showImagePreview(event.target.value.trim());
  });

  main.addEventListener("submit", (event) => {
    if (event.target.id === "add-menu-form") handleAddItem(event);
  });

  main.addEventListener("click", (event) => {
    if (event.target.id === "image-preview-clear") {
      const form = document.querySelector("#add-menu-form");
      if (form) {
        form.querySelector("#item-image").value = "";
        form.querySelector("#item-image-file").value = "";
      }
      showImagePreview("");
    }
  });

  window.addEventListener("menu-changed", () => {
    if (activePanel === "menu") renderMenuList();
  });
  window.addEventListener("storage", (event) => {
    if (event.key === "ceCustomMenu" || event.key === null) {
      if (activePanel === "menu") renderMenuList();
    }
  });

  render();
});