import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {MaterialIcons} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import {supabase} from '../../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false); // State để xác định xem mật khẩu có nên được hiển thị hay không

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Đảo ngược trạng thái hiển thị mật khẩu
  };

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          router.replace('/(home)');
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkLogin();
  }, []);

  async function signUpWithEmail() {
    if (!email || !password) {
      console.log('Vui lòng nhập email và mật khẩu');
      alert('Vui lòng nhập email và mật khẩu');
      return;
    }

    const {data, error} = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // console.error('Đăng nhập không thành công:', error.message);
      alert('Đăng nhập không thành công:', error.message);
      return;
    }

    if (data) {
      const token = data?.session?.access_token;
      if (token) {
        AsyncStorage.setItem('authToken', token);
      } else {
        AsyncStorage.removeItem('authToken'); // Xóa khóa nếu token là null hoặc undefined
      }
      router.replace('/(home)');
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
          <Text>Lưu tài khoản</Text>
          <Text>Quên mật khẩu</Text>
        </View>

        <Pressable
          onPress={signUpWithEmail}
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
          onPress={() => router.replace('/register')}
          style={{marginTop: 15}}>
          <Text style={{textAlign: 'center', color: 'gray', fontSize: 16}}>
            Bạn chưa có tài khoản? Đăng ký ngay
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({});
