import React, { useEffect, useState } from "react";
import { FlatList, HStack, VStack, Text, useColorMode } from "native-base";
import { RefreshControl, ActivityIndicator } from "react-native";
import CoinItem from "../components/CoinItem";
import { useDispatch, useSelector } from "react-redux";
import {
  getCoinsAsync,
  refreshCoins,
  selectCoins,
  selectCoinsIsLoading,
} from "../Redux/coinsSlice";

const HomeScreen = () => {
  const { colorMode } = useColorMode();
  /*port to redux
  const [coins, setCoins] = useState([]);
  */
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const coins = useSelector(selectCoins);
  const coinsIsLoading = useSelector(selectCoinsIsLoading);

  const renderFooter = () => {
    return coinsIsLoading && <ActivityIndicator />;
  };

  useEffect(() => {
    dispatch(getCoinsAsync(page));
  }, [page]);

  return (
    <VStack flex={1} mx={2}>
      <HStack justifyContent="space-between">
        <Text fontSize={25} alignSelf="center">
          Cryptoassets
        </Text>
        <Text fontSize={12} alignSelf="center">
          Powered by CoinGecko
        </Text>
      </HStack>
      <FlatList
        data={coins}
        renderItem={({ item }) => <CoinItem marketCoin={item} />}
        keyExtractor={(item) => item.market_cap_rank}
        ListFooterComponent={renderFooter}
        onEndReached={() => !coinsIsLoading && setPage(page + 1)}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={coinsIsLoading}
            tintColor={colorMode == "dark" ? "white" : "black"}
            onRefresh={() => {
              dispatch(refreshCoins());
              setPage(1);
            }}
          />
        }
      />
    </VStack>
  );
};

export default HomeScreen;
