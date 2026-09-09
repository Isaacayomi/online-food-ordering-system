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

  function render() {
    const orders = getOrders();
    const counts = countStatuses();

    main.innerHTML = `
      <section class="admin-page">
        <div class="admin-wrap">

          <div class="admin-hero">
            <h1>Admin Dashboard</h1>
            <p>Review and update every CampusEats order.</p>
          </div>

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

        </div>
      </section>
    `;

    renderList();
  }

  function renderList() {
    const list = document.querySelector("#orders-list");
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

  function renderCounts() {
    const orders = getOrders();
    const counts = countStatuses();

    document.querySelectorAll("[data-count]").forEach((strong) => {
      const key = strong.dataset.count;
      strong.textContent = key === "total" ? orders.length : counts[key] || 0;
    });

    document.querySelectorAll(".admin-tab").forEach((tab) => {
      const key = tab.dataset.filter;
      const span = tab.querySelector("span");
      if (span) {
        span.textContent = `(${key === "all" ? orders.length : counts[key] || 0})`;
      }
    });
  }

  main.addEventListener("click", (event) => {
    const tab = event.target.closest(".admin-tab");
    if (!tab) return;
    activeFilter = tab.dataset.filter;
    render();
  });

  main.addEventListener("change", (event) => {
    const select = event.target.closest(".status-select");
    if (!select) return;

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
  });

  render();
});
