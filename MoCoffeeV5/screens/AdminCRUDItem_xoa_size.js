import {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  LogBox,
  Alert,
} from 'react-native';

import CustomStatusBar from '../components/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AntDesign} from '@expo/vector-icons';

// DROPDOWN
import {
  SelectList,
  MultipleSelectList,
} from 'react-native-dropdown-select-list';
import Button from '../components/Button';

// PICK IMAGE
import * as ImagePicker from 'expo-image-picker';

// NAVIGATION
import {useNavigation} from '@react-navigation/native';

// FIREBASE UPLOAD IMAGE
import {
  auth,
  storage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  updateProfile,
  db,
  doc,
  updateDoc,
  addDoc,
  collection,
  setDoc,
} from '../firebase';
import {convertISOToFormattedDate} from '../utils/globalHelpers';

export default function AdminCRUDItem({navigation}) {
  // VALUE OF ITEM
  const [itemInfo, setItemInfo] = useState({
    featured_image: [],
    name: '',
    description: '',
    price: '',
    category: '',
    available: null,
  });

  // FOCUS
  const [isFocused, setIsFocused] = useState({
    name: false,
    description: false,
    price: false,
    category: false,
    available: false,
  });

  // FORM NAME
  const [formName, setFormName] = useState({
    featured_image: 'Hình ảnh sản phẩm *',
    name: 'Tên sản phẩm *',
    description: 'Mô tả sản phẩm *',
    price: 'Giá sản phẩm *',
    category: 'Phân loại sản phẩm *',
    available: 'Chế độ hiển thị *',
  });

  //   ERRORS
  const [errors, setErrors] = useState({
    featured_image: '',
    name: '',
    description: '',
    price: '',
    category: '',
    available: '',
  });

  const navi = useNavigation();

  // const [categoryDefaultOption, setCategoryDefaultOption] = useState(null);

  // ####################### LIBRARY ####################### //
  // # DROPDOWN
  // CATEGORY
  const [selectedItem, setSelectedItem] = useState('');

  const CategoriesData = [
    {key: '0', value: 'Cà phê', category: 'coffee'},
    {key: '1', value: 'Cà phê pha máy (Espresso)', category: 'coffee-espresso'},
    {key: '2', value: 'Trà', category: 'tea'},
    {key: '3', value: 'Trà sữa', category: 'milk-tea'},
    {key: '4', value: 'Đồ ăn vặt', disabled: true, category: 'food'},
    {key: '5', value: 'Sữa chua', category: 'yogurt'},
    {key: '6', value: 'Soda', category: 'soda'},
    {key: '7', value: 'Sinh tố', category: 'smoothie'},
  ];

  const handleSelectedItem = index => {
    console.log('index: ', index);
    console.log('index: ', typeof index);
    console.log('Category:', CategoriesData[index].category);
    handleValueChange('category', CategoriesData[index].category);
  };

  // AVAILABLE
  const AvailableData = [
    {key: '0', value: 'Công khai', activate: true},
    {key: '1', value: 'Ẩn', activate: false},
  ];

  const handleAvailableItem = index => {
    console.log('AVAILABLE: ', AvailableData[index].activate);
    handleValueChange('available', AvailableData[index].activate);
  };

  // PICK IMAGE
  // PICK IMAGE FROM LIBRARY
  const handlePickImageFromLibrary = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      quality: 5,
      // multiple: true, // Cho phép chọn nhiều ảnh
      allowsMultipleSelection: true,
    });

    if (result.assets.length >= 6) {
      console.log('result.assets.length: ', result.assets.length);
      setErrorWithTimeout(
        'featured_image',
        'Bạn đã chọn đủ số lượng tối đa là ảnh (5 ảnh)',
        5000,
      );
      return;
    }

    if (!result.canceled) {
      // case khi mà đã chọn vào image (selected)
      // setImageURI(result.assets[0].uri);
      // handleValueChange('photoURL', result.assets[0].uri);
      console.log('result.assets[0].uri: ', result.assets[0].uri);
      console.log('result.assets: ', result.assets);
      console.log('result.assets-length: ', result.assets.length);

      // Cái này lưu lại ảnh cũ
      // setItemInfo(prevItemInfo => ({
      //   ...prevItemInfo,
      //   featured_image: [
      //     ...prevItemInfo.featured_image,
      //     ...result.assets,
      //   ].slice(0, 5),
      // }));

      // Cái này khi chọn ảnh mới `replace` vào image cũ luôn
      setItemInfo(prevItemInfo => ({
        ...prevItemInfo,
        featured_image: result.assets.slice(0, 5),
      }));
    }
  };

  // IGNORE
  // Ignore specific warning for deprecated 'cancelled' key
  useEffect(() => {
    LogBox.ignoreLogs([
      'Key "cancelled" in the image picker result is deprecated',
    ]);
  }, []);

  // UPLOAD IMAGES
  let savePhotoURL = [];
  const uploadAndSaveURL = async () => {
    try {
      console.log('111');
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear().toString();
      const dateString = `${day}${month}${year}`;

      await Promise.all(
        itemInfo.featured_image.map(async image => {
          try {
            const response = await fetch(image.uri);

            const blob = await response.blob();
            const imageName = image.uri.substring(
              image.uri.lastIndexOf('/') + 1,
            );

            const storageRef = ref(
              storage,
              `assets/products/${dateString}/${imageName}`,
            );
            const uploadTask = uploadBytesResumable(storageRef, blob);

            // console.log('image: ', image.uri);
            // console.log('response: ', response);
            // console.log('imageName: ', imageName);

            await new Promise((resolve, reject) => {
              uploadTask.on(
                'state_changed',
                snapshot => {
                  const progress = (
                    (snapshot.bytesTransferred / snapshot.totalBytes) *
                    100
                  ).toFixed(2);

                  console.log('Upload image is ' + progress + '%');
                  setErrorWithTimeout(
                    'featured_image',
                    'Đang tải hình ảnh lên ' + progress + '%',
                    8000,
                  );
                },
                error => {
                  console.error('Error uploading image:', error);
                  alert('Error uploading image!');
                  reject(error);
                },
                async () => {
                  try {
                    const downloadURL = await getDownloadURL(
                      uploadTask.snapshot.ref,
                    );
                    console.log('File available at', downloadURL);

                    // Save URLs outside if needed
                    // savePhotoURL = downloadURL;
                    savePhotoURL.push(downloadURL);

                    console.log('UPLOAD SUCCESS!');

                    resolve();
                  } catch (error) {
                    console.error('Error getting download URL:', error);
                    alert('Error getting download URL!');
                    reject(error);
                  }
                },
              );
            });
          } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image!');
          }
        }),
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image!');
    }
  };

  const waitUpload = async dataObject => {
    if (
      Array.isArray(itemInfo.featured_image) &&
      itemInfo.featured_image.length > 0
    ) {
      await uploadAndSaveURL();
      console.log('done');
      if (!savePhotoURL.length) {
        console.log('Mảng rỗng.', savePhotoURL);
        return;
      } else {
        console.log('Mảng không rỗng.', savePhotoURL);

        // hanlde tiếp sau khi upload image thành công
        createNewItemOnFireStore(dataObject, savePhotoURL);
      }
      return;
    }
  };

  // ####################### FUNCTIONS ####################### //
  // HANDLE INPUT BLUR
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

  // HANDLE VALIDATE WHEN SUBMIT
  const validateData = () => {
    const newErrors = {};

    if (itemInfo.featured_image.length === 0) {
      newErrors.featured_image = 'Vui lòng chọn ít nhất một hình ảnh nổi bật';
    }

    if (!itemInfo.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên sản phẩm';
    }

    if (!itemInfo.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả sản phẩm';
    }

    if (!itemInfo.price.trim()) {
      newErrors.price = 'Vui lòng nhập giá sản phẩm';
    } else {
      // Loại bỏ ký tự ₫ và ,
      const cleanedPrice = itemInfo.price.replace(/[₫,]/g, '');
      if (isNaN(cleanedPrice)) {
        newErrors.price = 'Giá sản phẩm phải là số';
      }
    }

    if (!itemInfo.category.trim()) {
      newErrors.category = 'Vui lòng chọn danh mục sản phẩm';
    }

    if (itemInfo.available === null) {
      newErrors.available = 'Vui lòng chọn chế độ hiển thị';
    }

    setErrors(newErrors);

    // Return true if there are no errors, false otherwise
    return Object.keys(newErrors).length === 0;
  };

  const handlePress = dataObject => {
    setReloadFlag(prevFlag => !prevFlag); // Khi handlePress được gọi, trigger reload bằng cách thay đổi giá trị của reloadFlag

    const isValid = validateData();
    if (isValid) {
      // Nếu dữ liệu hợp lệ, thực hiện hành động tại đây
      console.log('Dữ liệu hợp lệ:', itemInfo);

      // Upload Image
      Alert.alert(
        'Xác nhận',
        'Bạn có muốn thêm sản phẩm này?',
        [
          {
            text: 'Hủy',
            onPress: () => console.log('Hành động đã bị hủy'),
            style: 'cancel',
          },
          {
            text: 'Xác nhận',
            onPress: () => waitUpload(dataObject),
          },
        ],
        {cancelable: false},
      );
    } else {
      console.log('ERROR: ', itemInfo);
      console.log('Dữ liệu không hợp lệ:', errors);
    }
  };

  // SET ERROR WITH TIMEOUT
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

  // // CREATE NEW ITEM ON FIRESTORE
  // const createNewItemOnFireStore = (dataObject, imageURL) => {
  //   console.log('USERDATA(itemInfo): ', dataObject);

  //   console.log('imageURL: ', imageURL);

  //   const timeNow = new Date().toISOString();
  //   const createdAt = convertISOToFormattedDate(timeNow);
  //   const updatedAt = createdAt;

  //   console.log('createdAt: ', createdAt);

  //   // auto_id
  //   addDoc(collection(db, 'MenuMoC&T'), {
  //     name,
  //     description,
  //     available,
  //     category,
  //     featured_image: imageURL,
  //     price,
  //     // DEFAULT VALUE
  //     likes: '0',
  //     // preparation_time # bỏ
  //     ratings: {average_rating: '5', total_ratings: '0'},
  //     sold_count: '0',
  //     createdAt,
  //     updatedAt,
  //   })
  //     .then(() => {
  //       // Data create successfully!
  //       console.log('ĐÃ THÊM SẢN PHẨM THÀNH CÔNG!!!');
  //       alert('ĐÃ THÊM SẢN PHẨM THÀNH CÔNG!!!');
  //       resetItemInfo();

  //       setTimeout(() => {
  //         navi.navigate('AdminProductsCRUD');
  //       }, 3000);
  //     })
  //     .catch(error => {
  //       console.log('error: ', error);
  //       alert('error: ', error);
  //     });
  // };

  const createNewItemOnFireStore = (dataObject, imageURL) => {
    console.log('USERDATA(itemInfo): ', dataObject);
    const {available, category, description, name, price} = dataObject;

    console.log('imageURL: ', imageURL);

    const timeNow = new Date().toISOString();
    const createdAt = convertISOToFormattedDate(timeNow);
    const updatedAt = createdAt;

    console.log('createdAt: ', createdAt);

    // Tạo một document reference mới mà không cần truyền vào ID cụ thể
    const docRef = doc(collection(db, 'MenuMoC&T'));

    // Lấy ID mới tạo và gán cho sản phẩm
    const productId = docRef.id;

    // Thêm sản phẩm vào Firestore với ID được tạo
    setDoc(docRef, {
      _id: productId,
      name,
      description,
      available,
      category,
      featured_image: imageURL,
      price,
      // DEFAULT VALUE
      likes: '0',
      // preparation_time # bỏ
      ratings: {average_rating: '5', total_ratings: '0'},
      sold_count: '0',
      createdAt,
      updatedAt,
    })
      .then(() => {
        // Data create successfully!
        console.log('ĐÃ THÊM SẢN PHẨM THÀNH CÔNG!!!', productId);
        alert('ĐÃ THÊM SẢN PHẨM THÀNH CÔNG!!!');
        resetItemInfo();

        setTimeout(() => {
          navi.navigate('AdminProductsCRUD');
        }, 3000);
      })
      .catch(error => {
        console.log('error: ', error);
        alert('error: ', error);
      });
  };

  // dùng chung của globalHelpers
  // const convertISOToFormattedDate = isoDateString => {
  //   const date = new Date(isoDateString);
  //   const hours = date.getHours().toString().padStart(2, '0');
  //   const minutes = date.getMinutes().toString().padStart(2, '0');
  //   const seconds = date.getSeconds().toString().padStart(2, '0');
  //   const day = date.getDate().toString().padStart(2, '0');
  //   const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //   const year = date.getFullYear();

  //   return `${hours}:${minutes}:${seconds}, ${day}/${month}/${year}`;
  // };

  const [reloadFlag, setReloadFlag] = useState(false); // State để trigger reload

  const resetItemInfo = () => {
    setItemInfo({
      featured_image: [],
      name: '',
      description: '',
      price: '',
      category: '',
      available: null,
    });

    // setCategoryDefaultOption(CategoriesData[0]);
    // handleSelectedItem('0');
    setReloadFlag(!reloadFlag);
    console.log('+_+ ', itemInfo);
    // console.log('reseted: ', categoryDefaultOption, itemInfo);
  };

  return (
    <SafeAreaProvider key={reloadFlag}>
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
        arrowIconColor={'#000'}
        arrowIconBackgroundColor={'#fff'}
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
        <View style={{alignItems: 'left', padding: 10}}>
          <Text style={{fontSize: 16, fontWeight: '600'}}>
            {formName.featured_image}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            {itemInfo.featured_image.map((image, index) => (
              <View key={index} style={{position: 'relative'}}>
                <Image
                  style={{width: 110, height: 110, borderRadius: 8, margin: 8}}
                  source={{uri: image.uri}}
                />
                {index === 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      backgroundColor: 'rgba(0,0,0,.45)',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      zIndex: 999,
                      height: 25,
                      marginHorizontal: 8,
                      marginBottom: 8,
                      borderRadius: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{color: '#fff', fontSize: 14, fontWeight: '600'}}>
                      Ảnh bìa
                    </Text>
                  </View>
                )}
              </View>
            ))}
            <TouchableOpacity
              onPress={handlePickImageFromLibrary}
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
            </TouchableOpacity>
          </View>
          {errors.featured_image ? (
            <Text style={styles.inputHelper}>{errors.featured_image}</Text>
          ) : null}
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
              // defaultOption={categoryDefaultOption}
              // defaultOption={{
              //   key: '0',
              //   value: 'Chọn loại sản phẩm112',
              //   category: 'none',
              //   disabled: true,
              // }}
            />
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.inputLabelTouchable, {top: 0}]}>
              <Text style={[styles.inputLabel, styles.inputLabelFocused]}>
                {formName.category}
              </Text>
            </TouchableOpacity>

            {errors.category ? (
              <Text style={styles.inputHelper}>{errors.category}</Text>
            ) : null}
          </View>
        </View>

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
                  isFocused.available,
                  styles.inputLabelFocused,
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

        <View style={{height: 300}}></View>
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
        <Button
          title={'Thêm sản phẩm'}
          onPress={() => handlePress(itemInfo)}
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
