import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './src/navigators/TabNavigator';
import DetailsScreen from './src/screens/DetailsScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import SplashScreen from 'react-native-splash-screen';

// import React from 'react'
import {Text} from 'react-native'


export default function App() {
  return (
    <Text style={{ fontSize: 40 }}>FINNALLY ITS WORKING123312!</Text>
  )
}
