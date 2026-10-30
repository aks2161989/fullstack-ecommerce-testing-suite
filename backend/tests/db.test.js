describe("Database Connection Module Unit Tests (db.js)", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("should not attempt MongoDB connection when NODE_ENV is 'test' and no TEST_DB_CONNECTION", () => {
    process.env.NODE_ENV = "test";
    delete process.env.TEST_DB_CONNECTION;

    let connectCalled = false;
    jest.isolateModules(() => {
      const mongoose = require("mongoose");
      jest.spyOn(mongoose, "connect").mockImplementation(() => {
        connectCalled = true;
        return Promise.resolve();
      });
      const dbModule = require("../db");
      expect(connectCalled).toBe(false);
      expect(dbModule).toBe(mongoose);
    });
  });

  test("should connect using TEST_DB_CONNECTION when provided in test environment", async () => {
    process.env.NODE_ENV = "test";
    process.env.TEST_DB_CONNECTION = "mongodb://custom-test-host:27017/test-db";

    let connectUri = null;
    let connectOptions = null;
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await new Promise((resolve) => {
      jest.isolateModules(() => {
        const mongoose = require("mongoose");
        jest.spyOn(mongoose, "connect").mockImplementation((uri, options) => {
          connectUri = uri;
          connectOptions = options;
          return Promise.resolve();
        });
        require("../db");
        // Flush microtasks for the .then() callback
        setImmediate(() => {
          resolve();
        });
      });
    });

    expect(connectUri).toBe("mongodb://custom-test-host:27017/test-db");
    expect(connectOptions).toEqual(
      expect.objectContaining({
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 2000,
        connectTimeoutMS: 2000,
      })
    );
    expect(logSpy).toHaveBeenCalledWith("Connected to MongoDB successfully");
    logSpy.mockRestore();
  });

  test("should use DB_CONNECTION environment variable when NODE_ENV is not 'test'", async () => {
    process.env.NODE_ENV = "development";
    process.env.DB_CONNECTION = "mongodb://prod-cluster:27017/production-shop";
    delete process.env.TEST_DB_CONNECTION;

    let connectUri = null;
    await new Promise((resolve) => {
      jest.isolateModules(() => {
        const mongoose = require("mongoose");
        jest.spyOn(mongoose, "connect").mockImplementation((uri) => {
          connectUri = uri;
          return Promise.resolve();
        });
        require("../db");
        setImmediate(resolve);
      });
    });

    expect(connectUri).toBe("mongodb://prod-cluster:27017/production-shop");
  });

  test("should fall back to default localhost URI when DB_CONNECTION is not set in non-test mode", async () => {
    process.env.NODE_ENV = "development";
    delete process.env.DB_CONNECTION;
    delete process.env.TEST_DB_CONNECTION;

    // Also mock dotenv to prevent loading DB_CONNECTION from .env file during test
    let connectUri = null;
    await new Promise((resolve) => {
      jest.isolateModules(() => {
        const dotenv = require("dotenv");
        jest.spyOn(dotenv, "config").mockReturnValue({});
        delete process.env.DB_CONNECTION;

        const mongoose = require("mongoose");
        jest.spyOn(mongoose, "connect").mockImplementation((uri) => {
          connectUri = uri;
          return Promise.resolve();
        });
        require("../db");
        setImmediate(resolve);
      });
    });

    expect(connectUri).toBe("mongodb://127.0.0.1:27017/ecommerce-shop");
  });

  test("should catch connection errors and log fallback warnings", async () => {
    process.env.NODE_ENV = "development";
    delete process.env.TEST_DB_CONNECTION;

    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    await new Promise((resolve) => {
      jest.isolateModules(() => {
        const mongoose = require("mongoose");
        jest.spyOn(mongoose, "connect").mockImplementation(() => {
          return Promise.reject(new Error("Connection refused"));
        });
        require("../db");
        setImmediate(resolve);
      });
    });

    expect(warnSpy).toHaveBeenCalledWith("MongoDB offline notice:", "Connection refused");
    expect(warnSpy).toHaveBeenCalledWith(
      "Backend will serve products and auth in fallback mode."
    );
    warnSpy.mockRestore();
  });
});
