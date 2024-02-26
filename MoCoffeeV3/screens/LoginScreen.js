import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import React, {useEffect, useState} from 'react';
import {MaterialIcons, AntDesign} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {db} from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State để xác định xem mật khẩu có nên được hiển thị hay không

  const navi = useNavigation();

  const auth = getAuth();

  // Lưu tài khoản
  const [isSaveAccount, setIsSaveAccount] = useState(true);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Đảo ngược trạng thái hiển thị mật khẩu
  };

  useEffect(() => {
    // const checkLogin = async () => {
    //   try {
    //     const token = await AsyncStorage.getItem('authToken');
    //     if (token) {
    //       router.replace('/(home)');
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // checkLogin();
  }, []);

  const signInWithEmail = async (email, password) => {
    if (!email || !password) {
      console.log('Vui lòng nhập email và mật khẩu');
      alert('Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      const token = await user.getIdToken(); // Lấy token từ Firebase

      // Lưu thông tin người dùng vào AsyncStorage
      // await AsyncStorage.setItem('user', JSON.stringify(user));
      // Lưu token vào AsyncStorage
      // await AsyncStorage.setItem('userToken', token);

      console.log('user: ', user);
      console.log('token: ', token);
      //  user:  {"_redirectEventId": undefined, "apiKey": "AIzaSyAALYOEpP92tXPCs2_f9AkOLrpUl0QjRyg", "appName": "[DEFAULT]", "createdAt": "1708945480583", "displayName": undefined, "email": "abcd345@mail.com", "emailVerified": false, "isAnonymous": false, "lastLoginAt": "1708946005049", "phoneNumber": undefined, "photoURL": undefined, "providerData": [[Object]], "stsTokenManager": {"accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImExODE4ZjQ0ODk0MjI1ZjQ2MWQyMmI1NjA4NDcyMDM3MTc2MGY1OWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbW8tY29mZmVlLXRlYSIsImF1ZCI6Im1vLWNvZmZlZS10ZWEiLCJhdXRoX3RpbWUiOjE3MDg5NDYwMDUsInVzZXJfaWQiOiJiTWlITFJibUNmU0ZCSEMxV1NJYmtDZnhTQk0yIiwic3ViIjoiYk1pSExSYm1DZlNGQkhDMVdTSWJrQ2Z4U0JNMiIsImlhdCI6MTcwODk0NjAwNSwiZXhwIjoxNzA4OTQ5NjA1LCJlbWFpbCI6ImFiY2QzNDVAbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYWJjZDM0NUBtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.3Vm6wnFnnvNUeVbZFtOU9Y-bo_0tAgJUcyPHVWUS-VqFApNGrDHEthaG0Wus3SAsKphSXKxFBLGUlqU100RZ-9mc7P44bsXDoT-58V2h8hR_Q6vd8CXguGUzpr06AnL7VKxFUwusW1QPUyuYyK4tvm35kvl6Rm2XSS-y6E3YD-ccb30XgE6bmDHfzZsLaNzHS4--pByBp4NNwkUDfInP3RVOcndXNT5SQ4is_Gi_cHUNUA8jUUbkJGPkyZy_IW193t8GrJefdePD1KGSWO0xH0QBT-DhaKCNEE4SdgaRBgtvDKJC41AptrBgyTMwLq9aS7yYyns90BpvzUXCsxUgbg", "expirationTime": 1708949605195, "refreshToken": "AMf-vBxkbhmT96RiH_4k9WF_F3KTvavpjiFeeqvmDEPjzluCUTPULsc9MKB30kfieLDPIcutLbF4BfInbV1sc58qTUFZiHQPBxT0c1TvMMhcyDLS7c9e5W4vLWmO0cRQxxnWxyM2VhgxUGuI9XA-kC205CH4MArE7TDG5Ue_O9ynjcpQyPgegsE8SYn1t3AGynE3ePLdCj2FlOlXwmmzFmyKWocqlJAhVg"}, "tenantId": undefined, "uid": "bMiHLRbmCfSFBHC1WSIbkCfxSBM2"}

      console.log('success sign-in user: ', user.email);
      // Chuyển hướng đến màn hình khác sau khi đăng nhập thành công
      // navigation.navigate('Home');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('false: ', error.message);
      console.log('false-code: ', error.code);
    }
  };

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
            Đăng nhập vào tài khoản của bạn
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
            <MaterialIcons
              style={{marginLeft: 8}}
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              value={email}
              onChangeText={text => setEmail(text)}
              style={{color: 'gray', marginVertical: 10, width: 300}}
              placeholder="Nhập địa chỉ E-mail"
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
              name="lock1"
              size={24}
              color="black"
            />
            <TextInput
              value={password}
              onChangeText={text => setPassword(text)}
              style={{color: 'gray', marginVertical: 10, width: 300}}
              placeholder="Nhập mật khẩu"
              secureTextEntry={!showPassword} // Sử dụng secureTextEntry để ẩn mật khẩu nếu showPassword là false
            />
            {/* Nút để hiển thị/ẩn mật khẩu */}
            <Pressable onPress={toggleShowPassword} style={{padding: 10}}>
              {showPassword ? (
                <MaterialIcons name="visibility-off" size={24} color="gray" />
              ) : (
                <MaterialIcons name="visibility" size={24} color="gray" />
              )}
            </Pressable>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 12,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Checkbox value={isSaveAccount} onValueChange={setIsSaveAccount} />
            <Text style={{marginLeft: 10}}>
              Lưu tài khoản {isSaveAccount ? '👍' : '👎'}
            </Text>
          </View>
          <Text>Quên mật khẩu?</Text>
        </View>

        <Pressable
          onPress={() => signInWithEmail(email, password)}
          style={{
            width: 200,
            backgroundColor: '#fd5c63',
            borderRadius: 6,
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: 15,
            marginTop: 50,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 16,
              color: 'white',
            }}>
            ĐĂNG NHẬP
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            // navi.reset({
            //   index: 0,
            //   routes: [{name: 'RegisterScreen'}],
            // })
            navi.reset({
              index: 0,
              routes: [{name: 'RegisterScreen'}],
            })
          }
          style={{marginTop: 15}}>
          <Text style={{textAlign: 'center', color: 'gray', fontSize: 16}}>
            Bạn chưa có tài khoản? Đăng ký ngay
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
