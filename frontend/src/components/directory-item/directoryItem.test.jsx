import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DirectoryItem from "./directoryItem.component";
import { DIRECTORY_ITEM_CASES } from "../../test-utils/testData";

describe("DirectoryItem Component (Data-Driven)", () => {
  test.each(DIRECTORY_ITEM_CASES)(
    "renders title button and navigates for $scenario",
    ({ item, expectedButtonName }) => {
      const { getByRole } = render(
        <MemoryRouter>
          <DirectoryItem item={item} />
        </MemoryRouter>
      );

      const button = getByRole("button", {
        name: new RegExp(`^${expectedButtonName}$`, "i"),
      });
      expect(button).toBeInTheDocument();
      fireEvent.click(button);
    }
  );
});
