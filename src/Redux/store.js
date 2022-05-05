import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import coinsReducer from "./coinsSlice";
import coinDetailReducer from "./coinDetailSlice";
import coinMarketReducer from "./coinMarketSlice";
const store = configureStore({
  reducer: {
    coins: coinsReducer,
    coinDetail: coinDetailReducer,
    coinMarket: coinMarketReducer,
  },
  devTools: process.env.NODE_ENV != "production",
  middleware: [thunk],
});
export default store;
