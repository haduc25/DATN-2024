import {useState, useEffect} from 'react';
import {View, Text} from 'react-native';

export default function SelectionFromBottom({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        onPress={() => navigation.navigate('Trang chủ')}
        style={{fontSize: 26, fontWeight: 'bold'}}>
        SelectionFromBottom Screen
      </Text>
    </View>
  );
}
