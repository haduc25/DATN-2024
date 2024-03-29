import {Stack} from 'expo-router';
import {Provider} from 'react-redux';
import store from '../../redux/store';

export default function Layout() {
  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false,
          headerTitle: 'aabbcc',
          headerStyle: {backgroundColor: 'red', height: 1000, marginTop: -80},
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="hotel" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="order" />
        <Stack.Screen name="crud_firebase" />
        <Stack.Screen name="BottomNavigationBar" />
      </Stack>
    </Provider>
  );
}
