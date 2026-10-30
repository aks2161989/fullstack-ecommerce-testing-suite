import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import ShopItemCard from "./shopItemCard.component";
import { SHOP_ITEM_CARD_CASES } from "../../test-utils/testData";

describe("ShopItemCard Component (Data-Driven)", () => {
  test.each(SHOP_ITEM_CARD_CASES)(
    "renders and dispatches add to cart for $scenario",
    ({ item }) => {
      let capturedAction = null;
      const store = createStore((state = {}, action) => {
        capturedAction = action;
        return state;
      });

      const { getByText, getByRole } = render(
        <Provider store={store}>
          <ShopItemCard item={item} />
        </Provider>
      );

      expect(getByText(item.name)).toBeInTheDocument();
      expect(getByText(String(item.price))).toBeInTheDocument();

      const addBtn = getByRole("button", { name: /add to cart/i });
      fireEvent.click(addBtn);

      expect(capturedAction).toEqual({
        type: "ADD_ITEM",
        payload: item,
      });
    }
  );
});
