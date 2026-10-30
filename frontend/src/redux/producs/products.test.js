import productReducer from "./products.reducer";
import { productActionTypes } from "./products.actionTypes";
import { PRODUCT_REDUCER_CASES } from "../../test-utils/testData";

describe("Products Redux Reducer (Data-Driven)", () => {
  const initialState = {
    product: [],
  };

  test("should return initial state for unknown action", () => {
    expect(productReducer(undefined, { type: "UNKNOWN_ACTION_TEST" })).toEqual(initialState);
  });

  describe("GET_PRODUCT action handling", () => {
    test.each(PRODUCT_REDUCER_CASES)(
      "should handle $scenario",
      ({ initialState: stateBefore, payload, expectedLength }) => {
        const action = {
          type: productActionTypes.GET_PRODUCT,
          payload,
        };

        const state = productReducer(stateBefore, action);
        expect(state.product).toEqual(payload);
        expect(state.product).toHaveLength(expectedLength);
      }
    );
  });
});
