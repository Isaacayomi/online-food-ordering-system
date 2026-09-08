# Data Contract

Shared shapes and event names so every stream (menu, cart, checkout, auth) builds against the same API — no coupling to any one page or teammate's branch.

## Catalog item shape (single source: `data.js` `Menu.CATALOG` + live items)

```js
{
  id: "jollof-chicken",        // string, unique. Live items are prefixed "live-<idMeal>"
  name: "Jollof & Grilled Chicken",
  category: "starters | mains | drinks | desserts",
  price: 3500,                 // Number, Naira, whole naira. ALWAYS present on every item.
  description: "…",
  image: "assets/menu/x.jpg" | "https://www.themealdb.com/…",  // relative OR absolute
  live: false                  // optional; true for TheMealDB items
}
```

- **Never show an un-priced dish.** Catalogue prices live in the `PRICE_TABLET` in `data.js`; live items get a price from the tablet the moment they load.
- Get an image's final URL via `Menu.url(item)` (handles the `../` prefix for pages under `/pages/`).

## Storage keys (via `Storage` in `js/storage.js`)

| Key | Contents | Owner |
|---|---|---|
| `foodUsers` | array of user accounts | auth |
| `foodSession` | current signed-in user `{userId, email, name, signedInAt}` | auth |
| `foodCart` | array of `{id, name, price, image, qty}` | cart |
| `foodOrders` | array of orders | checkout/orders |
| `foodMessages` | array of contact messages | contact |
| `foodMenu` | sessionStorage cache `{savedAt, live:[…]}` | menu |

Use `Storage.get(key, fallback)` / `Storage.set(key, value)` — never touch `localStorage` directly.

## Cart contract (`js/cart.js`)

- Every menu card renders with:
  - `data-food-id` = item id
  - `data-price` = item price (Number)
  - `data-category` = item category
- `Cart.getItems()` → `[{id,name,price,image,qty}]`
- `Cart.add({id,name,price,image})` — dedupes by id, increments qty
- `Cart.increment(id)` / `Cart.decrement(id)` (never below 1; call `remove` to drop) / `Cart.remove(id)` / `Cart.clear()`
- `Cart.count()` → total qty; `Cart.totals()` → `{subtotal, delivery, total}` (flat ₦500 delivery, ₦0 when empty)
- **Every mutation** persists to `foodCart` and dispatches a window event:

```js
window.dispatchEvent(new CustomEvent("cartchange", { detail: { count, subtotal } }));
```

- RGB badge: header hook is `#cart-badge` (span). Listen to `cartchange` + on load to update it; hide when 0.

## Forms

- All validation happens in JS; forms keep `novalidate`.
- Error/success messaging uses `Utils` (`isEmail`, `isEmpty`) and nsota status `<p class="form-status" hidden>` + per-field `.field-error` text.

## Money

- Display via `Utils.money(value)` → `₦1,200` (en-NG grouping). Store numbers, never formatted strings.