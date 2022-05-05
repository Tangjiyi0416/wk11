import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMarketData } from "../api";

const initialState = {
  coinDetailData: {},
  isLoading: false,
};
const getCoinDetailAsync = createAsyncThunk(
  "coinDetail/getData",
  async (coinId) => {
    const data = await getDetailedCoinData(coinId);
    return data;
  }
);
const coinDetailSlice = createSlice({
  name: "coinDetail",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getCoinDetailAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCoinDetailAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.coinsData = action.payload;
        state.coinDetailData = action.payload;
      });
  },
});
//export state to global
export const selectCoinDetailData = (state) => state.coinDetail.coinDetailData;
export const selectCoinDetailIsLoading = (state) => state.coinDetail.isLoading;

//export async function to global
export { getCoinDetailAsync };

//export reducer to global
export default coinDetailSlice.reducer;
