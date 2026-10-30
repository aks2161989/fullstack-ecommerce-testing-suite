import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import MainNavigation from "./mainNavigation.component";
import { MAIN_NAVIGATION_CASES } from "../../test-utils/testData";

describe("MainNavigation Component (Data-Driven)", () => {
  const createMockStore = (currentUser = null) => {
    return createStore(
      (state = { user: { currentUser }, cart: { cartItems: [] } }, action) => {
        if (action.type === "SET_CURRENT_USER") {
          return { ...state, user: { currentUser: action.payload } };
        }
        return state;
      },
      applyMiddleware(thunk)
    );
  };

  test.each(MAIN_NAVIGATION_CASES)(
    "renders navigation correctly for $scenario",
    ({ currentUser, expectedVisibleLinks, expectedVisibleButton, expectedHiddenText }) => {
      const store = createMockStore(currentUser);

      const { getByRole, getByLabelText, queryByText, queryByRole } = render(
        <Provider store={store}>
          <MemoryRouter>
            <MainNavigation />
          </MemoryRouter>
        </Provider>
      );

      expect(getByLabelText("Crown Clothing Home")).toBeInTheDocument();

      expectedVisibleLinks.forEach((linkName) => {
        expect(getByRole("link", { name: linkName })).toBeInTheDocument();
      });

      if (expectedHiddenText) {
        expect(queryByText(expectedHiddenText)).toBeNull();
      }

      if (expectedVisibleButton) {
        const btn = getByRole("button", { name: expectedVisibleButton });
        expect(btn).toBeInTheDocument();
        fireEvent.click(btn);
        expect(store.getState().user.currentUser).toBeNull();
      }

      // Dropdown toggle functionality
      const cartBtn = getByRole("button", { name: /shopping cart/i });
      expect(queryByRole("dialog", { name: "Shopping Cart Dropdown" })).toBeNull();

      fireEvent.click(cartBtn);
      expect(getByRole("dialog", { name: "Shopping Cart Dropdown" })).toBeInTheDocument();

      fireEvent.click(cartBtn);
      expect(queryByRole("dialog", { name: "Shopping Cart Dropdown" })).toBeNull();
    }
  );
});
