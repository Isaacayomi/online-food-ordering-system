document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("#main");

  if (!Auth.isSignedIn()) {
    window.location.href = "../login.html";
    return;
  }

  const user = Auth.current();
  const items = Cart.getItems();

  if (!items.length) {
    main.innerHTML = `
      <section class="checkout-page">
        <div class="checkout-wrap">
          <div class="empty-checkout">
            <h1>Your cart is empty</h1>
            <p>Add some delicious meals before checking out.</p>
            <a href="menu.html">Browse Menu</a>
          </div>
        </div>
      </section>
    `;
    return;
  }

  const totals = Cart.totals(items);

  main.innerHTML = `
    <section class="checkout-page">
      <div class="checkout-wrap">

        <div class="checkout-hero">
          <h1>Checkout</h1>
          <p>Complete your delivery details and place your order.</p>
        </div>

        <div class="checkout-grid">

          <section class="checkout-panel">
            <h2>Delivery Details</h2>

            <form class="checkout-form" id="checkout-form" novalidate>

              <div class="form-field">
                <label for="name">Full Name</label>
                <input id="name" name="name" type="text"
                  value="${Utils.escapeHTML(`${user.firstName || ""} ${user.lastName || ""}`.trim())}"
                  placeholder="Enter your full name">
                <small class="field-error" id="name-error"></small>
              </div>

              <div class="form-field">
                <label for="email">Email</label>
                <input id="email" name="email" type="email"
                  value="${Utils.escapeHTML(user.email || "")}"
                  placeholder="Enter your email">
                <small class="field-error" id="email-error"></small>
              </div>

              <div class="form-field">
                <label for="phone">Phone Number</label>
                <input id="phone" name="phone" type="tel"
  inputmode="numeric"
  pattern="[0-9]{11}"
  minlength="10"
  maxlength="13"
  placeholder="Enter your phone number">
                <small class="field-error" id="phone-error"></small>
              </div>

              <div class="form-field">
                <label for="address">Delivery Address</label>
                <textarea id="address" name="address"
                  placeholder="Enter your delivery address"></textarea>
                <small class="field-error" id="address-error"></small>
              </div>

              <p class="checkout-status" id="checkout-status"></p>

              <button class="checkout-submit" type="submit">
                Place Order
              </button>

            </form>
          </section>

          <aside class="checkout-summary">
            <h2>Order Summary</h2>

            <ul class="checkout-items">
              ${items.map(item => `
                <li class="checkout-item">
                  <div>
                    <div class="checkout-item-name">
                      ${Utils.escapeHTML(item.name)}
                    </div>
                    <div class="checkout-item-meta">
                      ${item.qty} × ${Utils.money(item.price)}
                    </div>
                  </div>
                  <strong>${Utils.money(Number(item.price) * item.qty)}</strong>
                </li>
              `).join("")}
            </ul>

            <dl>
              <div>
                <dt>Subtotal</dt>
                <dd>${Utils.money(totals.subtotal)}</dd>
              </div>

              <div>
                <dt>Delivery</dt>
                <dd>${Utils.money(totals.delivery)}</dd>
              </div>

              <div class="summary-total">
                <dt>Total</dt>
                <dd>${Utils.money(totals.total)}</dd>
              </div>
            </dl>
          </aside>

        </div>
      </div>
    </section>
  `;

  const form = document.querySelector("#checkout-form");

const phoneInput = document.querySelector("#phone");

phoneInput.addEventListener("input", () => {
  const hasLetters = /[A-Za-z]/.test(phoneInput.value);

  phoneInput.value = phoneInput.value.replace(/\D/g, "");

  const phoneError = document.querySelector("#phone-error");

  if (hasLetters) {
    phoneError.textContent = "Phone number can only contain numbers.";
  } else {
    phoneError.textContent = "";
  }
});
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const phone = document.querySelector("#phone").value.trim();
    const address = document.querySelector("#address").value.trim();

    document.querySelector("#name-error").textContent = "";
    document.querySelector("#email-error").textContent = "";
    document.querySelector("#phone-error").textContent = "";
    document.querySelector("#address-error").textContent = "";

    const errors = {};

    if (Utils.isEmpty(name)) {
      errors.name = "Name is required.";
    }

    if (Utils.isEmpty(email)) {
      errors.email = "Email is required.";
    } else if (!Utils.isEmail(email)) {
      errors.email = "Enter a valid email address.";
    }

    if (Utils.isEmpty(phone)) {
      errors.phone = "Phone number is required.";
    }

    if (Utils.isEmpty(address)) {
      errors.address = "Delivery address is required.";
    }

    Object.entries(errors).forEach(([field, message]) => {
      document.querySelector(`#${field}-error`).textContent = message;
    });

    const status = document.querySelector("#checkout-status");

    if (Object.keys(errors).length) {
      status.textContent = "Please correct the highlighted fields.";
      status.className = "checkout-status error";
      return;
    }

    const order = {
      id: `order-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      userId: user.id,
      items: items.map(item => ({ ...item })),
      subtotal: totals.subtotal,
      delivery: totals.delivery,
      total: totals.total,
      address,
      date: new Date().toISOString(),
      status: "Pending"
    };

    const orders = Storage.get("foodOrders", []);
    orders.push(order);
    Storage.set("foodOrders", orders);

    Cart.clear();

    main.innerHTML = `
      <section class="checkout-page">
        <div class="checkout-wrap">
          <div class="confirmation">
            <h1>Order Confirmed! 🎉</h1>
            <p>Your order has been placed successfully.</p>
            <p>Redirecting you to My Orders...</p>
          </div>
        </div>
      </section>
    `;

    setTimeout(() => {
      window.location.href = "orders.html";
    }, 1000);
  });
});