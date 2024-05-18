import {useState, useEffect} from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import CustomStatusBar from '../components/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native';
import {
  convertPriceStringToInteger,
  convertIntegerToPriceString,
} from '../utils/globalHelpers';
import {AntDesign} from '@expo/vector-icons';

export default function DetailItemOrdered({navigation}) {
  const route = useRoute();
  const {item} = route.params;
  console.log('route_DETAIL-ITEM: ', item);

  //  PHÍ GIAO HÀNG
  const phiship = 15000;
  const phiapdung = 6000;

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
        titleOfScreen={'Chi tiết đơn đặt hàng'}
        onPressBack={data => console.log(data)}
        dataNavigation={{
          screen: 'AdminOrders',
        }}
      />
      <ScrollView
        style={{
          flex: 1,
          paddingTop: 100,
          backgroundColor: '#fff',
        }}>
        <View>
          {/* THÔNG TIN ĐƠN HÀNG */}
          {/* TRẠNG THÁI */}
          <View
            style={{
              backgroundColor: '#7EC7E7',
              paddingVertical: 30,
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff', fontWeight: '700', fontSize: 16}}>
              Đơn hàng đã hủy
            </Text>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/338/338056.png',
              }}
              style={{width: 60, height: 60}}
            />
          </View>
          {/* THÔNG TIN NGƯỜI ĐẶT HÀNG */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{padding: 12}}>
              <Text style={{fontWeight: '700'}}>Mã đơn hàng</Text>
            </View>
            <View style={{padding: 12}}>
              <Text>#{item.ma_don_hang}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{padding: 12}}>
              <Text style={{fontWeight: '700'}}>Địa chỉ nhận hàng</Text>
            </View>
            <View style={{padding: 12}}>
              <Text numberOfLines={3} style={{maxWidth: 240}}>
                {item.dia_chi}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{padding: 12}}>
              <Text style={{fontWeight: '700'}}>Số điện thoại</Text>
            </View>
            <View style={{padding: 12}}>
              <Text>{item.so_dien_thoai}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{padding: 12}}>
              <Text style={{fontWeight: '700'}}>Thời gian đặt hàng</Text>
            </View>
            <View style={{padding: 12}}>
              <Text>{item.thoi_gian_tao_don_hang}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{padding: 12}}>
              <Text style={{fontWeight: '700'}}>Thời gian hủy</Text>
            </View>
            <View style={{padding: 12}}>
              <Text>{item.thoi_gian_cap_nhat_don_hang_moi_nhat}</Text>
            </View>
          </View>

          {/* SPLIT LINE */}
          <View
            style={{
              width: '100%',
              borderTopWidth: 0.5,
              borderTopColor: '#ccc',
              paddingBottom: 10,
            }}
          />

          {/* THÔNG TIN SẢN PHẨM */}
          <View style={{paddingHorizontal: 10}}>
            <Text style={{fontSize: 16, fontWeight: '600'}}>
              Sản phẩm đã đặt ({item.san_pham_order.length})
            </Text>
            {item.san_pham_order.map((itemOrdered, index) => {
              let gia_sp_sau_khi_cong_voi_sl =
                itemOrdered.so_luong *
                convertPriceStringToInteger(itemOrdered?.gia_sp);
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderWidth: 0.5,
                    borderRadius: 12,
                    borderColor: '#ccc',

                    padding: 6,
                    paddingVertical: 10,

                    backgroundColor: '#fff',
                    borderRadius: 10,
                    marginTop: 12,
                    marginBottom: 8,
                    shadowColor: '#000',
                    shadowOpacity: 0.25,
                    shadowRadius: 5,
                    shadowOffset: {width: 0, height: 0},
                    elevation: 5,
                  }}>
                  <View>
                    <Text
                      style={{fontSize: 16, maxWidth: 310, paddingLeft: 6}}
                      numberOfLines={1}>
                      - {`${itemOrdered.ten_sp}`}
                    </Text>
                    <Text
                      style={{fontSize: 16, maxWidth: 310, paddingLeft: 6}}
                      numberOfLines={1}>
                      - {`Số lượng: ${itemOrdered.so_luong}`}
                    </Text>
                    <Text
                      style={{fontSize: 16, maxWidth: 310, paddingLeft: 6}}
                      numberOfLines={1}>
                      - {`Size: ${itemOrdered?.selected_size ?? 'S'}`}
                    </Text>
                    <Text
                      style={{fontSize: 16, maxWidth: 310, paddingLeft: 6}}
                      numberOfLines={1}>
                      -{' '}
                      {`Giá: ${
                        itemOrdered?.gia_sp
                      } (${convertIntegerToPriceString(
                        gia_sp_sau_khi_cong_voi_sl,
                      )})`}
                    </Text>
                  </View>
                  <Image
                    source={{
                      uri:
                        itemOrdered?.anh_sp && itemOrdered.anh_sp.length > 0
                          ? itemOrdered.anh_sp[0]
                          : 'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fproducts%2Fitem-default%2Fitem-no-image.jpg?alt=media&token=e6c7faba-62d5-4bfa-b503-4b80c530c4b6',
                    }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 12,
                      borderWidth: 0.5,
                      borderColor: '#ccc',
                    }}
                  />
                </View>
              );
            })}
          </View>

          {/* THÔNG TIN THÊM VỀ ĐƠN HÀNG */}
          <View
            style={{
              marginTop: 20,
              borderTopWidth: 0.5,
              borderTopColor: '#ccc',
            }}>
            <View>
              <View style={{alignItems: 'center', paddingVertical: 10}}>
                <Text style={{fontSize: 18, fontWeight: '600'}}>
                  CHI TIẾT HÓA ĐƠN
                </Text>
              </View>
              {item.san_pham_order.map((itemOrdered, index) => {
                let gia_sp_sau_khi_cong_voi_sl_hoa_don =
                  itemOrdered.so_luong *
                  convertPriceStringToInteger(itemOrdered?.gia_sp);
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      // borderWidth: 0.5,
                      borderBottomWidth: 0.5,
                      marginLeft: 10,
                      marginRight: 10,
                      borderColor: '#ccc',

                      padding: 6,
                      paddingVertical: 10,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{fontSize: 16, paddingLeft: 6}}
                        numberOfLines={1}>
                        {`${index + 1}. ${itemOrdered.ten_sp} (${
                          itemOrdered.so_luong
                        } x ${itemOrdered?.gia_sp}) `}
                      </Text>
                      <View style={{alignItems: 'right'}}>
                        <Text
                          style={{fontSize: 16, paddingLeft: 6}}
                          numberOfLines={1}>
                          {`= ${convertIntegerToPriceString(
                            gia_sp_sau_khi_cong_voi_sl_hoa_don,
                          )}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}

              {/* PHÍ GIAO HÀNG */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 8,
                  paddingHorizontal: 22,
                  marginTop: 20,
                }}>
                <View>
                  <Text style={{fontWeight: '700', fontSize: 16}}>
                    Phí giao hàng (3.5km)
                  </Text>
                </View>
                <View>
                  <Text style={{fontSize: 16}}>
                    {convertIntegerToPriceString(phiship)}
                  </Text>
                </View>
              </View>

              {/* PHÍ ÁP DỤNG */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 8,
                  paddingHorizontal: 22,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontWeight: '700', fontSize: 16}}>
                    Phí áp dụng
                  </Text>
                  <AntDesign
                    name='questioncircleo'
                    size={12}
                    color='#505050'
                    style={{paddingLeft: 4}}
                  />
                </View>
                <View>
                  <Text style={{fontSize: 16}}>
                    {convertIntegerToPriceString(phiapdung)}
                  </Text>
                </View>
              </View>

              {/* TỔNG TIỀN */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 8,
                  paddingHorizontal: 22,
                }}>
                <View>
                  <Text style={{fontWeight: '700', fontSize: 16}}>
                    Tổng tiền thanh toán
                  </Text>
                </View>
                <View>
                  <Text style={{fontSize: 16}}>{item.tong_tien}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ĐỆM DƯỚI */}
        <View style={{height: 400}} />
      </ScrollView>
    </SafeAreaProvider>
  );
}
