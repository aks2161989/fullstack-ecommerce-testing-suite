import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import SignInAndSignUpPage from "./sign-in-and-sign-up.component";
import { SIGN_IN_AND_SIGN_UP_PAGE_CASES } from "../../test-utils/testData";

describe("SignInAndSignUpPage Component (Data-Driven)", () => {
  test.each(SIGN_IN_AND_SIGN_UP_PAGE_CASES)(
    "renders sign in and sign up sections side-by-side",
    ({ expectedRegions }) => {
      const store = createStore(() => ({}), applyMiddleware(thunk));

      const { getByRole } = render(
        <Provider store={store}>
          <MemoryRouter>
            <SignInAndSignUpPage />
          </MemoryRouter>
        </Provider>
      );

      expectedRegions.forEach((regionName) => {
        expect(getByRole("region", { name: regionName })).toBeInTheDocument();
      });
    }
  );
});
