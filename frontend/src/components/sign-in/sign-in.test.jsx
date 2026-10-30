import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import SignIn from "./sign-in.component";
import { SIGN_IN_FORM_CASES } from "../../test-utils/testData";

describe("SignIn Component (Data-Driven)", () => {
  test.each(SIGN_IN_FORM_CASES)(
    "renders form and handles submit for $scenario",
    ({ credentials }) => {
      let loginPayload = null;
      const store = createStore(() => ({}), applyMiddleware(thunk));

      const { getByLabelText, getByRole } = render(
        <Provider store={store}>
          <MemoryRouter>
            <SignIn
              loginUser={(data) => {
                loginPayload = data;
              }}
            />
          </MemoryRouter>
        </Provider>
      );

      const emailInput = getByLabelText("Email");
      const passwordInput = getByLabelText("Password");
      const submitBtn = getByRole("button", { name: "SIGN IN" });

      fireEvent.change(emailInput, {
        target: { name: "email", value: credentials.email },
      });
      fireEvent.change(passwordInput, {
        target: { name: "password", value: credentials.password },
      });

      expect(emailInput.value).toBe(credentials.email);
      expect(passwordInput.value).toBe(credentials.password);

      fireEvent.click(submitBtn);
    }
  );
});
