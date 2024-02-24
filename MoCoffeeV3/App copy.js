import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';

// Navigation: Thanh điều hướng
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

// Bottom Tab
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const BottomTab = createBottomTabNavigator();

// Components
import HomeScreen from './screens/HomeScreen';
import OrdersScreen from './screens/OrdersScreen';
import FavouriteScreen from './screens/FavouriteScreen';
import ProfileScreen from './screens/ProfileScreen';

// Icons
import {Ionicons} from '@expo/vector-icons';



//Screen names
const homeName = 'Trang chủ';
const ordersName = 'Đơn hàng';
const favouriteName = 'Yêu thích';
// const profileName = 'Tôi';
// const profileName = 'Trang cá nhân';
const profileName = 'Tài khoản';

export default function App() {
  return (
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
        <Stack.Screen name="Settings" component={ProfileScreen} />
      </Stack.Navigator> */}
      <BottomTab.Navigator
        initialRouteName="SplashScreen"
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? 'home' : 'home-outline';
            } else if (rn === ordersName) {
              iconName = focused ? 'list' : 'list-outline';
            } else if (rn === favouriteName) {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (rn === profileName) {
              iconName = focused ? 'person' : 'person-outline';
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
      </BottomTab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
});
