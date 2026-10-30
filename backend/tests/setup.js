const mongoose = require("mongoose");

// Ensure test environment
process.env.NODE_ENV = "test";

// Cleanly close mongoose connection after all tests if connected
afterAll(async () => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  } catch (err) {
    // Ignore teardown errors
  }
});
