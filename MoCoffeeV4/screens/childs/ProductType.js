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
import {useRoute, useNavigation} from '@react-navigation/native';

// get data from firestore
import {collection, query, where, getDocs} from 'firebase/firestore';
// Import `db` từ file firebase.js
import {db} from '../../firebase';

// Helper
import {translateCategory} from '../../utils/globalHelpers';

// export default function ProductType({navigation, route}) {
export default function ProductType({navigation}) {
  // Redux
  const dispatch = useDispatch();
  const isCartClean = useSelector(state => state.cart.isClean);

  console.log('isCartClean_PRODUCTTYPE: ', isCartClean);

  //   const params = useLocalSearchParams();
  const route = useRoute();
  const navi = useNavigation();
  console.log('router123: ', route);
  const cart = useSelector(state => state.cart.cart);
  console.log('ProductType-Cart: ', cart);

  // product
  // const product = useSelector(state => state.productInfo); // Product_Type (product):  {"category": "coffee", "name": "Cofffe sữa đá"}
  // console.log('Product_Type (product): ', product);

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

    fetchTeaItems();
  }, [category]);

  // return (
  //   <View style={{paddingTop: 40}}>
  //     <Text>name: {name}</Text>
  //     <Text>category: {category}</Text>
  //     <View>
  //       <Text>Tea Items</Text>
  //       <FlatList
  //         data={categoryItems}
  //         keyExtractor={(item, index) => index.toString()}
  //         renderItem={({item}) => (
  //           <View>
  //             <Text>{item.name}</Text>
  //             <Text>{item.description}</Text>
  //           </View>
  //         )}
  //       />
  //     </View>
  //   </View>
  // );

  return (
    <SafeAreaProvider>
      <ScrollView
        ref={scrollViewRef}
        // style={{backgroundColor: 'white', paddingTop: 40}}>
        style={{backgroundColor: 'white', paddingTop: 60}}>
        <View
          style={{
            marginTop: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {/* <Ionicons
            onPress={() => router.back()}
            style={{padding: 5}}
            name="arrow-back"
            size={24}
            color="black"
          /> */}
          {/* <Ionicons
            onPress={() => router.canGoBack() && router.back()}
            style={{padding: 5}}
            name="arrow-back"
            size={24}
            color="black"
          /> */}
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
              <Ionicons name='ios-star' size={15} color='white' />
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
        {/* {recievedMenu?.map((item, index) => (
          <FoodItem key={index} item={item} />
        ))} */}
        {/* {Array.isArray(recievedMenu) &&
          recievedMenu.map((item, index) => (
            <FoodItem key={index} item={item} />
          ))} */}
        {/* {recievedMenu.items.map((item, index) => (
            <FoodItem key={index} item={item} />
          ))} */}
        {/* {recievedMenu.map((item, index) => (
          // <FoodItem key={index} item={item} />
          <Text key={index}>123</Text>
        ))} */}
        {/* {dataMenu.map((item, index) => (
          <FoodItem key={index} item={item} />
          // <Text key={index}>123</Text>
        ))} */}

        {/* START: DANH SACH SAN PHAM */}
        {/* <Text style={{fontSize: 19, fontWeight: 'bold'}}>{item?.name}</Text> */}
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
        <View style={{height: 40}}></View>
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
        {/* {recievedMenu?.map((item, index) => ( */}
        {/* {recievedMenu.items.map((item, index) => ( */}
        {/* {dataMenu.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => scrollToCategory(index)}
            style={{
              paddingHorizontal: 7,
              borderRadius: 4,
              paddingVertical: 6,
              marginVertical: 10,
              marginHorizontal: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: '#181818',
              borderWidth: 1,
              height: 30,
            }}>
            <Text>♥_{item?.name}_♥</Text>
          </TouchableOpacity>
        ))} */}
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
        {cart?.length > 0 && !isCartClean && (
          <Pressable
            onPress={() => {
              // XÓA CART UI
              dispatch(cleanCartUI());

              navi.navigate('Cart', {
                currentScreen: 'ProductTypeScreen',
                category,
              });
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
              Đã thêm {cart.length} sản phẩm
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaProvider>
  );
}
