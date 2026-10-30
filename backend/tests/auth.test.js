const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const app = require("../app");
const User = require("../model/User");
const authRoute = require("../routes/auth");
const {
  TEST_CREDENTIALS,
  BASE_TEST_USERS,
  INVALID_REGISTRATION_CASES,
  INVALID_LOGIN_CASES,
  generateUniqueUser,
  resetAuthState,
  registerUser,
  loginUser,
} = require("./helpers/testHelpers");

describe("Authentication Routes API Integration Tests (/api/v1/user) (Data-Driven)", () => {
  beforeEach(() => {
    resetAuthState();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("In-Memory State & Router Helpers", () => {
    const SECRET_KEY_CASES = [
      {
        scenario: "custom secret key provided via environment",
        envValue: "custom_env_secret_key",
        shouldSet: true,
      },
      {
        scenario: "default secret key fallback when environment is undefined",
        envValue: undefined,
        shouldSet: false,
      },
    ];

    test.each(SECRET_KEY_CASES)(
      "should load auth routes properly when $scenario",
      ({ envValue, shouldSet }) => {
        const origSecret = process.env.SECRET_KEY;
        try {
          if (shouldSet) {
            process.env.SECRET_KEY = envValue;
          } else {
            delete process.env.SECRET_KEY;
          }
          jest.isolateModules(() => {
            jest.resetModules();
            require("../routes/auth");
          });
        } finally {
          if (origSecret) {
            process.env.SECRET_KEY = origSecret;
          } else {
            delete process.env.SECRET_KEY;
          }
        }
      }
    );

    test("should retrieve and reset in-memory users state cleanly", () => {
      expect(Array.isArray(authRoute._getInMemoryUsers())).toBe(true);
      const testUser = generateUniqueUser("temp");
      authRoute._getInMemoryUsers().push(testUser);
      expect(authRoute._getInMemoryUsers().length).toBeGreaterThan(0);

      authRoute._resetInMemoryUsers();
      expect(authRoute._getInMemoryUsers().length).toBe(0);
    });
  });

  describe("POST /api/v1/user/register (Fallback / In-Memory Mode)", () => {
    const VALID_REGISTRATION_PREFIXES = ["customer", "merchant", "subscriber"];

    test.each(VALID_REGISTRATION_PREFIXES)(
      "should successfully register a valid new '%s' user",
      async (prefix) => {
        const newUser = generateUniqueUser(prefix);
        const res = await registerUser(app, newUser);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("user");
        expect(typeof res.body.user).toBe("string");
        expect(res.body.user.length).toBeGreaterThan(0);
      }
    );

    test("should reject duplicate registration with the same email", async () => {
      const user = generateUniqueUser("dup");

      const firstRes = await registerUser(app, user);
      expect(firstRes.status).toBe(200);

      const secondRes = await registerUser(app, user);
      expect(secondRes.status).toBe(400);
      expect(secondRes.text).toContain("user exist");
    });

    test.each(INVALID_REGISTRATION_CASES)(
      "should return $expectedStatus when $description",
      async ({ payload, expectedStatus }) => {
        const res = await registerUser(app, payload);
        expect(res.status).toBe(expectedStatus);
        expect(typeof res.text).toBe("string");
        expect(res.text.length).toBeGreaterThan(0);
      }
    );
  });

  describe("POST /api/v1/user/login (Fallback / In-Memory Mode)", () => {
    test("should successfully login with valid credentials and return JWT token", async () => {
      const user = generateUniqueUser("login");

      await registerUser(app, user);

      const res = await loginUser(app, {
        email: user.email,
        password: user.password,
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("user");

      expect(typeof res.body.token).toBe("string");
      expect(res.headers["auth-token"]).toBe(res.body.token);

      expect(res.body.user).toHaveProperty("_id");
      expect(res.body.user).toHaveProperty("email", user.email);
      expect(res.body.user).toHaveProperty("name", user.name);
      expect(res.body.user).not.toHaveProperty("password");
    });

    test("should reject login when password is incorrect", async () => {
      const user = generateUniqueUser("wrongpass");

      await registerUser(app, user);

      const res = await loginUser(app, {
        email: user.email,
        password: TEST_CREDENTIALS.wrongPassword,
      });

      expect(res.status).toBe(400);
      expect(res.text).toContain("email or password wrong");
    });

    test.each(INVALID_LOGIN_CASES)(
      "should reject login for $description",
      async ({ credentials, expectedStatus, expectedBody }) => {
        const res = await loginUser(app, credentials);
        expect(res.status).toBe(expectedStatus);
        if (expectedBody) {
          expect(res.body).toEqual(expectedBody);
        }
      }
    );
  });

  describe("MongoDB Connected Mode (/register and /login)", () => {
    beforeEach(() => {
      mongoose.connection.readyState = 1;
    });

    afterEach(() => {
      mongoose.connection.readyState = 0;
    });

    test("should reject registration when user already exists in MongoDB", async () => {
      const user = generateUniqueUser("dbexist");
      jest.spyOn(User, "findOne").mockResolvedValueOnce({ _id: "db_id_1", email: user.email });

      const res = await registerUser(app, user);
      expect(res.status).toBe(400);
      expect(res.text).toContain("user exist");
    });

    test("should successfully save user to MongoDB when registering new user", async () => {
      const user = generateUniqueUser("dbsave");
      jest.spyOn(User, "findOne").mockResolvedValueOnce(null);
      jest.spyOn(User.prototype, "save").mockResolvedValueOnce({ _id: "mocked_mongo_id_789" });

      const res = await registerUser(app, user);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("user");
    });

    test("should catch MongoDB error during registration and fall back to in-memory registration", async () => {
      const user = generateUniqueUser("dberr_reg");
      jest.spyOn(User, "findOne").mockRejectedValueOnce(new Error("Mongo network error"));

      const res = await registerUser(app, user);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("user");
      expect(String(res.body.user)).toMatch(/^user_/);
    });

    test("should successfully login with user found in MongoDB", async () => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(BASE_TEST_USERS.dbSeedUser.password, salt);

      const dbUser = {
        _id: BASE_TEST_USERS.dbSeedUser._id,
        name: BASE_TEST_USERS.dbSeedUser.name,
        email: BASE_TEST_USERS.dbSeedUser.email,
        password: hashedPassword,
      };

      jest.spyOn(User, "findOne").mockResolvedValueOnce(dbUser);

      const res = await loginUser(app, {
        email: dbUser.email,
        password: BASE_TEST_USERS.dbSeedUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toEqual({
        _id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
      });
      expect(res.headers["auth-token"]).toBe(res.body.token);
    });

    test("should catch MongoDB error during login and fall back to in-memory login check", async () => {
      const offlineUser = generateUniqueUser("offline");
      jest.spyOn(User, "findOne").mockRejectedValueOnce(new Error("Mongo connection drop"));

      const res = await loginUser(app, {
        email: offlineUser.email,
        password: offlineUser.password,
      });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ msg: "user does not exist" });
    });
  });
});
