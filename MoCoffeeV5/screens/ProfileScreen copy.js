import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
// import {getAuth} from 'firebase/auth';
import {auth, storage} from '../firebase';

// navigation
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({navigation}) {
  console.log('storage: ', storage);

  const [displayName, setDisplayName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [userPhotoURL, setUserPhotoURL] = useState(null);
  const [userId, setUserId] = useState(null);

  const [imageURL, setImageURL] = useState(null);

  const navi = useNavigation();

  useEffect(() => {
    // const auth = getAuth();
    const user = auth.currentUser;

    console.log('PROFILE - user: ', user);

    if (user) {
      // Lấy các thuộc tính của người dùng nếu có
      const displayName = user.displayName;
      const email = user.email;
      const verified = user.emailVerified;
      const phone = user.phoneNumber;
      const photoURL = user.photoURL;
      const uid = user.uid;

      // Cập nhật state với các giá trị tương ứng
      setDisplayName(displayName);
      setUserEmail(email);
      setEmailVerified(verified);
      setPhoneNumber(phone);
      setUserPhotoURL(photoURL);
      setUserId(uid);
    }
  }, []);

  // Đăng xuất
  const handleDangXuat = async () => {
    try {
      // Hiển thị hộp thoại xác nhận trước khi đăng xuất
      Alert.alert(
        'Xác nhận đăng xuất',
        'Bạn có muốn đăng xuất không?',
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Đăng xuất',
            onPress: async () => {
              // Xóa token xác thực khỏi AsyncStorage
              await AsyncStorage.removeItem('authToken');

              // Chuyển người dùng đến màn hình đăng nhập

              navi.reset({
                index: 0,
                routes: [{name: 'LoginScreen'}],
              });
            },
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      console.error('Đã xảy ra lỗi khi đăng xuất:', error);
    }
  };

  useEffect(() => {
    const getImage = async () => {
      try {
        // const imageRef = storage.ref('IMG_6691.JPG');
        const imageRef = storage.ref().child('IMG_6691.JPG');
        const url = await imageRef.getDownloadURL();
        setImageURL(url);
      } catch (error) {
        console.error('Error getting download URL:', error);
      }
    };

    getImage();
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        onPress={() => navigation.navigate('Home')}
        style={{fontSize: 26, fontWeight: 'bold'}}>
        Profile Screen
      </Text>
      {displayName && <Text>Hello, {displayName}</Text>}
      {userEmail && <Text>Email: {userEmail}</Text>}
      {emailVerified && <Text>Email đã xác thực</Text>}
      {phoneNumber && <Text>Số điện thoại: {phoneNumber}</Text>}
      {userPhotoURL && <img src={userPhotoURL} alt="User" />}
      {userId && <Text>UserID: {userId}</Text>}

      <TouchableOpacity
        style={{paddingVertical: 10, marginTop: 80}}
        onPress={handleDangXuat}>
        <Text style={{fontSize: 18, color: 'red', fontWeight: '700'}}>
          Đăng xuất
        </Text>
      </TouchableOpacity>
    </View>
  );
}
