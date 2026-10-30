import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import CategoryItem from "./category.component";
import { CAT_NAMES } from "./cat_data";

describe("CategoryItem Component (Data-Driven)", () => {
  const store = createStore(() => ({}), applyMiddleware(thunk));

  test.each(CAT_NAMES.map((name) => ({ categoryName: name })))(
    "renders link and dispatches category action for $categoryName",
    ({ categoryName }) => {
      let calledCategory = null;

      const { getByRole, getByText } = render(
        <Provider store={store}>
          <MemoryRouter>
            <CategoryItem getProductByCategory={(cat) => { calledCategory = cat; }} />
          </MemoryRouter>
        </Provider>
      );

      expect(getByRole("complementary", { name: "Category Navigation" })).toBeInTheDocument();
      const link = getByText(categoryName);
      expect(link).toBeInTheDocument();
      expect(link.getAttribute("href")).toBe(`/shop/${categoryName}`);

      fireEvent.click(link);
    }
  );
});
