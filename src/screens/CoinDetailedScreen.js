import React, { useState, useEffect } from "react";
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
  getDetailedCoinData,
  getCoinMarketChart,
  getCandleChartData,
} from "../api";
/*
import {
  selectCoinDetailData,
  selectCoinDetailIsLoading,
} from "../Redux/coinsDetailSlice";
import {
  selectCoinMarketData,
  selectCoinMarketIsLoading,
} from "../Redux/coinMarketSlice";
*/
const chartColor = "#16c784";
const screenWidth = Dimensions.get("window").width * 0.8;

const CoinDetailedScreen = ({ route, navigation }) => {
  /*port to redux
  const [coin, setCoin] = useState(null);
  const [coinMarketData, setCoinMarketData] = useState([]);
  const [coinCandleChartData, setCoinCandleChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState("1");
  const [isCandleChartVisible, setIsCandleChartVisible] = useState(false);
  */
  const dispatch = useDispatch();
  const { coinId } = route.params;
  const { colorMode } = useColorMode();
  const coinDetailData = selectCoinDetailData();
  const isCoinDetailLoading = selectCoinDetailIsLoading();
  const coinMarketData = selectCoinMarketData();
  const isMarketCoinLoading = selectCoinMarketIsLoading();

  const fetchCandleStickChartData = async (selectedRangeValue) => {
    const fetchedSelectedCandleChartData = await getCandleChartData(
      coinId,
      selectedRangeValue
    );
    setCoinCandleChartData(fetchedSelectedCandleChartData);
  };

  const onSelectedRangeChange = (selectedRangeValue) => {
    setSelectedRange(selectedRangeValue);
    getCoinMarketAsync(coinId, selectedRangeValue);
    fetchCandleStickChartData(selectedRangeValue);
  };

  useEffect(() => {
    dispatch(getCoinDetailDataAsync(coinId));
    getCoinMarketAsync(coinId, 1);
    fetchCandleStickChartData(1);
  }, []);

  useEffect(() => {
    if (coinDetailData != null) {
      navigation.setOptions({
        headerTitle: () => {
          return (
            <CoinDetailedHeader
              coinId={coinDetailData.id}
              image={coinDetailData.image.small}
              symbol={coinDetailData.symbol}
              marketCapRank={coinDetailData.market_data.market_cap_rank}
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

  return loading ? (
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
            onToggle={() => setIsCandleChartVisible(!isCandleChartVisible)}
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
