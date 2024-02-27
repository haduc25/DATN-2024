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
import {Octicons, Ionicons} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';

// Components
import Categories from '../components/Categories';
import Products from '../components/Products';
import Carousel from '../components/Carousel';

// Database
// import {supabase} from '../supabase';
import {collection, getDocs} from 'firebase/firestore';
import {db} from '../firebase';

// navigation
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// fetch Image
import {auth, storage} from '../firebase';

export default function HomeScreen({navigation}) {
  // Location
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    'Đang tìm vị trí của bạn...',
  );

  const navi = useNavigation();

  // user photo
  const [userPhotoURL, setUserPhotoURL] = useState(null);

  // fecth data from db
  const [data, setData] = useState([]);

  // Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'CoffeeTeaMenu'));
        const fetchedData = [];
        querySnapshot.forEach(doc => {
          fetchedData.push({id: doc.id, ...doc.data()});
        });
        console.log('Data1:', fetchedData);
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // get user photo
    if (auth.currentUser) setUserPhotoURL(auth.currentUser.photoURL);
  }, []);

  // console.log('data1', data);

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

  // START: RECOMMENDED, ITEMS DATA
  const recommended = [
    {
      id: 0,
      name: 'Cà phê đen',
      image:
        'https://b.zmtcdn.com/data/pictures/chains/3/50713/81d0735ce259a6bf800e16bb54cb9e5e.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A',
      time: '35 - 45',
      type: 'Coffee',
    },
    {
      id: 0,
      name: 'Cà phê sữa đá',
      image:
        'https://b.zmtcdn.com/data/pictures/0/20844770/f9582144619b80d30566f497a02e2c8d.jpg?output-format=webp&fit=around|771.75:416.25&crop=771.75:416.25;*,*',
      time: '10 - 35',
      type: 'Coffee',
    },
    {
      id: 0,
      name: 'Cappuccino',
      image:
        'https://b.zmtcdn.com/data/reviews_photos/2f1/c66cf9c2c68f652db16f2c0a6188a2f1_1659295848.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A',
      time: '20 - 25',
      type: 'Coffee',
    },

    {
      id: 0,
      name: 'Trà sữa đá',
      image:
        'https://b.zmtcdn.com/data/reviews_photos/2f1/c66cf9c2c68f652db16f2c0a6188a2f1_1659295848.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A',
      time: '20 - 25',
      type: 'Tea',
    },
    {
      id: 0,
      name: 'Trà chanh',
      image:
        'https://b.zmtcdn.com/data/reviews_photos/2f1/c66cf9c2c68f652db16f2c0a6188a2f1_1659295848.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A',
      time: '20 - 25',
      type: 'Tea',
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
      name: '111',
      description: '111111',
      image: 'https://cdn-icons-png.flaticon.com/128/8302/8302686.png',
    },
    {
      id: '2',
      // name: 'Gourmet',
      // description: 'Selections',
      name: '222',
      description: '222222',
      image: 'https://cdn-icons-png.flaticon.com/128/1065/1065715.png',
    },
    {
      id: '3',
      // name: 'Healthy',
      // description: 'Curated dishes',
      name: '333',
      description: '333333',
      image: 'https://cdn-icons-png.flaticon.com/128/415/415744.png',
    },
  ];
  // END: RECOMMENDED DATA

  return (
    <ScrollView
      style={{
        flex: 1,
        // backgroundColor: '#f8f8f8',
        backgroundColor: '#fff',
        // paddingTop: 40,
        marginTop: -10, //nếu cho `Carousel` lên đầu
      }}>
      <Carousel />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          padding: 10,
        }}>
        <Octicons name="location" size={24} color="#E52850" />
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
          <Image
            source={{uri: userPhotoURL}}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
            }}
          />
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
        <TextInput placeholder="Tìm kiếm cà phê, trà sữa..." />
        <AntDesign name="search1" size={24} color="#E52B50" />
      </View>

      {/* <Carousel /> */}

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
                <Ionicons name="ios-time" size={24} color="green" />
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
        TẤT CẢ SẢN PHẨM
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
  );
}
