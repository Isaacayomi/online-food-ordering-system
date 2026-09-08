document.addEventListener("DOMContentLoaded", () => {
  const homeUrl = window.location.pathname.includes("/pages/") ? "../index.html" : "index.html";
  const loginForm = document.querySelector("#login-form");
  const registerForm = document.querySelector("#register-form");

  function showStatus(form, message, isError = true) {
    const status = form.querySelector(".form-status");
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", isError);
    status.classList.toggle("is-success", !isError);
    status.hidden = false;
  }

  if (loginForm) {
    const rememberedEmail = Storage.get("foodRemember", "");
    if (rememberedEmail) loginForm.querySelector("#login-email").value = rememberedEmail;

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = loginForm.querySelector("#login-email").value;
      const password = loginForm.querySelector("#login-password").value;

      if (loginForm.querySelector(".check-label input")?.checked) Storage.set("foodRemember", email);
      else Storage.remove("foodRemember");

      const result = await Auth.login(email, password);
      if (result.ok) {
        showStatus(loginForm, "Signed in! Redirecting…", false);
        window.location.href = homeUrl;
      } else {
        showStatus(loginForm, result.error);
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = {
        firstName: registerForm.querySelector("#first-name").value,
        lastName: registerForm.querySelector("#last-name").value,
        email: registerForm.querySelector("#register-email").value,
        password: registerForm.querySelector("#register-password").value,
      };

      if (!registerForm.querySelector(".terms input")?.checked) {
        showStatus(registerForm, "Please accept the Terms of Service.");
        return;
      }

      const result = await Auth.register(data);
      if (result.ok) {
        showStatus(registerForm, "Account created! Redirecting…", false);
        window.location.href = homeUrl;
      } else {
        showStatus(registerForm, result.error);
      }
    });
  }
});