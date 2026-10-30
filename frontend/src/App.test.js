import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./redux/store";
import App, { initializeAuthToken } from "./App";
import { APP_ROOT_CASES } from "./test-utils/testData";

describe("App Root Component (Data-Driven)", () => {
  afterEach(() => {
    localStorage.clear();
  });

  test("renders navigation and brand logo link", () => {
    const { getByRole, getByLabelText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
    expect(getByRole("link", { name: "SHOP" })).toBeInTheDocument();
    expect(getByRole("link", { name: "SIGN/SIGNUP" })).toBeInTheDocument();
    expect(getByLabelText("Crown Clothing Home")).toBeInTheDocument();
  });

  test.each(APP_ROOT_CASES)(
    "loads authentication user state for $scenario",
    ({ token, expectedUser }) => {
      localStorage.setItem("jwtToken", token);

      initializeAuthToken(store);

      expect(store.getState().user.currentUser).toEqual(
        expect.objectContaining(expectedUser)
      );
    }
  );
});
