import * as React from 'react';
import {View, Text} from 'react-native';

export default function CartScreen({navigation, route}) {
  console.log('navigation: ', navigation);
  console.log('route: ', route);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        onPress={() => navigation.navigate('Home')}
        style={{fontSize: 26, fontWeight: 'bold'}}>
        Cart Screen
      </Text>
    </View>
  );
}
