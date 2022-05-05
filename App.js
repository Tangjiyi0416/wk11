import "react-native-gesture-handler";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeBaseProvider } from "native-base";
import { Provider } from "react-redux";
import Navigation from "./src/navigations";
import { customTheme } from "./src/Theme";
import store from "./src/Redux/store";
const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NativeBaseProvider theme={customTheme}>
          <Navigation />
        </NativeBaseProvider>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
