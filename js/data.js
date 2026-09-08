const Menu = (() => {
  const rootPath = window.location.pathname.includes("/pages/") ? "../" : "";
  const CACHE_KEY = "foodMenu";

  const CATALOG = [
    { id: "spring-rolls", name: "Veggie Spring Rolls", category: "starters", price: 1200, description: "Crispy rolls filled with cabbage, carrot and glass noodles, served with sweet chilli dip.", image: "assets/menu/spring-rolls.jpg" },
    { id: "beef-samosa", name: "Beef Samosa (2 pcs)", category: "starters", price: 1500, description: "Flaky pastry parcels packed with spiced minced beef, onion and curry leaves.", image: "assets/menu/beef-samosa.jpg" },
    { id: "moin-moin", name: "Moin Moin", category: "starters", price: 800, description: "Savory steamed bean pudding with pepper, onions and a hint of smoked fish.", image: "assets/menu/moin-moin.jpg" },
    { id: "catfish-pepper-soup", name: "Catfish Pepper Soup", category: "starters", price: 3500, description: "Warm, spicy broth with tender catfish chunks and aromatic African spices.", image: "assets/menu/catfish-pepper-soup.jpg" },
    { id: "jollof-chicken", name: "Jollof & Grilled Chicken", category: "mains", price: 3500, description: "Smoky party-style jollof rice with a quarter grilled chicken and fried plantain.", image: "assets/menu/jollof-chicken.jpg" },
    { id: "fried-rice-beef", name: "Fried Rice & Beef", category: "mains", price: 3200, description: "Classic Nigerian fried rice loaded with vegetables, served with peppered beef.", image: "assets/menu/fried-rice.jpg" },
    { id: "egusi-pounded-yam", name: "Egusi & Pounded Yam", category: "mains", price: 3600, description: "Rich melon-seed soup with assorted meat over smooth, stretchy pounded yam.", image: "assets/menu/egusi-pounded-yam.jpg" },
    { id: "amala-ewedu", name: "Amala, Ewedu & Gbegiri", category: "mains", price: 2800, description: "Smooth yam flour amala with slimy ewedu and creamy bean gbegiri.", image: "assets/menu/amala-ewedu.jpg" },
    { id: "chicken-suya", name: "Chicken Suya (5 sticks)", category: "mains", price: 2500, description: "Spicy smoky chicken skewers dusted with yaji spice, onions and tomatoes.", image: "assets/menu/chicken-suya.jpg" },
    { id: "grilled-croaker", name: "Grilled Croaker (3 pcs)", category: "mains", price: 2800, description: "Flame-grilled croaker fish seasoned with herbs, served with plantain.", image: "assets/menu/grilled-croaker.jpg" },
    { id: "chapman", name: "Chapman", category: "drinks", price: 900, description: "A refreshing mix of soft drinks, grenadine and fresh fruit, served chilled.", image: "assets/menu/chapman.jpg" },
    { id: "zobo", name: "Zobo", category: "drinks", price: 700, description: "Hibiscus drink infused with ginger, pineapple and a hint of mint.", image: "assets/menu/zobo.jpg" },
    { id: "mango-smoothie", name: "Mango Smoothie", category: "drinks", price: 1800, description: "Thick and creamy fresh mango blended to order — no sugar added.", image: "assets/menu/mango-smoothie.jpg" },
    { id: "coconut-water", name: "Coconut Water", category: "drinks", price: 1200, description: "Ice-cold natural coconut water served straight from the shell.", image: "assets/menu/coconut-water.jpg" },
    { id: "puff-puff", name: "Puff Puff (6 pcs)", category: "desserts", price: 800, description: "Soft, golden fried dough balls, lightly sweetened and a campus favourite.", image: "assets/menu/puff-puff.jpg" },
    { id: "chin-chin", name: "Chin Chin (100g)", category: "desserts", price: 500, description: "Crunchy, nutmeg-scented fried dough bites — perfect for studying.", image: "assets/menu/chin-chin.jpg" },
    { id: "boli-groundnut", name: "Boli & Groundnut", category: "desserts", price: 1000, description: "Slow-roasted plantain with roasted groundnuts and a sprinkle of pepper.", image: "assets/menu/boli-groundnut.jpg" },
    { id: "fruit-salad", name: "Fresh Fruit Salad", category: "desserts", price: 1200, description: "A chilled cup of pineapple, paw paw, watermelon and oranges.", image: "assets/menu/fruit-salad.jpg" },
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

  function url(item) {
    return item.image.startsWith("http") ? item.image : `${rootPath}${item.image}`;
  }

  return { CATALOG, PRICE_TABLET, loadLive, getCachedLive, url };
})();