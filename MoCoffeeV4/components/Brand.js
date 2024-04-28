import * as React from 'react';
import {View, Text} from 'react-native';

export default function Brand() {
  return (
    <View
      style={{
        alignItems: 'center',
      }}>
      <View
        style={{
          width: 320,
          height: 68,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
        }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            fontFamily: 'Arial',
            color: '#000',
            textTransform: 'uppercase',
            paddingRight: 3,
          }}>
          Mỡ
        </Text>
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            fontFamily: 'Arial',
            color: '#9d9857',
            textTransform: 'uppercase',
          }}>
          Coffee
        </Text>
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            fontFamily: 'Arial',
            color: '#9d9857',
            paddingHorizontal: 6,
          }}>
          &
        </Text>
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            fontFamily: 'Arial',
            color: '#9d9857',
            textTransform: 'uppercase',
          }}>
          Tea
        </Text>
      </View>
    </View>
  );
}
