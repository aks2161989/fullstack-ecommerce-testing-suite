import { productActionTypes } from "./products.actionTypes";
import axios from "axios";
import SHOP_DATA from "../../components/shop-items/shop.data.js";

const getFallbackCategory = (category) => {
  const match = SHOP_DATA.find(
    (c) => c.routeName.toLowerCase() === (category || "").toLowerCase()
  );
  if (!match) return [];
  return [
    {
      ...match,
      _id: match._id || String(match.id),
      items: (match.items || []).map((item) => ({
        ...item,
        _id: item._id || String(item.id),
      })),
    },
  ];
};

export const getProductByCategory = (category) => (dispatch) => {
  return axios
    .get(`/api/v1/product/${category}`)
    .then((res) => {
      if (res.data && res.data.length > 0) {
        dispatch({
          type: productActionTypes.GET_PRODUCT,
          payload: res.data.map((prod) => ({
            ...prod,
            _id: prod._id || String(prod.id),
            items: (prod.items || []).map((item) => ({
              ...item,
              _id: item._id || String(item.id),
            })),
          })),
        });
      } else {
        dispatch({
          type: productActionTypes.GET_PRODUCT,
          payload: getFallbackCategory(category),
        });
      }
    })
    .catch((err) => {
      // Backend offline or unreachable -> fallback to local dataset
      dispatch({
        type: productActionTypes.GET_PRODUCT,
        payload: getFallbackCategory(category),
      });
    });
};
