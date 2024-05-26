import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {db, collection, getDocs, query, where} from '../firebase';
import {useRoute, useNavigation, useIsFocused} from '@react-navigation/native';
import {AntDesign} from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import {translateStatusOrders} from '../utils/globalHelpers';

export default function OrdersScreen() {
  const [userDataList, setUserDataList] = useState([]);
  const [isLoadingSpinner, setIsLoadingSpinner] = useState(true);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused) {
      refreshData();
      console.log('refreshing data...');
    }
  }, [isFocused]);

  const getUserId = async () => {
    try {
      const userProfile = await AsyncStorage.getItem('usersProfile');
      if (userProfile) {
        const {currentUser} = JSON.parse(userProfile);
        return currentUser._userId;
      }
      console.error('userProfile or currentUser is undefined or null.');
      return null;
    } catch (error) {
      console.error('Error retrieving user ID:', error);
      return null;
    }
  };

  const refreshData = async () => {
    const userId = await getUserId();
    if (!userId) {
      return;
    }
    try {
      console.log('Refreshing favourite data...');
      const orders = await getOrdersForUser(userId);
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
      return querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
      console.error('Error getting orders for user:', error);
      return [];
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingSpinner(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const getTotalQuantity = san_pham_order => {
    return san_pham_order.reduce((total, item) => total + item.so_luong, 0);
  };

  const renderItem = ({item}) => {
    const totalQuantity = getTotalQuantity(item.san_pham_order);
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('DetailItemOrderedUser', {orderIdItem: item._id})
        }
        style={styles.orderItemContainer}>
        <View style={styles.orderItemDetails}>
          <Text numberOfLines={1} style={styles.orderId}>
            #{item.ma_don_hang}
          </Text>
          <Text numberOfLines={1}>
            Sản phẩm đã đặt ({item.san_pham_order.length})
          </Text>
          <View style={styles.productList}>
            {item.san_pham_order.slice(0, 2).map((product, index) => (
              <Text key={index} numberOfLines={1} style={styles.productName}>
                - {product.ten_sp}
              </Text>
            ))}
          </View>
          <Text style={styles.totalQuantity}>
            Tổng số lượng: {totalQuantity}
          </Text>
          <Text style={styles.totalPrice}>{item.tong_tien}</Text>
          <View style={styles.statusContainer}>
            <Image
              style={styles.statusIcon}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/2769/2769388.png',
              }}
            />
            <Text style={styles.statusText}>
              {translateStatusOrders(item.status)}
            </Text>
          </View>
        </View>
        <View>
          <Image
            style={styles.orderImage}
            source={{
              uri: 'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fproducts%2Fitem-default%2Fitem-order-no-image.jpg?alt=media&token=251d05cb-9618-4ff6-951f-0c1122273a18',
            }}
          />
          <View style={styles.viewDetails}>
            <Text style={styles.viewDetailsText}>Xem chi tiết</Text>
            <AntDesign name='doubleright' size={18} color='blue' />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Spinner
        overlayColor={'#fff'}
        color='#000'
        visible={true}
        textContent={'Đang tải thông tin đơn hàng...'}
        textStyle={styles.spinnerText}
      /> */}
      {isLoadingSpinner ? (
        <Spinner
          overlayColor={'#fff'}
          color='#999'
          visible={isLoadingSpinner}
          textContent={'Đang tải thông tin đơn hàng...'}
          textStyle={styles.spinnerText}
        />
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerText}>Đơn hàng của bạn</Text>
          </View>
          {userDataList.length > 0 ? (
            <FlatList
              style={styles.flatList}
              data={userDataList}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
            />
          ) : (
            <View style={styles.noOrdersContainer}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/5058/5058432.png',
                }}
                style={{width: 200, height: 200, marginLeft: 40}}
              />
              <Text style={styles.noOrdersTitle}>Opps...!</Text>
              <Text style={styles.noOrdersText}>Bạn chưa có đơn hàng nào</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    width: '100%',
  },
  spinnerText: {
    // backgroundColor: 'red',
    marginBottom: 60,
    color: '#333',
    fontSize: 18,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 26,
    fontWeight: '500',
    paddingBottom: 20,
  },
  flatList: {
    width: '100%',
  },
  noOrdersContainer: {
    // height: '100%',
    maxHeight: 713,
    minHeight: 713,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noOrdersTitle: {
    fontWeight: '700',
    fontSize: 28,
    marginTop: 16,
  },
  noOrdersText: {
    fontSize: 20,
  },
  orderItemContainer: {
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
    maxHeight: 198,
    minHeight: 198,
  },
  orderItemDetails: {
    padding: 14,
    maxWidth: '50%',
    minWidth: '50%',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    maxWidth: 160,
  },
  productList: {
    minHeight: 45,
    maxHeight: 45,
  },
  productName: {
    fontSize: 16,
    maxWidth: 310,
    paddingLeft: 6,
  },
  totalQuantity: {
    marginTop: 4,
    borderRadius: 4,
    fontSize: 16,
  },
  totalPrice: {
    color: '#ee4d2d',
    fontWeight: '600',
    fontSize: 18,
    marginTop: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    maxWidth: 170,
  },
  statusIcon: {
    width: 23,
    height: 23,
  },
  statusText: {
    color: 'green',
    paddingLeft: 10,
  },
  orderImage: {
    width: 198,
    height: 198,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  viewDetails: {
    flexDirection: 'row',
    paddingTop: 10,
    alignItems: 'center',
    zIndex: 999,
    position: 'absolute',
    bottom: 4,
    right: 12,
  },
  viewDetailsText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
