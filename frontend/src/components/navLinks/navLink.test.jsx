import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CustomNavLink from "./navLink.component";
import { NAV_LINK_CASES } from "../../test-utils/testData";

describe("CustomNavLink Component (Data-Driven)", () => {
  test.each(NAV_LINK_CASES)(
    "renders link with path and content for $scenario",
    ({ to, text }) => {
      const { getByRole } = render(
        <MemoryRouter>
          <CustomNavLink to={to}>{text}</CustomNavLink>
        </MemoryRouter>
      );

      const link = getByRole("link", { name: text });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", to);
    }
  );
});
