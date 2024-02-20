import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Redirect} from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const index = () => {
  // AsyncStorage.clear();
  return <Redirect href="/(authenticate)/login" />;
};

export default index;

const styles = StyleSheet.create({});

// -> "/"
// -> "/home"
