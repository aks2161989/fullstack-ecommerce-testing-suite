import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import ShopPage from "./shopPage";
import { SHOP_PAGE_CASES } from "../../test-utils/testData";

describe("ShopPage Component (Data-Driven)", () => {
  test.each(SHOP_PAGE_CASES)(
    "renders Category sidebar and routes to ShopItem for $scenario",
    ({ category, initialPath, expectedProductName }) => {
      const store = createStore(
        (state = {
          products: {
            product: [category],
          },
        }) => state,
        applyMiddleware(thunk)
      );

      const { getByRole, getByText } = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[initialPath]}>
            <Route path="/shop" component={ShopPage} />
          </MemoryRouter>
        </Provider>
      );

      expect(getByRole("complementary", { name: "Category Navigation" })).toBeInTheDocument();
      expect(getByText(expectedProductName)).toBeInTheDocument();
    }
  );
});
