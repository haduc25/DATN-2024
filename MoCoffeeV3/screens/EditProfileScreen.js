import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useState, useEffect} from 'react';

import CustomStatusBar from '../components/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';

// Icons
import {Ionicons, AntDesign} from '@expo/vector-icons';
import Button from '../components/Button';

export default function EditProfileScreen({navigation}) {
  const route = useRoute();
  const {userInfo} = route.params;
  const [isFocused, setIsFocused] = useState({
    userID: false,
    displayName: false,
    email: false,
    phoneNumber: false,
    dob: false,
    createdAt: false,
    location: false,
  });
  const [inputValue, setInputValue] = useState('Email');
  const [inputValue2, setInputValue2] = useState('Meow');

  // Form Name
  const [formName, setFormName] = useState({
    userID: 'UID',
    displayName: 'Tên người dùng',
    email: 'E-mail',
    phoneNumber: 'Số điện thoại',
    dob: 'Ngày sinh',
    createdAt: 'Ngày tạo tài khoản',
    location: 'Địa chỉ',
  });

  // handle form
  const handleInputFocus = fieldName => {
    setIsFocused(prevState => ({
      ...prevState,
      [fieldName]: true,
    }));
  };

  //
  function limitText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    } else {
      return text.substring(0, maxLength) + '...';
    }
  }

  const handleInputBlur = fieldName => {
    setIsFocused(prevState => ({
      ...prevState,
      [fieldName]: false,
    }));
  };

  console.log('userInfo.createdAt: ', userInfo.createdAt);

  // version 2
  const [userInfo2, setUserInfo2] = useState({
    displayName: userInfo.displayName,
    email: userInfo.email,
    dob: userInfo.dob,
    createdAt: formatDate(userInfo.createdAt),
    // Thêm các trường thông tin khác cần thiết
  });

  // const [initDisplayName, setInitDisplayName] = useState(userInfo2.displayName);
  const [initialValues, setInitialValues] = useState({...userInfo2});

  const handleInputChange2 = (key, value) => {
    // setUserInfo2(prevState => {
    //   const newState = {...prevState, [key]: value};
    //   const hasValue = Object.values(newState).some(item => !!item);
    //   setShowButton(hasValue);
    //   console.log('value: ', value);
    //   console.log('hasValue: ', hasValue);
    //   return newState;
    // });
    // setUserInfo2(prevState => {
    //   const newState = {...prevState, [key]: value};
    //   const hasValueChanged = newState[key] !== prevState[key]; // So sánh giá trị mới với giá trị ban đầu
    //   setShowButton(hasValueChanged);
    //   console.log('value: ', value);
    //   console.log('hasValueChanged: ', hasValueChanged);
    //   console.log('newState: ', newState);
    //   console.log('prevState: ', prevState);
    //   console.log('newState[key]: ', newState[key]);
    //   console.log('prevState[key]: ', prevState[key]);
    //   console.log('hasValueChanged: ', hasValueChanged);
    //   return newState;
    // });
    // // checker
    // // Kiểm tra xem key có nằm trong danh sách các key của inputs không
    // if (Object.keys(inputs).includes(key)) {
    //   handleChangeText(key, value);
    //   return;
    // }
    // my logic
    if (typeof value !== 'undefined' && value !== null) {
      // Kiểm tra xem value có tồn tại không
      setUserInfo2(prevState => {
        const newState = {...prevState, [key]: value};
        const hasValueChanged = newState[key] !== initialValues[key]; // So sánh giá trị mới với giá trị ban đầu
        setShowButton(hasValueChanged);
        console.log('----------------------UserInfo2: ', userInfo2);
        return newState;
      });
    }
  };

  //info
  const [userDisplayName, setUserDisplayName] = useState('');
  const [userEmail, setUserEmail] = useState(null);

  // image
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    console.log('loading1: ', loading);
    setLoading(false);
    console.log('loading2: ', loading);
  };

  useEffect(() => {
    console.log('loading2: ', loading);
  }, [loading]);

  // console.log('EditProfileScreen_userInfo: ', userInfo);

  // button `Lưu`
  const [showButton, setShowButton] = useState(false);

  const handleInputChange = text => {
    setUserDisplayName(text);
    setShowButton(!!text); // Nếu text không rỗng, hiển thị nút, ngược lại ẩn nút
    console.log('showButton: ', showButton);
  };

  // convert
  function formatDate(timestamp) {
    if (typeof timestamp === 'string') {
      timestamp = parseInt(timestamp);
    }

    console.log('timestamp: ', timestamp);
    console.log('typeof timestamp: ', typeof timestamp);
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  //  date
  const [date, setDate] = useState('');

  // const handleChangeText = input => {
  //   // Loại bỏ bất kỳ dấu / nào đã được nhập trước đó
  //   input = input.replace(/\//g, '');

  //   // Kiểm tra xem có thể chia chuỗi thành 3 phần dd, mm, yyyy không
  //   if (input.length <= 2) {
  //     setDate(input);
  //   } else if (input.length <= 4) {
  //     setDate(input.substr(0, 2) + '/' + input.substr(2));
  //   } else if (input.length <= 8) {
  //     setDate(
  //       input.substr(0, 2) + '/' + input.substr(2, 2) + '/' + input.substr(4),
  //     );
  //   }
  // };

  // const handleBlur = () => {
  //   if (date.length !== 10) {
  //     Alert.alert('Lỗi', 'Vui lòng nhập đúng định dạng dd/mm/yyyy');
  //     setDate('');
  //     return;
  //   }

  //   const [day, month, year] = date.split('/').map(Number);
  //   const currentDate = new Date();
  //   const currentYear = currentDate.getFullYear();
  //   const minYear = currentYear - 100;

  //   if (
  //     isNaN(day) ||
  //     isNaN(month) ||
  //     isNaN(year) ||
  //     day < 1 ||
  //     day > 31 ||
  //     month < 1 ||
  //     month > 12 ||
  //     year < minYear ||
  //     year > currentYear
  //   ) {
  //     Alert.alert('Lỗi', 'Ngày tháng năm không hợp lệ');
  //     setDate('');
  //   }
  // };

  const [inputs, setInputs] = useState({
    createdAt: '',
    dob: '',
  });

  const [errors, setErrors] = useState({
    createdAt: '',
    dob: '',
  });

  const handleChangeText = (field, value = '') => {
    // // Loại bỏ bất kỳ dấu / nào đã được nhập trước đó
    // value = value.replace(/\//g, '');

    // // Kiểm tra xem có thể chia chuỗi thành 3 phần dd, mm, yyyy không
    // console.log('field: ', field);
    // console.log('value: ', value);
    // console.log('inputs: ', inputs);
    // if (value.length <= 2) {
    //   setInputs(prevInputs => ({...prevInputs, [field]: value}));
    //   console.log('input: 1', inputs);
    // } else if (value.length <= 4) {
    //   setInputs(prevInputs => ({
    //     ...prevInputs,
    //     [field]: value.substr(0, 2) + '/' + value.substr(2),
    //   }));
    //   console.log('input: 2', inputs);
    // } else if (value.length <= 8) {
    //   setInputs(prevInputs => ({
    //     ...prevInputs,
    //     [field]:
    //       value.substr(0, 2) + '/' + value.substr(2, 2) + '/' + value.substr(4),
    //   }));
    //   console.log('input: 3', inputs);
    // }
    // console.log('LAST inputs: ', inputs);
    // console.log('inputs.date: ', inputs.date);
    // handleInputChange2('createdAt', inputs.date);

    // // ###############
    // let updatedValue;

    // if (value.length <= 2) {
    //   updatedValue = value;
    // } else if (value.length <= 4) {
    //   updatedValue = value.substr(0, 2) + '/' + value.substr(2);
    // } else if (value.length <= 8) {
    //   updatedValue =
    //     value.substr(0, 2) + '/' + value.substr(2, 2) + '/' + value.substr(4);
    // }

    // console.log('updatedValue: ', updatedValue);
    // handleInputChange2('createdAt', updatedValue);

    // value = value.replace(/\//g, '');

    // updatedValue = value;
    // try {
    //   if (value.length <= 2) {
    //   } else if (value.length <= 4) {
    //     updatedValue = value.substr(0, 2) + '/' + value.substr(2);
    //   } else if (value.length <= 8) {
    //     updatedValue =
    //       value.substr(0, 2) + '/' + value.substr(2, 2) + '/' + value.substr(4);
    //   }

    //   // console.log('Updated value:', updatedValue);
    //   handleInputChange2('createdAt', updatedValue);
    // } catch (error) {
    //   console.log('error: ', error);
    // }

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

      // console.log('Updated value:', updatedValue);
      handleInputChange2('createdAt', updatedValue);
    }
  };

  const handleBlur = field => {
    const value = userInfo2[field];

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
        setInputs(prevInputs => ({...prevInputs, [field]: ''}));
        handleInputChange2(field, ''); // Truyền giá trị rỗng vào handleInputChange2
      } else {
        // Pass qua tất cả => Chuẩn rồi
        setErrors(prevErrors => ({...prevErrors, [field]: ''}));
      }
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: 'Vui lòng nhập đúng định dạng dd/mm/yyyy \nVí dụ: 25/09/2001',
      }));
      handleInputChange2(field, ''); // Truyền giá trị rỗng vào handleInputChange2
    }

    handleInputBlur(field);
  };

  return (
    <SafeAreaProvider>
      <CustomStatusBar
        backgroundColor='#fff'
        canGoBack={true}
        heightOfTop={50}
        customStyleIconBack={{marginBottom: 20}}
        arrowIconColor={'#fff'}
        arrowIconBackgroundColor={'#6E5532'}
        titleOfScreen={'Chỉnh sửa hồ sơ'}
        onPressBack={data => console.log(data)}
        dataNavigation={{
          screen: 'Tài khoản',
        }}
      />
      <ScrollView
        style={{
          flex: 1,
          paddingTop: 100,
          backgroundColor: '#fff',
        }}>
        <View
          style={{
            borderWidth: 1,
            alignItems: 'center',
            //
            marginTop: 10,
            backgroundColor: '#fff',
            paddingHorizontal: 14,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowOffset: {width: 0, height: 4},
            elevation: 5,
          }}>
          {userInfo && userInfo.photoURL && (
            <TouchableOpacity
              onPress={() => alert('Upload new image')}
              style={{paddingVertical: 20, opacity: loading ? 0 : 1}}>
              <LinearGradient
                colors={['yellow', 'pink', 'teal', 'cyan', 'magenta']}
                style={{
                  width: 160,
                  height: 160,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 999,
                }}>
                <Image
                  style={{
                    width: 150,
                    height: 150,
                    resizeMode: 'cover',
                    borderRadius: 999,
                    position: 'relative',
                  }}
                  source={{uri: userInfo.photoURL}}
                  onLoad={handleImageLoad}
                />
              </LinearGradient>
              {loading && (
                <ActivityIndicator
                  style={{position: 'absolute', alignSelf: 'center'}}
                />
              )}
              <View
                style={{
                  zIndex: 999,
                  position: 'absolute',
                  bottom: 28,
                  right: 8,
                  backgroundColor: '#ddd',
                  borderRadius: 60,
                  height: 35,
                  width: 35,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name={'camera-outline'} size={25} color={'#000'} />
              </View>
            </TouchableOpacity>
          )}

          {/* start */}
          <View
            style={{
              width: 170, // Adjust this size as needed
              height: 170, // Adjust this size as needed
              borderRadius: 85, // Half of width and height for a perfect circle
              overflow: 'hidden', // Clip child components to the view's bounds
              position: 'relative', // Position the linear gradient absolutely within the view
            }}>
            <Image
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
                position: 'absolute',
              }}
              source={{uri: userInfo.photoURL}}
            />
            {/* Linear Gradient for the border */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: 85,
                borderWidth: 3, // Adjust border width as needed
                borderColor: 'transparent', // Set transparent border color
                borderBottomColor: 'red', // Example: First color of the gradient
                borderRightColor: 'green', // Example: Second color of the gradient
                borderLeftColor: 'blue', // Example: Third color of the gradient
                borderTopColor: 'yellow', // Example: Fourth color of the gradient
                borderBottomLeftRadiusColor: 'orange', // Fifth color of the gradient
                borderBottomRightRadiusColor: 'purple', // Sixth color of the gradient
                borderTopLeftRadiusColor: 'pink', // Seventh color of the gradient
                borderTopRightRadiusColor: 'cyan', // Eighth color of the gradient
              }}
            />
          </View>
          {/* end */}

          {/* start2 */}
          <View style={{flex: 1}}>
            <Image
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
                position: 'absolute',
              }}
              source={{uri: userInfo.photoURL}}
              onLoad={handleImageLoad}
            />
            {loading && (
              <ActivityIndicator
                style={{position: 'absolute', alignSelf: 'center'}}
              />
            )}
          </View>
          {/* end2 */}
        </View>

        {/* Thông tin cá nhân */}
        <View
          style={{
            borderWidth: 1,
            marginTop: 10,
            paddingHorizontal: 14,

            // Nháp
            height: 2500,
          }}>
          <Text style={{fontSize: 18, fontWeight: 'bold', paddingTop: 20}}>
            Thông tin cá nhân
          </Text>

          {/* START: NEW TEXT INPUT */}
          <View style={styles.container}>
            {/* Thông tin cá nhân */}
            <View>
              <Text style={styles.title}>Thông tin cá nhân</Text>
              {/* UID */}
              <View style={styles.inputGroup}>
                <View
                  style={[
                    styles.inputUserInfo,
                    isFocused.userID && styles.inputFocused,
                  ]}>
                  <TextInput
                    onPressIn={() => alert('Bạn không thể chỉnh sửa UID.')}
                    readOnly={true}
                    style={[
                      styles.input,
                      isFocused.userID && {
                        borderBottomColor: 'rgba(19, 19, 21, 1)',
                      },
                    ]}
                    // onFocus={() => {
                    //   if (userInfo.uid) {
                    //     setIsFocused(true);
                    //     return;
                    //   }
                    // }}
                    onFocus={() => handleInputFocus('userID')}
                    onBlur={() => handleInputBlur('userID')}
                    // onBlur={() => setIsFocused(false)}
                    // onChangeText={text => setInputValue(text)}
                    onChangeText={text => setInputValue2(text)}
                    // value={inputValue}
                    // value={inputValue2}
                    value={limitText(userInfo.uid, 25)}
                  />
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.inputLabelTouchable}>
                    <Text
                      style={[
                        styles.inputLabel,
                        // isFocused || inputValue !== ''
                        //   ? styles.inputLabelFocused
                        //   : null,
                        isFocused.userID || userInfo.uid !== ''
                          ? styles.inputLabelFocused
                          : null,
                        // isFocused || inputValue2 !== ''
                        //   ? styles.inputLabelFocused
                        //   : null,
                      ]}>
                      {/* Tên input (label) */}
                      {formName.userID}
                    </Text>
                  </TouchableOpacity>
                  <AntDesign
                    name={'key'}
                    size={18}
                    color={'rgba(19, 19, 21, 0.6)'}
                    style={[
                      {
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        top: 10,
                      },
                      isFocused.userID && {
                        color: 'rgba(19, 19, 21, 1)',
                      },
                    ]}
                  />
                  <Text style={styles.inputHelper}>Message Text</Text>
                </View>
              </View>

              {/* CREATED DATE */}
              <View style={[styles.inputGroup]}>
                <View
                  style={[
                    styles.inputUserInfo,
                    isFocused.displayName && styles.inputFocused,
                  ]}>
                  <TextInput
                    // style={styles.input}
                    style={[
                      styles.input,
                      isFocused.displayName && {
                        borderBottomColor: 'rgba(19, 19, 21, 1)',
                      },
                    ]}
                    // onFocus={() => {
                    //   if (userInfo2.displayName) {
                    //     setIsFocused(true);
                    //     return;
                    //   }
                    // }}
                    // onBlur={() => setIsFocused(false)}
                    onFocus={() => handleInputFocus('displayName')}
                    onBlur={() => handleInputBlur('displayName')}
                    // onChangeText={text => setInputValue(text)}
                    // onChangeText={text => setInputValue2(text)}
                    onChangeText={text =>
                      handleInputChange2('displayName', text)
                    }
                    // value={inputValue}
                    // value={inputValue2}
                    value={userInfo2.displayName}
                  />
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.inputLabelTouchable}>
                    <Text
                      style={[
                        styles.inputLabel,
                        // isFocused || inputValue !== ''
                        //   ? styles.inputLabelFocused
                        //   : null,
                        isFocused.displayName || userInfo2.displayName !== ''
                          ? styles.inputLabelFocused
                          : null,
                        // isFocused || inputValue2 !== ''
                        //   ? styles.inputLabelFocused
                        //   : null,
                      ]}>
                      {/* Tên input (label) */}
                      {formName.displayName}
                    </Text>
                  </TouchableOpacity>
                  <AntDesign
                    name={'user'}
                    size={18}
                    color={'rgba(19, 19, 21, 0.6)'}
                    style={[
                      {
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        top: 10,
                      },
                      isFocused.displayName && {
                        color: 'rgba(19, 19, 21, 1)',
                      },
                    ]}
                  />
                  <Text style={styles.inputHelper}>Message Text</Text>
                </View>
              </View>

              {/* EMAIL */}
              <View style={[styles.inputGroup]}>
                <View
                  style={[
                    styles.inputUserInfo,
                    isFocused.email && styles.inputFocused,
                  ]}>
                  <TextInput
                    style={[
                      styles.input,
                      isFocused.email && {
                        borderBottomColor: 'rgba(19, 19, 21, 1)',
                      },
                    ]}
                    onFocus={() => handleInputFocus('email')}
                    onBlur={() => handleInputBlur('email')}
                    onChangeText={text => handleInputChange2('email', text)}
                    value={userInfo2.email}
                  />
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.inputLabelTouchable}>
                    <Text
                      style={[
                        styles.inputLabel,

                        isFocused.email || userInfo2.email !== ''
                          ? styles.inputLabelFocused
                          : null,
                      ]}>
                      {formName.email}
                    </Text>
                  </TouchableOpacity>
                  <AntDesign
                    name={'mail'}
                    size={18}
                    color={'rgba(19, 19, 21, 0.6)'}
                    style={[
                      {
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        top: 10,
                      },
                      isFocused.email && {
                        color: 'rgba(19, 19, 21, 1)',
                      },
                    ]}
                  />
                  <Text style={styles.inputHelper}>Message Text</Text>
                </View>
              </View>

              {/* SDT */}
              <View style={[styles.inputGroup]}>
                <View
                  style={[
                    styles.inputUserInfo,
                    isFocused.phoneNumber && styles.inputFocused,
                  ]}>
                  <TextInput
                    keyboardType='numeric'
                    style={[
                      styles.input,
                      isFocused.phoneNumber && {
                        borderBottomColor: 'rgba(19, 19, 21, 1)',
                      },
                    ]}
                    onFocus={() => handleInputFocus('phoneNumber')}
                    onBlur={() => handleInputBlur('phoneNumber')}
                    onChangeText={text =>
                      handleInputChange2('phoneNumber', text)
                    }
                    value={userInfo2.phoneNumber}
                  />
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.inputLabelTouchable}>
                    <Text
                      style={[
                        styles.inputLabel,
                        (isFocused.phoneNumber ||
                          (userInfo2.phoneNumber !== undefined &&
                            userInfo2.phoneNumber !== '')) &&
                          styles.inputLabelFocused,
                      ]}>
                      {formName.phoneNumber}
                    </Text>
                  </TouchableOpacity>
                  <AntDesign
                    name={'phone'}
                    size={18}
                    color={'rgba(19, 19, 21, 0.6)'}
                    style={[
                      {
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        top: 10,
                      },
                      isFocused.phoneNumber && {
                        color: 'rgba(19, 19, 21, 1)',
                      },
                    ]}
                  />
                  <Text style={styles.inputHelper}>Message Text</Text>
                </View>
              </View>

              {/* ĐỊA CHỈ */}
              <View style={[styles.inputGroup]}>
                <View
                  style={[
                    styles.inputUserInfo,
                    isFocused.location && styles.inputFocused,
                  ]}>
                  <TextInput
                    style={[
                      styles.input,
                      isFocused.location && {
                        borderBottomColor: 'rgba(19, 19, 21, 1)',
                      },
                    ]}
                    onFocus={() => handleInputFocus('location')}
                    onBlur={() => handleInputBlur('location')}
                    onChangeText={text => handleInputChange2('location', text)}
                    value={userInfo2.location}
                  />
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.inputLabelTouchable}>
                    <Text
                      style={[
                        styles.inputLabel,
                        (isFocused.location ||
                          (userInfo2.location !== undefined &&
                            userInfo2.location !== '')) &&
                          styles.inputLabelFocused,
                      ]}>
                      {formName.location}
                    </Text>
                  </TouchableOpacity>
                  <Ionicons
                    name={'location-outline'}
                    size={20}
                    color={'rgba(19, 19, 21, 0.6)'}
                    style={[
                      {
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        top: 10,
                      },
                      isFocused.location && {
                        color: 'rgba(19, 19, 21, 1)',
                      },
                    ]}
                  />
                  <Text style={styles.inputHelper}>Message Text</Text>
                </View>
              </View>

              {/* DOB */}
              <View style={[styles.inputGroup]}>
                <View
                  style={[
                    styles.inputUserInfo,
                    isFocused.dob && styles.inputFocused,
                  ]}>
                  <TextInput
                    style={[
                      styles.input,
                      isFocused.dob && {
                        borderBottomColor: 'rgba(19, 19, 21, 1)',
                      },
                    ]}
                    onFocus={() => handleInputFocus('dob')}
                    onBlur={() => handleInputBlur('dob')}
                    onChangeText={text => handleInputChange2('dob', text)}
                    value={userInfo2.dob}
                  />
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.inputLabelTouchable}>
                    <Text
                      style={[
                        styles.inputLabel,

                        isFocused.dob || userInfo2.dob !== ''
                          ? styles.inputLabelFocused
                          : null,
                      ]}>
                      {formName.dob}
                    </Text>
                  </TouchableOpacity>
                  <AntDesign
                    name={'gift'}
                    size={18}
                    color={'rgba(19, 19, 21, 0.6)'}
                    style={[
                      {
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        top: 10,
                      },
                      isFocused.dob && {
                        color: 'rgba(19, 19, 21, 1)',
                      },
                    ]}
                  />
                  <Text style={styles.inputHelper}>Message Text</Text>
                </View>
              </View>

              {/* CREATED DATE */}
              <View style={[styles.inputGroup]}>
                <View
                  style={[
                    styles.inputUserInfo,
                    isFocused.createdAt && styles.inputFocused,
                  ]}>
                  <TextInput
                    style={[
                      styles.input,
                      isFocused.createdAt && {
                        borderBottomColor: 'rgba(19, 19, 21, 1)',
                      },
                    ]}
                    // value={inputs.date}
                    value={userInfo2.createdAt}
                    onFocus={() => handleInputFocus('createdAt')}
                    onChangeText={text => handleChangeText('date', text)}
                    // onBlur={() => handleBlur('date')}
                    onBlur={() => handleBlur('createdAt')}
                    maxLength={10}
                    keyboardType='numeric'
                  />
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.inputLabelTouchable}>
                    <Text
                      style={[
                        styles.inputLabel,

                        isFocused.createdAt || userInfo2.createdAt !== ''
                          ? styles.inputLabelFocused
                          : null,
                      ]}>
                      {formName.createdAt}
                    </Text>
                  </TouchableOpacity>
                  <AntDesign
                    name={'mail'}
                    size={18}
                    color={'rgba(19, 19, 21, 0.6)'}
                    style={[
                      {
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        top: 10,
                      },
                      isFocused.createdAt && {
                        color: 'rgba(19, 19, 21, 1)',
                      },
                    ]}
                  />
                  {errors.createdAt ? (
                    // <Text style={styles.errorText}>{errors.date}</Text>
                    <Text style={styles.inputHelper}>{errors.createdAt}</Text>
                  ) : null}
                </View>
              </View>

              {/* Picker date */}
              <View>
                <TextInput
                  value={inputs.date}
                  onChangeText={text => handleChangeText('date', text)}
                  onBlur={() => handleBlur('date')}
                  placeholder='dd/mm/yyyy'
                  maxLength={10}
                  keyboardType='numeric'
                  style={styles.input}
                />
                {errors.date ? (
                  <Text style={styles.errorText}>{errors.date}</Text>
                ) : null}
              </View>
              <View>
                <TextInput
                  value={inputs.dob}
                  onChangeText={text => handleChangeText('dob', text)}
                  onBlur={() => handleBlur('dob')}
                  placeholder='dd/mm/yyyy'
                  maxLength={10}
                  keyboardType='numeric'
                  style={styles.input}
                />
                {errors.dob ? (
                  <Text style={styles.errorText}>{errors.dob}</Text>
                ) : null}
              </View>
            </View>
          </View>

          {/* END: NEW TEXT INPUT */}

          {/* <View style={{borderWidth: 1, marginTop: 40}}>
            <Button
              title={'Lưu thay đổi'}
              onPress={() => alert('meow')}
              buttonStyleCustom={{borderRadius: '15%'}}
            />
          </View> */}

          {/*  */}
          {/* <LinearGradient
            colors={['red', 'green', 'blue', 'yellow', 'orange']}
            style={{
              width: '100%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <Text
              style={[
                {
                  fontSize: 16,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  color: '#fff',
                },
              ]}>
              'children'
            </Text>
          </LinearGradient> */}

          {/* <LinearGradient
            colors={['yellow', 'pink', 'teal', 'cyan', 'magenta']}
            style={{
              width: 210,
              height: 210,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 999,
            }}>
            <Image
              style={{
                width: 200,
                height: 200,
                resizeMode: 'cover',
                borderRadius: 999,
                position: 'relative',
              }}
              source={{uri: userInfo.photoURL}}
            />
          </LinearGradient> */}
        </View>
      </ScrollView>
      {showButton && (
        <View
          style={{
            // borderWidth: 1,
            position: 'absolute',
            bottom: 30,
            left: 10,
            right: 10,
          }}>
          <Button
            title={'Lưu thay đổi'}
            // onPress={() => alert('meow')}
            onPress={() => console.log('\n\n\n\nuserinfo2: ', userInfo2)}
            buttonStyleCustom={{borderRadius: '15%', paddingVertical: 16}}
          />
        </View>
      )}
    </SafeAreaProvider>
  );
}

// style
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    marginTop: 30,
    borderColor: 'whitesmoke',
    borderWidth: 1,
    padding: 21,
    borderRadius: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 45,
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 15,

    // temp
    borderWidth: 0,
    paddingTop: 25,
  },
  inputUserInfo: {
    position: 'relative',
    width: 300, //width của text input
  },
  inputFocused: {
    borderBottomColor: 'rgba(19, 19, 21, 1)', // Adjust as per your design
  },
  input: {
    // borderBottomWidth: 1,
    // borderBottomColor: 'rgba(19, 19, 21, 0.6)', // Adjust as per your design
    // height: 40,
    // fontSize: 17, // Adjust as per your design
    // paddingLeft: 10, // Adjust as per your design
    // paddingRight: 40, // Adjust as per your design
    // marginBottom: 5, // Adjust as per your design

    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(19, 19, 21, .6)', // Adjust as per your design
    height: 40,
    fontSize: 17, // Adjust as per your design
    paddingLeft: 10, // Adjust as per your design
    paddingRight: 40, // Adjust as per your design
    marginBottom: 5, // Adjust as per your design
  },
  inputLabelTouchable: {
    position: 'absolute',
    top: 12, // Adjust as per your design
    left: 10, // Adjust as per your design
    zIndex: 1,
    flexDirection: 'row',
  },
  inputLabel: {
    color: 'rgba(19, 19, 21, 0.6)', // Adjust as per your design
  },
  // Cái này chỉnh độ cao khi đc focus
  inputLabelFocused: {
    top: -18,
    fontSize: 12, // Adjust as per your design
    color: 'rgba(19, 19, 21, 1)', // Adjust as per your design
    fontWeight: '700',
  },
  inputHelper: {
    fontSize: 15, // Adjust as per your design
    color: 'rgba(19, 19, 21, 0.6)', // Adjust as per your design
    marginLeft: 10, // Adjust as per your design
    marginRight: 10, // Adjust as per your design
    marginTop: 3, // Adjust as per your design
  },
  icon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    top: 10,
  },
  errorText: {
    color: 'red',
    marginLeft: 10,
  },
});
