import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Redirect} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const index = () => {
  // AsyncStorage.clear();
  // return <Redirect href="/(authenticate)/login" />;
  // return <Redirect href="/(authenticate)/register" />;
  // return <Redirect href="/(home)/crud_firebase" />;
  return <Redirect href="/(home)/BottomNavigationBar" />;
};

export default index;

const styles = StyleSheet.create({});

// -> "/"
// -> "/home"
