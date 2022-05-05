import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMarketData } from "../api";

const initialState = { coinsData: [], isLoading: false };
const getCoinsAsync = createAsyncThunk("coins/getData", async (page) => {
  const data = await getMarketData(page);
  return data;
});
const coinsSlice = createSlice({
  name: "coins",
  initialState,
  reducers: {
    refreshCoins: (state) => {
      state.coinsData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCoinsAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCoinsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.coinsData = action.payload;
        state.coinsData = [...state?.coinsData, ...action?.payload];
      });
  },
});
//export state to global
export const { refreshCoins } = coinsSlice.actions;
export const selectCoins = (state) => state.coins.coinsData;
export const selectCoinsIsLoading = (state) => state.coins.isLoading;

//export async function to global
export { getCoinsAsync };

//export reducer to global
export default coinsSlice.reducer;
