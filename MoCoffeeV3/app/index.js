import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Redirect} from 'expo-router';
import {NavigationContainer} from '@react-navigation/native';

const Index = () => {
  return (
    <View
      style={{
        backgroundColor: 'red',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
      <Text>123</Text>
    </View>
  );
  // return (
  //   <NavigationContainer independent>
  //     {/* <Redirect href="/(home)/BottomNavigationBar" /> */}
  //   </NavigationContainer>
  // );
  // return <Redirect href="/(home)/crud_firebase" />;
};

export default Index;

const styles = StyleSheet.create({});
