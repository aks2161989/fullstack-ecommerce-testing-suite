import rootReducer from "./root-reducer";
import { ROOT_REDUCER_CASES } from "../test-utils/testData";

describe("Root Reducer (Data-Driven)", () => {
  test.each(ROOT_REDUCER_CASES)(
    "initializes with initial states for products, cart, and user",
    ({ action, expectedKeys, expectedCartInitial, expectedUserInitial }) => {
      const initialState = rootReducer(undefined, action);

      expectedKeys.forEach((key) => {
        expect(initialState).toHaveProperty(key);
      });

      expect(initialState.cart).toEqual(expectedCartInitial);
      expect(initialState.user).toEqual(expectedUserInitial);
    }
  );
});
