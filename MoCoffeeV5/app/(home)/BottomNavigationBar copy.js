// // import {StyleSheet, Text, View} from 'react-native';
// // import React from 'react';
// // import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// // import {Ionicons} from '@expo/vector-icons';

// // //Screens
// // import HomeScreen from '../../components/HomeScreen';
// // import DetailsScreen from '../../components/DetailsScreen';
// // import SettingsScreen from '../../components/SettingsScreen';

// // //Screen names
// // const homeName = 'Home';
// // const detailsName = 'Details';
// // const settingsName = 'Settings';

// // const Tab = createBottomTabNavigator();

// // const BottomNavigationBar = () => {
// //   return (
// //     <Tab.Navigator
// //       initialRouteName={homeName}
// //       screenOptions={({route}) => ({
// //         tabBarIcon: ({focused, color, size}) => {
// //           let iconName;
// //           let rn = route.name;

// //           if (rn === homeName) {
// //             iconName = focused ? 'home' : 'home-outline';
// //           } else if (rn === detailsName) {
// //             iconName = focused ? 'list' : 'list-outline';
// //           } else if (rn === settingsName) {
// //             iconName = focused ? 'settings' : 'settings-outline';
// //           }

// //           // You can return any component that you like here!
// //           return <Ionicons name={iconName} size={size} color={color} />;
// //         },
// //       })}
// //       tabBarOptions={{
// //         activeTintColor: 'tomato',
// //         inactiveTintColor: 'grey',
// //         labelStyle: {paddingBottom: 10, fontSize: 10},
// //         style: {padding: 10, height: 70},
// //       }}>
// //       <Tab.Screen name={homeName} component={HomeScreen} />
// //       <Tab.Screen name={detailsName} component={DetailsScreen} />
// //       <Tab.Screen name={settingsName} component={SettingsScreen} />
// //     </Tab.Navigator>
// //   );
// // };

// // export default BottomNavigationBar;

// // const styles = StyleSheet.create({});

import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';

// Screens
import HomeScreen from '../../components/HomeScreen';
import DetailsScreen from '../../components/DetailsScreen';
import SettingsScreen from '../../components/SettingsScreen';

//Screen names
const homeName = 'Home';
const detailsName = 'Details';
const settingsName = 'Settings';

const Tab = createBottomTabNavigator();

function CustomHeader() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 0,
        marginBottom: 70,
        backgroundColor: 'red',
        height: '140%',
        width: '230%',
      }}>
      <Text> 123</Text>
      {/* Your custom header content here */}
    </View>
  );
}

function BottomNavigationBar() {
  return (
    // <NavigationContainer independent>
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let rn = route.name;

          if (rn === homeName) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (rn === detailsName) {
            iconName = focused ? 'list' : 'list-outline';
          } else if (rn === settingsName) {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          // You can return any component that you like here!
          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
              // style={{marginTop: 10, borderWidth: 1, borderColor: '#000'}}
            />
          );
        },
        tabBarStyle: {
          // // position: 'absolute',
          // marginTop: 100,
        },
        tabBarLabelStyle: {
          backgroundColor: 'red',
          // width: 10,
          // height: 10,
          fontSize: 12, // Cỡ chữ của label
          // marginBottom: -50, // Khoảng cách giữa label và icon
        },
        // tabBarStyle: {
        //   height: 3,
        // },
        tabBarStyle: {
          height: 100, // Điều chỉnh độ cao của tabBar
          backgroundColor: 'yellow', // Màu nền của tabBar
          // position: 'absolute', // Đặt tabBar ở vị trí tuyệt đối
          // top: 10, // Đặt tabBar ở đỉnh cùng của màn hình
          bottom: 100,
        },

        tabBarActiveTintColor: '#000', //icon color
        activeTintColor: 'tomato',
        inactiveTintColor: 'grey',
        labelStyle: {
          paddingBottom: 10,
          fontSize: 10,
          backgroundColor: 'blue',
        },
        style: {padding: 10, height: 70, backgroundColor: 'green'},
        headerStyle: {
          // backgroundColor: 'pink',
          // marginTop: 100,
          // height: 100,
          minHeight: 8,
          height: 80, // Specify the height of your custom header
        },
        headerShown: true,
        headerStatusBarHeight: 1,
        headerBackgroundContainerStyle: {
          backgroundColor: 'blue',
        },
        headerTitle: '',
        // headerStyle: {
        //   backgroundColor: 'red',
        //   height: 100,
        // },
        headerRight: () => <CustomHeader />,
      })}>
      <Tab.Screen name={homeName} component={HomeScreen} />
      <Tab.Screen name={detailsName} component={DetailsScreen} />
      <Tab.Screen name={settingsName} component={SettingsScreen} />
    </Tab.Navigator>
    // </NavigationContainer>
  );
}

export default BottomNavigationBar;
