/**
 * Centralized Data-Driven Test Fixtures for Backend Tests
 */

/**
 * Standard test user credentials for backend authentication & account testing
 */
const TEST_CREDENTIALS = {
  defaultPassword: "SecurePassword123!",
  alternatePassword: "DifferentPassword456!",
  invalidPassword: "123",
  wrongPassword: "IncorrectPassword999!",
};

const BASE_TEST_USERS = {
  standardUser: {
    name: "John Doe",
    email: "john.doe@example.com",
    password: TEST_CREDENTIALS.defaultPassword,
  },
  adminUser: {
    name: "Jane Admin",
    email: "jane.admin@example.com",
    password: TEST_CREDENTIALS.defaultPassword,
  },
  dbSeedUser: {
    _id: "mongo_seeded_user_001",
    name: "Mongo User",
    email: "mongo.user@example.com",
    password: TEST_CREDENTIALS.defaultPassword,
  },
};

/**
 * Data-driven registration validation test cases
 */
const INVALID_REGISTRATION_CASES = [
  {
    description: "missing name",
    payload: {
      email: "missing.name@example.com",
      password: TEST_CREDENTIALS.defaultPassword,
    },
    expectedStatus: 400,
    expectedErrorSnippet: "name",
  },
  {
    description: "short name (less than 6 chars)",
    payload: {
      name: "Bob",
      email: "short.name@example.com",
      password: TEST_CREDENTIALS.defaultPassword,
    },
    expectedStatus: 400,
    expectedErrorSnippet: "name",
  },
  {
    description: "invalid email format",
    payload: {
      name: "Robert Taylor",
      email: "invalid-email-format",
      password: TEST_CREDENTIALS.defaultPassword,
    },
    expectedStatus: 400,
    expectedErrorSnippet: "email",
  },
  {
    description: "short password (less than 6 chars)",
    payload: {
      name: "Robert Taylor",
      email: "short.pass@example.com",
      password: TEST_CREDENTIALS.invalidPassword,
    },
    expectedStatus: 400,
    expectedErrorSnippet: "password",
  },
];

/**
 * Data-driven login failure test cases
 */
const INVALID_LOGIN_CASES = [
  {
    description: "unregistered email address",
    credentials: {
      email: "unregistered.account@example.com",
      password: TEST_CREDENTIALS.defaultPassword,
    },
    expectedStatus: 400,
    expectedBody: { msg: "user does not exist" },
  },
  {
    description: "malformed email address",
    credentials: {
      email: "not-an-email-string",
      password: TEST_CREDENTIALS.invalidPassword,
    },
    expectedStatus: 400,
  },
];

/**
 * Factory to generate unique, deterministic test users to guarantee test isolation
 */
const generateUniqueUser = (prefix = "user") => {
  const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  return {
    name: `${prefix} ${uniqueId.substring(0, 6)}`,
    email: `${prefix}_${uniqueId}@example.com`,
    password: TEST_CREDENTIALS.defaultPassword,
  };
};

module.exports = {
  TEST_CREDENTIALS,
  BASE_TEST_USERS,
  INVALID_REGISTRATION_CASES,
  INVALID_LOGIN_CASES,
  generateUniqueUser,
};
