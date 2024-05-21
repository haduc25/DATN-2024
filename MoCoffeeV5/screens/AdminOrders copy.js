import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import CustomStatusBar from '../components/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Button from '../components/Button';

import {AntDesign} from '@expo/vector-icons';
import {db, getDocs, collection} from '../firebase';

import {useNavigation, useIsFocused} from '@react-navigation/native';

export default function AdminOrders({navigation}) {
  const renderItem = ({item}) => (
    <View
      key={item._id}
      style={{
        width: 395,
        // minHeight: 200,
        minHeight: 250,
        //   paddingHorizontal: 20,
        //   marginHorizontal: 10,

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
              Mã đơn: #{item._id}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text numberOfLines={1} style={{fontSize: 16, maxWidth: 245}}>
                Tình trạng:{' '}
              </Text>
              <View
                style={{
                  backgroundColor: 'green',
                  borderRadius: 5,
                  padding: 2,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                  }}>
                  Đang giao hàng
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
                  Minh Đức
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
                  style={{
                    fontWeight: 'bold',
                  }}>
                  {/* Tổ 7, thị trấn Chợ Mới, huyện Chợ Mới, tỉnh Bắc Kạn. */}
                  Tổ 7, thị trấn Chợ Mới...
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text numberOfLines={1} style={{fontSize: 16, maxWidth: 245}}>
                Số ĐT:{' '}
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
                  0964103861
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text numberOfLines={1} style={{fontSize: 16, maxWidth: 245}}>
                Sản phẩm:{' '}
              </Text>
              <View
                style={{
                  padding: 2,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                  }}>
                  {item.name}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text numberOfLines={1} style={{fontSize: 16, maxWidth: 245}}>
                Số lượng:{' '}
              </Text>
              <View
                style={{
                  padding: 2,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                  }}>
                  1
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text numberOfLines={1} style={{fontSize: 16, maxWidth: 245}}>
                Thành tiền:{' '}
              </Text>
              <View
                style={{
                  padding: 2,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                  }}>
                  41.000 ₫
                </Text>
              </View>
            </View>

            {/* price */}
            <Text
              style={{
                color: '#ee4d2d',
                fontWeight: '600',
                fontSize: 18,
              }}>
              {item.price}.000 ₫
            </Text>
          </View>
          <Image
            style={{width: 100, height: 100, borderRadius: 8}}
            source={{
              uri: item.featured_image[0],
              // uri: 'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fproducts%2Ftemp%2Fimages.jpg?alt=media&token=378984d7-948f-4240-8c8d-f41c31ca0b12',
            }}
          />
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
          style={{
            borderWidth: 1,
            height: 45,
            width: 120,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
            borderRadius: 8,
          }}>
          <Text style={{fontWeight: '600'}}>Xem chi tiết</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            height: 45,
            width: 120,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
          }}>
          <Text style={{fontWeight: '600'}}>Chỉnh sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
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
          maxHeight: 200,
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
            flex: 1,
            alignItems: 'center',
            // justifyContent: 'center',
            // borderTopColor: '#ccc',
            // borderTopWidth: 0.5,
          }}>
          {/* ITEMS */}
          <FlatList
            style={{width: '100%', paddingBottom: 250}}
            // data={products}
            data={products}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />

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