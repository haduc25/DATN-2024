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
  LogBox,
} from 'react-native';
import {useState, useEffect} from 'react';
import RadioButtonGroup, {RadioButtonItem} from 'expo-radio-button';

import CustomStatusBar from '../components/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';

// Icons
import {Ionicons, AntDesign} from '@expo/vector-icons';
import Button from '../components/Button';

// Firebase: Storage (Upload Image)
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
} from '../firebase';
import * as ImagePicker from 'expo-image-picker';

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
    location: false, // true => có dữ liệu, ngược lại
  });

  // Form Name
  const [formName, setFormName] = useState({
    userID: 'UID',
    displayName: 'Tên người dùng',
    email: 'E-mail',
    phoneNumber: 'Số điện thoại',
    dob: 'Ngày sinh',
    createdAt: 'Ngày tạo tài khoản',
    location: 'Địa chỉ',
    gtinh: 'Giới tính',
    uploadedImageName: null,
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

  // console.log('userInfo.createdAt: ', userInfo.createdAt);

  // version 2: (Dữ lệu ban đầu)
  const [userInfo2, setUserInfo2] = useState({
    displayName: userInfo.displayName,
    email: userInfo.email,
    dob: userInfo.dob,
    createdAt: formatDate(userInfo.createdAt),
    gtinh: userInfo.gtinh,
    photoURL: userInfo.photoURL,
    phoneNumber: userInfo.phoneNumber,
    location: userInfo.location,
    uid: userInfo.uid.trim(),
    // Thêm các trường thông tin khác cần thiết
  });

  const [initialValues, setInitialValues] = useState({...userInfo2});
  const [changedFields, setChangedFields] = useState({}); // xác định feild nào đã thay đổi

  // const handleValueChange = (key, value) => {
  //   if (typeof value !== 'undefined' && value !== null) {
  //     // Kiểm tra xem value có tồn tại không
  //     setUserInfo2(prevState => {
  //       const newState = {...prevState, [key]: value};
  //       const hasValueChanged = newState[key] !== initialValues[key]; // So sánh giá trị mới với giá trị ban đầu
  //       console.log('----------------------UserInfo2: ', userInfo2);
  //       return newState;
  //     });
  //   }
  // };

  const handleValueChange = (key, value) => {
    if (typeof value !== 'undefined' && value !== null) {
      setUserInfo2(prevState => {
        const newState = {...prevState, [key]: value};

        // So sánh giá trị mới với giá trị ban đầu
        const hasValueChanged = newState[key] !== initialValues[key];

        // Nếu giá trị đã thay đổi, thêm key vào danh sách dữ liệu đã thay đổi
        if (hasValueChanged) {
          setChangedFields(prevFields => {
            return {...prevFields, [key]: true};
          });
        }

        // console.log('----------------------UserInfo2: ', userInfo2);
        return newState;
      });
    }
  };

  //info
  const [userEmail, setUserEmail] = useState(null);

  // image
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  // button `enableEditing`
  const [enableEditing, setEnableEditing] = useState(false);

  const handleInputChange = () => {
    setEnableEditing(!enableEditing);
  };

  // convert
  function formatDate(timestamp) {
    if (typeof timestamp === 'string') {
      timestamp = parseInt(timestamp);
    }

    // console.log('timestamp: ', timestamp);
    // console.log('typeof timestamp: ', typeof timestamp);
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const [errors, setErrors] = useState({
    uid: '',
    createdAt: '',
    dob: '',
    email: '',
    displayName: '',
  });

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

      handleValueChange(field, updatedValue);
    }
  };

  const handleBlurForDatePicker = field => {
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
        handleValueChange(field, ''); // Truyền giá trị rỗng vào handleValueChange
      } else {
        // Pass qua tất cả => Chuẩn rồi
        setErrors(prevErrors => ({...prevErrors, [field]: ''}));
      }
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: 'Vui lòng nhập đúng định dạng dd/mm/yyyy \nVí dụ: 25/09/2001',
      }));
      handleValueChange(field, ''); // Truyền giá trị rỗng vào handleValueChange
    }

    handleInputBlur(field);
  };

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

  // check errors
  const [errors2, setErrors2] = useState({
    userID: false,
    displayName: false,
    email: false,
    phoneNumber: false,
    dob: false,
    createdAt: false,
    location: false,
  });

  // Hàm này để kiểm tra xem trường nào bị lỗi
  const checkErrors = () => {
    let hasErrors = false;
    const newErrors = {...errors2};

    // Kiểm tra từng trường
    Object.keys(isFocused).forEach(field => {
      if (isFocused[field]) {
        newErrors[field] = true; // Gán lỗi nếu trường không được focus
        hasErrors = true; // Đặt hasErrors thành true nếu có lỗi
      }
    });

    setErrors2(newErrors); // Cập nhật trạng thái lỗi
    return hasErrors; // Trả về true nếu có lỗi, ngược lại trả về false
  };

  // Hàm xử lý khi nút "Lưu thay đổi" được nhấn
  const handleSubmit = () => {
    // Kiểm tra xem có lỗi không
    const hasError = Object.values(errors).some(error => error !== '');
    if (hasError) {
      Alert.alert('Lỗi', 'Vui lòng kiểm tra lại các trường nhập liệu.');
      return;
    }

    // Tiến hành lưu thay đổi
    // ################### UPLOAD IMAGE ################### //
    // Sau khi lưu thành công, có thể thực hiện các hành động khác
    // console.log('THIS DATA WILL SAVING TO DATABASE(userInfo2): ', userInfo2);
    // check tiếp
    console.log('changedFields: ', changedFields);
    // console.log('userInfo2: ', userInfo2);
    updateFirebase();

    // xử lý
    // handleUploadUserImage();
    // Alert.alert('Thành công', 'Dữ liệu đã được lưu thành công.');
  };

  //####################### HANDLE VALUES #######################//
  // handle upload image
  const handlePickImageFromLibrary = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // case khi mà đã chọn vào image (selected)
      // setImageURI(result.assets[0].uri);
      handleValueChange('photoURL', result.assets[0].uri);
      // console.log('result.assets[0].uri: ', result.assets[0].uri);
    }
  };

  // Ignore specific warning for deprecated 'cancelled' key
  useEffect(() => {
    LogBox.ignoreLogs([
      'Key "cancelled" in the image picker result is deprecated',
    ]);
  }, []);

  // Upload Image
  const handleUploadUserImage = async () => {
    try {
      if (!userInfo2.photoURL) {
        alert('Please select an image first!');
        return;
      }
      const response = await fetch(userInfo2.photoURL);
      const blob = await response.blob();
      const imageName = userInfo2.photoURL.substring(
        userInfo2.photoURL.lastIndexOf('/') + 1,
      );
      const storageRef = ref(storage, `assets/avatars/users/${imageName}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        snapshot => {
          // Progress tracking can be implemented here if needed
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload image is ' + progress + '% done');
        },
        error => {
          console.error('Error uploading image:', error);
          alert('Error uploading image!');
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File available at', downloadURL);

            // update on Firestore
            await updateValueToFireStore('photoURL', downloadURL); // Gọi hàm cập nhật ảnh vào Firestore

            // update on AUTH
            handleUpdateToAuth({photoURL: downloadURL});

            alert('UPLOAD SUCCESS!');
            // Đường dẫn đầy đủ của ảnh sẽ được lưu trong biến downloadURL
            // Bạn có thể sử dụng nó để hiển thị hoặc thực hiện các tác vụ khác
          } catch (error) {
            console.error('Error getting download URL:', error);
            alert('Error getting download URL!');
          }
        },
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image!');
    }
  };

  // Update image to auth
  // const handleUpdateToAuth = async (field, value) => {
  //   try {
  //     const user = auth.currentUser;

  //     if (user) {
  //       await updateProfile(user, {
  //         field: value,
  //       });

  //       // Chờ một khoảng thời gian ngắn (ví dụ: 1 giây) để đảm bảo thông tin hồ sơ được cập nhật
  //       await new Promise(resolve => setTimeout(resolve, 3000));

  //       console.log('Cập nhật thành công!');
  //     } else {
  //       alert('Không tìm thấy người dùng hiện tại!');
  //     }
  //   } catch (error) {
  //     console.error('Lỗi khi cập nhật', error);
  //     alert('Đã xảy ra lỗi khi cập nhật!');
  //   }
  // };

  const handleUpdateToAuth = async dataToUpdate => {
    try {
      const user = auth.currentUser;
      const valueObject = {};

      if (user) {
        // Lặp qua mỗi cặp key-value trong dataToUpdate
        for (const field in dataToUpdate) {
          const value = dataToUpdate[field];

          // console.log('\n=========================');
          // console.log('[field]: ', [field]);
          // console.log('value: ', value);

          valueObject[field] = value;
          // // Cập nhật thông tin người dùng dựa trên cặp key-value hiện tại
          // await updateProfile(user, {
          //   [field]: value,
          // });

          // // Chờ một khoảng thời gian ngắn (ví dụ: 1 giây) để đảm bảo thông tin hồ sơ được cập nhật
          // await new Promise(resolve => setTimeout(resolve, 1000));

          // console.log(`Cập nhật thành công ${field} với giá trị ${value}!`);
        }

        // console.log('valueObject: ', valueObject);

        // Cập nhật thông tin người dùng dựa trên cặp key-value hiện tại
        await updateProfile(user, valueObject);

        // Chờ một khoảng thời gian ngắn (ví dụ: 1 giây) để đảm bảo thông tin hồ sơ được cập nhật
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log(`Cập nhật thành công!!!`);
      } else {
        alert('Không tìm thấy người dùng hiện tại!');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật', error);
      alert('Đã xảy ra lỗi khi cập nhật!');
    }
  };

  // HANDLE FIRESTORE
  // // V1
  // const updateFirebase = () => {
  //   // Lặp qua các key trong changedFields
  //   for (const key in changedFields) {
  //     if (Object.hasOwnProperty.call(changedFields, key)) {
  //       // Lấy giá trị mới của key
  //       const value = changedFields[key];

  //       // Thực hiện cập nhật giá trị tương ứng trong cơ sở dữ liệu
  //       updateDoc(doc(db, 'Users', 'htyhhHyJG9YnuAnd1C8PZy80wVu2'), {
  //         [key]: value,
  //       })
  //         .then(() => {
  //           console.log(`${key} updated successfully!`);
  //         })
  //         .catch(error => {
  //           console.error(`Error updating ${key}:`, error);
  //         });
  //     }
  //   }
  // };

  // V2: Thêm phân loại để update cho cả auth
  // HANDLE FIRESTORE
  const updateFirebase = async () => {
    const keysToCheck = ['phoneNumber', 'displayName', 'photoURL']; // Mảng chứa các key cần kiểm tra
    const keysArray = Object.keys(changedFields);
    const resultObject = {};
    const diffrentKeyOfResultObject = {};

    // Khởi tạo các giá trị ban đầu trong resultObject là false
    keysToCheck.forEach(key => {
      resultObject[key] = false;
    });

    for (const key of keysArray) {
      // Kiểm tra xem key có tồn tại trong keysToCheck không
      if (keysToCheck.includes(key)) {
        // Nếu có, cập nhật giá trị của key trong resultObject thành true
        resultObject[key] = true;
      } else {
        // Nếu key không có trong keysToCheck, console log key đó
        // console.log(`Key '${key}' không nằm trong danh sách keysToCheck.`);
        diffrentKeyOfResultObject[key] = true;
      }
    }

    // console.log(resultObject); // In ra object với các giá trị đã được cập nhật

    // Tạm tắt
    // console.log('diffrentKeyOfResultObject: ', diffrentKeyOfResultObject);
    // updateValueToFireStore2(diffrentKeyOfResultObject, userInfo2);

    // Check có image thì upload từ trước luôn
    let savePhotoURL = null;
    // if (resultObject.photoURL) {
    //   try {
    //     if (!userInfo2.photoURL) {
    //       alert('Please select an image first!');
    //       return;
    //     }
    //     const response = await fetch(userInfo2.photoURL);
    //     const blob = await response.blob();
    //     const imageName = userInfo2.photoURL.substring(
    //       userInfo2.photoURL.lastIndexOf('/') + 1,
    //     );
    //     const storageRef = ref(storage, `assets/avatars/users/${imageName}`);
    //     const uploadTask = uploadBytesResumable(storageRef, blob);

    //     uploadTask.on(
    //       'state_changed',
    //       snapshot => {
    //         const progress =
    //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //         console.log('Upload image is ' + progress + '% done');
    //       },
    //       error => {
    //         console.error('Error uploading image:', error);
    //         alert('Error uploading image!');
    //       },
    //       async () => {
    //         try {
    //           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    //           console.log('File available at', downloadURL);

    //           // // update on Firestore
    //           // await updateValueToFireStore('photoURL', downloadURL); // Gọi hàm cập nhật ảnh vào Firestore

    //           // // update on AUTH
    //           // handleUpdateToAuth({photoURL: downloadURL});

    //           // save url to out side
    //           savePhotoURL = downloadURL;

    //           alert('UPLOAD SUCCESS!');
    //           // Đường dẫn đầy đủ của ảnh sẽ được lưu trong biến downloadURL
    //           // Bạn có thể sử dụng nó để hiển thị hoặc thực hiện các tác vụ khác
    //         } catch (error) {
    //           console.error('Error getting download URL:', error);
    //           alert('Error getting download URL!');
    //         }
    //       },
    //     );
    //   } catch (error) {
    //     console.error('Error uploading image:', error);
    //     alert('Error uploading image!');
    //   }
    // }

    async function uploadAndSaveURL() {
      if (resultObject.photoURL) {
        try {
          if (!userInfo2.photoURL) {
            alert('Please select an image first!');
            return;
          }
          const response = await fetch(userInfo2.photoURL);
          const blob = await response.blob();
          const imageName = userInfo2.photoURL.substring(
            userInfo2.photoURL.lastIndexOf('/') + 1,
          );
          const storageRef = ref(
            storage,
            `assets/avatars/users/${userInfo2.uid}/${imageName}`,
          );
          const uploadTask = uploadBytesResumable(storageRef, blob);

          await new Promise((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              snapshot => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload image is ' + progress + '% done');
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

                  // // update on Firestore
                  // await updateValueToFireStore('photoURL', downloadURL); // Gọi hàm cập nhật ảnh vào Firestore

                  // // update on AUTH
                  // handleUpdateToAuth({photoURL: downloadURL});

                  // save url to out side
                  savePhotoURL = downloadURL;

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
      }
    }

    async function waitUpload() {
      await uploadAndSaveURL();

      // dieu kien
      // Kiểm tra điều kiện để cập nhật lên db
      if (resultObject.photoURL) {
        if (
          resultObject.displayName &&
          resultObject.phoneNumber &&
          resultObject.photoURL
        ) {
          // Cập nhật lên db với cả ba trường là displayName, phoneNumber và photoURL
          console.log(
            'Update displayName, phoneNumber và photoURL: ',
            userInfo2.displayName,
            userInfo2.phoneNumber,
            savePhotoURL,
          );

          handleUpdateToAuth({
            displayName: userInfo2.displayName,
            photoURL: savePhotoURL, //url need handle
            phoneNumber: userInfo2.phoneNumber,
          });
          updateValueToFireStore4({
            displayName: userInfo2.displayName,
            photoURL: savePhotoURL,
            phoneNumber: userInfo2.phoneNumber,
          });
          resultObject['phoneNumber'] = false;
          resultObject['displayName'] = false;
          resultObject['photoURL'] = false;
        } else if (resultObject.displayName && resultObject.photoURL) {
          // Cập nhật lên db với trường displayName và photoURL
          console.log(
            'Update displayName và photoURL: ',
            userInfo2.displayName,
            userInfo2.photoURL,
          );
          handleUpdateToAuth({
            displayName: userInfo2.displayName,
            photoURL: savePhotoURL,
          });
          updateValueToFireStore4({
            displayName: userInfo2.displayName,
            photoURL: savePhotoURL,
          });
          resultObject['displayName'] = false;
          resultObject['photoURL'] = false;
        } else if (resultObject.phoneNumber && resultObject.photoURL) {
          // Cập nhật lên db với trường phoneNumber và photoURL
          console.log(
            'Update phoneNumber và photoURL: ',
            userInfo2.phoneNumber,
            userInfo2.photoURL,
          );
          handleUpdateToAuth({
            photoURL: savePhotoURL, //url need handle
            phoneNumber: userInfo2.phoneNumber,
          });
          updateValueToFireStore4({
            photoURL: savePhotoURL,
            phoneNumber: userInfo2.phoneNumber,
          });
          resultObject['phoneNumber'] = false;
          resultObject['photoURL'] = false;
        } else if (resultObject.photoURL) {
          // Chỉ cập nhật lên db với trường photoURL
          console.log('UPDATE photoURL with VALUE: ', userInfo2.photoURL);
          // handleUploadUserImage();

          updateValueToFireStore('photoURL', savePhotoURL); // Gọi hàm cập nhật ảnh vào Firestore

          // update on AUTH
          handleUpdateToAuth({photoURL: savePhotoURL});
          resultObject['photoURL'] = false;
        }
      }
    }

    waitUpload();

    return;
    // // Kiểm tra điều kiện để cập nhật lên db
    // if (
    //   resultObject.displayName &&
    //   resultObject.phoneNumber &&
    //   resultObject.photoURL &&
    // ) {
    //   // Cập nhật lên db với cả ba trường là displayName, phoneNumber và photoURL
    //   console.log(
    //     'Update displayName, phoneNumber và photoURL: ',
    //     userInfo2.displayName,
    //     userInfo2.phoneNumber,
    //     userInfo2.photoURL,
    //     savePhotoURL,
    //   );

    //   // handleUpdateToAuth({
    //   //   displayName: userInfo2.displayName,
    //   //   photoURL: savePhotoURL, //url need handle
    //   //   phoneNumber: userInfo2.phoneNumber,
    //   // });
    //   resultObject['phoneNumber'] = false;
    //   resultObject['displayName'] = false;
    //   resultObject['photoURL'] = false;
    // } else if (resultObject.displayName && resultObject.phoneNumber) {
    //   // Cập nhật lên db với cả hai trường là displayName và phoneNumber
    //   console.log(
    //     'Update displayName và phoneNumber: ',
    //     userInfo2.displayName,
    //     userInfo2.phoneNumber,
    //   );
    //   handleUpdateToAuth({
    //     displayName: userInfo2.displayName,
    //     phoneNumber: userInfo2.phoneNumber,
    //   });
    //   updateValueToFireStore4({
    //     displayName: userInfo2.displayName,
    //     phoneNumber: userInfo2.phoneNumber,
    //   });
    //   resultObject['phoneNumber'] = false;
    //   resultObject['displayName'] = false;
    // } else if (resultObject.displayName && resultObject.photoURL) {
    //   // Cập nhật lên db với trường displayName và photoURL
    //   console.log(
    //     'Update displayName và photoURL: ',
    //     userInfo2.displayName,
    //     userInfo2.photoURL,
    //   );
    //   resultObject['displayName'] = false;
    //   resultObject['photoURL'] = false;
    // } else if (resultObject.phoneNumber && resultObject.photoURL) {
    //   // Cập nhật lên db với trường phoneNumber và photoURL
    //   console.log(
    //     'Update phoneNumber và photoURL: ',
    //     userInfo2.phoneNumber,
    //     userInfo2.photoURL,
    //   );
    //   resultObject['phoneNumber'] = false;
    //   resultObject['photoURL'] = false;
    // } else if (resultObject.displayName) {
    //   // Chỉ cập nhật lên db với trường displayName
    //   console.log('UPDATE displayName with VALUE: ', userInfo2.displayName);
    //   handleUpdateToAuth({
    //     displayName: userInfo2.displayName,
    //   });
    //   updateValueToFireStore3('displayName', userInfo2.displayName);
    //   resultObject['displayName'] = false;
    // } else if (resultObject.phoneNumber) {
    //   // Chỉ cập nhật lên db với trường phoneNumber
    //   console.log('UPDATE phoneNumber with VALUE: ', userInfo2.phoneNumber);
    //   handleUpdateToAuth({
    //     phoneNumber: userInfo2.phoneNumber,
    //   });
    //   updateValueToFireStore3('phoneNumber', userInfo2.phoneNumber);
    //   resultObject['phoneNumber'] = false;
    // } else if (resultObject.photoURL) {
    //   // Chỉ cập nhật lên db với trường photoURL
    //   console.log('UPDATE photoURL with VALUE: ', userInfo2.photoURL);
    //   handleUploadUserImage();
    //   resultObject['photoURL'] = false;
    // }

    // DISPLAYNAME + PHONENUMER
    // Kiểm tra điều kiện để cập nhật lên db
    if (resultObject.displayName && resultObject.phoneNumber) {
      // Cập nhật lên db với cả hai trường là displayName và phoneNumber
      console.log(
        'Update displayName và phoneNumber: ',
        userInfo2.displayName,
        userInfo2.phoneNumber,
      );
      handleUpdateToAuth({
        displayName: userInfo2.displayName,
        phoneNumber: userInfo2.phoneNumber,
      });
      updateValueToFireStore4({
        displayName: userInfo2.displayName,
        phoneNumber: userInfo2.phoneNumber,
      });
      resultObject['phoneNumber'] = false;
      resultObject['displayName'] = false;
    } else if (resultObject.displayName) {
      // Chỉ cập nhật lên db với trường displayName
      console.log('UPDATE displayName with VALUE: ', userInfo2.displayName);
      handleUpdateToAuth({
        displayName: userInfo2.displayName,
      });
      updateValueToFireStore3('displayName', userInfo2.displayName);
      resultObject['displayName'] = false;
    } else if (resultObject.phoneNumber) {
      // Chỉ cập nhật lên db với trường phoneNumber
      console.log('UPDATE phoneNumber with VALUE: ', userInfo2.phoneNumber);
      handleUpdateToAuth({
        phoneNumber: userInfo2.phoneNumber,
      });
      updateValueToFireStore3('phoneNumber', userInfo2.phoneNumber);
      resultObject['phoneNumber'] = false;
    }
  };

  const updateFirestore = async (key, value) => {
    try {
      await updateDoc(doc(db, 'Users', 'htyhhHyJG9YnuAnd1C8PZy80wVu2'), {
        [key]: value,
      });
      console.log(`${key} updated successfully!`);
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
      // Bạn có thể xử lý lỗi tại đây
    }
  };

  const updateValueToFireStore = async (key, value) => {
    // try {
    //   await updateDoc(
    //     doc(db, 'Users', 'htyhhHyJG9YnuAnd1C8PZy80wVu2'), // Thay đổi địa chỉ của tài liệu tương ứng trong Firestore
    //     {
    //       [key]: value, // Thay đổi tên trường cần cập nhật nếu cần
    //     },
    //   );
    //   console.log(`${key} updated successfully!`);
    // } catch (error) {
    //   console.error(`Error updating ${key}:`, error);
    // }
  };

  const updateValueToFireStore2 = (obj1, obj2) => {
    if (obj1 && obj2) {
      // console.log('obj1: ', obj1);
      // console.log('obj2: ', obj2);

      const keysFromObj1InObj2 = {};

      for (const key in obj1) {
        if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
          keysFromObj1InObj2[key] = obj2[key];
        }
      }

      console.log('UPDATE TO FIRESTORE: ', keysFromObj1InObj2);
    }
  };

  const updateValueToFireStore3 = async (key, value) => {
    try {
      await updateDoc(
        doc(db, 'Users', 'htyhhHyJG9YnuAnd1C8PZy80wVu2'), // Thay đổi địa chỉ của tài liệu tương ứng trong Firestore
        {
          [key]: value, // Thay đổi tên trường cần cập nhật nếu cần
        },
      );
      console.log(`${key} updated successfully!`);
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
    }
  };

  const updateValueToFireStore4 = async object => {
    const valueObject = {};
    try {
      for (const field in object) {
        const value = object[field];
        valueObject[field] = value;
      }
      await updateDoc(
        doc(db, 'Users', userInfo2.uid), // Thay đổi địa chỉ của tài liệu tương ứng trong Firestore
        object,
      );
      console.log(`object is updated successfully!`);
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
    }
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
            // borderWidth: 1,
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
          {userInfo2 && userInfo2.photoURL && (
            <TouchableOpacity
              onPress={() => {
                if (enableEditing) {
                  handlePickImageFromLibrary();
                }
              }}
              style={{
                paddingVertical: 20,
                minHeight: 170,
              }}>
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
                    opacity: loading ? 0 : 1,
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                    position: 'absolute',
                  }}
                  source={{uri: userInfo2.photoURL}}
                  onLoad={handleImageLoad}
                />
                <View
                  style={{
                    opacity: loading ? 0 : 1,
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
              {loading && (
                <ActivityIndicator
                  style={{
                    position: 'absolute',
                    alignSelf: 'center',
                    bottom: 0,
                    top: 0,
                  }}
                />
              )}
              <View
                style={{
                  opacity: loading ? 0 : 1,
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
        </View>

        {/* Thông tin cá nhân */}
        <View
          style={{
            // borderWidth: 1,
            marginTop: 10,
            paddingHorizontal: 14,

            // Nháp
            // height: 1000,
            paddingBottom: 300,
          }}>
          {/* START: NEW TEXT INPUT */}
          <View style={styles.container}>
            {/* Thông tin cá nhân */}
            <View>
              <Text style={styles.title}>Thông tin cá nhân</Text>

              {/* Button accept chỉnh sửa */}
              <TouchableOpacity onPress={handleInputChange}>
                <View
                  style={{
                    alignItems: 'center',
                    padding: 12,
                    borderWidth: 1,
                    marginBottom: 12,
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
                          // color={''}
                          style={{paddingLeft: 6}}
                        />
                      </View>
                    ) : (
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                          Chỉnh sửa hồ sơ
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

              {/* UID */}
              <View style={styles.inputGroup}>
                <View
                  style={[
                    styles.inputUserInfo,
                    isFocused.userID && styles.inputFocused,
                  ]}>
                  <TextInput
                    onPressIn={() => {
                      if (enableEditing) {
                        setErrorWithTimeout(
                          'uid',
                          'Bạn không thể chỉnh sửa UID.',
                          5000,
                        );
                      }
                    }}
                    readOnly={true}
                    style={[
                      styles.input,
                      isFocused.userID && {
                        borderBottomColor: 'rgba(19, 19, 21, 1)',
                      },
                    ]}
                    // onFocus={() => handleInputFocus('userID')}
                    // onBlur={() => handleInputBlur('userID')}
                    value={limitText(userInfo2.uid, 25)}
                  />
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.inputLabelTouchable}>
                    <Text
                      style={[
                        styles.inputLabel,
                        isFocused.userID || userInfo2.uid !== ''
                          ? styles.inputLabelFocused
                          : null,
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
                  {errors.uid ? (
                    <Text style={styles.inputHelper}>{errors.uid}</Text>
                  ) : null}
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
                    readOnly={enableEditing ? false : true}
                    style={[
                      styles.input,
                      isFocused.displayName && {
                        borderBottomColor: 'rgba(19, 19, 21, 1)',
                      },
                    ]}
                    onFocus={() => handleInputFocus('displayName')}
                    onBlur={() => handleInputBlur('displayName')}
                    onChangeText={text =>
                      handleValueChange('displayName', text)
                    }
                    value={userInfo2.displayName}
                    maxLength={24}
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
                  {errors.displayName ? (
                    <Text style={styles.inputHelper}>{errors.displayName}</Text>
                  ) : null}
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
                    onPressIn={() => {
                      if (enableEditing) {
                        setErrorWithTimeout(
                          'email',
                          'Bạn không thể chỉnh sửa E-mail.',
                          5000,
                        );
                      }
                    }}
                    readOnly={true}
                    // onFocus={() => handleInputFocus('email')}
                    // onBlur={() => handleInputBlur('email')}
                    // onChangeText={text => handleValueChange('email', text)}
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
                  {errors.email ? (
                    <Text style={styles.inputHelper}>{errors.email}</Text>
                  ) : null}
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
                    readOnly={enableEditing ? false : true}
                    maxLength={10}
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
                      handleValueChange('phoneNumber', text)
                    }
                    value={userInfo2.phoneNumber}
                  />
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.inputLabelTouchable}>
                    <Text
                      style={[
                        styles.inputLabel,
                        isFocused.phoneNumber ||
                        (userInfo2.phoneNumber !== '' &&
                          userInfo2.phoneNumber !== null)
                          ? styles.inputLabelFocused
                          : null,
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
                  {errors.phoneNumber ? (
                    <Text style={styles.inputHelper}>{errors.phoneNumber}</Text>
                  ) : null}
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
                    readOnly={enableEditing ? false : true}
                    style={[
                      styles.input,
                      isFocused.location && {
                        borderBottomColor: 'rgba(19, 19, 21, 1)',
                      },
                    ]}
                    onFocus={() => handleInputFocus('location')}
                    onBlur={() => handleInputBlur('location')}
                    onChangeText={text => handleValueChange('location', text)}
                    // value={userInfo2.location}  (vì là array cần xử lý sang dạng string)
                  />
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.inputLabelTouchable}>
                    <Text
                      style={[
                        styles.inputLabel,
                        isFocused.location ||
                        (userInfo2.location !== '' &&
                          userInfo2.location !== null &&
                          userInfo2.location.length > 0)
                          ? styles.inputLabelFocused
                          : null,
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
                  {errors.location ? (
                    <Text style={styles.inputHelper}>{errors.location}</Text>
                  ) : null}
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
                    readOnly={enableEditing ? false : true}
                    style={[
                      styles.input,
                      isFocused.dob && {
                        borderBottomColor: 'rgba(19, 19, 21, 1)',
                      },
                    ]}
                    onFocus={() => handleInputFocus('dob')}
                    onChangeText={text =>
                      handleChangeTextForDatePicker('dob', text)
                    }
                    onBlur={() => handleBlurForDatePicker('dob')}
                    maxLength={10}
                    keyboardType='numeric'
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
                  {errors.dob ? (
                    <Text style={styles.inputHelper}>{errors.dob}</Text>
                  ) : null}
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
                    readOnly={true}
                    onPressIn={() => {
                      if (enableEditing) {
                        setErrorWithTimeout(
                          'createdAt',
                          'Bạn không thể chỉnh sửa Ngày tạo tài khoản.',
                          5000,
                        );
                      }
                    }}
                    style={[
                      styles.input,
                      isFocused.createdAt && {
                        borderBottomColor: 'rgba(19, 19, 21, 1)',
                      },
                    ]}
                    value={userInfo2.createdAt}
                    // onFocus={() => handleInputFocus('createdAt')}
                    // onChangeText={text =>
                    //   handleChangeTextForDatePicker('createdAt', text)
                    // }
                    // onBlur={() => handleBlurForDatePicker('createdAt')}
                    // maxLength={10}
                    // keyboardType='numeric'
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
                  <Ionicons
                    name={'time-outline'}
                    size={20}
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
                    <Text style={styles.inputHelper}>{errors.createdAt}</Text>
                  ) : null}
                </View>
              </View>

              {/* START: GIOI TINH */}
              <View style={[styles.inputGroup]}>
                <View>
                  <RadioButtonGroup
                    containerStyle={{
                      marginBottom: 10,
                      marginTop: 14,
                      flexDirection: 'row',
                      // borderWidth: 1,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    // selected={currentGioiTinh}
                    selected={userInfo2.gtinh}
                    // onSelected={value => setCurrentGioiTinh(value)}
                    onSelected={value => {
                      if (enableEditing) {
                        handleValueChange('gtinh', value);
                      }
                    }}
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
                    style={styles.inputLabelTouchable}>
                    <Text style={[styles.inputLabel, styles.inputLabelFocused]}>
                      {formName.gtinh}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* END: GIOI TINH */}
            </View>
          </View>

          {/* END: NEW TEXT INPUT */}
        </View>
      </ScrollView>
      {enableEditing && (
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
            // onPress={() => console.log('\n\n\n\nuserinfo2: ', userInfo2)}
            // onPress={handleSaveChanges}
            onPress={handleSubmit}
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
