import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import PrivateRoute from "./Private-route";
import { PRIVATE_ROUTE_AUTH_CASES } from "./test-utils/testData";

describe("PrivateRoute Component (Data-Driven)", () => {
  const SecretComponent = () => <div>Secret Protected Content</div>;
  const SignInComponent = () => <div>Sign In Page</div>;

  const renderWithState = (initialUser, initialPath = "/protected") => {
    const rootReducer = (state = { user: { currentUser: initialUser } }) => state;
    const store = createStore(rootReducer);

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialPath]}>
          <PrivateRoute path="/protected" component={SecretComponent} />
          <Route path="/signin" component={SignInComponent} />
        </MemoryRouter>
      </Provider>
    );
  };

  test.each(PRIVATE_ROUTE_AUTH_CASES)(
    "should handle route guarding when $scenario",
    ({ authenticatedUser, expectAccess }) => {
      const { getByText, queryByText } = renderWithState(authenticatedUser);

      if (expectAccess) {
        expect(getByText("Secret Protected Content")).toBeInTheDocument();
        expect(queryByText("Sign In Page")).toBeNull();
      } else {
        expect(getByText("Sign In Page")).toBeInTheDocument();
        expect(queryByText("Secret Protected Content")).toBeNull();
      }
    }
  );
});
