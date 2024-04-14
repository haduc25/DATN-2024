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

import {
  auth,
  db,
  createUserWithEmailAndPassword,
  updateProfile,
  doc,
  setDoc,
} from '../firebase';
import Button from '../components/Button';

export default function RegisterScreen({navigation}) {
  const [userValue, setUserValue] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    dob: '',
    gtinh: 'other',
    password: '',
    rePassword: '',
  });

  const handleChangeUserValue = (key, value) => {
    if (key !== undefined && value !== undefined && value !== null) {
      setUserValue(prevState => ({...prevState, [key]: value}));
    }
  };

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
  const createUserProfile = (user, profile) => {
    // summit data
    if (user && profile) {
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
      } = user;

      const {createdAt, lastLoginAt} = metadata;

      if (uid) {
        const {dob, gtinh, phoneNumber} = profile;

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
          dob,
          gtinh,
          location: [],
          itemFavorited: [],
          itemOrder: [],
          orderHistory: [],
        })
          .then(() => {
            // Data create successfully!
            console.log('Data created');
            // alert('Data created');

            console.log('success created user: ', user.email);
            alert('ĐĂNG KÝ THÀNH CÔNG!');
            // setErrorMsg('valid');

            // Quay sang đăng nhập
            navi.reset({
              index: 0,
              routes: [{name: 'LoginScreen'}],
            });
          })
          .catch(error => {
            console.log('error: ', error);
          });
      }
    }
  };

  // END: HANDLE PROFILE USER

  async function signUpNewUser(object) {
    const fieldTranslations = {
      name: 'tên hiển thị',
      email: 'email',
      phoneNumber: 'số điện thoại',
      dob: 'ngày sinh',
      password: 'mật khẩu',
      rePassword: 'xác nhận mật khẩu',
    };
    const keys = Object.keys(object);
    const emptyKeys = keys.filter(key => !object[key]);

    if (emptyKeys.length > 0) {
      emptyKeys.forEach(key => {
        const translatedFieldName = fieldTranslations[key];
        if (translatedFieldName) {
          setErrorWithTimeout(
            key,
            `Vui lòng nhập ${translatedFieldName}`,
            5000,
          );
        }
      });
    } else {
      // Tiếp tục xử lý đăng ký người dùng khi tất cả các key đều có dữ liệu
      // Ví dụ: await apiCallToSignUp(object);

      // Kiểm tra regex cho từng trường
      const regexPatterns = {
        email: /^\S+@\S+\.\S+$/,
        phoneNumber: /^\d{10,11}$/,
        name: /^[a-zA-Z0-9\s]+$/,
      };

      let isValid = true;
      Object.keys(regexPatterns).forEach(key => {
        if (!regexPatterns[key].test(object[key])) {
          setErrorWithTimeout(
            key,
            `Dữ liệu ${fieldTranslations[key]} không hợp lệ!!!`,
            5000,
          );
          isValid = false;
        }
      });

      if (isValid && handleValidDate('dob', object)) {
        // Kiểm tra xem password và rePassword có khớp nhau không
        if (object.password !== object.rePassword) {
          setErrorWithTimeout('password', 'Mật khẩu không khớp!', 5000);
          setErrorWithTimeout('rePassword', 'Mật khẩu không khớp!', 5000);
          return; // Trả về mà không tiếp tục xử lý
        }

        // REGISTER
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            object.email,
            object.password,
          );

          // Update tên, image cho người dùng
          await updateProfile(userCredential.user, {
            displayName: object.name,
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
          createUserProfile(user, object);
        } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log('false: ', errorMessage);
          console.log('false-code: ', errorCode);
          alert('ĐĂNG KÝ THẤT BẠI!');
        }
      }
    }
  }

  // for date
  const handleChangeTextForDatePicker = (field, value = '') => {
    if (typeof value !== 'undefined' && value !== null) {
      // Kiểm tra xem value có tồn tại không
      value = value.replace(/\//g, '');

      let updatedValue = value; // Khai báo updatedValue bên trong hàm để tránh lỗi
      if (value.length <= 2) {
      } else if (value.length <= 4) {
        updatedValue = value.substr(0, 2) + '/' + value.substr(2);
      } else if (value.length <= 8) {
        updatedValue =
          value.substr(0, 2) + '/' + value.substr(2, 2) + '/' + value.substr(4);
      }

      handleChangeUserValue(field, updatedValue);
    }
  };

  // check dob is valid
  const handleValidDate = (field, object) => {
    const value = object[field];

    if (typeof value !== 'undefined' && value !== null && value.length === 10) {
      const [day, month, year] = value.split('/').map(Number);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const minYear = currentYear - 100;

      if (
        isNaN(day) ||
        isNaN(month) ||
        isNaN(year) ||
        day < 1 ||
        day > 31 ||
        month < 1 ||
        month > 12 ||
        year < minYear ||
        year > currentYear
      ) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [field]: 'Ngày tháng năm không hợp lệ',
        }));
        handleChangeUserValue(field, ''); // Truyền giá trị rỗng vào handleChangeUserValue
        return false; // Trả về false nếu có lỗi
      } else {
        // Pass qua tất cả => Chuẩn rồi
        setErrors(prevErrors => ({...prevErrors, [field]: ''}));
        return true; // Trả về true nếu không có lỗi
      }
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: 'Vui lòng nhập đúng định dạng dd/mm/yyyy \nVí dụ: 25/09/2001',
      }));
      handleChangeUserValue(field, ''); // Truyền giá trị rỗng vào handleChangeUserValue
      return false; // Trả về false nếu có lỗi
    }
  };

  // error
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    dob: '',
    password: '',
    rePassword: '',
  });

  // set error
  const setErrorWithTimeout = (field, message, timeout) => {
    // Thiết lập lỗi với thông báo và trường xác định (field)
    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: message,
    }));

    // Thiết lập thời gian chờ để xóa lỗi sau khi đã được hiển thị
    setTimeout(() => {
      // Xóa lỗi bằng cách thiết lập lại thông báo thành chuỗi rỗng
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: '',
      }));
    }, timeout);
  };

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
          <View>
            {/* DISPLAY NAME */}
            <View style={{marginBottom: 10}}>
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
                <Ionicons
                  name='person'
                  size={24}
                  color='gray'
                  style={{marginLeft: 8}}
                />
                <TextInput
                  value={userValue.name}
                  // onChangeText={text => setName(text)}
                  onChangeText={text => handleChangeUserValue('name', text)}
                  style={{color: 'gray', marginVertical: 10, width: 300}}
                  placeholder='Nhập tên hiển thị'
                />
              </View>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 15, // Adjust as per your design
                  color: 'rgba(19, 19, 21, 0.6)', // Adjust as per your design
                  marginLeft: 10, // Adjust as per your design
                  marginRight: 10, // Adjust as per your design
                  marginTop: 3,
                  maxWidth: 350,
                  minHeight: 22,
                  maxHeight: 22,
                }}>
                {errors.name ? errors.name : null}
              </Text>
            </View>

            {/* EMAIL */}
            <View style={{marginBottom: 10}}>
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
                <MaterialIcons
                  style={{marginLeft: 8}}
                  name='email'
                  size={24}
                  color='gray'
                />
                <TextInput
                  value={userValue.email}
                  // onChangeText={text => setEmail(text)}
                  onChangeText={text => handleChangeUserValue('email', text)}
                  style={{color: 'gray', marginVertical: 10, width: 300}}
                  placeholder='Nhập địa chỉ E-mail'
                />
              </View>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 15, // Adjust as per your design
                  color: 'rgba(19, 19, 21, 0.6)', // Adjust as per your design
                  marginLeft: 10, // Adjust as per your design
                  marginRight: 10, // Adjust as per your design
                  marginTop: 3,
                  maxWidth: 350,
                  minHeight: 22,
                  maxHeight: 22,
                }}>
                {errors.email ? errors.email : null}
              </Text>
            </View>

            {/* SDT */}
            <View style={{marginBottom: 10}}>
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
                <MaterialIcons
                  style={{marginLeft: 8}}
                  name='smartphone'
                  size={24}
                  color='gray'
                />
                <TextInput
                  value={userValue.phoneNumber}
                  onChangeText={text =>
                    handleChangeUserValue('phoneNumber', text)
                  }
                  style={{color: 'gray', marginVertical: 10, width: 300}}
                  placeholder='Nhập số điện thoại'
                  maxLength={10}
                  keyboardType='numeric'
                />
              </View>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 15, // Adjust as per your design
                  color: 'rgba(19, 19, 21, 0.6)', // Adjust as per your design
                  marginLeft: 10, // Adjust as per your design
                  marginRight: 10, // Adjust as per your design
                  marginTop: 3,
                  maxWidth: 350,
                  minHeight: 22,
                  maxHeight: 22,
                }}>
                {errors.phoneNumber ? errors.phoneNumber : null}
              </Text>
            </View>

            {/* DOB */}
            <View style={{marginBottom: 10}}>
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
                <MaterialIcons
                  style={{marginLeft: 8}}
                  name='card-giftcard'
                  size={24}
                  color='gray'
                />
                <TextInput
                  value={userValue.dob}
                  onChangeText={text =>
                    handleChangeTextForDatePicker('dob', text)
                  }
                  style={{color: 'gray', marginVertical: 10, width: 300}}
                  placeholder='Nhập ngày sinh'
                  maxLength={10}
                  keyboardType='numeric'
                />
              </View>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 15, // Adjust as per your design
                  color: 'rgba(19, 19, 21, 0.6)', // Adjust as per your design
                  marginLeft: 10, // Adjust as per your design
                  marginRight: 10, // Adjust as per your design
                  marginTop: 3,
                  maxWidth: 350,
                  minHeight: 22,
                  maxHeight: 22,
                }}>
                {errors.dob ? errors.dob : null}
              </Text>
            </View>

            {/* START: GIOI TINH */}
            <View
              style={[
                {
                  marginBottom: 15,

                  // temp
                  borderWidth: 0,
                  // paddingTop: 25,
                },
              ]}>
              <View>
                <RadioButtonGroup
                  containerStyle={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  // selected={userInfo2.gtinh}
                  selected={userValue.gtinh}
                  // onSelected={value => setCurrentGioiTinh(value)}
                  // onSelected={() => console.log('Meow')}
                  onSelected={value => handleChangeUserValue('gtinh', value)}
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
              </View>
            </View>
            {/* END: GIOI TINH */}

            {/* PASSWORD */}
            <View style={{marginBottom: 10}}>
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
                  // value={password}
                  value={userValue.password}
                  // onChangeText={text => setPassword(text)}
                  onChangeText={text => handleChangeUserValue('password', text)}
                  style={{color: 'gray', marginVertical: 10, width: 300}}
                  placeholder='Nhập mật khẩu'
                  secureTextEntry={!showPassword} // Sử dụng secureTextEntry để ẩn mật khẩu nếu showPassword là false
                />
                {/* Nút để hiển thị/ẩn mật khẩu */}
                <Pressable onPress={toggleShowPassword} style={{padding: 10}}>
                  {showPassword ? (
                    <MaterialIcons
                      name='visibility-off'
                      size={24}
                      color='gray'
                    />
                  ) : (
                    <MaterialIcons name='visibility' size={24} color='gray' />
                  )}
                </Pressable>
              </View>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 15, // Adjust as per your design
                  color: 'rgba(19, 19, 21, 0.6)', // Adjust as per your design
                  marginLeft: 10, // Adjust as per your design
                  marginRight: 10, // Adjust as per your design
                  marginTop: 3,
                  maxWidth: 350,
                  minHeight: 22,
                  maxHeight: 22,
                }}>
                {errors.password ? errors.password : null}
              </Text>
            </View>

            {/* Confirm password */}
            <View style={{marginBottom: 10}}>
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
                  // value={password}
                  value={userValue.rePassword}
                  // onChangeText={text => setPassword(text)}
                  onChangeText={text =>
                    handleChangeUserValue('rePassword', text)
                  }
                  style={{color: 'gray', marginVertical: 10, width: 300}}
                  placeholder='Xác nhận mật khẩu'
                  secureTextEntry={!showPassword} // Sử dụng secureTextEntry để ẩn mật khẩu nếu showPassword là false
                />
                {/* Nút để hiển thị/ẩn mật khẩu */}
                <Pressable onPress={toggleShowPassword} style={{padding: 10}}>
                  {showPassword ? (
                    <MaterialIcons
                      name='visibility-off'
                      size={24}
                      color='gray'
                    />
                  ) : (
                    <MaterialIcons name='visibility' size={24} color='gray' />
                  )}
                </Pressable>
              </View>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 15, // Adjust as per your design
                  color: 'rgba(19, 19, 21, 0.6)', // Adjust as per your design
                  marginLeft: 10, // Adjust as per your design
                  marginRight: 10, // Adjust as per your design
                  marginTop: 3,
                  maxWidth: 350,
                  minHeight: 22,
                  maxHeight: 22,
                }}>
                {errors.rePassword ? errors.rePassword : null}
              </Text>
            </View>

            <View style={{marginTop: -10}}>
              <Text style={{textAlign: 'center', color: 'gray', fontSize: 14}}>
                Bằng cách nhấp vào Đăng ký, bạn đồng ý với Điều khoản và Chính
                sách quyền riêng tư của chúng tôi.
              </Text>
            </View>
          </View>

          <View style={{marginTop: 20}}>
            <Button
              title={'Đăng ký'}
              onPress={() => signUpNewUser(userValue)}
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
