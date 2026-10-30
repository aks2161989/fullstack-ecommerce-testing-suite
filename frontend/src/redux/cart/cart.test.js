import CartActionTypes from "./cart.types";
import cartReducer from "./cart.reducer";
import {
  toggleCartHidden,
  addItem,
  removeItem,
  clearItemFromCart,
} from "./cart.action";
import { addItemToCart, removeItemToCart } from "./cart.utils";
import { selectCartItemsCount, selectCartTotal } from "./cart.selectors";
import {
  MOCK_CART_ITEMS,
  CART_UTILS_ADD_CASES,
  CART_UTILS_REMOVE_CASES,
  CART_SELECTOR_COUNT_CASES,
  CART_SELECTOR_TOTAL_PRICE_CASES,
} from "../../test-utils/testData";

describe("Cart Redux State, Actions, Selectors & Utils (Data-Driven)", () => {
  describe("Cart Utils: addItemToCart", () => {
    test.each(CART_UTILS_ADD_CASES)(
      "should handle $scenario",
      ({ initialItems, itemToAdd, expectedCount, expectedItems }) => {
        const result = addItemToCart(initialItems, itemToAdd);
        expect(result).toHaveLength(expectedCount);
        expect(result).toEqual(expectedItems);
      }
    );
  });

  describe("Cart Utils: removeItemToCart", () => {
    test.each(CART_UTILS_REMOVE_CASES)(
      "should handle $scenario",
      ({ initialItems, itemToRemove, expectedCount, expectedQuantity, expectedRemainingIds }) => {
        const result = removeItemToCart(initialItems, itemToRemove);
        expect(result).toHaveLength(expectedCount);

        if (expectedQuantity !== undefined) {
          const updatedItem = result.find((item) => item._id === itemToRemove._id);
          expect(updatedItem.quantity).toBe(expectedQuantity);
        }

        if (expectedRemainingIds !== undefined) {
          const remainingIds = result.map((item) => item._id);
          expect(remainingIds).toEqual(expectedRemainingIds);
        }
      }
    );
  });

  describe("Cart Reducer Actions", () => {
    const initialState = {
      hidden: true,
      cartItems: [],
    };

    const REDUCER_ACTION_CASES = [
      {
        scenario: "return default initial state when action is unrecognized",
        initial: undefined,
        action: { type: "UNKNOWN_ACTION_TEST" },
        expectedState: initialState,
      },
      {
        scenario: "toggle hidden flag from true to false",
        initial: initialState,
        action: toggleCartHidden(),
        expectedState: { ...initialState, hidden: false },
      },
      {
        scenario: "toggle hidden flag from false to true",
        initial: { ...initialState, hidden: false },
        action: toggleCartHidden(),
        expectedState: { ...initialState, hidden: true },
      },
      {
        scenario: "add item to cart via ADD_ITEM",
        initial: initialState,
        action: addItem(MOCK_CART_ITEMS.hat),
        expectedState: {
          ...initialState,
          cartItems: [{ ...MOCK_CART_ITEMS.hat, quantity: 1 }],
        },
      },
      {
        scenario: "decrement item quantity via REMOVE_ITEM",
        initial: {
          ...initialState,
          cartItems: [{ ...MOCK_CART_ITEMS.hat, quantity: 2 }],
        },
        action: removeItem(MOCK_CART_ITEMS.hat),
        expectedState: {
          ...initialState,
          cartItems: [{ ...MOCK_CART_ITEMS.hat, quantity: 1 }],
        },
      },
      {
        scenario: "clear line item entirely via CLEAR_ITEM_FROM_CART",
        initial: {
          ...initialState,
          cartItems: [
            { ...MOCK_CART_ITEMS.hat, quantity: 4 },
            { ...MOCK_CART_ITEMS.beanie, quantity: 1 },
          ],
        },
        action: clearItemFromCart(MOCK_CART_ITEMS.hat),
        expectedState: {
          ...initialState,
          cartItems: [{ ...MOCK_CART_ITEMS.beanie, quantity: 1 }],
        },
      },
    ];

    test.each(REDUCER_ACTION_CASES)(
      "should $scenario",
      ({ initial, action, expectedState }) => {
        const state = cartReducer(initial, action);
        expect(state).toEqual(expectedState);
      }
    );
  });

  describe("Cart Selectors", () => {
    describe("selectCartItemsCount", () => {
      test.each(CART_SELECTOR_COUNT_CASES)(
        "should calculate $scenario correctly",
        ({ cartItems, expectedTotalItems }) => {
          expect(selectCartItemsCount(cartItems)).toBe(expectedTotalItems);
        }
      );
    });

    describe("selectCartTotal", () => {
      test.each(CART_SELECTOR_TOTAL_PRICE_CASES)(
        "should calculate $scenario correctly",
        ({ cartItems, expectedPrice }) => {
          expect(selectCartTotal(cartItems)).toBe(expectedPrice);
        }
      );
    });
  });
});
