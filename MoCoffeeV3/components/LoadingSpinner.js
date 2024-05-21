import {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';

// #999999 default ios color
export default function LoadingSpinner({size = 'large', color = '#00ff00'}) {
  return (
    <View
      style={{
        position: 'absolute',
        top: -50,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size={size} color={color} />
        <Text
          style={{
            marginTop: 10,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
          }}>
          Loading...
        </Text>
      </View>
    </View>
  );
}
