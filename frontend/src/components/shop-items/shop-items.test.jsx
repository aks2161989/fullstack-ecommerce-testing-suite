import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import ShopItem from "./shop-items.component";
import { SHOP_ITEMS_CASES } from "../../test-utils/testData";

describe("ShopItem Component (Data-Driven)", () => {
  test.each(SHOP_ITEMS_CASES)(
    "handles category catalog rendering for $scenario",
    ({ category, catParam, expectedItemNames, expectedItemCount }) => {
      const store = createStore(
        (state = { products: { product: category ? [category] : [] } }) => state,
        applyMiddleware(thunk)
      );

      const mockMatch = {
        params: catParam ? { catId: catParam } : {},
      };

      const { getAllByRole, queryAllByRole, getByText } = render(
        <Provider store={store}>
          <ShopItem match={mockMatch} />
        </Provider>
      );

      expectedItemNames.forEach((name) => {
        expect(getByText(name)).toBeInTheDocument();
      });

      if (expectedItemCount > 0) {
        expect(getAllByRole("article")).toHaveLength(expectedItemCount);
      } else {
        expect(queryAllByRole("article")).toHaveLength(0);
      }
    }
  );
});
