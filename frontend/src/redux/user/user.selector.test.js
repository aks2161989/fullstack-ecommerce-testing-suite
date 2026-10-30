import { selectCurrentUser } from "./user.selector";
import { USER_SELECTOR_CASES } from "../../test-utils/testData";

describe("User Selectors (Data-Driven)", () => {
  test.each(USER_SELECTOR_CASES)(
    "correctly $scenario",
    ({ state, expectedResult }) => {
      expect(selectCurrentUser(state)).toEqual(expectedResult);
    }
  );
});
