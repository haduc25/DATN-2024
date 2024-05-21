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
  Dimensions,
} from 'react-native';

// Icons
import {Octicons, Ionicons, AntDesign} from '@expo/vector-icons';

// Components
import Categories from '../components/Categories';
import Products from '../components/Products';
import Carousel from '../components/Carousel';
import CustomStatusBar from '../components/CustomStatusBar';
import SearchComponent from '../components/SearchComponent';
import SearchComponentV2 from '../components/SearchComponentV2';

// Database
// import {supabase} from '../supabase';
import {collection, getDocs, getDoc, doc, updateDoc} from 'firebase/firestore';

// navigation
import {useNavigation, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// fetch Image
import {db, auth, storage} from '../firebase';

// for custom status bar
import {SafeAreaProvider} from 'react-native-safe-area-context';

// LOCATION
import * as Location from 'expo-location';

import {GOOGLE_API_KEY} from '@env';

const reverseGeocode = async (location, setViTriHienTai) => {
  try {
    const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
    });

    const [{district, name, subregion, city, region, country, isoCountryCode}] =
      reverseGeocodedAddress;

    const xa = district || name;
    const huyen = subregion || city;
    const tinh = region;
    const quocGia = country || isoCountryCode;

    const viTri = `${xa}, ${huyen}, ${tinh}, ${quocGia}`;
    setViTriHienTai(viTri);

    // update location to firebase
    console.log(auth.currentUser.uid, viTri);
    updateLocationForUser(auth.currentUser.uid, viTri);
  } catch (error) {
    console.error('Error fetching reverse geocode:', error);
  }
};

const updateLocationForUser = (_userId, location) => {
  updateDoc(doc(db, 'Users', _userId), {
    location,
  })
    .then(() => {
      console.log('UPDATED LOCATION FOR USER: ', _userId);
      // save to AsyncStorage
      AsyncStorage.setItem('userLocation', location);
    })
    .catch(error => {
      console.log('error: ', error);
      alert('error: ', error);
    });
};

export default function HomeScreen({navigation}) {
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
      console.log('HomeScreen__Fetching...');
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

  // Lấy ra danh sách sản phẩm đã yêu thích của người dùng
  const fecthListItemFavoritedOfUser = async () => {
    try {
      // Lấy dữ liệu từ AsyncStorage
      const data = await AsyncStorage.getItem('usersProfile');

      if (data !== null) {
        // Chuyển đổi chuỗi JSON thành object
        const userProfile = JSON.parse(data);
        // console.log('User profiles:', userProfile);
        console.log('User profiles-id:', userProfile.currentUser._userId);

        // READ
        const docSnap = await getDoc(
          doc(db, 'Users', userProfile.currentUser._userId),
        );
        if (docSnap.exists()) {
          // console.log('Document data:', docSnap.data());
          // setUserData(docSnap.data());
          // console.log('data: ', docSnap.data());

          // console.log('itemFavorited: ', docSnap.data().itemFavorited);
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
  fecthListItemFavoritedOfUser();

  // START: RECOMMENDED, ITEMS DATA
  const recommended = [
    {
      id: 0,
      name: 'Cà phê đen',
      image:
        'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fproducts%2Frecommend_HOME_Khampha%2Fca-phe-den-da.jpg?alt=media&token=a82f35d8-e820-4d8a-b318-236e3c389b8f',
      time: '25',
      type: 'Cà phê',
    },
    {
      id: 1,
      name: 'Cà phê sữa đá',
      image:
        'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fproducts%2Frecommend_HOME_Khampha%2Fca-phe-sua-tuoi.jpg?alt=media&token=aeb296af-806f-4e6e-8c8d-7ec5d60c0d3c',
      time: '10 - 25',
      type: 'Cà phê',
    },
    {
      id: 2,
      name: 'Capuchino',
      image:
        'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fproducts%2Frecommend_HOME_Khampha%2Fca-phe-cappuccino.jpg?alt=media&token=8d417675-60c3-49ac-b18d-5c5170fc4eec',
      time: '20 - 25',
      type: 'Cà phê pha máy',
    },

    {
      id: 3,
      name: 'Trà sữa đá',
      image:
        'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fproducts%2Frecommend_HOME_Khampha%2Ftra-sua-da.jpg?alt=media&token=64d11140-ae3e-47a8-b4a9-406cbaca3e5d',
      time: '5 - 10',
      type: 'Trà sữa',
    },
    {
      id: 4,
      name: 'Trà chanh',
      image:
        'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fproducts%2Frecommend_HOME_Khampha%2Ftra-chanh.jpg?alt=media&token=dfe1bea1-a161-41bf-877e-3415bcc73cf4',
      time: '5',
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

  // ######################## START: LOCATION ########################
  const [viTriHienTai, setViTriHienTai] = useState(
    'Đang tìm vị trí của bạn...',
  );

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       await Location.requestForegroundPermissionsAsync();
  //       const currentLocation = await Location.getCurrentPositionAsync({});
  //       reverseGeocode(currentLocation, setViTriHienTai);
  //     } catch (error) {
  //       Alert.alert(
  //         'Quyền truy cập không được cấp',
  //         'Cho phép ứng dụng sử dụng dịch vụ định vị',
  //         [{text: 'OK'}],
  //         {cancelable: false},
  //       );
  //       console.error('Error fetching location:', error);
  //     }
  //   })();
  // }, []);
  // ######################## END: LOCATION ########################

  // HEIGHT & WIDTH DEVICE
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  console.log('screenWidth, screenHeight', screenWidth, screenHeight);

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
            <Text
              style={{color: 'gray', fontSize: 16, marginTop: 3}}
              numberOfLines={2}>
              {viTriHienTai}
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
        {/* 
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
          <TextInput
            placeholder='Tìm kiếm cà phê, trà sữa, nước hoa quả...'
            style={{width: 335, height: '100%'}}
          />
          <TouchableOpacity onPress={() => console.log('SEARCHING...')}>
            <AntDesign name='search1' size={24} color='#E52B50' />
          </TouchableOpacity>
        </View> */}

        {/* SEARCH */}
        {/* <SearchComponent /> */}
        <SearchComponentV2 />

        {/* <Carousel /> */}

        {/* <Categories /> */}

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
                    fontStyle: 'italic',
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
