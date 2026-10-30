import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import CheckoutItem from "./checkout-item.component";
import { CHECKOUT_ITEM_CASES } from "../../test-utils/testData";

describe("CheckoutItem Component (Data-Driven)", () => {
  test.each(CHECKOUT_ITEM_CASES)(
    "renders details and controls for $scenario",
    ({ cartItem, expectedPriceText }) => {
      const dispatchedActions = [];
      const store = createStore((state = {}, action) => {
        dispatchedActions.push(action);
        return state;
      });

      const { getByText, getByLabelText, getByAltText } = render(
        <Provider store={store}>
          <CheckoutItem cartItem={cartItem} />
        </Provider>
      );

      expect(getByText(cartItem.name)).toBeInTheDocument();
      expect(getByText(expectedPriceText)).toBeInTheDocument();
      expect(getByAltText(cartItem.name)).toBeInTheDocument();

      const increaseBtn = getByLabelText(`Increase quantity of ${cartItem.name}`);
      const decreaseBtn = getByLabelText(`Decrease quantity of ${cartItem.name}`);
      const removeBtn = getByLabelText(`Remove ${cartItem.name} from cart`);

      fireEvent.click(increaseBtn);
      fireEvent.click(decreaseBtn);
      fireEvent.click(removeBtn);

      expect(dispatchedActions.some((a) => a.type === "ADD_ITEM")).toBe(true);
      expect(dispatchedActions.some((a) => a.type === "REMOVE_ITEM")).toBe(true);
      expect(dispatchedActions.some((a) => a.type === "CLEAR_ITEM_FROM_CART")).toBe(true);
    }
  );
});
