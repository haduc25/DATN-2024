import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import React, {useEffect, useState} from 'react';
import {MaterialIcons, AntDesign} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {db, auth, getDoc, doc, signInWithEmailAndPassword} from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Brand from '../components/Brand';
import Button from '../components/Button';

// TOAST MESSAGE
import Toast from 'react-native-toast-message';
import {toastConfigMessage} from '../utils/globalCustomStyle';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State để xác định xem mật khẩu có nên được hiển thị hay không

  const navi = useNavigation();

  // const auth = getAuth();

  // Lưu tài khoản
  const [isSaveAccount, setIsSaveAccount] = useState(true);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Đảo ngược trạng thái hiển thị mật khẩu
  };

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          console.log('token?_', token);

          // router.replace('/(home)');
          navigation.navigate('Trang chủ');
          // navigation.navigate('Tài khoản');
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkLogin();
  }, []);

  const signInWithEmail = async (email, password, isAdmin) => {
    try {
      setIsLoading(true);
      if (!email || !password) {
        console.log('Vui lòng nhập email và mật khẩu');
        Toast.show({
          type: 'error',
          text1: 'Đăng nhập thất bại',
          text2: 'Vui lòng nhập email và mật khẩu của bạn!',
        });
        setIsLoading(false);
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      const token = await user.getIdToken(); // Lấy token từ Firebase

      console.log('USER: ', user.displayName);
      const _userId = user.uid;

      // Lưu thông tin người dùng vào AsyncStorage
      // await AsyncStorage.setItem('user', JSON.stringify(user));
      // Lưu token vào AsyncStorage
      await AsyncStorage.setItem('authToken', token);

      console.log('user: ', user);
      console.log('token: ', token);

      const userProfileData = {
        currentUser: {
          _userId,
          token,
          username: user.displayName,
          email: user.email,
        },
      };

      await AsyncStorage.setItem(
        'usersProfile',
        JSON.stringify(userProfileData),
      );
      console.log('User profiles saved successfully');

      // Kiểm tra quyền của người dùng nếu là admin
      if (isAdmin) {
        // Đọc dữ liệu role từ Firestore
        const role = await readDataFromFireStore(_userId);

        switch (role) {
          case 'admin':
            console.log('Chuyển sang screen khác');
            setIsLoading(false);

            // Chuyển hướng đến màn hình khác sau khi đăng nhập thành công
            setTimeout(() => {
              navigation.navigate('AdminDashboardScreen');
            }, 500); // Thời gian chờ
            return;
          case 'user':
          default:
            console.log('Bạn không có quyền truy cập');
            Toast.show({
              type: 'error',
              text1: 'Đăng nhập',
              text2: 'Bạn không có quyền truy cập',
            });
            setIsLoading(false);
            return;
        }
      }

      Toast.show({
        type: 'success',
        text1: 'Đăng nhập',
        text2: 'Đăng nhập thành công',
      });

      setTimeout(() => {
        navigation.navigate('Trang chủ');
      }, 500); // Thời gian chờ

      setIsLoading(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Đăng nhập',
        text2: 'Đăng nhập thất bại, vui lòng thử lại!',
      });
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('false: ', errorMessage);
      console.log('false-code: ', errorCode);
      setIsLoading(false);
    }
  };

  // read
  const readDataFromFireStore = async _uid => {
    try {
      const docSnap = await getDoc(doc(db, 'Users', _uid));
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.role) {
          return userData.role; // Trả về role nếu có
        } else {
          console.log('User role does not exist');
          return null; // Trả về null nếu không có role
        }
      } else {
        console.log('Document does not exist');
      }
    } catch (error) {
      console.log('Error getting document:', error);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        pointerEvents: isLoading ? 'none' : 'unset',
      }}>
      <View style={{marginTop: 40}}>
        <Brand />
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
              {/* Lưu tài khoản {isSaveAccount ? '👍' : '👎'} */}
              Lưu tài khoản
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              Toast.show({
                type: 'info',
                text1: 'Quên mật khẩu',
                text2: 'Tính năng đang được hoàn thiện!',
              })
            }>
            <Text>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        <View style={{marginTop: 50}}>
          <Button
            title={'Đăng nhập'}
            onPress={() => signInWithEmail(email.trim(), password.trim())}
            loading={isLoading}
            disabled={isLoading}
            buttonStyleCustom={{
              borderRadius: '15%',
              paddingVertical: 16,
              backgroundColor: '#ff4c4c',
            }}
            textStyleInsideButtonCustom={{textTransform: 'uppercase'}}
          />
        </View>

        <Pressable
          onPress={() =>
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

        <View
          style={{
            alignItems: 'center',
            borderWidth: 0,
            paddingVertical: 50,
            // borderWidth: 1,
          }}>
          {/* <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{color: 'gray', fontSize: 16, fontWeight: '600'}}>
              Đăng nhập với quyền quản trị viên
            </Text>
            <MaterialIcons
              style={{marginLeft: 4}}
              name='admin-panel-settings'
              size={26}
              color='gray'
            />
          </TouchableOpacity> */}

          <Button
            title={'Đăng nhập với quyền quản trị viên'}
            onPress={() => signInWithEmail(email.trim(), password.trim(), true)}
            buttonStyleCustom={{
              borderRadius: '15%',
              paddingVertical: 16,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: 'red',
              width: '100%',
            }}
            textStyleInsideButtonCustom={{color: 'red', fontWeight: '600'}}
          />
        </View>
      </KeyboardAvoidingView>
      <Toast config={toastConfigMessage} />
    </SafeAreaView>
  );
}
