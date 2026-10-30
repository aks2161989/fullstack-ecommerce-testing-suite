const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");

describe("Express App Configuration Unit Tests (app.js)", () => {
  const originalEnv = { ...process.env };
  let connectSpy;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    // Prevent real mongoose connection attempts when NODE_ENV is changed
    connectSpy = jest.spyOn(mongoose, "connect").mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    if (connectSpy) connectSpy.mockRestore();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("Middleware & CORS Headers", () => {
    test("should attach CORS headers to responses", async () => {
      const app = require("../app");
      const res = await request(app).get("/api/v1/category");

      expect(res.headers["access-control-allow-origin"]).toBe("*");
      expect(res.headers["access-control-allow-header"]).toBe("*");
    });

    test("should parse urlencoded request bodies", async () => {
      const app = require("../app");
      const res = await request(app)
        .post("/api/v1/user/login")
        .type("form")
        .send({ email: "invalid-email", password: "123" });

      // Verifies that body was parsed and reached validation
      expect(res.status).toBe(400);
    });
  });

  describe("Production Environment Static File Serving", () => {
    test("should configure static files and serve frontend index.html for client routes in production", async () => {
      process.env.NODE_ENV = "production";

      let prodApp;
      jest.isolateModules(() => {
        const exp = require("express");
        jest.spyOn(exp.application, "listen").mockImplementation(() => ({ close: (cb) => cb && cb() }));
        const mg = require("mongoose");
        jest.spyOn(mg, "connect").mockImplementation(() => Promise.resolve());

        prodApp = require("../app");
      });

      const res = await request(prodApp).get("/non-existent-client-route");

      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toMatch(/text\/html/);
      expect(res.text).toMatch(/<!doctype html>/i);
    });
  });

  describe("Server Port and Listen Initialization", () => {
    test("should invoke app.listen with default port 5000 when NODE_ENV is development", () => {
      process.env.NODE_ENV = "development";
      delete process.env.PORT;

      let capturedPort = null;
      let callbackExecuted = false;

      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

      jest.isolateModules(() => {
        const exp = require("express");
        jest.spyOn(exp.application, "listen").mockImplementation(function (port, cb) {
          capturedPort = port;
          if (typeof cb === "function") {
            cb();
            callbackExecuted = true;
          }
          return { close: (done) => done && done() };
        });

        const mg = require("mongoose");
        jest.spyOn(mg, "connect").mockImplementation(() => Promise.resolve());

        require("../app");
      });

      expect(capturedPort).toBe(5000);
      expect(callbackExecuted).toBe(true);
      expect(logSpy).toHaveBeenCalledWith("Server running on port 5000");

      logSpy.mockRestore();
    });

    test("should invoke app.listen with custom PORT from environment", () => {
      process.env.NODE_ENV = "development";
      process.env.PORT = "8080";

      let capturedPort = null;
      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

      jest.isolateModules(() => {
        const exp = require("express");
        jest.spyOn(exp.application, "listen").mockImplementation(function (port, cb) {
          capturedPort = port;
          if (typeof cb === "function") cb();
          return { close: (done) => done && done() };
        });

        const mg = require("mongoose");
        jest.spyOn(mg, "connect").mockImplementation(() => Promise.resolve());

        require("../app");
      });

      expect(capturedPort).toBe("8080");
      expect(logSpy).toHaveBeenCalledWith("Server running on port 8080");

      logSpy.mockRestore();
    });
  });
});
