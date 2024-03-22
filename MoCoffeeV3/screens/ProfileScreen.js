import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
// import {getAuth} from 'firebase/auth';
import {auth, storage} from '../firebase';
import {ref, getDownloadURL} from 'firebase/storage';

// navigation
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Icons
import {Ionicons, Fontisto, AntDesign} from '@expo/vector-icons';
import CustomStatusBar from '../components/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';

export default function ProfileScreen({navigation}) {
  const [imageURI, setImageURI] = useState(null);
  console.log('storage: ', storage);

  const [displayName, setDisplayName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [userPhotoURL, setUserPhotoURL] = useState(null);
  const [userId, setUserId] = useState(null);

  const [userInfo, setUserInfo] = useState(null);

  const navi = useNavigation();

  useEffect(() => {
    // const auth = getAuth();
    const user = auth.currentUser;

    console.log('PROFILE - user1: ', user);

    if (user) {
      setUserInfo(user);
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
              await AsyncStorage.removeItem('usersProfile');

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
    const fetchImageURI = async () => {
      try {
        getDownloadURL(ref(storage, 'IMG_6691.JPG'))
          .then(url => {
            // `url` is the download URL for 'images/stars.jpg'

            // This can be downloaded directly:
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = event => {
              const blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();

            // // Or inserted into an <img> element
            console.log('url: ', url);
            setImageURI(url);
          })
          .catch(error => {
            // Handle any errors
            console.log('error2: ', error);
          });
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImageURI();
  }, []);

  console.log('image URI: ', imageURI);

  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor='#fff' />
      <ScrollView
        style={{
          flex: 1,
          // marginTop: 40,
          paddingTop: 40,
          backgroundColor: '#fff',
        }}>
        <TouchableOpacity
          onPress={() => {
            if (userInfo) {
              console.log('userInfo: ', userInfo);
              const userInfo2 = {
                uid: userInfo.uid,
                phoneNumber: userInfo.phoneNumber,
                photoURL: userInfo.photoURL,
                displayName: userInfo.displayName,
                email: userInfo.email,
              };
              navi.navigate('Chỉnh sửa hồ sơ', {userInfo: userInfo2});
            }
          }}
          style={{
            // marginTop: 16,
            paddingVertical: 20,
            flexDirection: 'row',
            backgroundColor: '#fff',
            paddingHorizontal: 14,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowOffset: {width: 0, height: 4},
            elevation: 5,
          }}>
          {phoneNumber && <Text>Số điện thoại: {phoneNumber}</Text>}
          {userPhotoURL && (
            <Image
              source={{uri: userPhotoURL}}
              style={{width: 80, height: 80, borderRadius: 50}}
            />
          )}
          <View style={{padding: 10}}>
            {displayName && (
              <Text style={{fontWeight: '700'}}>Hello, {displayName}</Text>
            )}
            {userEmail && <Text style={{paddingTop: 4}}>{userEmail}</Text>}
          </View>
          {/* {emailVerified && <Text>Email đã xác thực</Text>}
          {userId && <Text>UserID: {userId}</Text>}
          {imageURI && (
            <Image source={{uri: imageURI}} style={{width: 200, height: 200}} />
          )} */}
        </TouchableOpacity>

        <View
          style={{
            // borderWidth: 1,
            borderColor: 'blue',
            minHeight: 332,
            // paddingTop: 20,
            marginTop: 10,

            backgroundColor: '#fff',
            paddingHorizontal: 14,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowOffset: {width: 0, height: 4},
            elevation: 5,
          }}>
          {/* <View
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between', // Đảm bảo các phần tử con được căn giữa và giãn cách đều
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <AntDesign
                name={'smileo'}
                size={18}
                color={'#000'}
                // style={{marginTop: 10, borderWidth: 1, borderColor: '#000'}}
              />
              <Text style={{paddingLeft: 10}}>Cộng đồng MoCoffee&Tea</Text>
            </View>
            <AntDesign name={'right'} size={18} color={'#000'} />
          </View> */}
          <TouchableOpacity
            onPress={() => alert('navigate to Cộng đồng MoCoffee&Tea')}
            style={{
              borderBottomWidth: 1,
              borderColor: '#ccc',
              paddingTop: 20,
              padding: 18,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <AntDesign
                name={'smileo'}
                size={18}
                color={'#000'}
                // style={{marginTop: 10, borderWidth: 1, borderColor: '#000'}}
              />
              <Text style={{paddingLeft: 10}}>Cộng đồng MoCoffee&Tea</Text>
            </View>
            <AntDesign name={'right'} size={18} color={'#000'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => alert('navigate to Quản lý thẻ')}
            style={{
              borderBottomWidth: 1,
              borderColor: '#ccc',
              padding: 18,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <AntDesign
                name={'creditcard'}
                size={18}
                color={'#000'}
                // style={{marginTop: 10, borderWidth: 1, borderColor: '#000'}}
              />
              <Text style={{paddingLeft: 10}}>Quản lý thẻ</Text>
            </View>
            <AntDesign name={'right'} size={18} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => alert('navigate to Q&A')}
            style={{
              borderBottomWidth: 1,
              borderColor: '#ccc',
              padding: 18,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <AntDesign
                name={'questioncircleo'}
                size={18}
                color={'#000'}
                // style={{marginTop: 10, borderWidth: 1, borderColor: '#000'}}
              />
              <Text style={{paddingLeft: 10}}>Câu hỏi thường gặp</Text>
            </View>
            <AntDesign name={'right'} size={18} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => alert('navigate to Contact to MoCoffee&Tea')}
            style={{
              borderBottomWidth: 1,
              borderColor: '#ccc',
              padding: 18,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <AntDesign
                name={'phone'}
                // name={'customerservice'}
                size={18}
                color={'#000'}
                // style={{marginTop: 10, borderWidth: 1, borderColor: '#000'}}
              />
              <Text style={{paddingLeft: 10}}>Liên hệ với MoCoffee&Tea</Text>
            </View>
            <AntDesign name={'right'} size={18} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => alert('navigate to INFO MoCoffee&Tea')}
            style={{
              borderBottomWidth: 1,
              borderColor: '#ccc',
              padding: 18,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <AntDesign
                name={'infocirlceo'}
                size={18}
                color={'#000'}
                // style={{marginTop: 10, borderWidth: 1, borderColor: '#000'}}
              />
              <Text style={{paddingLeft: 10}}>Về MoCoffee&Tea</Text>
            </View>
            <AntDesign name={'right'} size={18} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDangXuat}
            style={{
              borderBottomWidth: 1,
              borderColor: '#ccc',
              padding: 18,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <AntDesign
              name={'logout'}
              size={18}
              color={'red'}
              // style={{marginTop: 10, borderWidth: 1, borderColor: '#000'}}
            />
            <Text style={{paddingLeft: 10, color: 'red'}}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
        <View style={{alignItems: 'center', paddingTop: 40}}>
          <Text style={{paddingLeft: 10, color: '#ccc'}}>
            Phiên bản hiện tại: v3.10.5 (170324)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}
