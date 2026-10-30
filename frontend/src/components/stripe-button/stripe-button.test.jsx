import React from "react";
import { render, fireEvent } from "@testing-library/react";
import StripeCheckoutButton from "./stripe-button.component";
import { STRIPE_BUTTON_CASES } from "../../test-utils/testData";

describe("StripeCheckoutButton Component (Data-Driven)", () => {
  test.each(STRIPE_BUTTON_CASES)(
    "renders Pay Now button and triggers payment alert for $scenario",
    ({ price, expectedAlertText, expectedButtonLabel }) => {
      const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

      const { getByRole } = render(<StripeCheckoutButton price={price} />);
      const button = getByRole("button", { name: expectedButtonLabel });

      expect(button).toBeInTheDocument();
      fireEvent.click(button);

      expect(alertSpy).toHaveBeenCalledWith(expectedAlertText);
      alertSpy.mockRestore();
    }
  );
});
