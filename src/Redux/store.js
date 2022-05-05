import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import coinsReducer from "./coinsSlice";
import coinDetailReducer from "./coinDetailSlice";
import coinMarketReducer from "./coinMarketSlice";
import candleStickChartReducer from "./candleStickChartSlice";
import candleChartVisibleReducer from "./candleChartVisibleSlice";
const store = configureStore({
  reducer: {
    coins: coinsReducer,
    coinDetail: coinDetailReducer,
    coinMarket: coinMarketReducer,
    candleStickChart: candleStickChartReducer,
    candleChartVisible: candleChartVisibleReducer,
  },
  devTools: process.env.NODE_ENV != "production",
  middleware: [thunk],
});
export default store;
