import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {db, doc, getDocs, collection, getDoc, query, where} from '../firebase';

import {useRoute, useNavigation, useIsFocused} from '@react-navigation/native';
import {Ionicons, FontAwesome} from '@expo/vector-icons';
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

  const refreshData = () => {
    // Đặt logic làm mới dữ liệu ở đây, ví dụ: gọi API để lấy danh sách sản phẩm yêu thích mới
    console.log('Refreshing favourite data...');
    const userId = 'lMsKBPaYTpORRtBxprjjHppCy0U2'; // ID của người dùng bạn muốn lấy đơn hàng

    // Gọi hàm để lấy đơn hàng của người dùng
    getOrdersForUser(userId)
      .then(orders => {
        console.log('Orders for user:', orders);
        setUserDataList(orders.filter(data => data !== null));
      })
      .catch(error => {
        console.error('Error:', error);
        setUserDataList([]);
      });
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

  // Hàm render item cho FlatList
  const renderItem = ({item, index}) => (
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
        maxHeight: 200,
      }}>
      <View style={{padding: 14}}>
        {/* <Text>User ID: {item.userId}</Text> */}
        <Text
          numberOfLines={1}
          style={{fontSize: 16, fontWeight: '600', maxWidth: 160}}>
          {item.san_pham_order[index].ten_sp}
        </Text>
        {console.log('item.san_pham_order: ', item.san_pham_order)}
        {/* {console.log('item2: ', item.san_pham_order[0].size_sp)}
        {console.log('index: ', index)} */}
        <Text numberOfLines={1} style={{maxWidth: 165}}>
          {item.ma_don_hang}
        </Text>
        <Text numberOfLines={1} style={{maxWidth: 165}}>
          {item.san_pham_order[0].size_sp}
        </Text>
        <Text numberOfLines={1} style={{maxWidth: 165}}>
          {item.ma_don_hang}
        </Text>

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
            SL: {item.san_pham_order[index].so_luong}
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
            style={{flexDirection: 'row', maxWidth: 160, alignItems: 'center'}}>
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
      </View>
      <Image
        // source={{uri: item.data.featured_image[0]}}
        source={{
          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0qTl31Xof9ahjahcSbZVgLfwPPzKLV8LV8rCd5AhczA&s',
        }}
        style={{
          width: 200,
          height: 200,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
        }}
      />
    </TouchableOpacity>
  );

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
      <FlatList
        style={{width: '100%'}}
        data={userDataList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
