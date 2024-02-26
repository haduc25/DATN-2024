import * as React from 'react';
import {View, Text} from 'react-native';
import {useRoute} from '@react-navigation/native';

export default function DetailScreen({navigation}) {
  const route = useRoute();
  console.log('route: ', route);

  const {name, price} = route?.params;

  console.log('navigation: ', navigation);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        onPress={() => navigation.navigate('Trang chủ')}
        style={{fontSize: 26, fontWeight: 'bold'}}>
        Detail Screen
      </Text>
      <Text>name: {name}</Text>
      <Text>price: {price}.000 ₫</Text>
    </View>
  );
}
