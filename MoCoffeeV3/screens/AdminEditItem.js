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
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native';

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
  deleteDoc,
} from '../firebase';
import {convertISOToFormattedDate, sortSizes} from '../utils/globalHelpers';

export default function AdminEditItem({navigation}) {
  const navi = useNavigation();
  const route = useRoute();

  console.log('route_ADMIN-EDIT', route.params);
  const {thisItem} = route.params;
  // console.log('thisItem====', thisItem.available_sizes);

  // VALUE OF ITEM
  const [itemInfo, setItemInfo] = useState({
    _id: thisItem?._id ?? null,
    // featured_image: thisItem?.featured_image ?? [],
    featured_image: thisItem?.featured_image
      ? thisItem.featured_image.map(url => ({uri: url}))
      : [], // => chuyển về cấu trúc giống vs chọn ảnh trong library => có uri
    name: thisItem?.name ?? '',
    description: thisItem?.description ?? '',
    price: thisItem?.price ?? '',
    category: thisItem?.category ?? '',
    size: thisItem?.available_sizes ?? [],
    priceBySize: thisItem?.priceBySize ?? {},
    // size: [],
    available: thisItem?.available ?? null,
  });
  /** `name: thisItem?.name ?? ''` gán giá trị cho name của itemInfo. Nếu thisItem tồn tại và có thuộc tính name, thì name sẽ được gán bằng giá trị của name. Ngược lại, nếu thisItem không tồn tại hoặc không có thuộc tính name, thì name sẽ được gán bằng một chuỗi rỗng ''. */

  const set4EditItemInfo = () => {
    const valueOfPriceBySize = thisItem?.priceBySize ?? {};

    setItemInfo({
      _id: thisItem?._id ?? null,

      //   featured_image: thisItem?.featured_image ?? [],
      featured_image: thisItem?.featured_image
        ? thisItem.featured_image.map(url => ({uri: url}))
        : [],
      name: thisItem?.name ?? '',
      description: thisItem?.description ?? '',
      price: thisItem?.price ?? '',
      category: thisItem?.category ?? '',
      size: thisItem.available_sizes ?? [],
      // priceBySize: thisItem?.priceBySize ?? {},
      priceBySize: valueOfPriceBySize,
      // size: [],
      available: thisItem?.available ?? null,
    });

    setPriceBySize(valueOfPriceBySize);
  };

  useEffect(() => {
    set4EditItemInfo();
    console.log('refreshing...');
  }, [thisItem]);

  // FOCUS
  const [isFocused, setIsFocused] = useState({
    name: false,
    description: false,
    price: false,
    category: false,
    size: false,
    available: false,
  });

  // FORM NAME
  const [formName, setFormName] = useState({
    featured_image: 'Hình ảnh sản phẩm *',
    name: 'Tên sản phẩm *',
    description: 'Mô tả sản phẩm *',
    price: 'Giá sản phẩm cho size ',
    category: 'Phân loại sản phẩm *',
    size: 'Size sản phẩm *',
    available: 'Chế độ hiển thị *',
  });

  //   ERRORS
  const [errors, setErrors] = useState({
    featured_image: '',
    name: '',
    description: '',
    price: '',
    category: '',
    size: '',
    available: '',
  });

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
    // console.log('index: ', index);
    console.log('Category:', CategoriesData[index].category);
    handleValueChange('category', CategoriesData[index].category);
  };

  const getKeyByCategory = category => {
    const foundCategory = CategoriesData.find(
      item => item.category === category,
    );
    return foundCategory ? foundCategory.key : null;
  };
  // AVAILABLE_SIZES
  const handleSizeItem = value => {
    console.log('Size: ', value);
    handleValueChange('size', value);
  };

  // SIZE V2
  const [sizeSanPham, setSizeSanPham] = useState([]);
  const [itsFirstTimes, setItsFirstTimes] = useState(true);

  // const [sizeSanPham, setSizeSanPham] = useState(
  //   thisItem?.available_sizes ?? [],
  // );

  const SizeProductData = [
    {key: '0', value: 'S-Small (360ml)', size: 'S'},
    {key: '1', value: 'M-Medium (500ml)', size: 'M'},
    {key: '2', value: 'L-Large (700ml)', size: 'L'},
    {key: '3', value: 'XL-Extra Large (1000ml)', size: 'XL'},
  ];

  // // Khi sizeSanPham thay đổi, cập nhật giá trị của size trong itemInfo
  useEffect(() => {
    if (!itsFirstTimes) {
      console.log('thisItem: ', thisItem?.available_sizes);
      const selectedSizes = sizeSanPham.map(
        index => SizeProductData[index].size,
      );

      setItemInfo(prevState => ({
        ...prevState,
        size: selectedSizes, // Lấy dữ liệu từ selectedSizes
      }));
      return;
    }
    console.log('UPDATE THANH CONG ', itsFirstTimes);
    setItsFirstTimes(false);
  }, [sizeSanPham]);

  // AVAILABLE
  const AvailableData = [
    {key: '0', value: 'Công khai', activate: true},
    {key: '1', value: 'Ẩn', activate: false},
  ];

  const handleAvailableItem = index => {
    console.log('AVAILABLE: ', AvailableData[index].activate);
    handleValueChange('available', AvailableData[index].activate);
  };

  const getKeyByAvailable = activate => {
    const foundAvailable = AvailableData.find(
      item => item.activate === activate,
    );
    return foundAvailable ? foundAvailable.key : null;
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
        updateItemOnFireStore(dataObject, savePhotoURL);
      }
      return;
    }
  };

  // ####################### FUNCTIONS ####################### //
  // HANDLE INPUT BLUR
  const handleInputBlur = (fieldName, size = null) => {
    setIsFocused(prevState => ({
      ...prevState,
      [fieldName]: false,
    }));

    // Kiểm tra nếu fieldname là 'price', thêm ký hiệu tiền tệ vào cuối
    setIsFocusedPriceBySize(prevState => ({
      ...prevState,
      [size]: false,
    }));

    if (fieldName === 'price' && size && priceBySize[size]) {
      setPriceBySize(prevState => ({
        ...prevState,
        [size]: prevState[size] + '₫',
      }));
      // console.log('BLUR_priceBySize: ', priceBySize, size);
    }
  };

  // HANDLE INPUT FOCUS
  const handleInputFocus = (fieldName, size = null) => {
    setIsFocused(prevState => ({
      ...prevState,
      [fieldName]: true,
    }));

    setIsFocusedPriceBySize(prevState => ({
      ...prevState,
      [size]: true,
    }));
    console.log('priceBySize[size]: ', priceBySize[size], priceBySize);
    if (
      size &&
      priceBySize[size] &&
      fieldName === 'price' &&
      priceBySize[size].endsWith('₫')
    ) {
      setPriceBySize(prevState => ({
        ...prevState,
        [size]: prevState[size].slice(0, -1), // Xóa ký hiệu tiền tệ khỏi cuối chuỗi
      }));

      console.log('priceBySize', priceBySize);
    }
  };

  // HANDLE INPUT VALUE CHANGE
  const handleValueChange = (key, value) => {
    // console.log('key & value: ', key, value);
    // console.log('typeof value: ', typeof value);
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

  // HANDLE VALIDATE WHEN SUBMIT
  const validateData = () => {
    const newErrors = {};
    const newErrorsForPriceAndSize = {};

    if (itemInfo.featured_image.length === 0) {
      newErrors.featured_image = 'Vui lòng chọn ít nhất một hình ảnh nổi bật';
    }

    if (!itemInfo.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên sản phẩm';
    }

    if (!itemInfo.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả sản phẩm';
    }

    // if (!itemInfo.price.trim()) {
    //   newErrors.price = 'Vui lòng nhập giá sản phẩm';
    // } else {
    //   // Loại bỏ ký tự ₫ và ,
    //   const cleanedPrice = itemInfo.price.replace(/[₫,]/g, '');
    //   if (isNaN(cleanedPrice)) {
    //     newErrors.price = 'Giá sản phẩm phải là số';
    //   }
    // }

    // Kiểm tra từng kích thước giá sản phẩm
    // Object.keys(priceBySize).forEach(size => {
    //   if (!priceBySize[size].trim()) {
    //     newErrorsForPriceAndSize[size] =
    //       'Vui lòng nhập giá sản phẩm cho size ' + size;
    //   } else {
    //     // Loại bỏ ký tự ₫ và ,
    //     const cleanedPrice = priceBySize[size].replace(/[₫,]/g, '');
    //     if (isNaN(cleanedPrice)) {
    //       newErrorsForPriceAndSize[size] =
    //         'Giá sản phẩm cho size ' + size + ' phải là số';
    //     }
    //   }
    // });

    itemInfo.size.forEach(size => {
      if (!priceBySize[size].trim()) {
        newErrorsForPriceAndSize[size] =
          'Vui lòng nhập giá sản phẩm cho size ' + size;
      } else {
        // Loại bỏ ký tự ₫ và ,
        const cleanedPrice = priceBySize[size].replace(/[₫,]/g, '');
        if (isNaN(cleanedPrice)) {
          newErrorsForPriceAndSize[size] =
            'Giá sản phẩm cho size ' + size + ' phải là số';
        }
      }
    });

    if (!itemInfo.category.trim()) {
      newErrors.category = 'Vui lòng chọn danh mục sản phẩm';
    }

    if (itemInfo.size.length === 0) {
      newErrors.size = 'Vui lòng chọn kích thước sản phẩm';
    }

    if (itemInfo.available === null) {
      newErrors.available = 'Vui lòng chọn chế độ hiển thị';
    }

    setErrors(newErrors);
    setErrorsPriceAndSize(newErrorsForPriceAndSize);
    console.log('newErrorsForPriceAndSize: ', newErrorsForPriceAndSize);
    // console.log('itemInfo.size: ', itemInfo.size);

    // Kết hợp cả `newErrors` và `newErrorsForPriceAndSize` thành một mảng
    const allErrors = {...newErrors, ...newErrorsForPriceAndSize};

    // Kiểm tra nếu không có lỗi
    return Object.keys(allErrors).length === 0;
  };

  const handlePress = dataObject => {
    const isValid = validateData();
    if (isValid) {
      // CHỈ LẤY KEY NÀO CÓ DỮ LIỆU
      // Khởi tạo một đối tượng mới để lưu trữ các cặp key-value có dữ liệu
      const nonEmptyPriceBySize = {};

      // Lặp qua các cặp key-value của priceBySize
      for (const [key, value] of Object.entries(priceBySize)) {
        // Nếu value không rỗng, thêm cặp key-value này vào nonEmptyPriceBySize
        if (value !== '') {
          nonEmptyPriceBySize[key] = value;
        }
      }

      // console.log('nonEmptyPriceBySize: ', nonEmptyPriceBySize);

      // GỘP DỮ LIỆU VÀO CHUNG 1 OBJECT
      // Tạo một đối tượng mới để gộp các dữ liệu vào
      const mergedData = {
        ...dataObject, // Copy toàn bộ dữ liệu từ itemInfo vào mergedData
        priceBySize: nonEmptyPriceBySize, // Thêm key priceBySize với giá trị là priceBySize
      };

      // Lọc các kích thước không nằm trong sortedSizes
      const filteredPriceBySize = Object.fromEntries(
        Object.entries(mergedData.priceBySize).filter(([size]) =>
          sortedSizes.includes(size),
        ),
      );

      // Cập nhật mergedData với priceBySize đã lọc
      const updatedMergedData = {
        ...mergedData,
        priceBySize: filteredPriceBySize,
      };

      // In ra mergedData sau khi cập nhật
      // console.log('mergedData sau khi cập nhật:', updatedMergedData);

      // // Nếu dữ liệu hợp lệ, thực hiện hành động tại đây
      // console.log('Dữ liệu hợp lệ:', mergedData, sortedSizes);
      console.log('Dữ liệu hợp lệ:', updatedMergedData);

      // Upload Image
      Alert.alert(
        'Xác nhận',
        'Bạn có muốn lưu thay đổi cho sản phẩm này?',
        [
          {
            text: 'Hủy',
            onPress: () => console.log('Hành động đã bị hủy'),
            style: 'cancel',
          },
          {
            text: 'Xác nhận',
            onPress: () => {
              // setReloadFlag(prevFlag => !prevFlag); // Khi handlePress được gọi, trigger reload bằng cách thay đổi giá trị của reloadFlag
              waitUpload(updatedMergedData);
            },
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

  // // // CREATE NEW ITEM ON FIRESTORE
  // const createNewItemOnFireStore = (dataObject, imageURL) => {
  //   console.log('USERDATA(itemInfo): ', dataObject);
  //   const {available, category, description, name, price, size} = dataObject;

  //   console.log('imageURL: ', imageURL);

  //   const timeNow = new Date().toISOString();
  //   const createdAt = convertISOToFormattedDate(timeNow);
  //   const updatedAt = createdAt;

  //   console.log('createdAt: ', createdAt);

  //   // // Tạo một document reference mới mà không cần truyền vào ID cụ thể
  //   // const docRef = doc(collection(db, 'MenuMoC&T'));

  //   // // Lấy ID mới tạo và gán cho sản phẩm
  //   // const productId = docRef.id;

  //   // // Thêm sản phẩm vào Firestore với ID được tạo
  //   // setDoc(docRef, {
  //   //   _id: productId,
  //   //   name,
  //   //   description,
  //   //   available,
  //   //   available_sizes: size,
  //   //   category,
  //   //   featured_image: imageURL,
  //   //   price,
  //   //   // DEFAULT VALUE
  //   //   likes: '0',
  //   //   // preparation_time # bỏ
  //   //   ratings: {average_rating: '5', total_ratings: '0'},
  //   //   sold_count: '0',
  //   //   createdAt,
  //   //   updatedAt,
  //   // })
  //   //   .then(() => {
  //   //     // Data create successfully!
  //   //     console.log('ĐÃ THÊM SẢN PHẨM THÀNH CÔNG!!!', productId);
  //   //     alert('ĐÃ THÊM SẢN PHẨM THÀNH CÔNG!!!');
  //   //     resetItemInfo();

  //   //     setTimeout(() => {
  //   //       navi.navigate('AdminProductsCRUD');
  //   //     }, 3000);
  //   //   })
  //   //   .catch(error => {
  //   //     console.log('error: ', error);
  //   //     alert('error: ', error);
  //   //   });
  // };

  // UPDATE ITEM ON FIRESTORE
  const updateItemOnFireStore = (dataObject, imageURL) => {
    console.log('USERDATA(itemInfo): ', dataObject);
    const {
      _id,
      available,
      category,
      description,
      name,
      price,
      size,
      priceBySize,
    } = dataObject;

    console.log('_id SAN PHAM CAN UPDATE: ', _id, priceBySize);
    // console.log('imageURL: ', imageURL);

    const timeNow = new Date().toISOString();
    const updatedAt = convertISOToFormattedDate(timeNow);

    console.log('updatedAt: ', updatedAt);

    // Thực hiện cập nhật dữ liệu cho sản phẩm đã tồn tại
    updateDoc(doc(db, 'MenuMoC&T', _id), {
      name,
      description,
      available,
      available_sizes: size,
      category,
      featured_image: imageURL,
      price,
      updatedAt,
      priceBySize,
    })
      .then(() => {
        // Data updated successfully!
        console.log('ĐÃ CẬP NHẬT SẢN PHẨM THÀNH CÔNG!!!', _id);
        alert('ĐÃ CẬP NHẬT SẢN PHẨM THÀNH CÔNG!!!');
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

  const resetItemInfo = () => {
    setItemInfo({
      featured_image: [],
      name: '',
      description: '',
      price: '',
      category: '',
      size: [],
      available: null,
    });
    setEnableEditing(false);
  };

  // button `enableEditing`
  const [enableEditing, setEnableEditing] = useState(false);

  const handleInputChange = () => {
    setEnableEditing(!enableEditing);
  };

  const handleRemoveItem = itemId => {
    if (itemId) {
      Alert.alert(
        'Xác nhận xóa sản phẩm',
        'Bạn có chắc chắn muốn xóa sản phẩm này? Thao tác này không thể hoàn tác.',
        [
          {
            text: 'Hủy bỏ',
            style: 'cancel',
          },
          {
            text: 'Xóa',
            style: 'destructive',
            textStyle: {
              color: 'red',
            },
            onPress: () => removeItemFromFirebase(itemId),
          },
        ],
        {cancelable: false},
      );
    }
  };

  const removeItemFromFirebase = itemId => {
    deleteDoc(doc(db, 'MenuMoC&T', itemId))
      .then(() => {
        console.log('Sản phẩm đã được xóa. ', itemId);
        alert('Sản phẩm đã được xóa.');
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

  // const [priceBySize, setPriceBySize] = useState(itemInfo.priceBySize);
  const valueOfPriceBySize = thisItem?.priceBySize ?? {};
  const [priceBySize, setPriceBySize] = useState(valueOfPriceBySize);

  // HANDLE FOR PRICE BY SIZE
  const [isFocusedPriceBySize, setIsFocusedPriceBySize] = useState({
    S: false,
    M: false,
    L: false,
    XL: false,
  });

  //   ERRORS
  const [errorsPriceAndSize, setErrorsPriceAndSize] = useState({
    S: '',
    M: '',
    XL: '',
    L: '',
  });

  // PRICE & SIZE
  const handleInputPriceAndSize = (size, value) => {
    if (typeof value !== 'undefined' && value !== null) {
      let newValue = value;
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

      setPriceBySize({...priceBySize, [size]: newValue});
      console.log('ĐÃ UPDATE PriceBySize');
    }
  };

  // SORT
  const sortedSizes = sortSizes(itemInfo.size);

  // return <View>{console.log('sortedSizes: ', sortedSizes)}</View>;
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
        arrowIconColor={'#000'}
        arrowIconBackgroundColor={'#fff'}
        titleOfScreen={'Chỉnh sửa sản phẩm'}
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
        {/* Button accept chỉnh sửa */}
        <TouchableOpacity onPress={handleInputChange}>
          <View
            style={{
              alignItems: 'center',
              padding: 12,
              borderWidth: 1,
              margin: 24,
            }}>
            <View>
              {enableEditing ? (
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                    Hủy chỉnh sửa
                  </Text>
                  <AntDesign
                    name={'close'}
                    size={18}
                    style={{paddingLeft: 6}}
                  />
                </View>
              ) : (
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                    Chỉnh sửa sản phẩm
                  </Text>
                  <AntDesign
                    name={'edit'}
                    size={18}
                    // color={''}
                    style={{paddingLeft: 6}}
                  />
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
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
                  //   source={{uri: image.uri}}
                  //   source={{uri: thisItem?.featured_image ? image : image.uri}}
                  //   source={{uri: image || image.uri}}
                  //   source={{uri: image.uri}}
                  source={{uri: image.uri}}
                />
                {/* {console.log('image: ', image)}
                {console.log('image.uri: ', image.uri)}
                {console.log(
                  'itemInfo.featured_image__INSIDE: ',
                  itemInfo.featured_image,
                )} */}
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
              disabled={enableEditing ? false : true}
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
              readOnly={enableEditing ? false : true}
              style={[
                styles.input,
                isFocused.name && {
                  borderBottomColor: 'rgba(19, 19, 21, 1)',
                },
              ]}
              onFocus={() => handleInputFocus('name')}
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
              readOnly={enableEditing ? false : true}
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
        {/* <View style={styles.inputGroup}>
          <View
            style={[
              styles.inputUserInfo,
              isFocused.price && styles.inputFocused,
            ]}>
            <TextInput
              readOnly={enableEditing ? false : true}
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
        </View> */}

        {itemInfo.size.length > 0 &&
          sortedSizes.map((size, index) => (
            <View style={styles.inputGroup} key={index}>
              <View
                style={[
                  styles.inputUserInfo,
                  isFocusedPriceBySize[size] && styles.inputFocused,
                ]}>
                <TextInput
                  readOnly={enableEditing ? false : true}
                  style={[
                    styles.input,
                    isFocusedPriceBySize[size] && {
                      borderBottomColor: 'rgba(19, 19, 21, 1)',
                    },
                  ]}
                  keyboardType='numeric'
                  maxLength={20}
                  onFocus={() => handleInputFocus('price', size)}
                  onBlur={() => handleInputBlur('price', size)}
                  // onChangeText={text => handleValueChange(size, text)} // Pass size here
                  onChangeText={text => handleInputPriceAndSize(size, text)}
                  // value={itemInfo.price[size] || ''} // Get price for this size
                  value={priceBySize[size]} // Get price for this size
                />
                {/* {console.log('itemInfo.price[size]: ', itemInfo.price[size])} */}
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.inputLabelTouchable}>
                  <Text
                    style={[
                      styles.inputLabel,
                      isFocusedPriceBySize[size] ||
                      (priceBySize[size] !== null &&
                        priceBySize[size] !== undefined &&
                        priceBySize[size] !== '')
                        ? styles.inputLabelFocused
                        : null,
                    ]}>
                    {formName.price + size}
                  </Text>
                  {/* {console.log(
                    '111isFocusedPriceBySize[size]: ',
                    isFocusedPriceBySize[size],
                    priceBySize[size],
                    size,
                  )}
                  {console.log(
                    'priceBySize',
                    priceBySize,
                    size,
                    priceBySize[''],
                  )} */}
                </TouchableOpacity>
                <AntDesign
                  name={
                    isFocusedPriceBySize[size] ? 'checkcircle' : 'checkcircleo'
                  }
                  size={18}
                  color={'rgba(50, 205, 50, 0.6)'}
                  style={[
                    {
                      position: 'absolute',
                      right: 0,
                      bottom: 0,
                      top: 10,
                    },
                    isFocusedPriceBySize[size] && {
                      color: 'rgba(50, 205, 50, 1)',
                    },
                  ]}
                />
                {errorsPriceAndSize[size] ? (
                  <Text style={styles.inputHelper}>
                    {errorsPriceAndSize[size]}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}

        {/* START: CATEGORY */}
        <View
          style={[
            styles.inputGroup,
            {pointerEvents: enableEditing ? 'unset' : 'none'},
          ]}>
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
              //   defaultOption={{key: '0', value: 'Cà phê', category: 'coffee'}}
              //   defaultOption={CategoriesData[0]}
              //   defaultOption={CategoriesData[getKeyByCategory('soda')]}
              defaultOption={
                CategoriesData[getKeyByCategory(itemInfo.category)]
              }
            />
            {/* {console.log(
              'getKeyByCategory: ',
              CategoriesData[getKeyByCategory('soda')],
            )} */}
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
        {/* END: CATEGORY */}

        {/* START: AVAILABLE_SIZES */}
        <View
          style={[
            styles.inputGroup,
            {pointerEvents: enableEditing ? 'unset' : 'none'},
          ]}>
          <View
            style={[
              styles.inputUserInfo,
              isFocused.size && styles.inputFocused,
            ]}>
            <MultipleSelectList
              setSelected={val => setSizeSanPham(val)}
              data={SizeProductData}
              label='Các size đã chọn'
              // save='value'
              // boxStyles={{marginTop: 25}}
              searchPlaceholder={'Size sản phẩm của bạn'}
              placeholder={'Chọn size cho sản phẩm'}
              defaultOption={['S-Small (360ml)']}
              badgeStyles={{backgroundColor: 'red'}}
            />
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.inputLabelTouchable, {top: 0}]}>
              <Text style={[styles.inputLabel, styles.inputLabelFocused]}>
                {formName.size}
              </Text>
            </TouchableOpacity>

            {errors.size ? (
              <Text style={styles.inputHelper}>{errors.size}</Text>
            ) : null}

            {/* ITEMS SIZE SELECTED */}
            {/* {console.log('sizeSanPham: ', sizeSanPham)} */}
            {/* {sizeSanPham.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 12,
                  paddingHorizontal: 10,
                }}>
                <Text>Size sản phẩm đang được chọn: </Text>
                {sizeSanPham.map(item => {
                  return (
                    <View
                      key={item}
                      style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 5,
                        maxWidth: 40,
                        minWidth: 40,
                        alignItems: 'center',
                        marginLeft: 10,
                      }}>
                      <Text style={{color: 'gray', fontWeight: '700'}}>
                        {item}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )} */}
            {itemInfo.size.length > 0 && (
              <View
                style={{
                  marginTop: 12,
                  paddingHorizontal: 10,
                }}>
                <Text>Size sản phẩm đã chọn: </Text>

                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  {sortedSizes.map(item => {
                    return (
                      <View
                        key={item}
                        style={{
                          borderWidth: 1,
                          borderColor: '#ccc',
                          borderRadius: 5,
                          maxWidth: 40,
                          minWidth: 40,
                          alignItems: 'center',
                          marginLeft: 10,
                          marginTop: 8,
                        }}>
                        <Text style={{color: 'gray', fontWeight: '700'}}>
                          {item}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ITEMS SELECTED */}
        {/* <View style={{marginTop: 50}}>
          <Text>Selected Categories : </Text>
          {sizeSanPham.map(item => {
            return (
              <Text key={item} style={{marginTop: 10, color: 'gray'}}>
                {item}
              </Text>
            );
          })}
        </View> */}

        {/* ITEMS SELECTED2 */}
        {/* <View style={{marginTop: 50}}>
          <Text>Selected Categories222 : </Text>
          {itemInfo.size.map((item, index) => {
            return (
              <Text key={index} style={{marginTop: 10, color: 'gray'}}>
                {item}
              </Text>
            );
          })}
        </View> */}
        {/* END: AVAILABLE_SIZES */}

        {/* START: AVAILABLE */}
        <View
          style={[
            styles.inputGroup,
            {pointerEvents: enableEditing ? 'unset' : 'none'},
          ]}>
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
              defaultOption={
                AvailableData[getKeyByAvailable(itemInfo.available)]
              }
            />
            {/* {console.log('itemInfo.available__', itemInfo.available)} */}
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

        {/* BUTTON REMOVE ITEM */}
        {enableEditing && (
          <TouchableOpacity onPress={() => handleRemoveItem(itemInfo._id)}>
            <View
              style={{
                alignItems: 'center',
                padding: 12,
                borderWidth: 1,
                borderColor: '#ff4c4c',
                margin: 24,
              }}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{fontSize: 16, fontWeight: 'bold', color: '#ff4c4c'}}>
                  Xóa sản phẩm
                </Text>
                <AntDesign
                  name={'delete'}
                  size={18}
                  color={'#ff4c4c'}
                  style={{paddingLeft: 6}}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}

        <View style={{height: 300}}></View>
      </ScrollView>

      {/* BUTTON */}
      {enableEditing && (
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
            title={'Cập nhật sản phẩm'}
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
