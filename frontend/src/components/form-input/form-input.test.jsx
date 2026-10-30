import React from "react";
import { render, fireEvent } from "@testing-library/react";
import FormInput from "./form-input.component";
import { FORM_INPUT_CASES } from "../../test-utils/testData";

describe("FormInput Component (Data-Driven)", () => {
  describe("Input Configuration and Label Shrinking", () => {
    test.each(FORM_INPUT_CASES)(
      "should handle $scenario",
      ({ props, hasLabel, expectedLabelText, shouldShrink, expectedId }) => {
        const { container, getByText } = render(
          <FormInput {...props} onChange={() => {}} />
        );

        const input = container.querySelector("input");
        expect(input).toBeInTheDocument();

        if (expectedId) {
          expect(input.id).toBe(expectedId);
        }

        if (hasLabel) {
          const label = getByText(expectedLabelText);
          expect(label).toBeInTheDocument();
          if (shouldShrink) {
            expect(label.className).toContain("shrink");
          } else {
            expect(label.className).not.toContain("shrink");
          }
        } else {
          expect(container.querySelector("label")).toBeNull();
        }
      }
    );
  });

  const CHANGE_CASES = [
    { label: "Display Name", name: "displayName", inputValue: "New Name" },
    { label: "Email Address", name: "email", inputValue: "test@example.com" },
  ];

  test.each(CHANGE_CASES)(
    "triggers handleChange callback on text entry for $label",
    ({ label, name, inputValue }) => {
      const handleChange = jest.fn();
      const { getByLabelText } = render(
        <FormInput label={label} name={name} handleChange={handleChange} />
      );

      const input = getByLabelText(label);
      fireEvent.change(input, { target: { value: inputValue } });
      expect(handleChange).toHaveBeenCalledTimes(1);
    }
  );
});
