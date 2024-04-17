import React from 'react';
import {StyleSheet, Text, View, LogBox, StatusBar} from 'react-native';
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
import DynamicHeaderScrollView from './screens/DynamicHeaderScrollView';
import ImageAnimation from './screens/ImageAnimation';
import EditProfileScreen from './screens/EditProfileScreen';
import UploadImageToStorageDemo from './screens/UploadImageToStorageDemo';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AdminProductsCRUD from './screens/AdminProductsCRUD';
import AdminCRUDItem from './screens/AdminCRUDItem';

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
const editProfileName = 'Chỉnh sửa hồ sơ';

export default function App() {
  // Bỏ qua cảnh báo liên quan đến ViewPropTypes
  LogBox.ignoreLogs(['ViewPropTypes will be removed from React Native']);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <BottomTab.Navigator
          // initialRouteName={homeName}
          // initialRouteName={productTypeName}
          // initialRouteName={cartName}
          // initialRouteName={registerName}
          // initialRouteName={favouriteName}
          // initialRouteName={detailName}
          // initialRouteName={'ImageAnimation'}
          // initialRouteName={'DynamicHeaderScrollView'}

          initialRouteName={loginName} //current
          // initialRouteName={'UploadImageToStorageDemo'} //test
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName;
              if (route.name === homeName) {
                iconName = focused ? 'home' : 'home-outline';
                StatusBar.setBarStyle('dark-content');
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
            initialParams={{refresh: Math.random()}}
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
            name={'DynamicHeaderScrollView'}
            component={DynamicHeaderScrollView}
            options={{
              headerShown: false,
              // tabBarStyle: {display: 'none'}, // TabBar hiển thị dưới
              tabBarButton: () => null,
            }}
          />
          <BottomTab.Screen
            name={'ImageAnimation'}
            component={ImageAnimation}
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
            // initialParams={{
            //   item: {
            //     available: true,
            //     available_sizes: ['S', 'M', 'L'],
            //     category: 'tea',
            //     description: 'Trà quất làm từ quất',
            //     featured_image:
            //       'https://cong-news.appwifi.com/wp-content/uploads/2023/02/tra%CC%80-qua%CC%82%CC%81t-ma%CC%A3%CC%82t-ong_%C4%91a%CC%81.jpg',
            //     id: 'vAyp6Z4hoNFUA8ARLpTw',
            //     name: 'Trà quất',
            //     preparation_time: '5',
            //     price: '201',
            //     ratings: {average_rating: '4.6', total_ratings: '10'},
            //     sold_count: '20',
            //   },
            // }}
            options={{
              headerShown: false,
              tabBarStyle: {display: 'none'}, // TabBar hiển thị dưới
              tabBarButton: () => null,
            }}
          />
          {/* EDIT Profile */}
          <BottomTab.Screen
            name={editProfileName}
            component={EditProfileScreen}
            // initialParams={{name: 'haduc25'}}
            options={{
              headerShown: false,
              tabBarStyle: {display: 'none'}, // TabBar hiển thị dưới
              tabBarButton: () => null,
            }}
          />
          {/* UploadImageToStorageDemo */}
          <BottomTab.Screen
            name={'UploadImageToStorageDemo'}
            component={UploadImageToStorageDemo}
            options={{
              // headerShown: false,
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
          {/* ADMIN */}
          <BottomTab.Screen
            name={'AdminDashboardScreen'}
            component={AdminDashboardScreen}
            options={{
              headerShown: false,
              tabBarStyle: {display: 'none'}, // TabBar hiển thị dưới
              tabBarButton: () => null,
            }}
          />

          {/* AdminProductsCRUD */}
          <BottomTab.Screen
            name={'AdminProductsCRUD'}
            component={AdminProductsCRUD}
            options={{
              headerShown: false,
              tabBarStyle: {display: 'none'}, // TabBar hiển thị dưới
              tabBarButton: () => null,
            }}
          />

          {/* AdminCRUDItem */}
          <BottomTab.Screen
            name={'AdminCRUDItem'}
            component={AdminCRUDItem}
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
