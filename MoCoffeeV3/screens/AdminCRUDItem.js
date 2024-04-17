import {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import CustomStatusBar from '../components/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AntDesign} from '@expo/vector-icons';

// dropdown
import SelectDropdown from 'react-native-select-dropdown';

export default function AdminCRUDItem({navigation}) {
  // VALUE OF ITEM
  const [itemInfo, setItemInfo] = useState({
    name: 'SAN PHAM 1',
    description:
      'MO TA SAN PHAM 1There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form',
    // displayName: userInfo.displayName,
    // email: userInfo.email,
    // dob: userInfo.dob,
    // createdAt: formatDate(userInfo.createdAt),
    // gtinh: userInfo.gtinh,
    // photoURL: userInfo.photoURL,
    // phoneNumber: userInfo.phoneNumber,
    // location: userInfo.location,
    // uid: userInfo.uid.trim(),
    // Thêm các trường thông tin khác cần thiết
  });

  // FOCUS
  const [isFocused, setIsFocused] = useState({
    name: false,
    description: false,
    email: false,
    phoneNumber: false,
    dob: false,
    createdAt: false,
    location: false, // true => có dữ liệu, ngược lại
  });

  // FORM NAME
  const [formName, setFormName] = useState({
    name: 'Tên sản phẩm *',
    description: 'Mô tả sản phẩm *',
    category: 'Phân loại sản phẩm *',
    phoneNumber: 'Số điện thoại',
    dob: 'Ngày sinh',
    createdAt: 'Ngày tạo tài khoản',
    location: 'Địa chỉ',
    gtinh: 'Giới tính',
    uploadedImageName: null,
  });

  //   ERRORS
  const [errors, setErrors] = useState({
    name: 'meow meow',
    description: 'error 1',
    createdAt: '',
    dob: '',
    email: '',
    displayName: '',
  });

  // ####################### LIBRARY ####################### //
  const emojisWithIcons = [
    {title: 'happy', icon: 'exclamationcircle'},
    {title: 'cool', icon: 'exclamationcircle'},
    {title: 'lol', icon: 'exclamationcircle'},
    {title: 'sad', icon: 'exclamationcircle'},
    {title: 'cry', icon: 'exclamationcircle'},
    {title: 'angry', icon: 'exclamationcircle'},
    {title: 'confused', icon: 'exclamationcircle'},
    {title: 'excited', icon: 'exclamationcircle'},
    {title: 'kiss', icon: 'exclamationcircle'},
    {title: 'devil', icon: 'exclamationcircle'},
    {title: 'dead', icon: 'exclamationcircle'},
    {title: 'wink', icon: 'exclamationcircle'},
    {title: 'sick', icon: 'exclamationcircle'},
    {title: 'frown', icon: 'exclamationcircle'},
  ];
  // ####################### FUNCIONS ####################### //
  // HANDLE INPUT BLUR
  const handleInputBlur = fieldName => {
    setIsFocused(prevState => ({
      ...prevState,
      [fieldName]: false,
    }));
  };

  // HANDLE INPUT FOCUS
  const handleInputFocus = fieldName => {
    setIsFocused(prevState => ({
      ...prevState,
      [fieldName]: true,
    }));
  };

  // HANDLE INPUT VALUE CHANGE
  const handleValueChange = (key, value) => {
    if (typeof value !== 'undefined' && value !== null) {
      setItemInfo(prevState => {
        const newState = {...prevState, [key]: value};

        // // So sánh giá trị mới với giá trị ban đầu
        // const hasValueChanged = newState[key] !== initialValues[key];

        // // Nếu giá trị đã thay đổi, thêm key vào danh sách dữ liệu đã thay đổi
        // if (hasValueChanged) {
        //   setChangedFields(prevFields => {
        //     return {...prevFields, [key]: true};
        //   });
        // }
        return newState;
      });
    }
  };

  return (
    <SafeAreaProvider>
      <CustomStatusBar
        backgroundColor='#fff'
        canGoBack={true}
        heightOfTop={50}
        customStyleIconBack={{marginBottom: 20}}
        customStyleFormStatusBar={{
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 10,
          shadowOffset: {width: 0, height: 0},
          elevation: 5,
          maxHeight: 200,
        }}
        arrowIconColor={'#fff'}
        arrowIconBackgroundColor={'#6E5532'}
        titleOfScreen={'Thêm sản phẩm mới'}
        onPressBack={data => console.log(data)}
        dataNavigation={{
          screen: 'AdminProductsCRUD',
        }}
      />

      <ScrollView
        style={{
          flex: 1,
          paddingTop: 100,
        }}>
        {/* IMAGE */}
        <View
          style={{
            alignItems: 'left',
            backgroundColor: 'red',
            padding: 10,
          }}>
          <Text style={{fontSize: 16, fontWeight: '600'}}>
            Hình ảnh sản phẩm *
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            <View style={{position: 'relative'}}>
              <Image
                style={{width: 110, height: 110, borderRadius: 8, margin: 8}}
                source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fproducts%2Ftemp%2Fimages.jpg?alt=media&token=378984d7-948f-4240-8c8d-f41c31ca0b12',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: 'rgba(0,0,0,.45)',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 999,
                  height: 25,
                  marginLeft: 8,
                  marginRight: 8,
                  marginBottom: 8,
                  borderBottomRightRadius: 8,
                  borderBottomLeftRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: '#fff', fontSize: 14, fontWeight: '600'}}>
                  Ảnh bìa
                </Text>
              </View>
            </View>
            <Image
              style={{width: 110, height: 110, borderRadius: 8, margin: 8}}
              source={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fproducts%2Ftemp%2Fimages.jpg?alt=media&token=378984d7-948f-4240-8c8d-f41c31ca0b12',
              }}
            />
            <Image
              style={{width: 110, height: 110, borderRadius: 8, margin: 8}}
              source={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fproducts%2Ftemp%2Fimages.jpg?alt=media&token=378984d7-948f-4240-8c8d-f41c31ca0b12',
              }}
            />
            <Image
              style={{width: 110, height: 110, borderRadius: 8, margin: 8}}
              source={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fproducts%2Ftemp%2Fimages.jpg?alt=media&token=378984d7-948f-4240-8c8d-f41c31ca0b12',
              }}
            />
            <Image
              style={{width: 110, height: 110, borderRadius: 8, margin: 8}}
              source={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fproducts%2Ftemp%2Fimages.jpg?alt=media&token=378984d7-948f-4240-8c8d-f41c31ca0b12',
              }}
            />
            <View
              style={{
                width: 110,
                height: 110,
                borderRadius: 8,
                margin: 8,
                borderWidth: 1,
                borderColor: '#ccc',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
              }}>
              <Text>Thêm ảnh</Text>
              <AntDesign name={'picture'} size={18} style={{paddingRight: 6}} />
            </View>
          </View>
        </View>

        {/* NAME */}
        <View style={styles.inputGroup}>
          <View
            style={[
              styles.inputUserInfo,
              isFocused.name && styles.inputFocused,
            ]}>
            <TextInput
              style={[
                styles.input,
                isFocused.name && {
                  borderBottomColor: 'rgba(19, 19, 21, 1)',
                },
              ]}
              onFocus={() => handleInputFocus('name')}
              onBlur={() => handleInputBlur('name')}
              onChangeText={text => handleValueChange('name', text)}
              value={itemInfo.name}
            />
            <TouchableOpacity
              activeOpacity={1}
              style={styles.inputLabelTouchable}>
              <Text
                style={[
                  styles.inputLabel,
                  isFocused.name || itemInfo.name !== ''
                    ? styles.inputLabelFocused
                    : null,
                ]}>
                {formName.name}
              </Text>
            </TouchableOpacity>
            <AntDesign
              name={isFocused.name ? 'checkcircle' : 'checkcircleo'}
              size={18}
              color={'rgba(50, 205, 50, 0.6)'}
              style={[
                {
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  top: 10,
                },
                isFocused.name && {
                  color: 'rgba(50, 205, 50, 1)',
                },
              ]}
            />
            {errors.name ? (
              <Text style={styles.inputHelper}>{errors.name}</Text>
            ) : null}
          </View>
        </View>

        {/* DESCRIPTION */}
        <View style={styles.inputGroup}>
          <View
            style={[
              styles.inputUserInfo,
              isFocused.description && styles.inputFocused,
            ]}>
            <TextInput
              multiline={true}
              numberOfLines={4}
              maxLength={165}
              maxHeight={isFocused.description ? 100 : 40}
              style={[
                styles.input,
                {height: isFocused.description ? 100 : 40},
                isFocused.description && {
                  borderBottomColor: 'rgba(19, 19, 21, 1)',
                },
              ]}
              onFocus={() => handleInputFocus('description')}
              onBlur={() => handleInputBlur('description')}
              onChangeText={text => handleValueChange('description', text)}
              value={itemInfo.description}
            />
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.inputLabelTouchable,
                {top: isFocused.description ? 4 : 12},
              ]}>
              <Text
                style={[
                  styles.inputLabel,
                  isFocused.description || itemInfo.description !== ''
                    ? styles.inputLabelFocused
                    : null,
                ]}>
                {formName.description}
              </Text>
            </TouchableOpacity>
            <AntDesign
              name={isFocused.description ? 'checkcircle' : 'checkcircleo'}
              size={18}
              color={'rgba(50, 205, 50, 0.6)'}
              style={[
                {
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  top: isFocused.description ? 30 : 10,
                },
                isFocused.description && {
                  color: 'rgba(50, 205, 50, 1)',
                },
              ]}
            />
            {errors.description ? (
              <Text style={styles.inputHelper}>{errors.description}</Text>
            ) : null}
          </View>
        </View>

        {/* START: CATEGORY */}
        <SelectDropdown
          data={emojisWithIcons}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                {selectedItem && (
                  <AntDesign
                    name={selectedItem.icon}
                    style={styles.dropdownButtonIconStyle}
                  />
                )}
                <Text style={styles.dropdownButtonTxtStyle}>
                  {(selectedItem && selectedItem.title) || 'Select your mood'}
                </Text>
                <AntDesign
                  name={isOpened ? 'arrowup' : 'arrowdown'}
                  style={styles.dropdownButtonArrowStyle}
                />
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && {backgroundColor: '#D2D9DF'}),
                }}>
                <AntDesign
                  name={item.icon}
                  style={styles.dropdownItemIconStyle}
                />
                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
        {/* END: CATEGORY */}

        <View style={{height: 800}}></View>
      </ScrollView>
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
    // borderWidth: 1, (có thể bật hoặc không vì màu rất mờ)
    padding: 21,
    borderRadius: 4,
  },
  title: {
    textAlign: 'center',
    // marginBottom: 45,
    marginBottom: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 15,
    padding: 10,
    width: '100%',
    // temp
    borderWidth: 0,
    paddingTop: 25,
  },
  inputUserInfo: {
    position: 'relative',
    // width: 300, //width của text input
  },
  inputFocused: {
    borderBottomColor: 'rgba(19, 19, 21, 1)', // Adjust as per your design
  },
  input: {
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

  // Gioi tinh
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: 'lightblue', // Màu sắc của nút radio khi được chọn
  },
  radioText: {
    fontSize: 16,
    marginRight: 10,
  },
  selectedGender: {
    marginTop: 20,
    fontSize: 16,
  },

  //
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
