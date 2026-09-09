const Cart = (() => {
  function getKey() {
    const user = typeof Auth !== "undefined" ? Auth.current() : null;
    return user ? `foodCart_${user.id}` : null;
  }

  function read() {
    const key = getKey();
    return key ? Storage.get(key, []) : [];
  }

  function count(items = read()) {
    return items.reduce((sum, item) => sum + item.qty, 0);
  }

  function totals(items = read()) {
    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
    const delivery = subtotal ? 500 : 0;
    return { subtotal, delivery, total: subtotal + delivery, lines: items.length };
  }

  function write(items) {
  const key = getKey();

  if (!key) {
    window.dispatchEvent(new CustomEvent("cartchange", { detail: totals([]) }));
    return items;
  }

  Storage.set(key, items);
  window.dispatchEvent(new CustomEvent("cartchange", { detail: totals(items) }));
  return items;
}

  function add(item) {
    const items = read();
    const existing = items.find((i) => i.id === item.id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ id: item.id, name: item.name, price: Number(item.price), image: item.image, qty: 1 });
    }
    return write(items);
  }

  function increment(id) {
    const items = read();
    const item = items.find((i) => i.id === id);
    if (item) item.qty += 1;
    return write(items);
  }

  function decrement(id) {
    const items = read();
    const item = items.find((i) => i.id === id);
    if (!item) return items;
    if (item.qty <= 1) return remove(id);
    item.qty -= 1;
    return write(items);
  }

  function remove(id) {
    return write(read().filter((i) => i.id !== id));
  }

  function clear() {
    return write([]);
  }

  function getItems() {
    return read();
  }

  return { getItems, add, increment, decrement, remove, clear, count, totals };
})();