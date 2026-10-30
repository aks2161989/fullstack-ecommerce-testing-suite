const mongoose = require("mongoose");
require("dotenv").config();

const dbURI =
  process.env.DB_CONNECTION ||
  "mongodb://127.0.0.1:27017/ecommerce-shop";

// Connect to MongoDB unless running in test mode without an explicit TEST_DB_CONNECTION
if (process.env.NODE_ENV !== "test" || process.env.TEST_DB_CONNECTION) {
  mongoose
    .connect(process.env.TEST_DB_CONNECTION || dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch((err) => {
      console.warn("MongoDB offline notice:", err.message);
      console.warn("Backend will serve products and auth in fallback mode.");
    });
}

module.exports = mongoose;
