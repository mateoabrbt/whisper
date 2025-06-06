import { Provider } from "react-redux";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Store } from "@redux/store";

import Container from "Container";

export default function App() {
  return (
    <Provider store={Store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Container />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}
