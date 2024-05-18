import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  db,
  doc,
  getDocs,
  collection,
  getDoc,
  query,
  where,
  auth,
} from '../firebase';

import {useRoute, useNavigation, useIsFocused} from '@react-navigation/native';
import {Ionicons, FontAwesome, AntDesign} from '@expo/vector-icons';
import {translateStatusOrders} from '../utils/globalHelpers';

export default function FavouriteScreen({navigation}) {
  const [listItemFavorited, setListItemFavorited] = useState([]);
  const [userDataList, setUserDataList] = useState([]);

  const route = useRoute();
  const navi = useNavigation();

  // Refresh
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      // Gọi hàm refreshData() khi màn hình được focus
      refreshData();
      console.log('refreshing data...');
    }
  }, [isFocused]);

  const refreshData = async () => {
    // ########### GET UID ########### //
    const getUserId = async () => {
      try {
        const userProfile = await AsyncStorage.getItem('usersProfile');
        if (userProfile) {
          const userProfileObject = JSON.parse(userProfile);
          return userProfileObject.currentUser._userId;
        } else {
          console.error('userProfile or currentUser is undefined or null.');
          return null;
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    };

    // Lấy userId bằng cách gọi getUserId
    const userId = await getUserId();

    // Nếu không có userId, không cần gọi getOrdersForUser
    if (!userId) {
      console.error('UserId is null or undefined');
      return;
    }

    // Gọi hàm để lấy đơn hàng của người dùng
    try {
      console.log('Refreshing favourite data...');
      const orders = await getOrdersForUser(userId);
      console.log('Orders for user:', orders);
      setUserDataList(orders.filter(data => data !== null));
    } catch (error) {
      console.error('Error:', error);
      setUserDataList([]);
    }
  };

  const getOrdersForUser = async userId => {
    try {
      const ordersRef = collection(db, 'OrdersConfirmation');
      const q = query(ordersRef, where('user_id_ordered', '==', userId));
      const querySnapshot = await getDocs(q);
      const orders = [];
      querySnapshot.forEach(doc => {
        orders.push({id: doc.id, ...doc.data()});
      });
      return orders;
    } catch (error) {
      console.error('Error getting orders for user:', error);
      return [];
    }
  };

  // Hàm tính tổng số lượng của mỗi sản phẩm từ mảng san_pham_order
  const getTotalQuantity = san_pham_order => {
    let totalQuantity = 0;
    san_pham_order.forEach(item => {
      totalQuantity += item.so_luong;
    });
    return totalQuantity;
  };

  // Hàm render item cho FlatList
  const renderItem = ({item, index}) => {
    const totalQuantity = getTotalQuantity(item.san_pham_order);
    return (
      <TouchableOpacity
        // onPress={() =>
        //   navi.navigate('DetailScreen', {
        //     item: item.data,
        //     currentScreen: 'Yêu thích',
        //   })
        // }
        // onPress={() => console.log('item.data: ', item)}
        style={{
          // borderWidth: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 4,

          backgroundColor: '#fff',
          borderRadius: 10,
          margin: 10,
          marginBottom: 8,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 10,
          shadowOffset: {width: 0, height: 0},
          elevation: 5,
          maxHeight: 250, //200
        }}>
        <View style={{padding: 14, maxWidth: '50%', minWidth: '50%'}}>
          {/* <Text>User ID: {item.userId}</Text> */}
          <Text
            numberOfLines={1}
            style={{fontSize: 16, fontWeight: '600', maxWidth: 160}}>
            #{item.ma_don_hang}
          </Text>

          <Text numberOfLines={1} style={{maxWidth: 165}}>
            Sản phẩm đã đặt ({item.san_pham_order.length})
          </Text>
          {item.san_pham_order.slice(0, 3).map((itemOrdered, index) => (
            <View key={index}>
              <Text
                style={{fontSize: 16, maxWidth: 310, paddingLeft: 6}}
                numberOfLines={1}>
                - {itemOrdered.ten_sp}
              </Text>
            </View>
          ))}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // backgroundColor: 'yellow',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                marginTop: 10,
                borderRadius: 4,
                fontSize: 16,
              }}>
              Tổng số lượng: {totalQuantity}
            </Text>
            <Text
              style={{
                color: '#ee4d2d',
                fontWeight: '600',
                fontSize: 18,
                marginTop: 10,
              }}>
              {/* {item.data.price} */}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // backgroundColor: 'yellow',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                marginTop: 10,
                borderRadius: 4,
                fontSize: 16,
              }}>
              Thành tiền:{' '}
            </Text>
            <Text
              style={{
                color: '#ee4d2d',
                fontWeight: '600',
                fontSize: 18,
                marginTop: 10,
              }}>
              {item.tong_tien}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 14,
              // backgroundColor: 'red',
              maxWidth: 170,
            }}>
            <View
              style={{
                flexDirection: 'row',
                maxWidth: 160,
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 23,
                  height: 23,
                }}
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/2769/2769388.png',
                }}
              />
              <Text style={{color: 'green', paddingLeft: 10}}>
                {translateStatusOrders(item.status)}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              paddingTop: 10,
              alignItems: 'center',
            }}>
            <Text style={{color: 'blue'}}>Xem chi tiết </Text>
            <AntDesign name='doubleright' size={18} color='blue' />
          </View>
        </View>
        <Image
          // source={{uri: item.data.featured_image[0]}}
          source={{
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0qTl31Xof9ahjahcSbZVgLfwPPzKLV8LV8rCd5AhczA&s',
          }}
          style={{
            width: 250, //200
            height: 250, //200
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
          }}
        />
      </TouchableOpacity>
    );
  };

  // useEffect(() => {
  //   const getUserId = async () => {
  //     try {
  //       const userProfile = await AsyncStorage.getItem('usersProfile');
  //       if (userProfile) {
  //         const userProfileObject = JSON.parse(userProfile);
  //         const _userId = userProfileObject.currentUser._userId;
  //       } else {
  //         console.error('userProfile or currentUser is undefined or null.');
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   getUserId();
  // }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        width: '100%',
      }}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
        }}>
        <Text
          style={{
            fontSize: 26,
            fontWeight: '500',
            paddingBottom: 20,
          }}>
          Đơn hàng của bạn
        </Text>
      </View>
      {/* Sử dụng FlatList để hiển thị dữ liệu người dùng */}
      {userDataList.length > 0 ? (
        <FlatList
          style={{width: '100%'}}
          data={userDataList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View
          style={{
            height: '100%',
            maxHeight: 713,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontWeight: '700', fontSize: 28}}>Opps...!</Text>
          <Text style={{fontSize: 20}}>Bạn chưa có đơn hàng nào</Text>
        </View>
      )}
    </View>
  );
}
