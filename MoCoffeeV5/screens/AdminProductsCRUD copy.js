import * as React from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import CustomStatusBar from '../components/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';

export default function AdminProductsCRUD({navigation}) {
  return (
    <SafeAreaProvider>
      <CustomStatusBar
        backgroundColor='#fff'
        canGoBack={true}
        heightOfTop={50}
        customStyleIconBack={{marginBottom: 20}}
        arrowIconColor={'#fff'}
        arrowIconBackgroundColor={'#6E5532'}
        titleOfScreen={'Danh sách sản phẩm'}
        onPressBack={data => console.log(data)}
        dataNavigation={{
          screen: 'AdminDashboardScreen',
        }}
      />
      <ScrollView
        style={{
          flex: 1,
          paddingTop: 100,
          backgroundColor: '#fff',
          borderWidth: 1,
        }}>
        {/* PARENT OF THIS COMPONENT */}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            backgroundColor: 'yellow',
            height: 800,
          }}>
          {/* ITEMS */}
          <View
            style={{
              width: 395,
              minHeight: 200,
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
                    Trà sữa chân trâu siu to khổng lồ
                  </Text>
                  {/* desc */}
                  <Text
                    style={{
                      color: 'gray',
                      fontWeight: '600',
                    }}>
                    Meowwwwwwwwwwwwwww
                  </Text>
                  {/* price */}
                  <Text
                    style={{
                      color: '#ee4d2d',
                      fontWeight: '600',
                      fontSize: 18,
                    }}>
                    50.000 ₫
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingTop: 12,
                    }}>
                    <Text>(icon)Đã bán: 10</Text>
                    <Text>(icon)Lượt thích: 10</Text>
                  </View>
                </View>
                <Image
                  style={{width: 100, height: 100, borderRadius: 8}}
                  source={{
                    uri: 'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fproducts%2Ftemp%2Fimages.jpg?alt=media&token=378984d7-948f-4240-8c8d-f41c31ca0b12',
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
                <Text style={{fontWeight: '600'}}>Sửa</Text>
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
                <Text style={{fontWeight: '600'}}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}
