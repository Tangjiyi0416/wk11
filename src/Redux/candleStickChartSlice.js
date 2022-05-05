import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCandleChartData } from "../api";

const initialState = {
  candleStickChartData: [],
  isLoading: false,
};
const getCandleStickChartAsync = createAsyncThunk(
  "csc/getData",
  async (para) => {
    const { coinId, selectedRangeValue } = para;
    const data = await getCandleChartData(coinId, selectedRangeValue);
    return data;
  }
);
const candleStickChartSlice = createSlice({
  name: "candleStickChart",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getCandleStickChartAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCandleStickChartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.coinsData = action.payload;
        state.candleStickChartData = action.payload;
      });
  },
});
//export state to global
export const selectCandleStickChartData = (state) =>
  state.candleStickChart.candleStickChartData;
export const selectCandleStickChartIsLoading = (state) =>
  state.candleStickChart.isLoading;

//export async function to global
export { getCandleStickChartAsync };

//export reducer to global
export default candleStickChartSlice.reducer;
