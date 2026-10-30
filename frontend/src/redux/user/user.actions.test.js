import axios from "axios";
import { registerUser, loginUser, logoutUser } from "./user.actions";
import { USER_ACTIONS_THUNK_CASES } from "../../test-utils/testData";

jest.mock("axios");

describe("User Async Action Creators (Thunks) (Data-Driven)", () => {
  let dispatch;
  let history;

  beforeEach(() => {
    dispatch = jest.fn();
    history = { push: jest.fn() };
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("registerUser", () => {
    test.each(USER_ACTIONS_THUNK_CASES.filter((c) => c.scenario.includes("registration")))(
      "handles $scenario",
      async ({ user, apiResponse, apiError, expectedRedirect }) => {
        if (apiResponse) {
          axios.post.mockResolvedValueOnce(apiResponse);
        } else if (apiError) {
          axios.post.mockRejectedValueOnce(apiError);
        }

        await registerUser(user, history)(dispatch);

        expect(axios.post).toHaveBeenCalledWith("/api/v1/user/register", user);
        expect(history.push).toHaveBeenCalledWith(expectedRedirect);
      }
    );

    test("handles registration without history callback", async () => {
      axios.post.mockResolvedValueOnce({ data: {} });
      await registerUser({ name: "User" }, null)(dispatch);

      axios.post.mockRejectedValueOnce(new Error("Network Error"));
      await registerUser({ name: "User" }, null)(dispatch);
      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe("loginUser", () => {
    test.each(USER_ACTIONS_THUNK_CASES.filter((c) => c.scenario.includes("login")))(
      "handles $scenario",
      async ({ credentials, apiResponse, apiError, expectedToken, expectedRedirect }) => {
        if (apiResponse) {
          axios.post.mockResolvedValueOnce(apiResponse);
        } else if (apiError) {
          axios.post.mockRejectedValueOnce(apiError);
        }

        await loginUser(credentials, history)(dispatch);

        expect(localStorage.getItem("jwtToken")).toBe(expectedToken);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "SET_CURRENT_USER",
          })
        );
        expect(history.push).toHaveBeenCalledWith(expectedRedirect);
      }
    );

    test("handles login without history and with empty email fallback", async () => {
      axios.post.mockResolvedValueOnce({ data: { token: "t1", user: {} } });
      await loginUser({}, null)(dispatch);

      axios.post.mockRejectedValueOnce(new Error("offline"));
      await loginUser({}, null)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "SET_CURRENT_USER",
          payload: expect.objectContaining({ name: "User" }),
        })
      );
    });
  });

  describe("logoutUser", () => {
    test("removes jwtToken from localStorage and sets currentUser to null", () => {
      localStorage.setItem("jwtToken", "existing_token");

      logoutUser()(dispatch);

      expect(localStorage.getItem("jwtToken")).toBeNull();
      expect(dispatch).toHaveBeenCalledWith({
        type: "SET_CURRENT_USER",
        payload: null,
      });
    });
  });
});
