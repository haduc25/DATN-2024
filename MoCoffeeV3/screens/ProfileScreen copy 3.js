import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Button,
} from 'react-native';
// import {getAuth} from 'firebase/auth';
import {auth, db, doc, getDoc} from '../firebase';

// navigation
import {useNavigation, useIsFocused} from '@react-navigation/native';

// Icons
import {AntDesign} from '@expo/vector-icons';
import CustomStatusBar from '../components/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {removeAllKeyAndDataInAsyncStorage} from '../utils/globalHelpers';

// TOAST MESSAGE
// import Toast from 'react-native-toast-message';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';

// OVERLAY
import {Button as Button2, Overlay} from 'react-native-elements';

export default function ProfileScreen() {
  const [userInfo, setUserInfo] = useState(null);
  const [showUIAdmin, setShowUIAdmin] = useState(false);

  const navi = useNavigation();
  const isFocused = useIsFocused();

  // =========== START: Use Effect =========== //
  useEffect(() => {
    const readUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return; // Thoát sớm nếu không có người dùng đăng nhập

        const userUid = user.uid;
        const docSnap = await getDoc(doc(db, 'Users', userUid));

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const mergedData = mergeObjects(user, userData);
          setUserInfo(mergedData);

          if (mergedData.role === 'admin') {
            setShowUIAdmin(true);
          }
        } else {
          console.log('Document does not exist');
          alert('Document does not exist');
        }
      } catch (error) {
        console.log('Error getting document:', error);
        alert('Error getting document:', error.message); // Chỉ hiển thị thông báo lỗi
      }
    };

    if (isFocused) {
      readUserData();
      console.log('Fetching readUserData...');
    }
  }, [isFocused]);

  // =========== END: Use Effect =========== //

  // Hàm hợp nhất hai đối tượng và loại bỏ các khóa trùng lặp
  const mergeObjects = (obj1, obj2) => {
    const merged = {...obj1};

    Object.keys(obj2).forEach(key => {
      if (!(key in obj1)) {
        merged[key] = obj2[key];
      } else if (key === 'phoneNumber') {
        // Bỏ `phoneNumber` của auth để lấy cái `phoneNumber` ở bên Firestore
        merged[key] = obj2[key];
      }
    });

    return merged;
  };

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
              await removeAllKeyAndDataInAsyncStorage(); // Gọi hàm để xóa hết các key
              toggleOverlay();

              // TOAST MSG
              Toast.show({
                type: 'success',
                text1: 'Đăng xuất',
                text2: 'Đã đăng xuất',
              });

              setTimeout(() => {
                // Chuyển người dùng đến màn hình đăng nhập
                navi.reset({
                  index: 0,
                  routes: [{name: 'LoginScreen'}],
                });
              }, 3000); // Thời gian chờ
            },
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      console.error('Đã xảy ra lỗi khi đăng xuất:', error);
    }
  };

  const toastConfig = {
    success: props => (
      <BaseToast
        {...props}
        style={{
          position: 'absolute',
          top: 10,
          borderLeftColor: '#6666ff',
          minWidth: 400,
          maxWidth: 400,
          minHeight: 80,
          backgroundColor: '#1c1c1e',
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        text1Style={{
          fontSize: 16,
          fontWeight: '400',
          color: '#fff',
        }}
        text2Style={{
          fontSize: 14,
        }}
      />
    ),
    error: props => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 17,
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),
    tomatoToast: ({text1, props}) => (
      <View style={{height: 60, width: '100%', backgroundColor: 'tomato'}}>
        <Text>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
    ),
  };

  const [visibleOverlay, setVisibleOverlay] = useState(false);

  const toggleOverlay = () => {
    setVisibleOverlay(!visibleOverlay);
  };

  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor='#fff' />
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity
          onPress={() => {
            if (userInfo) {
              console.log('=================== \n');
              console.log('userInfo222: ', userInfo);
              const userInfo2 = {
                uid: userInfo.uid,
                phoneNumber: userInfo.phoneNumber,
                photoURL: userInfo.photoURL,
                displayName: userInfo.displayName,
                email: userInfo.email,
                emailVerified: userInfo.emailVerified,
                dob: userInfo.dob,
                gtinh: userInfo.gtinh,
                role: userInfo.role,
                createdAt: userInfo.createdAt,
                location: userInfo.location,
              };
              navi.navigate('Chỉnh sửa hồ sơ', {userInfo: userInfo2});
            }
          }}
          style={styles.touchableOpacity}>
          {userInfo && userInfo.photoURL && (
            <Image
              source={{uri: userInfo.photoURL}}
              style={styles.userInfoImage}
            />
          )}
          <View style={styles.userInfoTextContainer}>
            {userInfo && userInfo.displayName && (
              <Text style={{fontWeight: '700'}}>
                Hello, {userInfo.displayName}
              </Text>
            )}
            {userInfo && userInfo.email && (
              <Text style={{paddingTop: 4}}>{userInfo.email}</Text>
            )}
            {userInfo && userInfo.emailVerified ? (
              <Text style={{paddingTop: 4, fontStyle: 'italic', fontSize: 13}}>
                Email đã được xác thực
              </Text>
            ) : (
              <Text style={{paddingTop: 4, fontStyle: 'italic', fontSize: 13}}>
                Email chưa được xác thực
              </Text>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.containerView}>
          <TouchableOpacity
            onPress={() => alert('navigate to Cộng đồng MoCoffee&Tea')}
            style={styles.itemTouchableOpacity}>
            <View style={styles.itemIconContainer}>
              <AntDesign name='smileo' size={18} color='#000' />
              <Text style={{paddingLeft: 10}}>Cộng đồng MoCoffee&Tea</Text>
            </View>
            <AntDesign name='right' size={18} color='#000' />
          </TouchableOpacity>

          {showUIAdmin && (
            <TouchableOpacity
              onPress={() => navi.navigate('AdminDashboardScreen')}
              style={styles.itemTouchableOpacity}>
              <View style={styles.itemIconContainer}>
                <AntDesign name='Safety' size={18} color='#000' />
                <Text style={{paddingLeft: 10}}>Giao diện quản trị viên</Text>
              </View>
              <AntDesign name='right' size={18} color='#000' />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() =>
              navi.navigate('Cart', {
                currentScreen: 'Tài khoản',
              })
            }
            style={styles.itemTouchableOpacity}>
            <View style={styles.itemIconContainer}>
              <AntDesign name='shoppingcart' size={18} color='#000' />
              <Text style={{paddingLeft: 10}}>Giỏ hàng</Text>
            </View>
            <AntDesign name='right' size={18} color='#000' />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => alert('navigate to Quản lý thẻ')}
            style={styles.itemTouchableOpacity}>
            <View style={styles.itemIconContainer}>
              <AntDesign name='creditcard' size={18} color='#000' />
              <Text style={{paddingLeft: 10}}>Quản lý thẻ</Text>
            </View>
            <AntDesign name='right' size={18} color='#000' />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => alert('navigate to Q&A')}
            style={styles.itemTouchableOpacity}>
            <View style={styles.itemIconContainer}>
              <AntDesign name='questioncircleo' size={18} color='#000' />
              <Text style={{paddingLeft: 10}}>Câu hỏi thường gặp</Text>
            </View>
            <AntDesign name='right' size={18} color='#000' />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => alert('navigate to Contact to MoCoffee&Tea')}
            style={styles.itemTouchableOpacity}>
            <View style={styles.itemIconContainer}>
              <AntDesign name='phone' size={18} color='#000' />
              <Text style={{paddingLeft: 10}}>Liên hệ với MoCoffee&Tea</Text>
            </View>
            <AntDesign name='right' size={18} color='#000' />
          </TouchableOpacity>

          <TouchableOpacity
            // onPress={() => alert('navigate to INFO MoCoffee&Tea')}
            onPress={toggleOverlay}
            style={styles.itemTouchableOpacity}>
            <View style={styles.itemIconContainer}>
              <AntDesign name='infocirlceo' size={18} color='#000' />
              <Text style={{paddingLeft: 10}}>Về MoCoffee&Tea</Text>
            </View>
            <AntDesign name='right' size={18} color='#000' />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDangXuat}
            style={styles.itemTouchableOpacity}>
            <AntDesign name='logout' size={18} style={styles.logoutIcon} />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        <View style={{alignItems: 'center', paddingTop: 40}}>
          <Text style={styles.footerText}>
            Phiên bản hiện tại: v3.10.5 (170324)
          </Text>
        </View>

        {/* <Button
          title={'toast notification'}
          onPress={() =>
            Toast.show({
              type: 'success',
              text1: 'Hello',
              text2: 'This is some something 👋',
            })
          }
        /> */}
      </ScrollView>

      {/* OVERLAY */}
      <Overlay
        overlayStyle={{
          backgroundColor: 'transparent',
          position: 'relative',
          height: '100%',
        }}
        isVisible={visibleOverlay}
        fullScreen={visibleOverlay} //bằng true thì ấn ra ngoài k tắt và giống như read only
        onBackdropPress={toggleOverlay}>
        <Toast config={toastConfig} />
      </Overlay>
    </SafeAreaProvider>
  );
}

const styles = {
  scrollView: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  touchableOpacity: {
    paddingVertical: 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 5,
  },
  userInfoImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  userInfoTextContainer: {
    padding: 10,
  },
  containerView: {
    borderColor: 'blue',
    minHeight: 332,
    marginTop: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 5,
  },
  itemTouchableOpacity: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  footerText: {
    paddingLeft: 10,
    color: '#ccc',
  },
  logoutIcon: {
    color: 'red',
  },
  logoutText: {
    paddingLeft: 10,
    color: 'red',
  },
};
