import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Container from 'Container';
import {Store} from '@redux/store';
import {SocketProvider} from 'context/socket';

export default function App() {
  return (
    <Provider store={Store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{flex: 1}}>
          <SocketProvider>
            <Container />
          </SocketProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}
