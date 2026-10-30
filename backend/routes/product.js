const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../model/ProductModal");
const Category = require("../model/CatModal");
const fallbackProducts = require("../data/products.json");

// Helper to normalize items with _id
const normalizeCategory = (cat) => ({
  ...cat,
  _id: cat._id || String(cat.id),
  items: (cat.items || []).map((item) => ({
    ...item,
    _id: item._id || String(item.id),
  })),
});

const isDbConnected = () => mongoose.connection.readyState === 1;

// Get all products
router.get("/product", async (req, res) => {
  if (isDbConnected()) {
    try {
      const products = await Product.find();
      if (products && products.length > 0) {
        return res.json(products);
      }
    } catch (err) {}
  }
  return res.json(fallbackProducts.map(normalizeCategory));
});

// Get all category names
router.get("/category", async (req, res) => {
  if (isDbConnected()) {
    try {
      const categories = await Category.find();
      if (categories && categories.length > 0) {
        return res.json(categories);
      }
    } catch (err) {}
  }
  return res.json(fallbackProducts.map((p) => p.routeName));
});

// Get all product by specific category name
router.get("/product/:cat_name", async (req, res) => {
  const catName = (req.params["cat_name"] || "").toLowerCase();
  if (isDbConnected()) {
    try {
      const product = await Product.find({ routeName: catName });
      if (product && product.length > 0) {
        return res.json(product);
      }
    } catch (err) {}
  }

  // Fallback to local catalog
  const match = fallbackProducts.filter(
    (p) => p.routeName.toLowerCase() === catName
  );
  if (match.length > 0) {
    return res.json(match.map(normalizeCategory));
  }

  return res.status(404).json({ nocatsfound: "No product found" });
});

module.exports = router;
