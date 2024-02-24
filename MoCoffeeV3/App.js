import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Ionicons} from '@expo/vector-icons';

// Import các màn hình
import HomeScreen from './screens/HomeScreen';
import OrdersScreen from './screens/OrdersScreen';
import FavouriteScreen from './screens/FavouriteScreen';
import ProfileScreen from './screens/ProfileScreen';
import CartScreen from './screens/CartScreen';

// Khởi tạo Stack Navigator
const Stack = createNativeStackNavigator();

// Khởi tạo Bottom Tab Navigator
const BottomTab = createBottomTabNavigator();

// Hàm tạo Stack Navigator cho một màn hình
function createScreenStack(ScreenComponent) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ScreenComponent.name}
        component={ScreenComponent}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

//Screen names
const homeName = 'Trang chủ';
const ordersName = 'Đơn hàng';
const favouriteName = 'Yêu thích';
const profileName = 'Tài khoản';

export default function App() {
  return (
    <NavigationContainer>
      <BottomTab.Navigator
        initialRouteName={homeName}
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if (route.name === homeName) {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === ordersName) {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === favouriteName) {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === profileName) {
              iconName = focused ? 'person' : 'person-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          // tabBarActiveTintColor: '#e91e63',
          tabBarActiveTintColor: '#7EC7E7', //màu icon khi active
          tabBarInactiveTintColor: '#7EC7E7', //màu chữ các thứ
        })}>
        <BottomTab.Screen
          name={homeName}
          children={() => createScreenStack(HomeScreen)}
          options={{headerShown: false}}
        />
        <BottomTab.Screen
          name={ordersName}
          children={() => createScreenStack(OrdersScreen)}
          options={{headerShown: false}}
        />
        <BottomTab.Screen
          name={favouriteName}
          children={() => createScreenStack(FavouriteScreen)}
          options={{headerShown: false}}
        />
        <BottomTab.Screen
          name={profileName}
          children={() => createScreenStack(ProfileScreen)}
          options={{headerShown: false}}
        />

        {/* HIDE - SCREEN & HIDE TASKBAR */}
        <BottomTab.Screen
          name={'Cart'}
          children={() => createScreenStack(CartScreen)}
          options={{
            headerShown: false,
            // tabBarStyle: {display: 'none'}, // TabBar hiển thị dưới
            tabBarButton: () => null,
          }}
        />
      </BottomTab.Navigator>
    </NavigationContainer>
  );
}
