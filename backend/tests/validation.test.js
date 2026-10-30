const { registerValidation, loginValidation } = require("../validation");

describe("Validation Utility Unit Tests", () => {
  describe("registerValidation", () => {
    test("should pass with valid registration payload", () => {
      const validPayload = {
        name: "Test User",
        email: "test.user@example.com",
        password: "Password123!",
      };
      const { error } = registerValidation(validPayload);
      expect(error).toBeUndefined();
    });

    const invalidRegistrationCases = [
      {
        scenario: "missing name",
        payload: { email: "test@example.com", password: "Password123!" },
        expectedErrorPattern: /name/i,
      },
      {
        scenario: "name shorter than 6 characters",
        payload: { name: "Alex", email: "test@example.com", password: "Password123!" },
        expectedErrorPattern: /length.*at least 6/i,
      },
      {
        scenario: "missing email",
        payload: { name: "Test User", password: "Password123!" },
        expectedErrorPattern: /email/i,
      },
      {
        scenario: "invalid email format",
        payload: { name: "Test User", email: "not-an-email", password: "Password123!" },
        expectedErrorPattern: /must be a valid email/i,
      },
      {
        scenario: "missing password",
        payload: { name: "Test User", email: "test@example.com" },
        expectedErrorPattern: /password/i,
      },
      {
        scenario: "password shorter than 6 characters",
        payload: { name: "Test User", email: "test@example.com", password: "123" },
        expectedErrorPattern: /length.*at least 6/i,
      },
    ];

    test.each(invalidRegistrationCases)(
      "should fail when $scenario",
      ({ payload, expectedErrorPattern }) => {
        const { error } = registerValidation(payload);
        expect(error).toBeDefined();
        expect(error.details[0].message).toMatch(expectedErrorPattern);
      }
    );
  });

  describe("loginValidation", () => {
    test("should pass with valid login payload", () => {
      const validPayload = {
        email: "test.user@example.com",
        password: "Password123!",
      };
      const { error } = loginValidation(validPayload);
      expect(error).toBeUndefined();
    });

    const invalidLoginCases = [
      {
        scenario: "missing email",
        payload: { password: "Password123!" },
        expectedErrorPattern: /email/i,
      },
      {
        scenario: "invalid email format",
        payload: { email: "plainaddress", password: "Password123!" },
        expectedErrorPattern: /must be a valid email/i,
      },
      {
        scenario: "missing password",
        payload: { email: "test@example.com" },
        expectedErrorPattern: /password/i,
      },
      {
        scenario: "password shorter than 6 characters",
        payload: { email: "test@example.com", password: "abc" },
        expectedErrorPattern: /length.*at least 6/i,
      },
    ];

    test.each(invalidLoginCases)(
      "should fail when $scenario",
      ({ payload, expectedErrorPattern }) => {
        const { error } = loginValidation(payload);
        expect(error).toBeDefined();
        expect(error.details[0].message).toMatch(expectedErrorPattern);
      }
    );
  });
});
