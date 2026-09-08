const Menu = (() => {
  const rootPath = window.location.pathname.includes("/pages/") ? "../" : "";
  const CACHE_KEY = "foodMenu";

  const PLACEHOLDER =
    "data:image/svg+xml," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#f0ede4"/><g fill="none" stroke="#b6b09c" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"><circle cx="330" cy="310" r="120"/><path d="M480 200v180"/><path d="M480 250h50a62 62 0 0 1 0 120v40"/></g></svg>'
    );

  const CATALOG = [
    { id: "spring-rolls", name: "Veggie Spring Rolls", category: "starters", price: 1200, description: "Crispy rolls filled with cabbage, carrot and glass noodles, served with sweet chilli dip.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Golden_Vegetable_Spring_Rolls_Served_with_Dipping_Sauce.jpg/960px-Golden_Vegetable_Spring_Rolls_Served_with_Dipping_Sauce.jpg" },
    { id: "beef-samosa", name: "Beef Samosa (2 pcs)", category: "starters", price: 1500, description: "Flaky pastry parcels packed with spiced minced beef, onion and curry leaves.", image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1200&h=900" },
    { id: "moin-moin", name: "Moin Moin", category: "starters", price: 800, description: "Savory steamed bean pudding with pepper, onions and a hint of smoked fish.", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&h=900" },
    { id: "catfish-pepper-soup", name: "Catfish Pepper Soup", category: "starters", price: 3500, description: "Warm, spicy broth with tender catfish chunks and aromatic African spices.", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&h=900" },
    { id: "jollof-chicken", name: "Jollof & Grilled Chicken", category: "mains", price: 3500, description: "Smoky party-style jollof rice with a quarter grilled chicken and fried plantain.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Ghana_Jollof_Rice_with_Chicken.jpg/960px-Ghana_Jollof_Rice_with_Chicken.jpg" },
    { id: "fried-rice-beef", name: "Fried Rice & Beef", category: "mains", price: 3200, description: "Classic Nigerian fried rice loaded with vegetables, served with peppered beef.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Singapore_Beef_Fried_Rice_by_Banej.jpg/960px-Singapore_Beef_Fried_Rice_by_Banej.jpg" },
    { id: "egusi-pounded-yam", name: "Egusi & Pounded Yam", category: "mains", price: 3600, description: "Rich melon-seed soup with assorted meat over smooth, stretchy pounded yam.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&h=900" },
    { id: "amala-ewedu", name: "Amala, Ewedu & Gbegiri", category: "mains", price: 2800, description: "Smooth yam flour amala with slimy ewedu and creamy bean gbegiri.", image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&h=900" },
    { id: "chicken-suya", name: "Chicken Suya (5 sticks)", category: "mains", price: 2500, description: "Spicy smoky chicken skewers dusted with yaji spice, onions and tomatoes.", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&h=900" },
    { id: "grilled-croaker", name: "Grilled Croaker (3 pcs)", category: "mains", price: 2800, description: "Flame-grilled croaker fish seasoned with herbs, served with plantain.", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1200&h=900" },
    { id: "chapman", name: "Chapman", category: "drinks", price: 900, description: "A refreshing mix of soft drinks, grenadine and fresh fruit, served chilled.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Chapman_drink.jpg/960px-Chapman_drink.jpg" },
    { id: "zobo", name: "Zobo", category: "drinks", price: 700, description: "Hibiscus drink infused with ginger, pineapple and a hint of mint.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Zobo_drink.jpg/960px-Zobo_drink.jpg" },
    { id: "mango-smoothie", name: "Mango Smoothie", category: "drinks", price: 1800, description: "Thick and creamy fresh mango blended to order — no sugar added.", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&h=900" },
    { id: "coconut-water", name: "Coconut Water", category: "drinks", price: 1200, description: "Ice-cold natural coconut water served straight from the shell.", image: "https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=1200&h=900" },
    { id: "puff-puff", name: "Puff Puff (6 pcs)", category: "desserts", price: 800, description: "Soft, golden fried dough balls, lightly sweetened and a campus favourite.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Puff_Puff.jpg/960px-Puff_Puff.jpg" },
    { id: "chin-chin", name: "Chin Chin (100g)", category: "desserts", price: 500, description: "Crunchy, nutmeg-scented fried dough bites — perfect for studying.", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&h=900" },
    { id: "boli-groundnut", name: "Boli & Groundnut", category: "desserts", price: 1000, description: "Slow-roasted plantain with roasted groundnuts and a sprinkle of pepper.", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&h=900" },
    { id: "fruit-salad", name: "Fresh Fruit Salad", category: "desserts", price: 1200, description: "A chilled cup of pineapple, paw paw, watermelon and oranges.", image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=1200&h=900" },
  ];

  const PRICE_TABLET = {
    starters: 1600,
    mains: 3400,
    drinks: 1200,
    desserts: 1200,
    side: 1500,
    past: 3000,
    pork: 4000,
    lamb: 4200,
  };

  const LIVE_CATEGORIES = [
    { api: "Chicken", category: "mains", price: 3400 },
    { api: "Seafood", category: "mains", price: 4200 },
    { api: "Dessert", category: "desserts", price: 1500 },
  ];

  function guessCategory(category) {
    const c = String(category || "").toLowerCase();
    if (c === "starters" || c === "side") return "starters";
    if (c === "dessert") return "desserts";
    if (c === "drinks" || c === "cocktail" || c === "shake") return "drinks";
    return "mains";
  }

  function normalizeLive(payload, category, price) {
    return (payload.meals || []).slice(0, 3).map((meal) => ({
      id: `live-${meal.idMeal}`,
      name: meal.strMeal,
      category,
      price,
      description: "A live international dish pulled straight from TheMealDB today.",
      image: meal.strMealThumb,
      live: true,
    }));
  }

  async function loadLive() {
    const cached = Storage.get(CACHE_KEY, null);
    if (cached && Array.isArray(cached.live) && cached.live.length) return cached.live;

    const results = await Promise.allSettled(
      LIVE_CATEGORIES.map(({ api }) =>
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(api)}`).then((res) => res.json())
      )
    );

    const live = [];
    results.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value && Array.isArray(result.value.meals)) {
        const { category, price } = LIVE_CATEGORIES[index];
        live.push(...normalizeLive(result.value, category, price));
      }
    });

    Storage.set(CACHE_KEY, { savedAt: Date.now(), live });
    return live;
  }

  function getCachedLive() {
    const cached = Storage.get(CACHE_KEY, null);
    return cached && Array.isArray(cached.live) ? cached.live : [];
  }

  async function search(query) {
    const q = String(query || "").trim().toLowerCase();
    if (!q) return [];
    const cacheKey = `foodSearch-${q}`;

    const cached = Storage.get(cacheKey, null);
    if (Array.isArray(cached)) return cached;

    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`);
      const payload = await response.json();
      const items = (payload.meals || [])
        .filter((meal) => meal.strMeal)
        .slice(0, 6)
        .map((meal) => {
          const category = guessCategory(meal.strCategory);
          return {
            id: `live-${meal.idMeal}`,
            name: meal.strMeal,
            category,
            price: PRICE_TABLET[category] || 3400,
            description: `${meal.strInstructions || ""}`.replace(/\s+/g, " ").trim().slice(0, 96) + "…",
            image: meal.strMealThumb,
            live: true,
            searched: true,
          };
        });
      Storage.set(cacheKey, items);
      return items;
    } catch {
      return [];
    }
  }

  function url(item) {
    return item.image.startsWith("http") ? item.image : `${rootPath}${item.image}`;
  }

  return { CATALOG, PRICE_TABLET, loadLive, getCachedLive, search, url, PLACEHOLDER };
})();