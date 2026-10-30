module.exports = {
  mongoURI:
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce-shop",
  secretOrKey: process.env.SECRET_OR_KEY || "development_secret_key",
};
