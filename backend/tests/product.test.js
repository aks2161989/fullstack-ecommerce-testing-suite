const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Product = require("../model/ProductModal");
const Category = require("../model/CatModal");

describe("Product & Category Routes API Integration Tests (/api/v1)", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("GET /api/v1/product (Fallback Mode)", () => {
    test("should return 200 and complete list of normalized product categories", async () => {
      const res = await request(app).get("/api/v1/product");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);

      // Verify category object structure
      const firstCategory = res.body[0];
      expect(firstCategory).toHaveProperty("_id");
      expect(firstCategory).toHaveProperty("title");
      expect(firstCategory).toHaveProperty("routeName");
      expect(firstCategory).toHaveProperty("items");
      expect(Array.isArray(firstCategory.items)).toBe(true);
      expect(firstCategory.items.length).toBeGreaterThan(0);

      // Verify item object structure within category
      const firstItem = firstCategory.items[0];
      expect(firstItem).toHaveProperty("_id");
      expect(firstItem).toHaveProperty("name");
      expect(firstItem).toHaveProperty("price");
      expect(typeof firstItem.price).toBe("number");
      expect(firstItem).toHaveProperty("imageUrl");
    });
  });

  describe("GET /api/v1/category (Fallback Mode)", () => {
    test("should return 200 and all category route names", async () => {
      const res = await request(app).get("/api/v1/category");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      const expectedCategories = ["hats", "sneakers", "jackets", "womens", "mens"];
      expectedCategories.forEach((cat) => {
        expect(res.body).toContain(cat);
      });
    });
  });

  describe("GET /api/v1/product/:cat_name (Fallback Mode)", () => {
    const validCategories = ["hats", "jackets", "sneakers", "womens", "mens"];

    test.each(validCategories)(
      "should return 200 and products for category '%s'",
      async (categoryName) => {
        const res = await request(app).get(`/api/v1/product/${categoryName}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);

        const categoryData = res.body[0];
        expect(categoryData.routeName.toLowerCase()).toBe(categoryName);
        expect(categoryData.items.length).toBeGreaterThan(0);
      }
    );

    test("should be case-insensitive when querying category name", async () => {
      const lowerRes = await request(app).get("/api/v1/product/hats");
      const upperRes = await request(app).get("/api/v1/product/HATS");

      expect(lowerRes.status).toBe(200);
      expect(upperRes.status).toBe(200);
      expect(lowerRes.body).toEqual(upperRes.body);
    });

    test("should return 404 when category does not exist", async () => {
      const res = await request(app).get("/api/v1/product/non-existent-category");

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("nocatsfound", "No product found");
    });
  });

  describe("MongoDB Connected Mode Operations", () => {
    beforeEach(() => {
      mongoose.connection.readyState = 1;
    });

    afterEach(() => {
      mongoose.connection.readyState = 0;
    });

    describe("GET /api/v1/product with MongoDB", () => {
      test("should return products directly from MongoDB when available", async () => {
        const mockProducts = [
          { _id: "mongo_cat_1", title: "DB Hats", routeName: "hats", items: [] },
        ];
        jest.spyOn(Product, "find").mockResolvedValueOnce(mockProducts);

        const res = await request(app).get("/api/v1/product");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockProducts);
      });

      test("should fall back to local catalog when MongoDB returns an empty list", async () => {
        jest.spyOn(Product, "find").mockResolvedValueOnce([]);

        const res = await request(app).get("/api/v1/product");
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty("routeName");
      });

      test("should catch MongoDB query error and fall back to local catalog", async () => {
        jest.spyOn(Product, "find").mockRejectedValueOnce(new Error("Mongo find error"));

        const res = await request(app).get("/api/v1/product");
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
      });
    });

    describe("GET /api/v1/category with MongoDB", () => {
      test("should return categories directly from MongoDB when available", async () => {
        const mockCategories = [
          { _id: "cat_1", name: "Hats", routeName: "hats" },
          { _id: "cat_2", name: "Jackets", routeName: "jackets" },
        ];
        jest.spyOn(Category, "find").mockResolvedValueOnce(mockCategories);

        const res = await request(app).get("/api/v1/category");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockCategories);
      });

      test("should fall back to local categories when MongoDB returns empty array", async () => {
        jest.spyOn(Category, "find").mockResolvedValueOnce([]);

        const res = await request(app).get("/api/v1/category");
        expect(res.status).toBe(200);
        expect(res.body).toContain("hats");
      });

      test("should catch MongoDB query error and fall back to local categories", async () => {
        jest.spyOn(Category, "find").mockRejectedValueOnce(new Error("Category DB error"));

        const res = await request(app).get("/api/v1/category");
        expect(res.status).toBe(200);
        expect(res.body).toContain("hats");
      });
    });

    describe("GET /api/v1/product/:cat_name with MongoDB", () => {
      test("should return specific category products directly from MongoDB", async () => {
        const mockCategoryProducts = [
          { _id: "p_1", routeName: "hats", items: [{ name: "DB Brim Hat" }] },
        ];
        jest.spyOn(Product, "find").mockResolvedValueOnce(mockCategoryProducts);

        const res = await request(app).get("/api/v1/product/hats");
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockCategoryProducts);
      });

      test("should fall back to local catalog when MongoDB returns empty product list for category", async () => {
        jest.spyOn(Product, "find").mockResolvedValueOnce([]);

        const res = await request(app).get("/api/v1/product/hats");
        expect(res.status).toBe(200);
        expect(res.body[0].routeName).toBe("hats");
      });

      test("should catch MongoDB query error and fall back to local catalog for category", async () => {
        jest.spyOn(Product, "find").mockRejectedValueOnce(new Error("Product query failure"));

        const res = await request(app).get("/api/v1/product/hats");
        expect(res.status).toBe(200);
        expect(res.body[0].routeName).toBe("hats");
      });
    });
  });

  describe("Category Normalization and Route Param Branches", () => {
    test("should handle items with explicit _id and categories without items array", async () => {
      let customApp;
      jest.isolateModules(() => {
        jest.resetModules();
        jest.doMock("../data/products.json", () => [
          {
            _id: "custom_cat_id_1",
            id: 101,
            routeName: "custom_category",
            title: "Custom Category",
            items: [
              {
                _id: "custom_item_id_1",
                id: 501,
                name: "Custom Item 1",
                price: 99,
              },
            ],
          },
          {
            id: 102,
            routeName: "empty_items_category",
            title: "Empty Category",
          },
        ]);

        const express = require("express");
        customApp = express();
        const customRouter = require("../routes/product");
        customApp.use("/api/v1", customRouter);
      });

      const res = await request(customApp).get("/api/v1/product");
      expect(res.status).toBe(200);
      expect(res.body[0]._id).toBe("custom_cat_id_1");
      expect(res.body[0].items[0]._id).toBe("custom_item_id_1");
      expect(res.body[1]._id).toBe("102");
      expect(res.body[1].items).toEqual([]);
    });

    test("should handle missing cat_name param via empty string fallback", async () => {
      const express = require("express");
      const testApp = express();
      const productRouter = require("../routes/product");

      testApp.get("/test-param-fallback", (req, res, next) => {
        req.params = {};
        const routeLayer = productRouter.stack.find(
          (s) => s.route && s.route.path === "/product/:cat_name"
        );
        routeLayer.route.stack[0].handle(req, res, next);
      });

      const res = await request(testApp).get("/test-param-fallback");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("nocatsfound", "No product found");
    });
  });
});
