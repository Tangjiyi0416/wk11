import { createSlice } from "@reduxjs/toolkit";

const initialState = { isCandleChartVisible: false };

const candleChartVisibleSlice = createSlice({
  name: "candleChartVisible",
  initialState,
  reducers: {
    toggleIsCandleChartVisible: (state) => {
      state.isCandleChartVisible = !state.isCandleChartVisible;
    },
  },
});
//export state to global
export const { toggleIsCandleChartVisible } = candleChartVisibleSlice.actions;
export const selectIsCandleChartVisible = (state) =>
  state.candleChartVisible.isCandleChartVisible;

//export reducer to global
export default candleChartVisibleSlice.reducer;
