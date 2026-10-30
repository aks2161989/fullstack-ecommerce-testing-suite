import userReducer from "./user.reducer";
import { UserActionTypes } from "./user.types";
import { setCurrentUser } from "./user.actions";
import { USER_REDUCER_CASES } from "../../test-utils/testData";

describe("User Redux Reducer & Actions (Data-Driven)", () => {
  const initialState = {
    currentUser: null,
  };

  test("should return default initial state for unknown action", () => {
    expect(userReducer(undefined, { type: "UNKNOWN_ACTION_TEST" })).toEqual(initialState);
  });

  describe("SET_CURRENT_USER action & state mutation", () => {
    test.each(USER_REDUCER_CASES)(
      "should handle $scenario",
      ({ initialState: stateBefore, userPayload, expectedUser }) => {
        const action = setCurrentUser(userPayload);

        expect(action).toEqual({
          type: UserActionTypes.SET_CURRENT_USER,
          payload: userPayload,
        });

        const stateAfter = userReducer(stateBefore, action);
        expect(stateAfter.currentUser).toEqual(expectedUser);
      }
    );
  });
});
