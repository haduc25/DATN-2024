import * as React from 'react';
import {View, Text} from 'react-native';

export default function AdminDashboardScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        onPress={() => navigation.navigate('Home')}
        style={{fontSize: 26, fontWeight: 'bold'}}>
        AdminDashboard Screen
      </Text>
      <View style={{width: '100%'}}>
        <View style={{borderWidth: 1, alignItems: 'center'}}>
          <View
            style={{
              height: 220,
              borderWidth: 1,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>Thống kê</Text>
          </View>
          <View
            style={{
              height: 220,
              borderWidth: 1,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>Đơn hàng</Text>
          </View>
          <View
            style={{
              height: 220,
              borderWidth: 1,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>Sản phẩm</Text>
          </View>
        </View>
        <View
          style={{
            borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            // backgroundColor: 'red',
            height: 80,
          }}>
          <View style={{justifyContent: 'center'}}>
            <Text>Trang chủ</Text>
          </View>
          <View style={{justifyContent: 'center'}}>
            <Text>Đăng xuất</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
