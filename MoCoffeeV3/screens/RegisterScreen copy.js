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

import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';

// import {useRouter} from 'expo-router';
// import {supabase} from '../../supabase';

export default function RegisterScreen({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State để xác định xem mật khẩu có nên được hiển thị hay không
  const navi = useNavigation();

  const auth = getAuth();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Đảo ngược trạng thái hiển thị mật khẩu
  };

  async function signUpNewUser() {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        console.log('success created user: ', user.email);
        // setErrorMsg('valid');
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('false: ', error.message);
        console.log('false-code: ', error.code);
      });
    //
    // createUserWithEmailAndPassword(auth, email, password)
    //   .then(userCredential => {
    //     // Signed up
    //     const user = userCredential.user;
    //     // ...
    //   })
    //   .catch(error => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // ..
    //   });
    // //
    // const {data, error} = await supabase.auth.signUp({
    //   name: name,
    //   email: email,
    //   password: password,
    // });

    // if (data?.user?.role == 'authenticated') {
    //   Alert.alert(
    //     'You have been successfully registered',
    //     'please check your email for confirmation',
    //   );
    // }
    // if (error) {
    //   Alert.alert('Error while registering', 'please try again');
    // }
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
              name="person"
              size={24}
              color="gray"
              style={{marginLeft: 8}}
            />
            <TextInput
              value={name}
              onChangeText={text => setName(text)}
              style={{color: 'gray', marginVertical: 10, width: 300}}
              placeholder="Nhập tên hiển thị"
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
              name="lock1"
              size={24}
              color="black"
            />
            <TextInput
              // value={password}
              // onChangeText={text => setPassword(text)}
              style={{color: 'gray', marginVertical: 10, width: 300}}
              placeholder="Xác nhận mật khẩu"
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

          <View style={{marginTop: 14}}>
            <Text style={{textAlign: 'center', color: 'gray', fontSize: 14}}>
              Bằng cách nhấp vào Đăng ký, bạn đồng ý với Điều khoản và Chính
              sách quyền riêng tư của chúng tôi.
            </Text>
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
