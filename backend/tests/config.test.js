describe("Config Keys Unit Tests (config/keys.js)", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("should load keys_prod when NODE_ENV is production", () => {
    process.env.NODE_ENV = "production";
    process.env.MONGO_URI = "mongodb+srv://prod-cluster.mongodb.net/shop";
    process.env.SECRET_OR_KEY = "custom_prod_secret";

    let keys;
    jest.isolateModules(() => {
      keys = require("../config/keys");
    });

    expect(keys.mongoURI).toBe("mongodb+srv://prod-cluster.mongodb.net/shop");
    expect(keys.secretOrKey).toBe("custom_prod_secret");
  });

  test("should load keys_dev when NODE_ENV is not production", () => {
    process.env.NODE_ENV = "development";

    let keys;
    jest.isolateModules(() => {
      keys = require("../config/keys");
    });

    expect(keys.mongoURI).toContain("mongodb+srv://ajay:ajay@cluster0-fhjlv.mongodb.net");
    expect(keys.secretOrKey).toBe("secret_key");
  });
});
