import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {MaterialIcons, Ionicons, AntDesign} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import RadioButtonGroup, {RadioButtonItem} from 'expo-radio-button';
import Brand from '../components/Brand';

// import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {auth, db} from '../firebase';
import {doc, setDoc} from 'firebase/firestore';
import Button from '../components/Button';

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
  // START: HANDLE PROFILE USER
  const createUserProfile = profile => {
    // summit data
    if (profile) {
      console.log('profile: ', profile);
      const {
        uid,
        accessToken,
        displayName,
        email,
        emailVerified,
        metadata,
        phoneNumber,
        photoURL,
      } = profile.auth.currentUser;

      const {createdAt, lastLoginAt} = metadata;

      if (uid) {
        setDoc(doc(db, 'Users', uid), {
          accessToken,
          displayName,
          email,
          emailVerified,
          phoneNumber,
          photoURL,
          createdAt,
          lastLoginAt,
          role: 'user',
          dob: '25/09/2001',
          gtinh: 'male',
          location: [],
          itemFavorited: [],
          itemOrder: [],
          orderHistory: [],
        })
          .then(() => {
            // Data create successfully!
            // console.log('Data created');
            alert('Data created');
          })
          .catch(error => {
            console.log('error: ', error);
            alert('error: ', error);
          });
      }
    }
  };
  // END: HANDLE PROFILE USER

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

      // // Filter dữ liệu user
      // const {
      //   // auth,
      //   proactiveRefresh,
      //   providerData,
      //   providerId,
      //   reloadListener,
      //   reloadUserInfo,
      //   stsTokenManager,
      //   tenantId,
      //   ...userInfo
      // } = user.auth.currentUser;

      // // update dữ liệu sang FireStore
      createUserProfile(user);

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
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        borderWidth: 1,
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View style={{marginTop: 40}}>
          {/* LINEAR GRADIENT */}
          <Brand />
        </View>

        <KeyboardAvoidingView>
          <View style={{marginTop: 10}}>
            {/* DISPLAY NAME */}
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

            {/* EMAIL */}
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

            {/* SDT */}
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
                name='smartphone'
                size={24}
                color='gray'
              />
              <TextInput
                value={email}
                onChangeText={text => setEmail(text)}
                style={{color: 'gray', marginVertical: 10, width: 300}}
                placeholder='Nhập số điện thoại'
              />
            </View>

            {/* DOB */}
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
                name='card-giftcard'
                size={24}
                color='gray'
              />
              <TextInput
                value={email}
                onChangeText={text => setEmail(text)}
                style={{color: 'gray', marginVertical: 10, width: 300}}
                placeholder='Nhập ngày sinh'
              />
            </View>

            {/* START: GIOI TINH */}
            <View
              style={[
                {
                  marginBottom: 15,

                  // temp
                  borderWidth: 0,
                  paddingTop: 25,
                },
              ]}>
              <View>
                <RadioButtonGroup
                  containerStyle={{
                    // marginBottom: 10,
                    marginTop: 14,
                    flexDirection: 'row',
                    // borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  // selected={userInfo2.gtinh}
                  selected={'other'}
                  // onSelected={value => setCurrentGioiTinh(value)}
                  // onSelected={value => {
                  //   if (enableEditing) {
                  //     handleValueChange('gtinh', value);
                  //   }
                  // }}
                  radioBackground='lightblue'>
                  <RadioButtonItem
                    value='male'
                    label={
                      <View
                        style={{
                          paddingLeft: 6,
                          flexDirection: 'row',
                          // borderWidth: 1,
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: 'red',
                            fontSize: 15,
                          }}>
                          Nam
                        </Text>
                        <Ionicons
                          name={'male'}
                          size={18}
                          color={'rgba(19, 19, 21, 0.6)'}
                          style={{paddingLeft: 2}}
                        />
                      </View>
                    }
                  />
                  <RadioButtonItem
                    value='female'
                    label={
                      <View
                        style={{
                          paddingLeft: 6,
                          flexDirection: 'row',
                          // borderWidth: 1,
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: 'red',
                            paddingLeft: 6,
                            fontSize: 15,
                          }}>
                          Nữ
                        </Text>
                        <Ionicons
                          name={'female'}
                          size={18}
                          color={'rgba(19, 19, 21, 0.6)'}
                          style={{paddingLeft: 2}}
                        />
                      </View>
                    }
                  />
                  <RadioButtonItem
                    value='other'
                    label={
                      <View
                        style={{
                          paddingLeft: 6,
                          flexDirection: 'row',
                          // borderWidth: 1,
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: 'red',
                            paddingLeft: 6,
                            fontSize: 15,
                          }}>
                          Khác
                        </Text>
                        <Ionicons
                          name={'male-female'}
                          size={18}
                          color={'rgba(19, 19, 21, 0.6)'}
                          style={{paddingLeft: 2}}
                        />
                      </View>
                    }
                  />
                </RadioButtonGroup>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    position: 'absolute',
                    top: 12, // Adjust as per your design
                    left: 10, // Adjust as per your design
                    zIndex: 1,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={[
                      {color: 'rgba(19, 19, 21, 0.6)'},
                      {
                        top: -18,
                        fontSize: 12, // Adjust as per your design
                        color: 'rgba(19, 19, 21, 1)', // Adjust as per your design
                        fontWeight: '700',
                      },
                    ]}>
                    {/* {formName.gtinh} */}
                    Giới tính
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* END: GIOI TINH */}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                backgroundColor: '#E0E0E0',
                paddingVertical: 5,
                borderRadius: 5,
                // marginTop: 30,
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

          <View style={{marginTop: 20}}>
            <Button
              title={'Đăng ký'}
              onPress={() => signUpNewUser(email, password, name)}
              // loading={loading.buttonLoading}
              // disabled={loading.buttonLoading}
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
                routes: [{name: 'LoginScreen'}],
              })
            }
            style={{marginTop: 15}}>
            <Text style={{textAlign: 'center', color: 'gray', fontSize: 16}}>
              Bạn đã có tài khoản? Đăng nhập ngay
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}
