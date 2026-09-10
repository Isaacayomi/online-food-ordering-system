document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const statusEl = form.querySelector(".form-status");
  const fields = {
    name: form.querySelector("#contact-name"),
    email: form.querySelector("#contact-email"),
    subject: form.querySelector("#contact-subject"),
    message: form.querySelector("#contact-message"),
  };
  const errors = {
    name: form.querySelector("#name-error"),
    email: form.querySelector("#email-error"),
    subject: form.querySelector("#subject-error"),
    message: form.querySelector("#message-error"),
  };

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

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    Object.values(errors).forEach((el) => (el.textContent = ""));
    statusEl.textContent = "";
    statusEl.classList.remove("is-success");
    statusEl.hidden = true;

    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const subject = fields.subject.value.trim();
    const message = fields.message.value.trim();

    let isValid = true;

    if (Utils.isEmpty(name) || name.length < 2) {
      errors.name.textContent = "Please enter your name (at least 2 characters).";
      isValid = false;
    }

    if (!Utils.isEmail(email)) {
      errors.email.textContent = "Please enter a valid email address.";
      isValid = false;
    }

    if (subject && (subject.length < 3 || subject.length > 100)) {
      errors.subject.textContent = "Subject should be between 3 and 100 characters.";
      isValid = false;
    }

    if (Utils.isEmpty(message) || message.length < 10) {
      errors.message.textContent = "Message should be at least 10 characters.";
      isValid = false;
    }

    if (!isValid) {
      statusEl.textContent = "Please correct the highlighted fields.";
      statusEl.hidden = false;
      return;
    }

    const messages = Storage.get("foodMessages", []);
    messages.push({
      id: `msg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      email,
      subject,
      message,
      date: Date.now(),
    });
    Storage.set("foodMessages", messages);

    form.reset();
    statusEl.textContent = "Thanks — we'll respond within a day.";
    statusEl.classList.add("is-success");
    statusEl.hidden = false;

    showToast("Message sent successfully — we'll respond within a day.");
  });
});