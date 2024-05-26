import {useState, useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import Button from '../components/Button';

export default function OrderConfirmationSuccessfully({navigation, route}) {
  const {payment_method} = route?.params;
  const isWaitPayment = payment_method !== 'cash' ? true : false;

  // console.log('route : ', route); route :  {"key": "OrderConfirmationSuccessfully-TWYxp4K2DPYjvpdMYm7X1", "name": "OrderConfirmationSuccessfully", "params": {"payment_method": "momowallet"}, "path": undefined}
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View style={{alignItems: 'center', padding: 14, paddingTop: 150}}>
        <Image
          style={{
            width: 130,
            height: 130,
            // borderRadius: 10,
            // borderWidth: 1,
            borderColor: '#ccc',
            resizeMode: 'cover',
          }}
          source={{
            uri: isWaitPayment
              ? 'https://cdn-icons-png.flaticon.com/512/10308/10308693.png'
              : 'https://cdn-icons-png.flaticon.com/512/1828/1828640.png',
          }}
        />
      </View>
      <Text style={{fontSize: 26, fontWeight: 'bold'}}>
        {isWaitPayment ? 'Đang chờ thanh toán' : 'Đặt hàng thành công'}
      </Text>

      <View
        style={{
          padding: 10,
          paddingTop: 20,
          alignItems: 'center',
          // borderWidth: 1,
        }}>
        <Text style={{fontSize: 18, paddingBottom: 10}}>
          Cảm ơn bạn đã đặt hàng
        </Text>

        <Text>
          {isWaitPayment ? 'Sau khi thanh toán bạn ' : 'Bạn '}
          sẽ sớm nhận được đơn hàng. Cùng Mỡ Coffee&Tea bảo vệ quyền lợi của bạn
          - chỉ nhận hàng & thanh toán khi đơn mua ở trạng thái "Đang giao
          hàng". {'\n\n'}Để kiểm tra trạng thái đơn hàng của bạn trong màn hình
          "Theo dõi đơn hàng"
        </Text>
      </View>

      <View
        style={{flexDirection: 'row', paddingHorizontal: 20, paddingTop: 16}}>
        <Button
          title={'Quay về trang chủ'}
          onPress={() => navigation.navigate('Trang chủ')}
          // loading={loading.buttonLoading}
          // disabled={loading.buttonLoading}
          buttonStyleCustom={{
            borderRadius: 8,
            paddingVertical: 16,
            backgroundColor: '#2196f3',
            width: '100%',
          }}
          textStyleInsideButtonCustom={{textTransform: 'uppercase'}}
        />
      </View>
    </View>
  );
}
