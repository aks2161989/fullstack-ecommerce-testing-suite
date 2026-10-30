import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import SignUp from "./sign-up.component";
import { SIGN_UP_FORM_CASES } from "../../test-utils/testData";

describe("SignUp Component (Data-Driven)", () => {
  test.each(SIGN_UP_FORM_CASES)(
    "handles registration input flow for $scenario",
    ({ formData, shouldAlert }) => {
      const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
      let registeredData = null;
      const store = createStore(() => ({}), applyMiddleware(thunk));

      const { getByLabelText, getByRole } = render(
        <Provider store={store}>
          <SignUp
            registerUser={(data) => {
              registeredData = data;
            }}
          />
        </Provider>
      );

      const nameInput = getByLabelText("Display Name");
      const emailInput = getByLabelText("Email");
      const passwordInput = getByLabelText("Password");
      const confirmInput = getByLabelText("Confirm Password");
      const submitBtn = getByRole("button", { name: "SIGN UP" });

      fireEvent.change(nameInput, {
        target: { name: "displayName", value: formData.displayName },
      });
      fireEvent.change(emailInput, {
        target: { name: "email", value: formData.email },
      });
      fireEvent.change(passwordInput, {
        target: { name: "password", value: formData.password },
      });
      fireEvent.change(confirmInput, {
        target: { name: "confirmPassword", value: formData.confirmPassword },
      });

      fireEvent.click(submitBtn);

      if (shouldAlert) {
        expect(alertSpy).toHaveBeenCalled();
      }

      alertSpy.mockRestore();
    }
  );
});
