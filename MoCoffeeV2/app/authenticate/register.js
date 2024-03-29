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
import {MaterialIcons, Ionicons} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import {supabase} from '../../supabase';

const register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State để xác định xem mật khẩu có nên được hiển thị hay không
  const router = useRouter();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Đảo ngược trạng thái hiển thị mật khẩu
  };

  async function signUpNewUser() {
    if (!name || !email || !password) {
      Alert.alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const {data, error} = await supabase.auth.signUp({
      name: name,
      email: email,
      password: password,
    });

    if (error) {
      console.error('Lỗi đăng ký:', error.message);
      Alert.alert('Đã xảy ra lỗi khi đăng ký', 'Vui lòng thử lại');
      return;
    }

    if (data?.user?.role === 'authenticated') {
      console.log('Đăng ký thành công');
      Alert.alert(
        'Bạn đã đăng ký thành công',
        'Vui lòng kiểm tra email của bạn để xác nhận',
      );
      router.replace('/login');
    }
  }

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: 'white', alignItems: 'center'}}>
      <View style={{marginTop: 50}}>
        <Text style={{fontSize: 20, textAlign: 'center', fontWeight: 'bold'}}>
          Food App
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
            Register to your account
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
              name="person"
              size={24}
              color="gray"
              style={{marginLeft: 8}}
            />
            <TextInput
              value={name}
              onChangeText={text => setName(text)}
              style={{color: 'gray', marginVertical: 10, width: 300}}
              placeholder="enter your Name"
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
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              value={email}
              onChangeText={text => setEmail(text)}
              style={{color: 'gray', marginVertical: 10, width: 300}}
              placeholder="enter your Email"
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
              secureTextEntry={!showPassword} // Sử dụng secureTextEntry để ẩn mật khẩu nếu showPassword là false
              style={{color: 'gray', marginVertical: 10, width: 300}}
              placeholder="enter your password"
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

        <Pressable
          onPress={signUpNewUser}
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
            Register
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace('/login')}
          style={{marginTop: 15}}>
          <Text style={{textAlign: 'center', color: 'gray', fontSize: 16}}>
            Already have an Account? Sign In
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default register;

const styles = StyleSheet.create({});
