document.addEventListener("DOMContentLoaded", () => {
  const chips = document.querySelectorAll(".filter-chip");
  const cards = document.querySelectorAll(".menu-card");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => {
        c.classList.remove("is-active");
        c.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("is-active");
      chip.setAttribute("aria-pressed", "true");

      const filter = chip.dataset.filter;

      cards.forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;
        card.style.display = show ? "" : "none";
      });
    });
  });
});