import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "db.json");

function load() {
  if (!existsSync(DB_PATH)) {
    const initial = { users: [], orders: [], nextUserId: 1, nextOrderId: 1 };
    writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(readFileSync(DB_PATH, "utf-8"));
}

function save(db) {
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Basic single-process file "database". Every call reads then writes the
// whole file — perfectly fine for a small store, but swap this module out
// for a real database (Postgres/MongoDB/etc.) if you outgrow it.
export const store = {
  findUserByEmail(email) {
    const db = load();
    return db.users.find((u) => u.email === email) || null;
  },

  createUser({ name, email, passwordHash }) {
    const db = load();
    const user = { id: db.nextUserId++, name, email, passwordHash };
    db.users.push(user);
    save(db);
    return user;
  },

  findUserById(id) {
    const db = load();
    return db.users.find((u) => u.id === id) || null;
  },

  createOrder({ userId, items, address, total, customerDetails }) {
    const db = load();
    const order = {
      id: db.nextOrderId++,
      userId,
      items,
      address,
      total,
      customerDetails,
      createdAt: new Date().toISOString(),
    };
    db.orders.push(order);
    save(db);
    return order;
  },

  ordersForUser(userId) {
    const db = load();
    return db.orders
      .filter((o) => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
};
