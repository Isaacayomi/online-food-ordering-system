document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("#main");

  if (!Auth.isSignedIn()) {
    window.location.href = "../login.html";
    return;
  }

  const user = Auth.current();

  const statusKey = (status) =>
    String(status || "Pending")
      .toLowerCase()
      .replace(/\s+/g, "-");

  const orders = Storage.get("foodOrders", [])
    .filter((order) => order.userId === user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  main.innerHTML = `
    <section class="orders-page">
      <div class="orders-wrap">

        <div class="orders-hero">
          <h1>My Orders</h1>
          <p>Track your CampusEats orders.</p>
        </div>

        ${
          orders.length
            ? `<div class="orders-list">
                ${orders
                  .map((order) => {
                    const date = new Date(order.date).toLocaleString("en-NG", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    });

                    return `
                    <article class="order-card">
                      <div class="order-header">
                        <div>
                          <h2>Order #${Utils.escapeHTML(order.id)}</h2>
                          <div class="order-date">${Utils.escapeHTML(date)}</div>
                        </div>

                        <span class="order-status order-status--${statusKey(order.status)}">
                          ${Utils.escapeHTML(order.status || "Pending")}
                        </span>
                      </div>

                      <ul class="order-items">
                        ${order.items
                          .map(
                            (item) => `
                          <li class="order-item">
                            <div class="order-item-info">
                              <span class="order-item-name">
                                ${Utils.escapeHTML(item.name)}
                              </span>
                              <span class="order-item-meta">
                                ${item.qty} × ${Utils.money(item.price)}
                              </span>
                            </div>

                            <strong>
                              ${Utils.money(Number(item.price) * item.qty)}
                            </strong>
                          </li>
                        `,
                          )
                          .join("")}
                      </ul>

                      <div class="order-total">
                        <span>Total</span>
                        <span>${Utils.money(order.total)}</span>
                      </div>
                    </article>
                  `;
                  })
                  .join("")}
              </div>`
            : `
              <div class="empty-orders">
                <h2>No orders yet</h2>
                <p>You haven't placed an order yet.</p>
                <a class="browse-menu-button" href="menu.html">
                  Browse Menu
                </a>
              </div>
            `
        }

      </div>
    </section>
  `;

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

  if (Storage.get("ceOrderPlaced", false)) {
    Storage.remove("ceOrderPlaced");
    showToast("Your order has been placed successfully!");
  }
});
