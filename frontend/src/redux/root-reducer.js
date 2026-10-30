import { combineReducers } from "redux";

import productReducer from "./producs/products.reducer";
import CartReducer from "./cart/cart.reducer";
import userReducer from "./user/user.reducer";

const rootReducer = combineReducers({
  products: productReducer,
  cart: CartReducer,
  user: userReducer,
});

export default rootReducer;
