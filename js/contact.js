document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const statusEl = document.querySelector(".form-status");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    document.querySelectorAll(".field-error").forEach(el => el.textContent = "");
    statusEl.hidden = true;
    statusEl.textContent = "";
    statusEl.classList.remove("success", "error");

    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const subjectInput = document.getElementById("contact-subject");
    const messageInput = document.getElementById("contact-message");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    let isValid = true;

    if (Utils.isEmpty(name) || name.length < 2) {
      document.getElementById("nameError").textContent = "Please enter your name (at least 2 characters).";
      isValid = false;
    }

    if (!Utils.isEmail(email)) {
      document.getElementById("emailError").textContent = "Please enter a valid email address.";
      isValid = false;
    }

    if (subject.length > 0 && subject.length < 3) {
      document.getElementById("subjectError").textContent = "Subject should be at least 3 characters.";
      isValid = false;
    }

    if (Utils.isEmpty(message) || message.length < 10) {
      document.getElementById("messageError").textContent = "Message should be at least 10 characters.";
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const messages = Storage.get("foodMessages", []);
    const newMessage = {
      id: Date.now().toString(),
      name: name,
      email: email,
      subject: subject,
      message: message,
      date: new Date().toISOString()
    };
    messages.push(newMessage);
    Storage.set("foodMessages", messages);

    statusEl.hidden = false;
    statusEl.textContent = "Thanks — we'll respond within a day.";
    statusEl.classList.add("success");
    form.reset();
  });
});