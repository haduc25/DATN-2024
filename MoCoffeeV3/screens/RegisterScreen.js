import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {MaterialIcons, Ionicons, AntDesign} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

// import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {auth} from '../firebase';

export default function RegisterScreen({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State để xác định xem mật khẩu có nên được hiển thị hay không
  const navi = useNavigation();

  // const auth = getAuth();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Đảo ngược trạng thái hiển thị mật khẩu
  };

  async function signUpNewUser(email, password, name) {
    if (!name) {
      console.log('Vui lòng nhập tên hiển thị');
      alert('Vui lòng nhập tên hiển thị');
      return;
    }

    if (!email || !password) {
      console.log('Vui lòng nhập email và mật khẩu');
      alert('Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Update tên, image cho người dùng
      await updateProfile(userCredential.user, {
        displayName: name,
        // photoURL: `https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Favatars%2Fno-avatar.jpg?alt=media&token=85996ccb-5864-4608-8917-6b4a16ef4b12`, // ảnh mặc định
        photoURL: `https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Favatars%2Fno-image2.JPG?alt=media&token=66eac0f7-5349-4ae5-b0ac-61c10699e6e6`, // ảnh mặc định
      });

      // Chờ một khoảng thời gian ngắn (ví dụ: 1 giây) để đảm bảo thông tin hồ sơ được cập nhật
      await new Promise(resolve => setTimeout(resolve, 3000));

      const user = userCredential.user;
      console.log('success created user: ', user.email);
      alert('ĐĂNG KÝ THÀNH CÔNG!');
      // setErrorMsg('valid');

      // Quay sang đăng nhập
      navi.reset({
        index: 0,
        routes: [{name: 'LoginScreen'}],
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('false: ', errorMessage);
      console.log('false-code: ', errorCode);
      alert('ĐĂNG KÝ THẤT BẠI!');
    }
  }

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: 'white', alignItems: 'center'}}>
      <View style={{marginTop: 50}}>
        <Text style={{fontSize: 20, textAlign: 'center', fontWeight: 'bold'}}>
          Mỡ Coffee & Tea
        </Text>
      </View>

      <KeyboardAvoidingView>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: 'bold',
              marginTop: 12,
              color: 'red',
            }}>
            Đăng ký nhanh chóng và dễ dàng
          </Text>
        </View>

        <View style={{marginTop: 70}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              backgroundColor: '#E0E0E0',
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}>
            <Ionicons
              name='person'
              size={24}
              color='gray'
              style={{marginLeft: 8}}
            />
            <TextInput
              value={name}
              onChangeText={text => setName(text)}
              style={{color: 'gray', marginVertical: 10, width: 300}}
              placeholder='Nhập tên hiển thị'
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              backgroundColor: '#E0E0E0',
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}>
            <MaterialIcons
              style={{marginLeft: 8}}
              name='email'
              size={24}
              color='gray'
            />
            <TextInput
              value={email}
              onChangeText={text => setEmail(text)}
              style={{color: 'gray', marginVertical: 10, width: 300}}
              placeholder='Nhập địa chỉ E-mail'
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              backgroundColor: '#E0E0E0',
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}>
            <AntDesign
              style={{marginLeft: 8}}
              name='lock1'
              size={24}
              color='black'
            />
            <TextInput
              value={password}
              onChangeText={text => setPassword(text)}
              style={{color: 'gray', marginVertical: 10, width: 300}}
              placeholder='Nhập mật khẩu'
              secureTextEntry={!showPassword} // Sử dụng secureTextEntry để ẩn mật khẩu nếu showPassword là false
            />
            {/* Nút để hiển thị/ẩn mật khẩu */}
            <Pressable onPress={toggleShowPassword} style={{padding: 10}}>
              {showPassword ? (
                <MaterialIcons name='visibility-off' size={24} color='gray' />
              ) : (
                <MaterialIcons name='visibility' size={24} color='gray' />
              )}
            </Pressable>
          </View>

          {/* Confirm password */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              backgroundColor: '#E0E0E0',
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}>
            <AntDesign
              style={{marginLeft: 8}}
              name='lock1'
              size={24}
              color='black'
            />
            <TextInput
              // value={password}
              // onChangeText={text => setPassword(text)}
              style={{color: 'gray', marginVertical: 10, width: 300}}
              placeholder='Xác nhận mật khẩu'
              secureTextEntry={!showPassword} // Sử dụng secureTextEntry để ẩn mật khẩu nếu showPassword là false
            />
            {/* Nút để hiển thị/ẩn mật khẩu */}
            <Pressable onPress={toggleShowPassword} style={{padding: 10}}>
              {showPassword ? (
                <MaterialIcons name='visibility-off' size={24} color='gray' />
              ) : (
                <MaterialIcons name='visibility' size={24} color='gray' />
              )}
            </Pressable>
          </View>

          <View style={{marginTop: 14}}>
            <Text style={{textAlign: 'center', color: 'gray', fontSize: 14}}>
              Bằng cách nhấp vào Đăng ký, bạn đồng ý với Điều khoản và Chính
              sách quyền riêng tư của chúng tôi.
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => signUpNewUser(email, password, name)}
          android_ripple={{color: 'rgba(0, 0, 0, 0.1)'}} // Hiệu ứng opacity cho Android
          // style={{
          //   width: 200,
          //   backgroundColor: '#fd5c63',
          //   borderRadius: 6,
          //   marginLeft: 'auto',
          //   marginRight: 'auto',
          //   padding: 15,
          //   marginTop: 50,
          // }}>
          style={({pressed}) => [
            {
              opacity: pressed ? 0.5 : 1, // Thay đổi opacity khi nhấn
            },
            {
              width: 200,
              backgroundColor: '#fd5c63',
              borderRadius: 6,
              marginLeft: 'auto',
              marginRight: 'auto',
              padding: 15,
              marginTop: 50,
            },
          ]}>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 16,
              color: 'white',
            }}>
            ĐĂNG KÝ
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            navi.reset({
              index: 0,
              routes: [{name: 'LoginScreen'}],
            })
          }
          style={{marginTop: 15}}>
          <Text style={{textAlign: 'center', color: 'gray', fontSize: 16}}>
            Bạn đã có tài khoản? Đăng nhập ngay
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
