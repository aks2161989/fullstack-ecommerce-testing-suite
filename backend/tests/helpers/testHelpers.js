const request = require("supertest");
const authRoute = require("../../routes/auth");
const {
  TEST_CREDENTIALS,
  BASE_TEST_USERS,
  INVALID_REGISTRATION_CASES,
  INVALID_LOGIN_CASES,
  generateUniqueUser,
} = require("../fixtures/testData");

/**
 * Reset authentication state (in-memory users) before each test run
 */
const resetAuthState = () => {
  if (typeof authRoute._resetInMemoryUsers === "function") {
    authRoute._resetInMemoryUsers();
  }
};

/**
 * Helper to perform registration request
 */
const registerUser = (app, userData) => {
  return request(app).post("/api/v1/user/register").send(userData);
};

/**
 * Helper to perform login request
 */
const loginUser = (app, credentials) => {
  return request(app).post("/api/v1/user/login").send(credentials);
};

module.exports = {
  TEST_CREDENTIALS,
  BASE_TEST_USERS,
  INVALID_REGISTRATION_CASES,
  INVALID_LOGIN_CASES,
  generateUniqueUser,
  resetAuthState,
  registerUser,
  loginUser,
};
