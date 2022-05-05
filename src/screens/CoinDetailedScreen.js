import React, { useEffect, useState } from "react";
import {
  Text,
  HStack,
  Switch,
  VStack,
  ScrollView,
  useColorMode,
} from "native-base";
import { ActivityIndicator, Dimensions } from "react-native";
import { LineChart, CandlestickChart } from "react-native-wagmi-charts";

import CoinDetailedHeader from "../components/CoinDetailedHeader";
import FilterComponent from "../components/FilterComponent";
import {
  getCoinDetailAsync,
  selectCoinDetailData,
  selectCoinDetailIsLoading,
} from "../Redux/coinDetailSlice";

import {
  getCoinMarketAsync,
  selectCoinMarketData,
  selectCoinMarketIsLoading,
} from "../Redux/coinMarketSlice";
import {
  getCandleStickChartAsync,
  selectCandleStickChartData,
  selectCandleStickChartIsLoading,
} from "../Redux/candleStickChartSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsCandleChartVisible,
  toggleIsCandleChartVisible,
} from "../Redux/candleChartVisibleSlice";

const chartColor = "#16c784";
const screenWidth = Dimensions.get("window").width * 0.8;

const CoinDetailedScreen = ({ route, navigation }) => {
  /*port to redux
  const [coin, setCoin] = useState(null);
  const [coinMarketData, setCoinMarketData] = useState([]);
  const [coinCandleChartData, setCoinCandleChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  */

  const dispatch = useDispatch();
  const { coinId } = route.params;
  const { colorMode } = useColorMode();
  const coinDetailData = useSelector(selectCoinDetailData);
  const isCoinDetailLoading = useSelector(selectCoinDetailIsLoading);
  const coinMarketData = useSelector(selectCoinMarketData);
  const isMarketCoinLoading = useSelector(selectCoinMarketIsLoading);

  const coinCandleChartData = useSelector(selectCandleStickChartData);
  const isCandleStickChartLoading = useSelector(
    selectCandleStickChartIsLoading
  );
  const isCandleChartVisible = useSelector(selectIsCandleChartVisible);
  const [selectedRange, setSelectedRange] = useState("1");

  const onSelectedRangeChange = (selectedRangeValue) => {
    setSelectedRange(selectedRangeValue);
    dispatch(getCoinMarketAsync({ coinId, selectedRangeValue }));
    dispatch(getCandleStickChartAsync({ coinId, selectedRangeValue }));
  };

  useEffect(() => {
    dispatch(getCoinDetailAsync(coinId));
    dispatch(getCoinMarketAsync({ coinId, selectedRangeValue: "1" }));
    dispatch(getCandleStickChartAsync({ coinId, selectedRangeValue: "1" }));
  }, []);

  useEffect(() => {
    if (coinDetailData != null) {
      navigation.setOptions({
        headerTitle: () => {
          return (
            <CoinDetailedHeader
              coinId={coinDetailData.id ?? ""}
              image={
                coinDetailData.image?.small ??
                "https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579"
              }
              symbol={coinDetailData.symbol ?? ""}
              marketCapRank={coinDetailData?.market_data?.market_cap_rank ?? ""}
            />
          );
        },
      });
    }
  }, [coinDetailData]);

  let line_data = [];
  coinMarketData.prices?.map(([timestamp, value]) =>
    line_data.push({ timestamp, value })
  );

  let candle_data = [];
  coinCandleChartData?.map(([timestamp, open, high, low, close]) =>
    candle_data.push({ timestamp, open, high, low, close })
  );

  return isCoinDetailLoading ||
    isMarketCoinLoading ||
    isCandleStickChartLoading ? (
    <ActivityIndicator size="large" />
  ) : (
    <ScrollView>
      <VStack flex={1} alignItems="center" mt={20}>
        <FilterComponent
          selectedRange={selectedRange}
          setSelectedRange={onSelectedRangeChange}
        />

        <HStack space={8} alignItems="center" mb={12}>
          <Text fontSize="lg">
            {!isCandleChartVisible ? "Line Chart" : "Candle Chart"}
          </Text>
          <Switch
            size="sm"
            colorScheme="emerald"
            name="line Mode"
            isChecked={!isCandleChartVisible}
            onToggle={() => dispatch(toggleIsCandleChartVisible())}
            accessibilityLabel="line-mode"
            accessibilityHint="line or candle"
          />
        </HStack>
        {!isCandleChartVisible ? (
          <LineChart.Provider data={line_data}>
            <LineChart height={screenWidth / 2} width={screenWidth}>
              <LineChart.Path color={chartColor}>
                <LineChart.Gradient
                  color={colorMode === "dark" ? "white" : "black"}
                />
              </LineChart.Path>
              <LineChart.CursorCrosshair color={chartColor}>
                <LineChart.Tooltip />
                <LineChart.Tooltip position="bottom">
                  <LineChart.DatetimeText />
                </LineChart.Tooltip>
              </LineChart.CursorCrosshair>
            </LineChart>
          </LineChart.Provider>
        ) : (
          <CandlestickChart.Provider data={candle_data}>
            <CandlestickChart height={screenWidth / 2} width={screenWidth}>
              <CandlestickChart.Candles />
              <CandlestickChart.Crosshair>
                <CandlestickChart.Tooltip />
              </CandlestickChart.Crosshair>
            </CandlestickChart>
            <CandlestickChart.DatetimeText
              style={{ color: "white", fontWeight: "600", margin: 10 }}
            />
          </CandlestickChart.Provider>
        )}
      </VStack>
    </ScrollView>
  );
};

export default CoinDetailedScreen;
