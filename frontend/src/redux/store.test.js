import store from "./store";

describe("Redux Store", () => {
  test("creates store with rootReducer and middleware", () => {
    expect(store).toBeDefined();
    expect(typeof store.getState).toBe("function");
    expect(typeof store.dispatch).toBe("function");

    const state = store.getState();
    expect(state).toHaveProperty("cart");
    expect(state).toHaveProperty("products");
    expect(state).toHaveProperty("user");
  });
});
