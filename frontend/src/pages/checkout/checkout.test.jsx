import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import CheckoutPage from "./checkout.component";
import { CHECKOUT_PAGE_CASES } from "../../test-utils/testData";

describe("CheckoutPage Component (Data-Driven)", () => {
  const createMockStore = (cartItems = []) => {
    return createStore(() => ({
      cart: { cartItems },
    }));
  };

  test.each(CHECKOUT_PAGE_CASES)(
    "renders table headers, items, and total calculation for $scenario",
    ({ cartItems, expectedTotalText, expectedItemNames }) => {
      const store = createMockStore(cartItems);

      const { getByText, getByRole } = render(
        <Provider store={store}>
          <CheckoutPage />
        </Provider>
      );

      expect(getByRole("region", { name: "Checkout" })).toBeInTheDocument();
      expect(getByText("Product")).toBeInTheDocument();
      expect(getByText("Quantity")).toBeInTheDocument();
      expect(getByText("Price")).toBeInTheDocument();

      expectedItemNames.forEach((name) => {
        expect(getByText(name)).toBeInTheDocument();
      });

      expect(getByText(expectedTotalText)).toBeInTheDocument();
    }
  );
});
