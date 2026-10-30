import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Directory from "./directory.component";
import sections from "./directory-data";

describe("Directory Component", () => {
  test("renders all directory sections", () => {
    const { getByRole, getByText } = render(
      <MemoryRouter>
        <Directory />
      </MemoryRouter>
    );

    sections.forEach((section) => {
      expect(
        getByRole("button", { name: new RegExp(`^${section.title}$`, "i") })
      ).toBeInTheDocument();
    });
  });
});
