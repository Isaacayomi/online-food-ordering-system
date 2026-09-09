const Auth = (() => {
  const USERS_KEY = "foodUsers";
  const SESSION_KEY = "foodSession";
  const DEMO = {
    firstName: "Demo",
    lastName: "Student",
    email: "demo@student.com",
    password: "demo123",
  };
  const ADMIN = {
    firstName: "Admin",
    lastName: "Account",
    email: "admin@campuseats.com",
    password: "admin123",
    role: "admin",
  };

  async function hash(text, salt) {
    const data = new TextEncoder().encode(`${salt}:${text}`);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(digest)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  const makeSalt = () =>
    [...crypto.getRandomValues(new Uint8Array(8))]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  const makeId = () =>
    `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  function users() {
    return Storage.get(USERS_KEY, []);
  }

  function current() {
    const sessionEntry = Storage.get(SESSION_KEY, null);
    if (!sessionEntry) return null;
    return users().find((user) => user.id === sessionEntry.userId) || null;
  }

  function isSignedIn() {
    return Boolean(current());
  }

  function isAdmin() {
    return current()?.role === "admin";
  }

  async function seedDemo() {
    const list = users();
    if (list.some((user) => user.email === DEMO.email)) return;
    const salt = makeSalt();
    list.push({
      id: makeId(),
      firstName: DEMO.firstName,
      lastName: DEMO.lastName,
      email: DEMO.email,
      salt,
      hash: await hash(DEMO.password, salt),
      createdAt: new Date().toISOString(),
      demo: true,
    });
    Storage.set(USERS_KEY, list);
  }

  async function seedAdmin() {
    const list = users();
    if (list.some((user) => user.email === ADMIN.email)) return;
    const salt = makeSalt();
    list.push({
      id: makeId(),
      firstName: ADMIN.firstName,
      lastName: ADMIN.lastName,
      email: ADMIN.email,
      role: "admin",
      salt,
      hash: await hash(ADMIN.password, salt),
      createdAt: new Date().toISOString(),
      demo: true,
    });
    Storage.set(USERS_KEY, list);
  }

  async function register({ firstName, lastName, email, password }) {
    firstName = String(firstName || "").trim();
    lastName = String(lastName || "").trim();
    email = String(email || "")
      .trim()
      .toLowerCase();
    password = String(password || "");

    if (!firstName || !lastName || !email || !password)
      return { ok: false, error: "Please fill in every field." };
    if (!Utils.isEmail(email))
      return { ok: false, error: "Enter a valid email address." };
    if (password.length < 8)
      return { ok: false, error: "Password must be at least 8 characters." };

    const list = users();
    if (list.some((user) => user.email === email))
      return { ok: false, error: "An account with this email already exists." };

    const salt = makeSalt();
    const user = {
      id: makeId(),
      firstName,
      lastName,
      email,
      salt,
      hash: await hash(password, salt),
      createdAt: new Date().toISOString(),
    };
    list.push(user);
    Storage.set(USERS_KEY, list);
    Storage.set(SESSION_KEY, sessionFor(user));
    return { ok: true, user };
  }

  async function login(email, password) {
    email = String(email || "")
      .trim()
      .toLowerCase();
    password = String(password || "");

    if (!email || !password)
      return { ok: false, error: "Enter your email and password." };

    const user = users().find((entry) => entry.email === email);
    if (!user) return { ok: false, error: "No account found with that email." };
    if (user.hash !== (await hash(password, user.salt)))
      return { ok: false, error: "Incorrect password. Try again." };

    Storage.set(SESSION_KEY, sessionFor(user));
    return { ok: true, user };
  }

  function sessionFor(user) {
    return {
      userId: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      signedInAt: Date.now(),
    };
  }

  function logout() {
    Storage.remove(SESSION_KEY);
  }

  function require(href) {
    const signedIn = isSignedIn();
    if (!signedIn && href) window.location.href = href;
    return signedIn;
  }

  seedDemo();
  seedAdmin();

  return {
    register,
    login,
    logout,
    current,
    isSignedIn,
    isAdmin,
    require,
    seedDemo,
  };
})();
