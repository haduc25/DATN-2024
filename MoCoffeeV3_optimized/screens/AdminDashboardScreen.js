import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminDashboardScreen({navigation}) {
  const navi = useNavigation();

  // Đăng xuất
  const handleDangXuat = async () => {
    try {
      // Hiển thị hộp thoại xác nhận trước khi đăng xuất
      Alert.alert(
        'Xác nhận đăng xuất',
        'Bạn có muốn đăng xuất không?',
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Đăng xuất',
            onPress: async () => {
              // Xóa token xác thực khỏi AsyncStorage
              await AsyncStorage.removeItem('authToken');
              await AsyncStorage.removeItem('usersProfile');

              // Chuyển người dùng đến màn hình đăng nhập

              navi.reset({
                index: 0,
                routes: [{name: 'LoginScreen'}],
              });
            },
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      console.error('Đã xảy ra lỗi khi đăng xuất:', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{paddingTop: 40, flex: 1}}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
              marginBottom: 12,
            }}>
            <Text
              style={{
                fontSize: 26,
                fontWeight: '500',
                paddingBottom: 20,
              }}>
              Giao diện quản trị viên
            </Text>
          </View>
          <View style={{width: '100%'}}>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                style={styles.itemsContainer}
                onPress={() =>
                  navi.navigate('AdminStatisticsAndAnalysisChart')
                }>
                <Image
                  style={{width: 125, height: 125}}
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/2672/2672319.png',
                  }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: 'gray',
                    padding: 10,
                    fontWeight: '600',
                  }}>
                  Thống kê
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.itemsContainer}
                onPress={() => navi.navigate('AdminOrders')}>
                <Image
                  style={{width: 125, height: 125}}
                  source={{
                    // uri: 'https://cdn-icons-png.flaticon.com/512/2728/2728439.png',
                    uri: 'https://cdn-icons-png.flaticon.com/512/2728/2728447.png',
                  }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: 'gray',
                    padding: 10,
                    fontWeight: '600',
                  }}>
                  Đơn hàng
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.itemsContainer}
                onPress={() => navi.navigate('AdminProductsCRUD')}>
                <Image
                  style={{width: 125, height: 125}}
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/3712/3712193.png',
                  }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: 'gray',
                    padding: 10,
                    fontWeight: '600',
                  }}>
                  Sản phẩm
                </Text>
              </TouchableOpacity>
            </View>
            {/*  */}
          </View>
        </View>
      </ScrollView>
      {/* BUTTON */}
      <View
        style={{
          // borderWidth: 1,
          height: 70,

          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          // backgroundColor: 'yellow',
          // width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          // paddingHorizontal: 20,
          // paddingVertical: 10,
          // backgroundColor: '#fff', // Change this to match your background color
          borderColor: '#ccc', // Change this to match your border color
        }}>
        <TouchableOpacity
          onPress={() => navi.navigate('Trang chủ')}
          style={{
            justifyContent: 'center',
            // borderWidth: 1,
            borderTopRightRadius: '15%',
            width: '49%',
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
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDangXuat}
          style={{
            justifyContent: 'center',
            // borderWidth: 1,
            borderTopLeftRadius: '15%',
            width: '49%',
            alignItems: 'center',
            backgroundColor: '#000',
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: '600',
            }}>
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemsContainer: {
    height: 200,
    width: 395,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25,
    backgroundColor: '#fff',
    borderRadius: '15%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginLeft: 18,
    marginRight: 18,
    marginBottom: 12,
    shadowOffset: {width: 0, height: 0},
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
