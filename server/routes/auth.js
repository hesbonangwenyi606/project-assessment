import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { store } from "../data/store.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

authRouter.post("/signup", (req, res) => {
  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Please fill in every field." });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "That email address doesn't look valid." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }
  if (store.findUserByEmail(email)) {
    return res.status(409).json({ error: "An account with that email already exists." });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = store.createUser({ name, email, passwordHash });
  const token = signToken(user.id);

  res.status(201).json({ token, user: publicUser(user) });
});

authRouter.post("/login", (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  const user = store.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "No account found with that email." });
  }
  if (!bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: "Incorrect password." });
  }

  const token = signToken(user.id);
  res.json({ token, user: publicUser(user) });
});

authRouter.get("/me", requireAuth, (req, res) => {
  const user = store.findUserById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user: publicUser(user) });
});
