import * as React from 'react';
import {View, Text} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

export default function BrandLinearGradient() {
  return (
    <View style={{alignItems: 'center'}}>
      <LinearGradient
        // colors={['yellow', 'pink']}
        // colors={['#765640', '#ccae88']}
        // colors={['#a89487', '#a89487', '#ccae88', '#ccae88']}
        colors={['lightblue', '#57a09d']}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
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
      </LinearGradient>
    </View>
  );
}
