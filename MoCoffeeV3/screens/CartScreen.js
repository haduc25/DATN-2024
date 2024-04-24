import {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import {
  Ionicons,
  FontAwesome5,
  Feather,
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  cleanCart,
} from '../redux/CartReducer';
import CustomStatusBar from '../components/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useRoute, useNavigation} from '@react-navigation/native';
import {
  convertPriceStringToInteger,
  convertIntegerToPriceString,
} from '../utils/globalHelpers';

export default function CartScreen({navigation}) {
  // console.log('navigation: ', navigation);
  // console.log('route: ', route);

  // #################### VALUE #################### //
  // REDUX
  const cart = useSelector(state => state.cart.cart);
  const productInfo = useSelector(state => state.productInfo);
  const isCartClean = useSelector(state => state.cart.isClean);
  // console.log('DATA FROM REDUX: ', productInfo);
  // console.log('DATA FROM REDUX222_Cart: ', isCartClean);
  const dispatch = useDispatch();
  const paymentMethods = [
    {
      id: '0',
      name: 'Tiền mặt',
      value: 'cash',
      url: 'https://cdn-icons-png.flaticon.com/512/1052/1052866.png',
      urlQRPayment:
        'https://ae01.alicdn.com/kf/S6a9c7c41476e4e3f8e23cd5eb00adc181.jpg',
    },
    {
      id: '1',
      name: 'Thẻ tín dụng',
      value: 'credit',
      url: 'https://cdn-icons-png.flaticon.com/128/8983/8983163.png',
      urlQRPayment:
        'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fpayment-QR%2Fbidv-qr.jpg?alt=media&token=db041e7b-552a-4507-8c4d-f1285e00e8b0',
    },
    {
      id: '2',
      name: 'Ví Momo',
      value: 'momowallet',
      url: 'https://i.pinimg.com/736x/0a/21/61/0a2161c76c50b3a7615cb470f25e4096.jpg',
      urlQRPayment:
        'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fpayment-QR%2Fmomo-qr.jpg?alt=media&token=7b457eea-e268-4721-864d-5b290dfe8d3d',
    },
    {
      id: '3',
      name: 'Ví ZaloPay',
      value: 'zalopaywallet',
      url: 'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Ficons%2Fzalopay-icon.jpg?alt=media&token=e414910c-dd0d-47ed-9178-639968ace449',
      urlQRPayment:
        'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fpayment-QR%2Fzalopay-qr.jpg?alt=media&token=1a64e81a-0a97-45c2-922e-fa55732d05eb',
    },
  ];

  let total = cart
    ?.map(item => item.quantity * convertPriceStringToInteger(item.price))
    .reduce((curr, prev) => curr + prev, 0);
  // console.log('total_CART: ', total);

  //
  const route = useRoute();
  const {currentScreen, category} = route?.params;

  // console.log('currentScreen_CART:  ', currentScreen);
  //  PHÍ GIAO HÀNG
  const phiship = 15000;
  const phiapdung = 6000;

  // state của `Thanh toán`
  const [activeIndex, setActiveIndex] = useState(0); // Lưu trạng thái của phần tử được chọn
  useEffect(() => {
    setActiveIndex(0);
  }, []);

  const [showQR, setShowQR] = useState(false);

  const kiemTraPhuongThucThanhToan = (index, value) => {
    console.log('value[index]: ', value[index]);
    switch (value[index].value) {
      case 'cash':
        console.log(
          'cash - chuyển qua màn hình đặt hàng thành công  (đơn hàng đang được xử lý)',
        );
        break;

      case 'credit':
        console.log('credit - hiện ra thông tin thanh toán, mã QR các thứ');
        break;

      case 'momowallet':
        console.log('momowallet - hiện ra thông tin thanh toán, mã QR các thứ');
        break;

      case 'zalopaywallet':
        console.log(
          'zalopaywallet - hiện ra thông tin thanh toán, mã QR các thứ',
        );
        break;

      default:
        console.log('Thanh toán k hợp lệ!!!');
        break;
    }
  };

  return (
    // <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    //   <Text
    //     onPress={() => navigation.navigate('Home')}
    //     style={{fontSize: 26, fontWeight: 'bold'}}>
    //     Cart Screen
    //   </Text>
    // </View>
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
        titleOfScreen={'Giỏ hàng'}
        onPressBack={data => console.log(data)}
        dataNavigation={{
          screen: currentScreen,
          category: category,
        }}
      />
      <ScrollView
        style={{
          padding: 10,
          flex: 1,
          backgroundColor: '#F0F8FF',
          paddingTop: 100,
        }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 8,
            marginTop: 15,
            borderRadius: 8,
          }}>
          <Text>
            Giao hàng trong{' '}
            <Text style={{fontWeight: '500'}}>15 - 20 phút</Text>
          </Text>
        </View>

        <View style={{marginVertical: 12}}>
          <Text
            style={{
              textAlign: 'center',
              letterSpacing: 3,
              fontSize: 15,
              color: 'gray',
            }}>
            {cart.length ? 'CÁC SẢN PHẨM TRONG GIỎ HÀNG' : 'GIỎ HÀNG TRỐNG'}
          </Text>
        </View>

        <View>
          {cart?.map((item, index) => (
            <Pressable
              style={{backgroundColor: 'white', padding: 10}}
              key={index}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 6,
                }}>
                <Text style={{width: 200, fontSize: 16, fontWeight: '600'}}>
                  {item?.name}
                </Text>
                <Pressable
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    alignItems: 'center',
                    borderColor: '#BEBEBE',
                    borderWidth: 0.5,
                    borderRadius: 10,
                    minWidth: 100,
                    maxWidth: 100,
                  }}>
                  <Pressable
                    onPress={() => {
                      dispatch(decrementQuantity(item));
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        color: 'green',
                        paddingHorizontal: 6,
                        fontWeight: '600',
                      }}>
                      -
                    </Text>
                  </Pressable>

                  <Pressable>
                    <Text
                      style={{
                        fontSize: 19,
                        color: 'green',
                        paddingHorizontal: 8,
                        fontWeight: '600',
                      }}>
                      {item.quantity}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      dispatch(incrementQuantity(item));
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        color: 'green',
                        paddingHorizontal: 6,
                        fontWeight: '600',
                      }}>
                      +
                    </Text>
                  </Pressable>
                </Pressable>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  {/* {item.price * item.quantity}.000 ₫ */}
                  {/* {item.price * item.quantity} */}
                  {convertIntegerToPriceString(
                    convertPriceStringToInteger(item.price) * item.quantity,
                  )}
                </Text>
                <Text style={{fontSize: 15, fontWeight: '500'}}>
                  Số lượng: {item?.quantity}
                </Text>
              </View>
            </Pressable>
          ))}

          <View style={{marginVertical: 10}}>
            <Text style={{fontSize: 16, fontWeight: '600'}}>
              Phương thức thanh toán
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {paymentMethods?.map((item, index) => (
                <Pressable
                  onPress={() => {
                    setActiveIndex(index);
                    console.log('index: ', index);
                    switch (paymentMethods[index].value) {
                      case 'cash':
                        setShowQR(false);
                        console.log(
                          'cash - chuyển qua màn hình đặt hàng thành công  (đơn hàng đang được xử lý)',
                        );
                        break;

                      case 'credit':
                        setShowQR(true);
                        console.log(
                          'credit - hiện ra thông tin thanh toán, mã QR các thứ',
                        );
                        break;

                      case 'momowallet':
                        setShowQR(true);
                        console.log(
                          'momowallet - hiện ra thông tin thanh toán, mã QR các thứ',
                        );
                        break;

                      case 'zalopaywallet':
                        setShowQR(true);
                        console.log(
                          'zalopaywallet - hiện ra thông tin thanh toán, mã QR các thứ',
                        );
                        break;

                      default:
                        setShowQR(false);
                        console.log('Thanh toán k hợp lệ!!!');
                        break;
                    }
                  }}
                  key={index}
                  style={{
                    margin: 10,
                    borderRadius: 10,
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingHorizontal: 8,
                    backgroundColor:
                      activeIndex === index ? 'lightblue' : 'white', // Thay đổi màu nền nếu được chọn
                    borderWidth: 1,
                    borderColor: activeIndex === index ? '#ccc' : 'transparent',
                  }}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 50,
                        borderWidth: 0.5,
                        borderColor: '#ccc',
                        resizeMode: 'center',
                      }}
                      source={{
                        uri: item?.url,
                      }}
                    />
                    <Text
                      style={{
                        width: 75,
                        fontSize: 13,
                        color: '#383838',
                        paddingTop: 10,
                        textAlign: 'center',
                      }}>
                      {item?.name}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* START: PAYMENT ATM, MOMO, ZALO */}
          {showQR && (
            <View>
              <Text>Vui lòng thanh toán qua</Text>
              <View style={{alignItems: 'center', padding: 14}}>
                <Image
                  style={{
                    width: 250,
                    height: 250,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#ccc',
                  }}
                  source={{
                    uri: paymentMethods[activeIndex].urlQRPayment,
                  }}
                />
              </View>
              <View style={{paddingBottom: 20, paddingTop: 20}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                  }}>
                  <Text>CHỦ TÀI KHOẢN {activeIndex}</Text>
                  <Text style={{fontWeight: '600'}}>HÀ MINH ĐỨC</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                  }}>
                  <Text>SỐ TÀI KHOẢN</Text>
                  <Text style={{fontWeight: '600'}}>0964103861</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                  }}>
                  <Text>NGÂN HÀNG</Text>
                  <Text style={{fontWeight: '600'}}>BIDV-CN THAI NGUYÊN</Text>
                </View>
              </View>
            </View>
          )}
          {/* END: PAYMENT ATM, MOMO, ZALO */}

          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}>
              {/* <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                <Feather name='plus-circle' size={24} color='black' />
                <Text>Add more Items</Text>
              </View>
              <AntDesign name='right' size={20} color='black' /> */}
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                {/* <AntDesign name='tagso' size={20} color='black' /> */}
                <Image
                  style={{
                    width: 23,
                    height: 23,
                  }}
                  source={{
                    // uri: 'https://cdn-icons-png.flaticon.com/512/2205/2205459.png',
                    uri: 'https://cdn-icons-png.flaticon.com/512/2205/2205349.png',
                  }}
                />
                <Text style={{paddingLeft: 8}}>Thêm voucher</Text>
              </View>
              <AntDesign name='right' size={20} color='black' />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}>
              {/* <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                <Entypo name='new-message' size={24} color='black' />
                <Text>Add more cooking paymentMethods</Text>
              </View> */}
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                <Image
                  style={{
                    width: 28,
                    height: 28,
                  }}
                  source={{
                    // uri: 'https://cdn-icons-png.flaticon.com/512/4607/4607287.png',
                    uri: 'https://cdn-icons-png.flaticon.com/512/4606/4606053.png',
                  }}
                />
                <Text style={{paddingLeft: 3}}>Thưởng cho tài xế</Text>
              </View>
              <AntDesign name='right' size={20} color='black' />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                {/* <MaterialCommunityIcons
                  name='food-fork-drink'
                  size={24}
                  color='black'
                /> */}
                <Image
                  style={{
                    width: 23,
                    height: 23,
                  }}
                  source={{
                    // uri: 'https://cdn-icons-png.flaticon.com/512/3792/3792507.png',
                    uri: 'https://cdn-icons-png.flaticon.com/512/3792/3792490.png',
                  }}
                />
                <Text style={{paddingLeft: 8}}>Lấy dụng cụ ăn uống</Text>
                <AntDesign
                  name='questioncircleo'
                  size={12}
                  color='#505050'
                  style={{marginLeft: -2}}
                />
              </View>
              <AntDesign name='right' size={20} color='black' />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                {/* <MaterialCommunityIcons
                  name='food-fork-drink'
                  size={24}
                  color='black'
                /> */}
                <Image
                  style={{
                    width: 23,
                    height: 23,
                  }}
                  source={{
                    // uri: 'https://cdn-icons-png.flaticon.com/512/3075/3075867.png',
                    uri: 'https://cdn-icons-png.flaticon.com/512/3075/3075908.png',
                  }}
                />
                <Text style={{paddingLeft: 8}}>Ghi chú</Text>
              </View>
              <AntDesign name='right' size={20} color='black' />
            </View>
          </View>

          {/* <View>
            <View
              style={{
                padding: 10,
                backgroundColor: 'white',
                marginVertical: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text>Nuôi dưỡng quyên góp</Text>
                <AntDesign name='checksquare' size={24} color='#fd5c63' />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text style={{color: 'gray'}}>
                  Hướng tới một VN không có con người sdd
                </Text>
                <Text>3.000 ₫</Text>
              </View>
            </View>
          </View> */}

          <View
            style={{
              marginVertical: 10,
              paddingBottom: 140,
            }}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>
              Chi tiết hóa đơn
            </Text>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 7,
                padding: 10,
                marginTop: 14,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{fontSize: 15, fontWeight: '400', color: '#505050'}}>
                  Tổng cộng (1 món)
                </Text>
                <Text
                  style={{fontSize: 15, fontWeight: '400', color: '#505050'}}>
                  {convertIntegerToPriceString(total)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 8,
                }}>
                <Text
                  style={{fontSize: 15, fontWeight: '400', color: '#505050'}}>
                  Phí giao hàng (3.5km)
                </Text>

                <Text
                  style={{fontSize: 15, fontWeight: '400', color: '#505050'}}>
                  {cart.length
                    ? convertIntegerToPriceString(phiship)
                    : convertIntegerToPriceString(0)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{fontSize: 15, fontWeight: '400', color: '#505050'}}>
                    Phí áp dụng
                  </Text>
                  <AntDesign
                    name='questioncircleo'
                    size={12}
                    color='#505050'
                    style={{paddingLeft: 4}}
                  />
                </View>

                <Text
                  style={{fontSize: 15, fontWeight: '400', color: '#505050'}}>
                  {cart.length
                    ? convertIntegerToPriceString(phiapdung)
                    : convertIntegerToPriceString(0)}
                </Text>
              </View>

              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: 8,
                  }}>
                  <Text style={{fontWeight: 'bold', fontSize: 15}}>
                    Tổng cộng
                  </Text>
                  <Text style={{fontWeight: 'bold', fontSize: 15}}>
                    {/* {convertIntegerToPriceString(total)} */}
                    {/* Tính phí ship + phí áp dụng */}
                    {cart.length
                      ? convertIntegerToPriceString(
                          (total = total + phiship + phiapdung),
                        )
                      : convertIntegerToPriceString(0)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {total === 0 ? null : (
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            justifyContent: 'space-between',
            backgroundColor: 'white',
          }}>
          {console.log('total___ ', total)}
          <View>
            <Text style={{fontSize: 16, fontWeight: '600', maxWidth: 150}}>
              Thanh toán khi nhận hàng
            </Text>
            {/* <Text style={{fontSize: 16, fontWeight: '600'}}>
              Thanh toán bằng thẻ
            </Text> */}
            {/* <Text style={{marginTop: 7, fontSize: 15}}>
              Thanh toán khi nhận hàng
            </Text> */}
          </View>

          {/* <Pressable
            onPress={() => {
              dispatch(cleanCart());
              router.replace({
                pathname: '/order',
                params: {
                  name: params?.name,
                },
              });
            }}
            style={{
              backgroundColor: '#fd5c63',
              padding: 10,
              width: 200,
              borderRadius: 6,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
            }}>
            <View>
              <Text
                style={{
                  fontSize: 15,
                  color: 'white',
                  fontWeight: '500',
                  marginTop: 3,
                }}>
                TỔNG CỘNG
              </Text>
              <Text style={{color: 'white', fontSize: 15, fontWeight: 'bold'}}>
                {total + 95}.000 ₫
              </Text>
            </View>
            <Text style={{fontSize: 16, fontWeight: '500', color: 'white'}}>
              Đặt đơn
            </Text>
          </Pressable> */}

          <Pressable
            onPress={() => {
              // dispatch(cleanCart());
              // router.replace({
              //   pathname: '/order',
              //   params: {
              //     name: params?.name,
              //   },
              // });

              // alert('Chuyen qua thanh toan: ', activeIndex);
              console.log('activeIndex: ', activeIndex);
              console.log('cart: ', cart);
              console.log('cart.length: ', cart.length);
              //
              kiemTraPhuongThucThanhToan(activeIndex, paymentMethods);
            }}
            style={{
              backgroundColor: '#fd5c63',
              padding: 10,
              minWidth: 180,
              minHeight: 50,
              borderRadius: 6,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}>
            <Text style={{fontSize: 16, fontWeight: '500', color: 'white'}}>
              Đặt đơn
            </Text>
          </Pressable>
        </Pressable>
      )}
    </SafeAreaProvider>
  );
}
