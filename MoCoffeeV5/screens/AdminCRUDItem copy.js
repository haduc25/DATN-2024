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

// DROPDOWN
import {SelectList} from 'react-native-dropdown-select-list';

import Button from '../components/Button';

export default function AdminCRUDItem({navigation}) {
  // VALUE OF ITEM
  const [itemInfo, setItemInfo] = useState({
    name: 'SAN PHAM 1',
    description:
      'MO TA SAN PHAM 1There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form',
    // price: '100.000 ₫',
    price: '',
    category: 'tea',
    size: 'M',
    available: true,
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
    price: false,
    category: false,
    size: false,
    available: false,
    createdAt: false,
    location: false, // true => có dữ liệu, ngược lại
  });

  // FORM NAME
  const [formName, setFormName] = useState({
    name: 'Tên sản phẩm *',
    description: 'Mô tả sản phẩm *',
    price: 'Giá sản phẩm *',
    category: 'Phân loại sản phẩm *',
    size: 'Size sản phẩm',
    available: 'Chế độ hiển thị',
    createdAt: 'Ngày tạo tài khoản',
    location: 'Địa chỉ',
    gtinh: 'Giới tính',
    uploadedImageName: null,
  });

  //   ERRORS
  const [errors, setErrors] = useState({
    name: 'meow meow',
    description: 'error 1',
    price: 'vui long nhap giá',
    category: 'vui lòng chọn đê',
    size: 'Vui long chon size',
    available: 'Vui long chon chế độ hiển thị',
    displayName: '',
  });

  // ####################### LIBRARY ####################### //
  // CATEGORY
  const [selectedItem, setSelectedItem] = useState('');

  const CategoriesData = [
    {key: '0', value: 'Cà phê', category: 'coffee'},
    {key: '1', value: 'Trà', category: 'tea'},
    {key: '2', value: 'Trà sữa', category: 'milk-tea'},
    {key: '3', value: 'Đồ ăn vặt', disabled: true, category: 'food'},
  ];

  const handleSelectedItem = index => {
    console.log('index: ', index);
    console.log('Category:', CategoriesData[index].category);
  };

  // AVAILABLE_SIZES
  const SizeData = [
    {key: '0', value: 'M'},
    {key: '1', value: 'L'},
  ];

  const handleSizeItem = value => {
    console.log('Size: ', value);
  };

  // AVAILABLE
  const AvailableData = [
    {key: '0', value: 'Công khai', activate: true},
    {key: '1', value: 'Ẩn', activate: false},
  ];

  const handleAvailableItem = index => {
    console.log('AVAILABLE: ', AvailableData[index].activate);
  };
  // ####################### FUNCIONS ####################### //
  // HANDLE INPUT BLUR
  // const handleInputBlur = fieldName => {
  //   setIsFocused(prevState => ({
  //     ...prevState,
  //     [fieldName]: false,
  //   }));
  // };
  const handleInputBlur = fieldName => {
    setIsFocused(prevState => ({
      ...prevState,
      [fieldName]: false,
    }));

    if (fieldName === 'price') {
      setItemInfo(prevState => ({
        ...prevState,
        [fieldName]: prevState[fieldName] + '₫', // Thêm ký hiệu tiền tệ vào cuối
      }));
    }
  };

  // HANDLE INPUT FOCUS
  // const handleInputFocus = fieldName => {
  //   console.log(
  //     'formatCurrency(itemInfo.price): ',
  //     formatCurrency(itemInfo.price),
  //   );
  //   setIsFocused(prevState => ({
  //     ...prevState,
  //     [fieldName]: true,
  //   }));
  // };
  const handleInputFocus = fieldName => {
    console.log(
      'formatCurrency(itemInfo.price): ',
      formatCurrency(itemInfo.price),
    );
    setIsFocused(prevState => ({
      ...prevState,
      [fieldName]: true,
    }));

    if (fieldName === 'price' && itemInfo.price.endsWith('₫')) {
      setItemInfo(prevState => ({
        ...prevState,
        [fieldName]: prevState[fieldName].slice(0, -1), // Xóa ký hiệu tiền tệ khỏi cuối chuỗi
      }));
    }
  };

  // HANDLE INPUT VALUE CHANGE
  const handleValueChange = (key, value) => {
    console.log('key & value: ', key, value);
    console.log('typeof value: ', typeof value);
    if (typeof value !== 'undefined' && value !== null) {
      let newValue = value;
      if (key === 'price') {
        // Xóa các ký tự không phải số và không phải dấu chấm
        newValue = newValue.replace(/[^\d.]/g, '');
        // Kiểm tra nếu giá trị mới không phải là số hoặc là một chuỗi rỗng
        // thì gán giá trị mới là '0'
        if (isNaN(newValue) || newValue === '') {
          newValue = '0';
        }
        // Kiểm tra nếu giá trị mới nhỏ hơn 0 thì gán giá trị mới là '0'
        else if (parseFloat(newValue) < 0) {
          newValue = '0';
        }
        // Chuyển đổi giá trị sang định dạng tiền tệ
        else {
          newValue = parseFloat(newValue).toLocaleString('en-US');
        }
      }
      setItemInfo(prevState => {
        const newState = {...prevState, [key]: newValue};
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

  function formatCurrency(value) {
    // Chuyển đổi chuỗi số thành số nguyên
    const intValue = parseInt(value, 10);

    // Sử dụng phương thức toLocaleString để thêm dấu chấm phân tách hàng nghìn
    return intValue.toLocaleString('en-US');
  }

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

        {/* PRICE */}
        <View style={styles.inputGroup}>
          <View
            style={[
              styles.inputUserInfo,
              isFocused.price && styles.inputFocused,
            ]}>
            <TextInput
              style={[
                styles.input,
                isFocused.price && {
                  borderBottomColor: 'rgba(19, 19, 21, 1)',
                },
              ]}
              keyboardType='numeric'
              maxLength={20}
              onFocus={() => handleInputFocus('price')}
              onBlur={() => handleInputBlur('price')}
              onChangeText={text => handleValueChange('price', text)}
              value={itemInfo.price}
            />
            <TouchableOpacity
              activeOpacity={1}
              style={styles.inputLabelTouchable}>
              <Text
                style={[
                  styles.inputLabel,
                  isFocused.price || itemInfo.price !== ''
                    ? styles.inputLabelFocused
                    : null,
                ]}>
                {formName.price}
              </Text>
            </TouchableOpacity>
            <AntDesign
              name={isFocused.price ? 'checkcircle' : 'checkcircleo'}
              size={18}
              color={'rgba(50, 205, 50, 0.6)'}
              style={[
                {
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  top: 10,
                },
                isFocused.price && {
                  color: 'rgba(50, 205, 50, 1)',
                },
              ]}
            />
            {errors.price ? (
              <Text style={styles.inputHelper}>{errors.price}</Text>
            ) : null}
          </View>
        </View>

        {/* START: CATEGORY */}
        <View style={styles.inputGroup}>
          <View
            style={[
              styles.inputUserInfo,
              isFocused.category && styles.inputFocused,
            ]}>
            <SelectList
              setSelected={val => handleSelectedItem(val)}
              data={CategoriesData}
              // save='value'
              searchPlaceholder={'Phân loại sản phẩm của bạn'}
              placeholder={'Chọn loại sản phẩm'}
            />
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.inputLabelTouchable, {top: 0}]}>
              <Text
                style={[
                  styles.inputLabel,
                  isFocused.category || itemInfo.category !== ''
                    ? styles.inputLabelFocused
                    : null,
                ]}>
                {formName.category}
              </Text>
            </TouchableOpacity>

            {errors.category ? (
              <Text style={styles.inputHelper}>{errors.category}</Text>
            ) : null}
          </View>
        </View>
        {/* END: CATEGORY */}

        {/* START: AVAILABLE_SIZES */}
        <View style={styles.inputGroup}>
          <View
            style={[
              styles.inputUserInfo,
              isFocused.size && styles.inputFocused,
            ]}>
            <SelectList
              setSelected={val => handleSizeItem(val)}
              data={SizeData}
              save='value'
              searchPlaceholder={'Size sản phẩm của bạn'}
              placeholder={'Chọn size cho sản phẩm'}
            />
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.inputLabelTouchable, {top: 0}]}>
              <Text
                style={[
                  styles.inputLabel,
                  isFocused.size || itemInfo.size !== ''
                    ? styles.inputLabelFocused
                    : null,
                ]}>
                {formName.size}
              </Text>
            </TouchableOpacity>

            {errors.size ? (
              <Text style={styles.inputHelper}>{errors.size}</Text>
            ) : null}
          </View>
        </View>
        {/* END: AVAILABLE_SIZES */}

        {/* START: AVAILABLE */}
        <View style={styles.inputGroup}>
          <View
            style={[
              styles.inputUserInfo,
              isFocused.available && styles.inputFocused,
            ]}>
            <SelectList
              setSelected={val => handleAvailableItem(val)}
              data={AvailableData}
              // save='value'
              searchPlaceholder={'Chế độ hiển thị sản phẩm'}
              placeholder={'Chọn chế độ hiển thị cho sản phẩm'}
            />
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.inputLabelTouchable, {top: 0}]}>
              <Text
                style={[
                  styles.inputLabel,
                  isFocused.available || itemInfo.available !== ''
                    ? styles.inputLabelFocused
                    : null,
                ]}>
                {formName.available}
              </Text>
            </TouchableOpacity>

            {errors.available ? (
              <Text style={styles.inputHelper}>{errors.available}</Text>
            ) : null}
          </View>
        </View>
        {/* END: AVAILABLE */}

        <View style={{height: 800}}></View>
      </ScrollView>

      {/* BUTTON */}
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          // backgroundColor: 'yellow',
          flexDirection: 'row',
          justifyContent: 'center',
          // paddingHorizontal: 20,
          // paddingVertical: 10,
          // backgroundColor: '#fff', // Change this to match your background color
          borderColor: '#ccc', // Change this to match your border color
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}>
        {/* <TouchableOpacity
          onPress={() => navi.navigate('Trang chủ')}
          style={{
            justifyContent: 'center',
            // borderWidth: 1,
            borderRadius: '15%',
            width: '100%',
            alignItems: 'center',
            backgroundColor: '#000',
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: '600',
            }}>
            Trang chủ
          </Text>
        </TouchableOpacity> */}
        <Button
          title={'Thêm 1 sản phẩm mới'}
          // onPress={() => navi.navigate('AdminCRUDItem')}
          onPress={() => console.log('itemInfo: ', itemInfo)}
          // loading={loading.buttonLoading}
          // disabled={loading.buttonLoading}
          buttonStyleCustom={{
            borderRadius: '15%',
            paddingVertical: 16,
            backgroundColor: '#ff4c4c',
            width: '100%',
          }}
          textStyleInsideButtonCustom={{textTransform: 'uppercase'}}
        />
      </View>
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
});
