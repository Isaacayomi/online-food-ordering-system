const Utils = (() => {
  function money(value) {
    return `₦${Number(value || 0).toLocaleString("en-NG")}`;
  }

  function isEmpty(value) {
    return value === undefined || value === null || String(value).trim() === "";
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char]));
  }

  return { money, isEmpty, isEmail, escapeHTML };
})();