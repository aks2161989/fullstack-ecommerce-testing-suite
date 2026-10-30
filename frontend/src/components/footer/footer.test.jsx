import React from "react";
import { render } from "@testing-library/react";
import Footer from "./footer.component";
import { FOOTER_CASES } from "../../test-utils/testData";

describe("Footer Component (Data-Driven)", () => {
  test.each(FOOTER_CASES)(
    "renders copyright info and author link",
    ({ expectedCopyrightPattern, authorName, authorUrl }) => {
      const { getByRole, getByText } = render(<Footer />);

      expect(getByText(expectedCopyrightPattern)).toBeInTheDocument();
      const link = getByRole("link", { name: authorName });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", authorUrl);
    }
  );
});
