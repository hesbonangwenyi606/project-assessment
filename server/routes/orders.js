import { Router } from "express";
import { PRODUCTS } from "../data/products.js";
import { store } from "../data/store.js";
import { requireAuth } from "../middleware/auth.js";

export const ordersRouter = Router();

ordersRouter.use(requireAuth);

ordersRouter.post("/", (req, res) => {
  const address = (req.body.address || "").trim();
  const customerDetails = req.body.customerDetails || {};
  const items = Array.isArray(req.body.items) ? req.body.items : [];

  if (!address) {
    return res.status(400).json({ error: "Shipping address is required." });
  }
  if (items.length === 0) {
    return res.status(400).json({ error: "Your cart is empty." });
  }

  const requiredFields = ["name", "email", "phone", "address", "city", "postalCode", "country"];
  const missingFields = requiredFields.filter((field) => !String(customerDetails[field] || "").trim());
  if (missingFields.length > 0) {
    return res.status(400).json({ error: "Please complete all customer details." });
  }

  const normalizedDetails = {
    name: String(customerDetails.name).trim(),
    email: String(customerDetails.email).trim(),
    phone: String(customerDetails.phone).trim(),
    address: String(customerDetails.address).trim(),
    city: String(customerDetails.city).trim(),
    postalCode: String(customerDetails.postalCode).trim(),
    country: String(customerDetails.country).trim(),
  };

  // Rebuild each line item from the trusted server-side catalog — the
  // client only tells us which product IDs and quantities it wants.
  const resolvedItems = [];
  for (const raw of items) {
    const qty = Number(raw.qty);
    const product = PRODUCTS.find((p) => p.id === Number(raw.productId));
    if (!product || !Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ error: "One of the items in your cart is invalid." });
    }
    resolvedItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty,
    });
  }

  const total = resolvedItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const order = store.createOrder({
    userId: req.userId,
    items: resolvedItems,
    address: normalizedDetails.address,
    total,
    customerDetails: normalizedDetails,
  });

  res.status(201).json({ order });
});

ordersRouter.get("/", (req, res) => {
  res.json({ orders: store.ordersForUser(req.userId) });
});
