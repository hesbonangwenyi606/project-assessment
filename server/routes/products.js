import { Router } from "express";
import { PRODUCTS } from "../data/products.js";

export const productsRouter = Router();

productsRouter.get("/", (req, res) => {
  res.json({ products: PRODUCTS });
});
