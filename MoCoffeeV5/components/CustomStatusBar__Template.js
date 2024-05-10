import * as React from 'react';
import {Text, View, StyleSheet, StatusBar} from 'react-native';
import {
  SafeAreaView,
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const CustomStatusBar = ({
  backgroundColor,
  barStyle = 'dark-content',
  //add more props StatusBar
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{height: insets.top, backgroundColor}}>
      <StatusBar
        animated={true}
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor="yellow" />
      <View style={{flex: 1, backgroundColor: 'blue'}}></View>
    </SafeAreaProvider>
  );
}
