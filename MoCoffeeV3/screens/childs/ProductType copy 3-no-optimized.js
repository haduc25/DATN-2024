import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Animated,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomStatusBar from '../../components/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// Icons
import {Ionicons} from '@expo/vector-icons';
import {SimpleLineIcons} from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';

// Components
import FoodItem from '../../components/FoodItem';

// Redux
import {useDispatch, useSelector} from 'react-redux';
import {cleanCart, cleanCartUI} from '../../redux/CartReducer';

// Navigation router
import {useRoute, useNavigation, useIsFocused} from '@react-navigation/native';

// get data from firestore
import {collection, query, where, getDocs} from 'firebase/firestore';
// Import `db` từ file firebase.js
import {db} from '../../firebase';

// Helper
import {translateCategory} from '../../utils/globalHelpers';

// AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function ProductType({navigation, route}) {
export default function ProductType({navigation}) {
  // Redux
  const dispatch = useDispatch();
  const isCartClean = useSelector(state => state.cart.isClean);

  console.log('isCartClean_PRODUCTTYPE: ', isCartClean);

  //   const params = useLocalSearchParams();
  const route = useRoute();
  const navi = useNavigation();
  const isFocused = useIsFocused();
  // console.log('router123: ', route);
  const cart = useSelector(state => state.cart.cart);
  console.log('ProductType-Cart: ', cart);

  console.log('ProductType_navigation: ', navigation);
  // console.log('route: ', route);

  const {name, category} = route.params || {};

  console.log('route: ', route);
  // console.log('route.params: ', route.params);

  // Scroll View
  const scrollViewRef = useRef(null);
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const ITEM_HEIGHT = 650;
  const scrollToCategory = index => {
    const yOffset = index * ITEM_HEIGHT;
    Animated.timing(scrollAnim, {
      toValue: yOffset,
      duration: 500,
      useNativeDriver: true,
    }).start();
    scrollViewRef.current.scrollTo({y: yOffset, animated: true});
  };

  // category item
  const [categoryItems, setCategoryItems] = useState([]);

  useEffect(() => {
    const {category} = route.params || {};
    console.log('category__: ', category);

    const fetchTeaItems = async () => {
      try {
        const q = query(
          collection(db, 'MenuMoC&T'),
          where('category', '==', category), // Đảm bảo chuỗi so sánh là 'tea' hoặc 'Tea'
        );
        const querySnapshot = await getDocs(q);
        const categoryItemsData = [];
        querySnapshot.forEach(doc => {
          categoryItemsData.push({id: doc.id, ...doc.data()});
        });
        console.log('Tea Items Data:', categoryItemsData);
        setCategoryItems(categoryItemsData); // Cập nhật state với dữ liệu đã lấy được
      } catch (error) {
        console.error('Error fetching tea items:', error);
      }
    };

    if (isFocused) {
      fetchTeaItems();
      console.log('Fetching...');
    }
  }, [category, isFocused]);

  // V3 - CHỌN SIZES
  const [selectedSizes, setSelectedSizes] = useState({}); // State lưu kích thước được chọn cho từng sản phẩm

  // Thiết lập kích thước mặc định cho mỗi sản phẩm khi cart thay đổi
  useEffect(() => {
    const defaultSizes = {};
    cart.forEach(item => {
      defaultSizes[item._id] = item.available_sizes[0]; // Chọn kích thước đầu tiên làm mặc định
    });
    setSelectedSizes(defaultSizes);
  }, [cart]);

  const handleSizeChange = (productId, size) => {
    setSelectedSizes(prevState => ({
      ...prevState,
      [productId]: size,
    }));
  };

  // save to AsyncStorage
  const saveSelectedSizes = async selectedSizes => {
    try {
      const jsonValue = JSON.stringify(selectedSizes);
      await AsyncStorage.setItem('selectedSizes_CART', jsonValue);
      console.log('Selected sizes đã lưu vào AsyncStorage');
    } catch (e) {
      console.error('Failed to save selected sizes.', e);
    }
  };

  return (
    <SafeAreaProvider>
      <ScrollView
        ref={scrollViewRef}
        // style={{backgroundColor: 'white', paddingTop: 40}}>
        style={{
          backgroundColor: 'white',
          paddingTop: 60,
        }}>
        <View
          style={{
            marginTop: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Ionicons
            onPress={() => navigation.canGoBack() && navigation.goBack()}
            style={{padding: 5}}
            name='arrow-back'
            size={24}
            color='black'
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 14,
              gap: 10,
            }}>
            <SimpleLineIcons name='camera' size={24} color='black' />
            <Ionicons name='bookmark-outline' size={24} color='black' />
            <MaterialCommunityIcons
              name='share-outline'
              size={24}
              color='black'
              onPress={() => {
                dispatch(cleanCart());
                alert('CLEAN');
              }}
            />
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 12,
          }}>
          {/* <Text style={{fontSize: 20, fontWeight: 'bold'}}>{name}</Text> */}
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            {translateCategory(category)} ({categoryItems.length})
          </Text>
          <Text
            style={{
              marginTop: 5,
              color: 'gray',
              fontWeight: '500',
              fontSize: 15,
            }}>
            {' '}
            {/* Bắc Kạn • Coffee & Tea • ♥ */}♥ • Coffee & Tea • ♥
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              marginTop: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#006A4E',
                borderRadius: 4,
                paddingHorizontal: 4,
                paddingVertical: 5,
                gap: 4,
              }}>
              <Text style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>
                {/* {aggregate_rating} */}
                4.8
              </Text>
              {/* <Ionicons name='ios-star' size={15} color='white' /> */}
              <Ionicons
                name={Ionicons['ios-star'] ? 'ios-star' : 'star'}
                size={15}
                color='#fff'
              />
            </View>
            <Text style={{fontSize: 15, fontWeight: '500', marginLeft: 5}}>
              3.2K Đánh giá
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#D0F0C0',
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginTop: 12,
            }}>
            <Text>10 - 15 phút • 2 km | Bắc Kạn</Text>
          </View>
        </View>

        <Text
          style={{
            marginTop: 10,
            marginLeft: 12,
            // marginBottom: -14,
            fontSize: 19,
            fontWeight: 'bold',
          }}>
          Các sản phẩm từ {translateCategory(category)}
        </Text>
        {/* <AntDesign name='down' size={20} color='black' /> */}
        {categoryItems.map((item, index) => (
          <FoodItem key={index} item={item} />
          // <Text key={index}>123</Text>
        ))}
        {/* END: DANH SACH SAN PHAM */}
        {/* Đệm dưới */}
        <View style={{height: 60}}></View>
      </ScrollView>

      {/* Hiện ở dưới bottom */}
      <View
        // horizontal
        // showsHorizontalScrollIndicator={false}
        style={{
          flexDirection: 'row',
          // alignItems: 'center',
          backgroundColor: '#fff',
          // borderWidth: 1,
          // height: 5,
          width: '100%',
        }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categoryItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => scrollToCategory(index)}
              style={{
                paddingHorizontal: 7,
                borderRadius: 4,
                paddingVertical: 6,
                marginVertical: 10,
                marginHorizontal: 12,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: '#181818',
                borderWidth: 1,
                height: 30,
              }}>
              <Text>♥_{item?.name}_♥</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{backgroundColor: '#fff', paddingBottom: 40}}>
        {console.log('cart?.length, isCartClean', cart?.length, !isCartClean)}
        {cart?.length > 0 && (
          <View>
            {/* V3 */}
            <ScrollView style={{maxHeight: 380}}>
              {cart?.map((item, index) => (
                <View key={index}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{paddingLeft: 30, fontWeight: '600'}}>{`${
                      index + 1
                    }. ${item.name}`}</Text>
                    <Text
                      style={{
                        paddingRight: 30,
                        color: '#ee4d2d',
                        fontWeight: '600',
                      }}>
                      {item.priceBySize?.[
                        selectedSizes[item._id] || item.available_sizes[0]
                      ] ?? 'Giá không có sẵn'}

                      {/* {console.log('item, selectedSizes: ', selectedSizes)} */}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      padding: 4,
                      paddingLeft: 28,
                      paddingRight: 28,
                      marginBottom: 20,
                    }}>
                    {item.available_sizes.map((size, _index) => (
                      <TouchableOpacity
                        onPress={() => handleSizeChange(item._id, size)}
                        key={_index}
                        style={{
                          minWidth: 75,
                          maxWidth: 75,
                          minHeight: 28,
                          maxHeight: 28,
                          borderWidth: 0.5,
                          borderRadius: 12,
                          borderColor:
                            selectedSizes[item._id] === size
                              ? '#ee4d2d'
                              : 'gray',
                          backgroundColor:
                            selectedSizes[item._id] === size
                              ? '#ee4d2d'
                              : 'transparent',
                          paddingVertical: 4,
                          paddingHorizontal: 8,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color:
                              selectedSizes[item._id] === size
                                ? '#fff'
                                : '#000',
                          }}>{`Size ${size}`}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* BUTTON THÊM */}
            <Pressable
              onPress={() => {
                // toggleOverlay();
                // XÓA CART UI
                dispatch(cleanCartUI());
                console.log('selectedSizes_PRODUCTTYPE: ', selectedSizes);
                // SAVE TO STORAGE
                saveSelectedSizes(selectedSizes);

                navi.navigate('Cart', {
                  currentScreen: 'ProductTypeScreen',
                  category,
                  // selectedSizes: selectedSizes,
                });
                // console.log('selectedSizes: ', selectedSizes); //selectedSizes:  {"1UzgFTMOjSRXICcqzrjU": "S", "BuTrSYU6PuCLUG2TJAMW": "M", "JX5EYlkAuFr5Sj4UHxk3": "M"}
              }}
              style={{
                backgroundColor: '#fd5c63',
                paddingHorizontal: 10,
                paddingVertical: 10,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 20,
                marginRight: 20,
                borderRadius: '15%',
              }}>
              <Text
                style={{
                  paddingVertical: 10,
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 15,
                  fontWeight: '600',
                }}>
                Đã thêm {cart?.length} sản phẩm
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}
