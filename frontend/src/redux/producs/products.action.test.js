import axios from "axios";
import { getProductByCategory } from "./products.action";
import { PRODUCT_ACTIONS_THUNK_CASES } from "../../test-utils/testData";

jest.mock("axios");

describe("Products Async Action Creators (Thunks) (Data-Driven)", () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
    jest.clearAllMocks();
  });

  test("handles successful API fetch and transforms response items", async () => {
    const mockApiProducts = [
      {
        id: 1,
        title: "Hats",
        routeName: "hats",
        items: [{ id: 101, name: "Brown Hat", price: 25 }],
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockApiProducts });

    await getProductByCategory("hats")(dispatch);

    expect(axios.get).toHaveBeenCalledWith("/api/v1/product/hats");
    expect(dispatch).toHaveBeenCalledWith({
      type: "GET_PRODUCT",
      payload: [
        expect.objectContaining({
          _id: "1",
          routeName: "hats",
        }),
      ],
    });
  });

  test.each(PRODUCT_ACTIONS_THUNK_CASES)(
    "handles fallback and responses for $scenario",
    async ({
      categoryParam,
      apiResponse,
      apiError,
      expectedRouteName,
      expectedEmptyPayload,
      expectedFirstId,
    }) => {
      if (apiResponse) {
        axios.get.mockResolvedValueOnce(apiResponse);
      } else if (apiError) {
        axios.get.mockRejectedValueOnce(apiError);
      }

      await getProductByCategory(categoryParam)(dispatch);

      if (expectedEmptyPayload) {
        expect(dispatch).toHaveBeenCalledWith({
          type: "GET_PRODUCT",
          payload: [],
        });
      } else if (expectedRouteName) {
        expect(dispatch).toHaveBeenCalledWith({
          type: "GET_PRODUCT",
          payload: [
            expect.objectContaining({
              routeName: expectedRouteName,
            }),
          ],
        });
      } else if (expectedFirstId) {
        expect(dispatch).toHaveBeenCalledWith({
          type: "GET_PRODUCT",
          payload: [
            expect.objectContaining({
              _id: expectedFirstId,
            }),
          ],
        });
      }
    }
  );
});
