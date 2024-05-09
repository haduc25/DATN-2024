import React, {useState, useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';

// Icons
import {Octicons, Ionicons, AntDesign} from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';

// Components
import Categories from '../components/Categories';
import Products from '../components/Products';
import Carousel from '../components/Carousel';
import CustomStatusBar from '../components/CustomStatusBar';

// Database
// import {supabase} from '../supabase';
import {collection, getDocs, getDoc, doc} from 'firebase/firestore';

// navigation
import {useNavigation, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// fetch Image
import {db, auth, storage} from '../firebase';

// for custom status bar
import {SafeAreaProvider} from 'react-native-safe-area-context';

export default function HomeScreen({navigation}) {
  // Location
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    'Đang tìm vị trí của bạn...',
  );

  const navi = useNavigation();
  const isFocused = useIsFocused();

  // user photo
  const [userPhotoURL, setUserPhotoURL] = useState(null);

  // fecth data from db
  const [data, setData] = useState([]);

  // Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'MenuMoC&T'));
        // const querySnapshot = await getDocs(collection(db, 'CoffeeTeaMenu'));
        const fetchedData = [];
        querySnapshot.forEach(doc => {
          fetchedData.push({id: doc.id, ...doc.data()});
        });
        // console.log('Data1:', fetchedData);
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (isFocused) {
      fetchData();
      console.log('Fetching...');
    }

    // get user photo
    if (auth.currentUser) setUserPhotoURL(auth.currentUser.photoURL);
  }, [isFocused]);

  // console.log('data1', data);

  // fetch user data

  // Read from firebase
  // const userId = auth.currentUser.uid;
  // console.log('auth.currentUser: ', auth.currentUser);
  // console.log('userId: ', userId);

  const read = async () => {
    try {
      // Lấy dữ liệu từ AsyncStorage
      const data = await AsyncStorage.getItem('usersProfile');

      if (data !== null) {
        // Chuyển đổi chuỗi JSON thành object
        const userProfile = JSON.parse(data);
        console.log('User profiles:', userProfile);
        console.log('User profiles-id:', userProfile.currentUser._userId);

        // READ
        const docSnap = await getDoc(
          doc(db, 'Users', userProfile.currentUser._userId),
        );
        if (docSnap.exists()) {
          console.log('Document data:', docSnap.data());
          // setUserData(docSnap.data());
          console.log('data: ', docSnap.data());

          console.log('itemFavorited: ', docSnap.data().itemFavorited);
          // Lưu danh sách sản phẩm đã yêu thích mới vào AsyncStorage
          await AsyncStorage.setItem(
            'favoritedItems',
            JSON.stringify(docSnap.data().itemFavorited),
          );
        } else {
          console.log('Document does not exist');
          alert('Document does not exist');
          // setUserData(null);
        }
      } else {
        console.log('No user profiles found');
      }
    } catch (error) {
      console.log('Error getting document:', error);
      alert('Error getting document:', error);
      // setUserData(null);
    }
  };
  read();

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

  // START: RECOMMENDED, ITEMS DATA
  const recommended = [
    {
      id: 0,
      name: 'Cà phê đen',
      image:
        // 'https://b.zmtcdn.com/data/pictures/chains/3/50713/81d0735ce259a6bf800e16bb54cb9e5e.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A',
        'https://changibakery.com/wp-content/uploads/2023/05/CAFE-DEN-GHEP-ANH-scaled.jpg',
      time: '35 - 45',
      type: 'Cà phê',
    },
    {
      id: 0,
      name: 'Cà phê sữa đá',
      image:
        // 'https://b.zmtcdn.com/data/pictures/0/20844770/f9582144619b80d30566f497a02e2c8d.jpg?output-format=webp&fit=around|771.75:416.25&crop=771.75:416.25;*,*',
        'https://bonjourcoffee.vn/blog/wp-content/uploads/2020/11/cac-luu-y-cafe-sua-tuoi.jpg',
      time: '10 - 35',
      type: 'Cà phê',
    },
    {
      id: 0,
      name: 'Cappuccino',
      image:
        // 'https://b.zmtcdn.com/data/reviews_photos/2f1/c66cf9c2c68f652db16f2c0a6188a2f1_1659295848.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A',
        'https://bonjourcoffee.vn/blog/wp-content/uploads/2020/11/Caramel-Macchiato-da-xay.jpg',
      time: '20 - 25',
      type: 'Cà phê',
    },

    {
      id: 0,
      name: 'Trà sữa đá',
      image:
        // 'https://b.zmtcdn.com/data/reviews_photos/2f1/c66cf9c2c68f652db16f2c0a6188a2f1_1659295848.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A',
        'https://cdn.tgdd.vn/2021/07/CookRecipe/GalleryStep/thanh-pham-959.jpg',
      time: '20 - 25',
      type: 'Trà',
    },
    {
      id: 0,
      name: 'Trà chanh',
      image:
        // 'https://b.zmtcdn.com/data/reviews_photos/2f1/c66cf9c2c68f652db16f2c0a6188a2f1_1659295848.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A',
        'https://thienthanhtea.com/wp-content/uploads/2022/10/cach-lam-hong-tra-trai-cay-giai-nhiet-sau-mot-ngay-met-moi-5f3-6620628.jpg',
      time: '20 - 25',
      type: 'Trà',
    },
  ];

  const items = [
    {
      id: '0',
      name: 'Ưu đãi',
      description: 'GIẢM GIÁ 50%',
      // description: 'GIẢM GIÁ lên tới 50%',
      image: 'https://cdn-icons-png.flaticon.com/128/9356/9356378.png',
    },
    {
      id: '1',
      // name: 'Legends',
      // description: 'Across India',
      name: 'Trà sữa',
      description: 'THƠM NGON',
      // image: 'https://cdn-icons-png.flaticon.com/128/8302/8302686.png',
      image: 'https://cdn-icons-png.flaticon.com/512/5825/5825361.png',
    },
    {
      id: '2',
      // name: 'Gourmet',
      // description: 'Selections',
      name: 'Sinh tố',
      description: 'MÁT LẠNH',
      image: 'https://cdn-icons-png.flaticon.com/512/4080/4080639.png',
      // image: 'https://cdn-icons-png.flaticon.com/512/5848/5848527.png',
    },
    {
      id: '3',
      // name: 'Healthy',
      // description: 'Curated dishes',
      name: 'Cà phê',
      description: 'ĐẬM ĐÀ',
      // image: 'https://cdn-icons-png.flaticon.com/512/1047/1047503.png',
      image: 'https://cdn-icons-png.flaticon.com/512/10771/10771316.png',
    },
  ];
  // END: RECOMMENDED DATA

  // const numbers = [];
  // for (let i = 0; i < 1000; i++) {
  //   numbers.push(i);
  // }

  // return (
  //   <SafeAreaProvider>
  //     <CustomStatusBar backgroundColor="#fff" />
  //     <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
  //       {/* Sử dụng map để render các số từ mảng */}
  //       {numbers.map((number, index) => (
  //         <Text key={index}>{number}</Text>
  //       ))}
  //     </ScrollView>
  //   </SafeAreaProvider>
  // );

  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor='#fff' />
      {/* <CustomStatusBar backgroundColor='transparent' barStyle='dark-content' /> */}
      <ScrollView
        style={{
          flex: 1,
          // backgroundColor: '#f8f8f8',
          backgroundColor: '#fff',
          paddingTop: 40,
        }}>
        {/* <StatusBar
          animated={true}
          backgroundColor={'fff'}
          barStyle={'dark-content'}
        /> */}

        {/* <Carousel /> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            padding: 10,
          }}>
          <Octicons name='location' size={24} color='#E52850' />
          <View style={{flex: 1}}>
            <Text style={{fontSize: 15, fontWeight: '500'}}>Giao hàng tới</Text>
            <Text style={{color: 'gray', fontSize: 16, marginTop: 3}}>
              {displayCurrentAddress}
            </Text>
          </View>
          {/* <Pressable
            style={{
              backgroundColor: '#6CB4EE',
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={handleDangXuat}>
              <Text>MD</Text>
            </TouchableOpacity>
          </Pressable> */}
          {userPhotoURL && (
            <TouchableOpacity onPress={() => navi.navigate('Tài khoản')}>
              <Image
                source={{uri: userPhotoURL}}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                }}
              />
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: '#C0C0C0',
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderRadius: 11,
            marginTop: 10,
            marginHorizontal: 10,
          }}>
          <TextInput placeholder='Tìm kiếm cà phê, trà sữa, nước hoa quả...' />
          <AntDesign name='search1' size={24} color='#E52B50' />
        </View>

        <Carousel />

        <Categories />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recommended?.map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                margin: 10,
                borderRadius: 8,
              }}>
              <View>
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    resizeMode: 'cover',
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 7,
                  }}
                  source={{uri: item?.image}}
                />
              </View>
              <View style={{padding: 10, flexDirection: 'column'}}>
                <Text style={{fontSize: 15, fontWeight: '500'}}>
                  {item?.name}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    marginTop: 3,
                    color: 'gray',
                    fontWeight: '500',
                  }}>
                  {item?.type}
                </Text>

                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 3}}>
                  {/* <Ionicons name='ios-time' size={24} color='green' /> */}
                  <Ionicons
                    name={Ionicons['ios-time'] ? 'ios-time' : 'time'}
                    size={24}
                    color='green'
                  />

                  {/* Có thể thay chỗ này là giá tiền or đánh giá */}
                  <Text>{item?.time} phút</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <Text
          style={{
            textAlign: 'center',
            marginTop: 7,
            letterSpacing: 4,
            marginBottom: 5,
            color: 'gray',
          }}>
          KHÁM PHÁ
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {items?.map((item, index) => (
            <View
              key={index}
              style={{
                width: 90,
                borderColor: '#E0E0E0',
                borderWidth: 1,
                paddingVertical: 5,
                paddingHorizontal: 1,
                borderRadius: 5,
                marginLeft: 10,
                marginVertical: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}>
              <Image
                style={{width: 50, height: 50}}
                source={{uri: item?.image}}
              />

              <Text style={{fontSize: 13, fontWeight: '500', marginTop: 6}}>
                {item?.name}
              </Text>

              <Text style={{fontSize: 12, color: 'gray', marginTop: 3}}>
                {item?.description}
              </Text>
            </View>
          ))}
        </ScrollView>

        <Text
          style={{
            textAlign: 'center',
            marginTop: 7,
            letterSpacing: 9,
            marginBottom: 5,
            color: 'gray',
          }}>
          SẢN PHẨM THỊNH HÀNH
        </Text>

        <View
          style={{
            marginHorizontal: 8,
            paddingBottom: 50, //dưới (khoảng cách từ item vs TabBar)
          }}>
          {data?.map((item, index) => (
            <Products
              key={index}
              item={item}
              menu={item?.menu}
              listItems={item?.listItems}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

// import * as React from 'react';
// import {View, StyleSheet, Text} from 'react-native';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Ionicons name='md-checkmark-circle' size={32} color='green' />
//       <Ionicons name='checkmark-circle' size={32} color='green' />
//       <MaterialIcons name='check-circle' size={32} color='green' />

//       <Text>123</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
