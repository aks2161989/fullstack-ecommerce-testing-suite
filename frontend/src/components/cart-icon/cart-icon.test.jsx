import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import CartIcon from "./cart-icon.component";
import { MOCK_CART_ITEMS } from "../../test-utils/testData";

describe("CartIcon Component", () => {
  const createMockStore = (cartItems = []) => {
    return createStore(() => ({
      cart: { cartItems },
    }));
  };

  test.each([
    { name: "empty cart", items: [], expectedCount: "0" },
    {
      name: "single item with qty 1",
      items: [{ ...MOCK_CART_ITEMS.hat, quantity: 1 }],
      expectedCount: "1",
    },
    {
      name: "multiple items with varied quantities",
      items: [
        { ...MOCK_CART_ITEMS.hat, quantity: 2 },
        { ...MOCK_CART_ITEMS.beanie, quantity: 3 },
      ],
      expectedCount: "5",
    },
  ])("displays correct item count for $name", ({ items, expectedCount }) => {
    const store = createMockStore(items);
    const mockToggle = jest.fn();

    const { getByRole, getByText } = render(
      <Provider store={store}>
        <CartIcon toggleCartHidden={mockToggle} />
      </Provider>
    );

    const button = getByRole("button", { name: /shopping cart/i });
    expect(button).toBeInTheDocument();
    expect(getByText(expectedCount)).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
