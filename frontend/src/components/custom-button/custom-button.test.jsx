import React from "react";
import { render, fireEvent } from "@testing-library/react";
import CustomButton from "./custom-button.component";
import { CUSTOM_BUTTON_CASES } from "../../test-utils/testData";

describe("CustomButton Component (Data-Driven)", () => {
  describe("Button Styling Variations", () => {
    test.each(CUSTOM_BUTTON_CASES)(
      "should render $scenario correctly",
      ({ props, expectedClasses, unexpectedClasses }) => {
        const { getByRole } = render(<CustomButton {...props} />);
        const button = getByRole("button", { name: props.children });

        expect(button).toBeInTheDocument();
        expectedClasses.forEach((cls) => {
          expect(button.className).toContain(cls);
        });
        unexpectedClasses.forEach((cls) => {
          expect(button.className).not.toContain(cls);
        });
      }
    );
  });

  test("fires onClick handler when clicked", () => {
    const handleClick = jest.fn();
    const { getByRole } = render(<CustomButton onClick={handleClick}>Action</CustomButton>);
    fireEvent.click(getByRole("button", { name: "Action" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
