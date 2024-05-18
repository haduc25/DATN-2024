import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import CustomStatusBar from '../components/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Button from '../components/Button';

import {AntDesign} from '@expo/vector-icons';
import {db, getDocs, collection, updateDoc, doc} from '../firebase';

import {useNavigation, useIsFocused} from '@react-navigation/native';
import {
  translatePaymentMethod,
  translateStatusOrders,
  convertStatusToMessage,
  getOrderStatusBackgroundColor,
  isShippedOrCancelled,
  convertISOToFormattedDate,
  convertFormattedDateToISO,
  convertFormattedDateToUnixTime,
} from '../utils/globalHelpers';

export default function AdminOrders({navigation}) {
  const renderItem = ({item, index}) => (
    <View
      key={item.ma_don_hang}
      style={{
        width: 395,
        // minHeight: 200,
        // minHeight: 250,
        // minHeight: 340,
        // minHeight: 320,
        minHeight: item.san_pham_order.length > 3 ? 380 : 360,
        //   paddingHorizontal: 20,
        //   marginHorizontal: 10,

        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,

        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
        // marginBottom: 8,
        // marginBottom: index === orders.length - 1 ? 100 : 8, // Kiểm tra nếu là phần tử cuối cùng, thêm 100  vào marginBottom, nếu không thì thêm 8
        marginBottom: sortRefresh
          ? index === sortedOrders.length - 1
            ? 100
            : 8
          : index === orders.length - 1
          ? 100
          : 8,
        // `marginBottom...`: Dòng code này sử dụng toán tử ba ngôi để kiểm tra giá trị của sortRefresh. Nếu sortRefresh là true, nó kiểm tra xem index có bằng với độ dài của mảng sortedOrders trừ đi 1 không. Nếu đúng, giá trị của marginBottom sẽ là 100, ngược lại sẽ là 8. Nếu sortRefresh là false, nó tương tự kiểm tra index với độ dài của mảng orders.
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: {width: 0, height: 0},
        elevation: 5,
        // maxHeight: 200,
        maxHeight: 500,
      }}>
      {/* {console.log('item123: ', item)} */}
      {/* {console.log('item.san_pham_order: ', item.san_pham_order.length)} */}
      <View style={{flexDirection: 'row'}}>
        {/* TOP */}
        <View
          style={{
            padding: 14,
            //   borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            //   backgroundColor: 'blue',
            backgroundColor: '#fff',
            //   height: 120,
            borderRadius: 10,
          }}>
          <View
            style={{
              // backgroundColor: 'pink',
              backgroundColor: '#fff',
              height: 120,
            }}>
            {/* product name */}
            <Text
              numberOfLines={1}
              style={{fontSize: 16, fontWeight: '600', maxWidth: 245}}>
              {/* Mã đơn: #{item._id.slice(0, 9)} */}
              Mã đơn: #{item.ma_don_hang}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text numberOfLines={1} style={{fontSize: 16, maxWidth: 245}}>
                Tình trạng:{' '}
              </Text>
              <View
                style={{
                  backgroundColor: getOrderStatusBackgroundColor(item.status),
                  borderRadius: 5,
                  padding: 4,
                  paddingLeft: 6,
                  paddingRight: 6,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    maxWidth: 200,
                  }}>
                  {/* Đang giao hàng */}
                  {translateStatusOrders(item.status)}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text numberOfLines={1} style={{fontSize: 16, maxWidth: 245}}>
                Người nhận:{' '}
              </Text>
              <View
                style={{
                  padding: 2,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                  }}>
                  {item.nguoi_nhan}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text numberOfLines={1} style={{fontSize: 16, maxWidth: 245}}>
                Địa chỉ:{' '}
              </Text>
              <View
                style={{
                  padding: 2,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontWeight: 'bold',
                    maxWidth: 310,
                  }}>
                  {/* Tổ 7, thị trấn Chợ Mới, huyện Chợ Mới, tỉnh Bắc Kạn. */}
                  {/* Tổ 7, thị trấn Chợ Mới... */}
                  {item.dia_chi}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingBottom: 10,
              }}>
              <Text numberOfLines={1} style={{fontSize: 16, maxWidth: 245}}>
                Số điện thoại:{' '}
              </Text>
              <View
                style={{
                  padding: 2,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                  }}>
                  {/* Tổ 7, thị trấn Chợ Mới, huyện Chợ Mới, tỉnh Bắc Kạn. */}
                  {item.so_dien_thoai}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: 365,
                borderTopWidth: 0.5,
                borderTopColor: '#ccc',
                paddingBottom: 10,
              }}
            />
            <Text style={{fontSize: 16, fontWeight: '600'}}>
              Sản phẩm đã đặt ({item.san_pham_order.length})
            </Text>
            {item.san_pham_order.slice(0, 3).map((itemOrdered, index) => (
              <View key={index}>
                <Text
                  style={{fontSize: 16, maxWidth: 310, paddingLeft: 6}}
                  numberOfLines={1}>
                  -{' '}
                  {`${itemOrdered.ten_sp} (SL: ${
                    itemOrdered.so_luong
                  }), Size: ${itemOrdered?.selected_size ?? 'S'}`}
                </Text>
                {/* <Text style={{fontSize: 16}}>Số lượng: {itemOrdered.so_luong}</Text> */}
              </View>
            ))}
            {item.san_pham_order.length > 5 && (
              <Text style={{fontSize: 16, paddingLeft: 18, paddingBottom: 6}}>
                ...
              </Text>
            )}
            {/* price */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text numberOfLines={1} style={{fontSize: 16, maxWidth: 245}}>
                Tổng tiền:{' '}
              </Text>
              <View
                style={{
                  padding: 2,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                  }}>
                  {item.tong_tien}
                </Text>
              </View>
            </View>
            {/* Phuong thuc thanh toan */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text numberOfLines={1} style={{fontSize: 16, maxWidth: 245}}>
                Thanh toán:{' '}
              </Text>
              <View
                style={{
                  padding: 2,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                  }}>
                  {translatePaymentMethod(item.phuong_thuc_thanh_toan)}
                </Text>
              </View>
            </View>
            {/* Thời gian tạo đơn */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text numberOfLines={1} style={{fontSize: 16, maxWidth: 245}}>
                Thời gian tạo đơn:{' '}
              </Text>
              <View
                style={{
                  padding: 2,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    maxWidth: 310,
                    fontWeight: 'bold',
                  }}>
                  {item.thoi_gian_tao_don_hang}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* BOTTOM */}
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderTopColor: '#ccc',
          borderTopWidth: 0.5,

          // backgroundColor: 'red',
          backgroundColor: '#fff',
          height: 65,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}>
        <TouchableOpacity
          onPress={() => navi.navigate('DetailItemOrdered', {item})}
          // onPress={() => console.log('item_DETAIL: ', item)}
          style={{
            borderWidth: 1,
            height: 45,
            width: 120,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
            // marginRight: item.status === 'shipped' ? 8 : 0,
            marginRight: isShippedOrCancelled(item.status) ? 0 : 8,
            borderRadius: 8,
            // flex: item.status === 'shipped' ? 1 : 0,
            flex: isShippedOrCancelled(item.status) ? 0 : 1,
          }}>
          <Text style={{fontWeight: '600'}}>Xem chi tiết</Text>
        </TouchableOpacity>
        {isShippedOrCancelled(item.status) && (
          <TouchableOpacity
            // onPress={() => console.log('MA DON HANG: ', item.ma_don_hang)}
            onPress={() =>
              handleApproveOrders(item._id, item.ma_don_hang, item.status)
            }
            style={{
              borderWidth: 1,
              height: 45,
              width: 120,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
            }}>
            <Text style={{fontWeight: '600'}}>
              {convertStatusToMessage(item.status)}
            </Text>
          </TouchableOpacity>
        )}

        {isShippedOrCancelled(item.status) && (
          <TouchableOpacity
            onPress={() =>
              handleCancelOrders(item._id, item.ma_don_hang, item.status)
            }
            style={{
              borderWidth: 1,
              height: 45,
              width: 120,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 8,
              borderRadius: 8,
            }}>
            <Text style={{fontWeight: '600'}}>Hủy đơn</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // GET ITEMS FROM FIREBASE
  //   create fake data
  const [products, setProducts] = useState([
    {
      _id: 'TEA190424001',
      available: true,
      available_sizes: ['M', 'L'],
      category: 'tea',
      description: '',
      featured_image: [
        'https://cong-news.appwifi.com/wp-content/uploads/2023/02/tra%CC%80-qua%CC%82%CC%81t-ma%CC%A3%CC%82t-ong_%C4%91a%CC%81.jpg',
      ],
      likes: '3',
      name: 'Trà quất',
      preparation_time: '5',
      price: '20',
      ratings: {
        average_rating: '4.6',
        total_ratings: '10',
      },
      sold_count: '20',
    },
  ]);

  const [orders, setOrders] = useState([]);
  const isFocused = useIsFocused();
  // ############################# START: FECTHING DATA #############################
  const readMultiple = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'OrdersConfirmation'));
      const orders = [];

      querySnapshot.forEach(doc => {
        if (doc.exists()) {
          orders.push({id: doc.id, ...doc.data()});
          console.log('Document data:', doc.id, doc.data());
        } else {
          console.log('Document does not exist1:', doc.id);
        }
      });

      // Sắp xếp theo một trường nào đó trong đơn hàng, ví dụ: theo ngày tạo
      // orders.sort((a, b) => a.createdAt - b.createdAt);

      return orders;
    } catch (error) {
      console.error('Error getting documents:', error);
      alert('Error getting documents:', error);
      return [];
    }
  };

  const fetchData = async () => {
    try {
      const ordersData = await readMultiple();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // ############################# END: FECTHING DATA #############################

  useEffect(() => {
    if (isFocused) {
      fetchData();
      console.log('Fetching Data Orders (OrdersConfirmation)...');
    }
  }, [isFocused]);

  // navigation
  const navi = useNavigation();

  // handle duyet don hang
  const handleApproveOrders = (orderId, ma_don_hang, orderStatus) => {
    console.log('orderId, orderStatus: ', orderId, orderStatus);

    if (orderId && orderStatus && orderStatus === 'pending') {
      Alert.alert(
        'Xác nhận duyệt đơn hàng',
        `Bạn có chắc muốn duyệt đơn #${ma_don_hang}?`,
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Xác nhận',
            onPress: () => {
              const timeNow = new Date().toISOString();
              const updateAt = convertISOToFormattedDate(timeNow);
              // Thực hiện cập nhật
              updateDoc(doc(db, 'OrdersConfirmation', orderId), {
                status: 'processing',
                thoi_gian_cap_nhat_don_hang_moi_nhat: updateAt,
              })
                .then(() => {
                  // Dữ liệu cập nhật thành công
                  console.log(`Duyệt đơn #${orderId} thành công!!!`);
                  alert(`Duyệt đơn #${ma_don_hang} thành công!!!`);
                  fetchData(); // Lấy dữ liệu mới
                })
                .catch(error => {
                  // Xử lý lỗi
                  console.log('error: ', error);
                  alert('error: ', error);
                });
            },
          },
        ],
        {cancelable: false},
      );
      return;
    }

    if (orderId && orderStatus && orderStatus === 'processing') {
      // Hiển thị cảnh báo xác nhận
      Alert.alert(
        'Xác nhận đã xử lý xong',
        `Chuyển đơn hàng #${ma_don_hang} qua trạng thái giao hàng?`,
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Xác nhận',
            onPress: () => {
              // Thực hiện cập nhật
              const timeNow = new Date().toISOString();
              const updateAt = convertISOToFormattedDate(timeNow);
              updateDoc(doc(db, 'OrdersConfirmation', orderId), {
                status: 'shipping',
                thoi_gian_cap_nhat_don_hang_moi_nhat: updateAt,
              })
                .then(() => {
                  // Dữ liệu cập nhật thành công
                  console.log(`Duyệt đơn #${orderId} thành công!!!`);
                  alert(`Duyệt đơn #${ma_don_hang} thành công!!!`);
                  fetchData(); // Lấy dữ liệu mới
                })
                .catch(error => {
                  // Xử lý lỗi
                  console.log('error: ', error);
                  alert('error: ', error);
                });
            },
          },
        ],
        {cancelable: false},
      );
      return;
    }

    if (orderId && orderStatus && orderStatus === 'shipping') {
      // Hiển thị cảnh báo xác nhận
      Alert.alert(
        'Xác nhận đã giao hàng',
        `Xác nhận đã giao đơn hàng #${ma_don_hang} thành công!`,
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Xác nhận',
            onPress: () => {
              // Thực hiện cập nhật
              const timeNow = new Date().toISOString();
              const updateAt = convertISOToFormattedDate(timeNow);
              updateDoc(doc(db, 'OrdersConfirmation', orderId), {
                status: 'shipped',
                thoi_gian_cap_nhat_don_hang_moi_nhat: updateAt,
              })
                .then(() => {
                  // Dữ liệu cập nhật thành công
                  console.log(`Duyệt đơn #${orderId} thành công!!!`);
                  alert(`Duyệt đơn #${ma_don_hang} thành công!!!`);
                  fetchData(); // Lấy dữ liệu mới
                })
                .catch(error => {
                  // Xử lý lỗi
                  console.log('error: ', error);
                  alert('error: ', error);
                });
            },
          },
        ],
        {cancelable: false},
      );
      return;
    }

    if (orderId && orderStatus && orderStatus === 'wait4pay') {
      Alert.alert(
        'Xác nhận thanh toán & duyệt đơn hàng',
        `Người dùng đã thanh toán đơn này? Bạn có chắc muốn duyệt đơn #${ma_don_hang}?`,
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Xác nhận',
            onPress: () => {
              // Thực hiện cập nhật
              const timeNow = new Date().toISOString();
              const updateAt = convertISOToFormattedDate(timeNow);
              updateDoc(doc(db, 'OrdersConfirmation', orderId), {
                status: 'processing',
                thoi_gian_cap_nhat_don_hang_moi_nhat: updateAt,
              })
                .then(() => {
                  // Dữ liệu cập nhật thành công
                  console.log(`Duyệt đơn #${orderId} thành công!!!`);
                  alert(`Duyệt đơn #${ma_don_hang} thành công!!!`);
                  fetchData(); // Lấy dữ liệu mới
                })
                .catch(error => {
                  // Xử lý lỗi
                  console.log('error: ', error);
                  alert('error: ', error);
                });
            },
          },
        ],
        {cancelable: false},
      );
      return;
    }
  };

  const handleCancelOrders = (orderId, ma_don_hang, orderStatus) => {
    if (orderId && orderStatus && orderStatus !== 'cancelled') {
      Alert.alert(
        'Xác nhận hủy đơn hàng',
        `Bạn có chắc muốn hủy đơn #${ma_don_hang} này không?`,
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Hủy đơn hàng',
            onPress: () => {
              // Thực hiện cập nhật
              const timeNow = new Date().toISOString();
              const updateAt = convertISOToFormattedDate(timeNow);
              updateDoc(doc(db, 'OrdersConfirmation', orderId), {
                status: 'cancelled',
                thoi_gian_cap_nhat_don_hang_moi_nhat: updateAt,
              })
                .then(() => {
                  // Dữ liệu cập nhật thành công
                  console.log(`Đã hủy đơn #${orderId}!!!`);
                  alert(`Đã hủy đơn #${ma_don_hang}!!!`);
                  fetchData(); // Lấy dữ liệu mới
                })
                .catch(error => {
                  // Xử lý lỗi
                  console.log('error: ', error);
                  alert('error: ', error);
                });
            },
            style: 'destructive', // Thêm style 'destructive' để làm màu nút đỏ
          },
        ],
        {cancelable: false},
      );
      return;
    }
  };

  // ################### SORT ################### //
  const [sortRefresh, setSortRefresh] = useState(false);
  const [sortedOrders, setSortedOrders] = useState(orders);

  const sortOrder = orderBy => {
    switch (orderBy) {
      case 'newest':
        const timestamps = orders.map(order => ({
          timestamp: convertFormattedDateToUnixTime(
            order.thoi_gian_tao_don_hang,
          ),
          orderData: order,
        }));
        timestamps.sort((a, b) => b.timestamp - a.timestamp);
        const newSortedOrders = timestamps.map(item => item.orderData);
        setSortedOrders(newSortedOrders);
        setSortRefresh(true);
        break;
      case 'pending':
        const pendingOrders = orders.filter(
          order => order.status === 'pending' || order.status === 'wait4pay',
        );
        console.log('pendingOrders: ', pendingOrders);
        setSortedOrders(pendingOrders);
        setSortRefresh(true);
        break;
      case 'processing':
        const processingOrders = orders.filter(
          order => order.status === 'processing',
        );
        console.log('pendingOrders: ', processingOrders);
        setSortedOrders(processingOrders);
        setSortRefresh(true);
        break;
      case 'shipping':
        const shippingOrders = orders.filter(
          order => order.status === 'shipping' || order.status === 'shipped',
        );
        console.log('pendingOrders: ', shippingOrders);
        setSortedOrders(shippingOrders);
        setSortRefresh(true);
        break;
      case 'cancelled':
        const cancelledOrders = orders.filter(
          order => order.status === 'cancelled',
        );
        console.log('pendingOrders: ', cancelledOrders);
        setSortedOrders(cancelledOrders);
        setSortRefresh(true);
        break;
      default:
        // Đặt sortedOrders bằng orders ban đầu
        setSortedOrders(orders);
        setSortRefresh(false);
    }
  };

  return (
    <SafeAreaProvider>
      <CustomStatusBar
        backgroundColor='#fff'
        canGoBack={true}
        heightOfTop={50}
        customStyleIconBack={{marginBottom: 20}}
        customStyleFormStatusBar={{
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 10,
          shadowOffset: {width: 0, height: 0},
          elevation: 5,
          // maxHeight: 200,
          maxHeight: 500,
        }}
        arrowIconColor={'#000'}
        arrowIconBackgroundColor={'#fff'}
        titleOfScreen={'Danh sách đơn đặt hàng'}
        onPressBack={data => console.log(data)}
        dataNavigation={{
          screen: 'AdminDashboardScreen',
        }}
      />
      <View
        style={{
          flex: 1,
          paddingTop: 100,
          backgroundColor: '#fff',
        }}>
        {/* PARENT OF THIS COMPONENT */}
        <View
          style={{
            // flex: 1,
            alignItems: 'center',
          }}>
          {/* Chức năng SORT */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              height: 50,
              width: '100%',
              marginTop: 8,
              borderBottomWidth: 0.5,
              borderBottomColor: '#ccc',
            }}>
            <TouchableOpacity
              // onPress={sortOrdersByNewest}
              onPress={() => sortOrder('allin')}
              style={{
                backgroundColor: '#7EC7E7',
                marginLeft: 14,
                height: 40,
                minWidth: 80,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                padding: 4,
              }}>
              <Text style={{color: '#fff', fontWeight: '600'}}>Tất cả</Text>
            </TouchableOpacity>

            <TouchableOpacity
              // onPress={sortOrdersByNewest}
              onPress={() => sortOrder('newest')}
              style={{
                backgroundColor: '#8aacb8',
                marginLeft: 14,
                height: 40,
                minWidth: 80,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                padding: 4,
              }}>
              <Text style={{color: '#fff', fontWeight: '600'}}>Mới nhất</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => sortOrder('pending')}
              style={{
                backgroundColor: '#737373',
                marginLeft: 14,
                height: 40,
                minWidth: 80,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                padding: 4,
                paddingHorizontal: 8,
              }}>
              <Text style={{color: '#fff', fontWeight: '600'}}>Chưa duyệt</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => sortOrder('shipping')}
              style={{
                backgroundColor: '#4ca64c',
                marginLeft: 14,
                height: 40,
                minWidth: 80,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                padding: 4,
                paddingHorizontal: 8,
              }}>
              <Text style={{color: '#fff', fontWeight: '600'}}>
                Đang giao hàng
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => sortOrder('processing')}
              style={{
                backgroundColor: '#5d5dff',
                marginLeft: 14,
                height: 40,
                minWidth: 80,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                padding: 4,
                paddingHorizontal: 8,
              }}>
              <Text style={{color: '#fff', fontWeight: '600'}}>Đang xử lý</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => sortOrder('cancelled')}
              style={{
                backgroundColor: '#ff4c4c',
                marginLeft: 14,
                height: 40,
                minWidth: 80,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                padding: 4,
                paddingHorizontal: 8,
              }}>
              <Text style={{color: '#fff', fontWeight: '600'}}>Đã hủy</Text>
            </TouchableOpacity>
          </ScrollView>
          {/* ITEMS */}
          <FlatList
            style={{width: '100%', paddingBottom: 250}}
            // // data={products}
            // // data={orders}
            // data={sortedOrders}
            // renderItem={renderItem}
            // keyExtractor={(item, index) => index.toString()}

            data={sortRefresh ? sortedOrders : orders}
            // data={sortedOrders}
            renderItem={renderItem}
            keyExtractor={item => item._id}
          />
          {/* {console.log('1orders__: ', orders)} */}

          {/* {products.map(product => (
            <View key={product._id}>
              <Text>{product.name}</Text>
            </View>
          ))} */}
        </View>
      </View>
      {/* BUTTON */}
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          // backgroundColor: 'yellow',
          flexDirection: 'row',
          justifyContent: 'center',
          // paddingHorizontal: 20,
          // paddingVertical: 10,
          // backgroundColor: '#fff', // Change this to match your background color
          borderColor: '#ccc', // Change this to match your border color
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}>
        {/* <TouchableOpacity
          onPress={() => navi.navigate('Trang chủ')}
          style={{
            justifyContent: 'center',
            // borderWidth: 1,
            borderRadius: '15%',
            width: '100%',
            alignItems: 'center',
            backgroundColor: '#000',
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: '600',
            }}>
            Trang chủ
          </Text>
        </TouchableOpacity> */}
        {/* <Button
          title={'Thêm 1 sản phẩm mới'}
          onPress={() => navi.navigate('AdminCRUDItem')}
          // loading={loading.buttonLoading}
          // disabled={loading.buttonLoading}
          buttonStyleCustom={{
            borderRadius: '15%',
            paddingVertical: 16,
            backgroundColor: '#ff4c4c',
            width: '100%',
          }}
          textStyleInsideButtonCustom={{textTransform: 'uppercase'}}
        /> */}
      </View>
    </SafeAreaProvider>
  );
}
