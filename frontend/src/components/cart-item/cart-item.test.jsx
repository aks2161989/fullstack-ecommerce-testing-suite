import React from "react";
import { render } from "@testing-library/react";
import CartItem from "./cart-item.component";
import { CART_ITEM_DISPLAY_CASES } from "../../test-utils/testData";

describe("CartItem Component (Data-Driven)", () => {
  test.each(CART_ITEM_DISPLAY_CASES)(
    "should render $item.name with accurate quantity and price multiplier ($expectedPriceText)",
    ({ item, expectedPriceText }) => {
      const { getByText, getByAltText } = render(<CartItem item={item} />);

      expect(getByText(item.name)).toBeInTheDocument();
      expect(getByText(expectedPriceText)).toBeInTheDocument();

      const img = getByAltText("item");
      expect(img).toBeInTheDocument();
      expect(img.src).toBe(item.imageUrl);
    }
  );
});
