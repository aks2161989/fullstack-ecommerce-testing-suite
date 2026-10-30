import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./homePage";
import sections from "../../components/directory/directory-data";

describe("HomePage Page", () => {
  test("renders home page with directory sections", () => {
    const { getByRole } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    sections.forEach((section) => {
      expect(
        getByRole("button", { name: new RegExp(`^${section.title}$`, "i") })
      ).toBeInTheDocument();
    });
  });
});
