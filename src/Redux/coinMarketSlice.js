import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCoinMarketChart } from "../api";

const initialState = {
  coinMarketData: {},
  isLoading: false,
};
const getCoinMarketAsync = createAsyncThunk(
  "coinMarket/getData",
  async (para) => {
    const { coinId, selectedRangeValue } = para;
    const data = await getCoinMarketChart(coinId, selectedRangeValue);
    return data;
  }
);
const coinMarketSlice = createSlice({
  name: "coinMarket",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getCoinMarketAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCoinMarketAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.coinsData = action.payload;
        state.coinMarketData = action.payload;
      });
  },
});
//export state to global
export const selectCoinMarketData = (state) => state.coinMarket.coinMarketData;
export const selectCoinMarketIsLoading = (state) => state.coinMarket.isLoading;

//export async function to global
export { getCoinMarketAsync };

//export reducer to global
export default coinMarketSlice.reducer;
