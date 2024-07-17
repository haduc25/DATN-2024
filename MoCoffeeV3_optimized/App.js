import React from 'react';
import {StyleSheet, Text, View, LogBox, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';

// Import các màn hình
import HomeScreen from './screens/HomeScreen';
import OrdersScreen from './screens/OrdersScreen';
import DetailItemOrdered from './screens/DetailItemOrdered';
import DetailItemOrderedUser from './screens/DetailItemOrderedUser';
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
import AdminEditItem from './screens/AdminEditItem';
import AdminOrders from './screens/AdminOrders';
import AdminUsers from './screens/AdminUsers';
import AdminStatisticsAndAnalysisChart from './screens/AdminStatisticsAndAnalysisChart';
import OrderConfirmationSuccessfully from './screens/OrderConfirmationSuccessfully';

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
          initialRouteName={loginName} //current
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
            name={'DetailItemOrdered'}
            component={DetailItemOrdered}
            options={{
              headerShown: false,
              tabBarStyle: {display: 'none'},
              tabBarButton: () => null,
            }}
          />
          <BottomTab.Screen
            name={'DetailItemOrderedUser'}
            component={DetailItemOrderedUser}
            options={{
              headerShown: false,
              tabBarStyle: {display: 'none'},
              tabBarButton: () => null,
            }}
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
            // initialParams={{name: 'haduc25'}}
            options={{
              headerShown: false,
              tabBarStyle: {display: 'none'}, // TabBar hiển thị dưới
              tabBarButton: () => null,
            }}
          />
          <BottomTab.Screen
            name={'OrderConfirmationSuccessfully'}
            component={OrderConfirmationSuccessfully}
            initialParams={{payment_method: 'cash'}}
            options={{
              headerShown: false,
              tabBarStyle: {display: 'none'}, // TabBar hiển thị dưới
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

          {/* AdminEditItem */}
          <BottomTab.Screen
            name={'AdminEditItem'}
            component={AdminEditItem}
            options={{
              headerShown: false,
              tabBarStyle: {display: 'none'}, // TabBar hiển thị dưới
              tabBarButton: () => null,
            }}
          />

          {/* AdminOrders */}
          <BottomTab.Screen
            name={'AdminOrders'}
            component={AdminOrders}
            options={{
              headerShown: false,
              tabBarStyle: {display: 'none'}, // TabBar hiển thị dưới
              tabBarButton: () => null,
            }}
          />

          {/* AdminUsers */}
          <BottomTab.Screen
            name={'AdminUsers'}
            component={AdminUsers}
            options={{
              headerShown: false,
              tabBarStyle: {display: 'none'}, // TabBar hiển thị dưới
              tabBarButton: () => null,
            }}
          />

          {/* AdminStatisticsAndAnalysisChart */}
          <BottomTab.Screen
            name={'AdminStatisticsAndAnalysisChart'}
            component={AdminStatisticsAndAnalysisChart}
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