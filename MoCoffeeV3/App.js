import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';

// Import các màn hình
import HomeScreen from './screens/HomeScreen';
import OrdersScreen from './screens/OrdersScreen';
import FavouriteScreen from './screens/FavouriteScreen';
import ProfileScreen from './screens/ProfileScreen';
import CartScreen from './screens/CartScreen';
import ProductType from './screens/childs/ProductType';
import DetailScreen from './screens/DetailScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// Redux
import {Provider} from 'react-redux';
import store from './redux/store';

// Khởi tạo Bottom Tab Navigator
const BottomTab = createBottomTabNavigator();

//Screen names
const homeName = 'Trang chủ';
const ordersName = 'Đơn hàng';
const favouriteName = 'Yêu thích';
const profileName = 'Tài khoản';
const cartName = 'Cart';
const productTypeName = 'ProductTypeScreen';
const detailName = 'DetailScreen';
const loginName = 'LoginScreen';
const registerName = 'RegisterScreen';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <BottomTab.Navigator
          // initialRouteName={homeName}
          // initialRouteName={productTypeName}
          // initialRouteName={cartName}
          // initialRouteName={registerName}
          // initialRouteName={loginName}
          initialRouteName={favouriteName}
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
            // tabBarActiveTintColor: '#7EC7E7', //màu icon khi active
            // tabBarActiveTintColor: '#5C472A', //màu icon khi active
            tabBarActiveTintColor: '#6E5532', //màu icon khi active
            // tabBarInactiveTintColor: '#7EC7E7', //màu chữ các thứ
            tabBarInactiveTintColor: '#6E5532', //màu chữ các thứ
          })}>
          <BottomTab.Screen
            name={homeName}
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <BottomTab.Screen
            name={ordersName}
            component={OrdersScreen}
            options={{headerShown: false}}
          />
          <BottomTab.Screen
            name={favouriteName}
            component={FavouriteScreen}
            options={{headerShown: false}}
          />
          <BottomTab.Screen
            name={profileName}
            component={ProfileScreen}
            options={{headerShown: false}}
          />

          {/* HIDE - SCREEN & HIDE TASKBAR */}
          <BottomTab.Screen
            name={cartName}
            component={CartScreen}
            initialParams={{name: 'haduc25'}}
            options={{
              headerShown: false,
              // tabBarStyle: {display: 'none'}, // TabBar hiển thị dưới
              tabBarButton: () => null,
            }}
          />
          <BottomTab.Screen
            name={productTypeName}
            component={ProductType}
            options={{
              headerShown: false,
              tabBarStyle: {display: 'none'}, // TabBar hiển thị dưới
              tabBarButton: () => null,
            }}
          />
          <BottomTab.Screen
            name={detailName}
            component={DetailScreen}
            options={{
              headerShown: false,
              // tabBarStyle: {display: 'none'}, // TabBar hiển thị dưới
              tabBarButton: () => null,
            }}
          />
          {/* LOGIN & REGISTER */}
          <BottomTab.Screen
            name={loginName}
            component={LoginScreen}
            options={{
              headerShown: false,
              tabBarStyle: {display: 'none'}, // TabBar hiển thị dưới
              tabBarButton: () => null,
            }}
          />
          <BottomTab.Screen
            name={registerName}
            component={RegisterScreen}
            options={{
              headerShown: false,
              tabBarStyle: {display: 'none'}, // TabBar hiển thị dưới
              tabBarButton: () => null,
            }}
          />
        </BottomTab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
