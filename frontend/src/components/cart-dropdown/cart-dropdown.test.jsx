import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import CartDropdown from "./cart-dropdown.component";
import { CART_DROPDOWN_CASES } from "../../test-utils/testData";

describe("CartDropdown Component (Data-Driven)", () => {
  const createMockStore = (cartItems = []) => {
    return createStore(() => ({
      cart: { cartItems },
    }));
  };

  test.each(CART_DROPDOWN_CASES)(
    "renders correctly for $scenario",
    ({ cartItems, expectEmptyMessage, expectedItemName }) => {
      const store = createMockStore(cartItems);
      const mockToggle = jest.fn();

      const { getByText, getByRole, queryByText } = render(
        <Provider store={store}>
          <MemoryRouter>
            <CartDropdown toggleCart={mockToggle} />
          </MemoryRouter>
        </Provider>
      );

      const checkoutBtn = getByRole("button", { name: /go to checkout/i });
      expect(checkoutBtn).toBeInTheDocument();

      if (expectEmptyMessage) {
        expect(getByText(/your cart is empty/i)).toBeInTheDocument();
      } else {
        expect(queryByText(/your cart is empty/i)).toBeNull();
        expect(getByText(expectedItemName)).toBeInTheDocument();
      }

      fireEvent.click(checkoutBtn);
      expect(mockToggle).toHaveBeenCalledTimes(1);
    }
  );
});
