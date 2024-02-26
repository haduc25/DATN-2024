import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useState} from 'react';

// Icons
import {Ionicons} from '@expo/vector-icons';
import {SimpleLineIcons} from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';

// Components
import FoodItem from '../../components/FoodItem';

// Redux
// import {useSelector} from 'react-redux';

// Navigation router
// import {useRoute} from '@react-navigation/native';

// export default function ProductType({navigation, route}) {
export default function ProductType({navigation, route}) {
  //
  //   const params = useLocalSearchParams();
  //   const router = useRouter();
  //   const cart = useSelector(state => state.cart.cart);
  //   console.log('ProductType-Cart: ', cart);

  //
  //   const route = useRoute();

  console.log('navigation: ', navigation);
  console.log('route: ', route);

  const {cat, itemId, otherParam} = route.params || {};

  // console.log('route.params: ', route.params);

  //   // Scroll View
  //   const scrollViewRef = useRef(null);
  //   const scrollAnim = useRef(new Animated.Value(0)).current;
  //   const ITEM_HEIGHT = 650;
  //   const scrollToCategory = index => {
  //     const yOffset = index * ITEM_HEIGHT;
  //     Animated.timing(scrollAnim, {
  //       toValue: yOffset,
  //       duration: 500,
  //       useNativeDriver: true,
  //     }).start();
  //     scrollViewRef.current.scrollTo({y: yOffset, animated: true});
  //   };

  return (
    <View style={{paddingTop: 40}}>
      <Text>cat: {cat}</Text>
      <Text>itemId: {itemId}</Text>
      <Text>otherParam: {otherParam}</Text>
    </View>
  );

  //   return (
  //     <>
  //       <ScrollView ref={scrollViewRef} style={{backgroundColor: 'white'}}>
  //         <View
  //           style={{
  //             marginTop: 5,
  //             flexDirection: 'row',
  //             alignItems: 'center',
  //             justifyContent: 'space-between',
  //           }}>
  //           {/* <Ionicons
  //           onPress={() => router.back()}
  //           style={{padding: 5}}
  //           name="arrow-back"
  //           size={24}
  //           color="black"
  //         /> */}
  //           <Ionicons
  //             onPress={() => router.canGoBack() && router.back()}
  //             style={{padding: 5}}
  //             name="arrow-back"
  //             size={24}
  //             color="black"
  //           />

  //           <View
  //             style={{
  //               flexDirection: 'row',
  //               alignItems: 'center',
  //               paddingHorizontal: 14,
  //               gap: 10,
  //             }}>
  //             <SimpleLineIcons name="camera" size={24} color="black" />
  //             <Ionicons name="bookmark-outline" size={24} color="black" />
  //             <MaterialCommunityIcons
  //               name="share-outline"
  //               size={24}
  //               color="black"
  //             />
  //           </View>
  //         </View>

  //         <View
  //           style={{
  //             justifyContent: 'center',
  //             alignItems: 'center',
  //             marginVertical: 12,
  //           }}>
  //           <Text style={{fontSize: 20, fontWeight: 'bold'}}>{params?.name}</Text>
  //           <Text
  //             style={{
  //               marginTop: 5,
  //               color: 'gray',
  //               fontWeight: '500',
  //               fontSize: 15,
  //             }}>
  //             {' '}
  //             {/* Bắc Kạn • Coffee & Tea • ♥ */}♥ • Coffee & Tea • ♥
  //           </Text>
  //           <View
  //             style={{
  //               flexDirection: 'row',
  //               alignItems: 'center',
  //               gap: 4,
  //               marginTop: 10,
  //             }}>
  //             <View
  //               style={{
  //                 flexDirection: 'row',
  //                 alignItems: 'center',
  //                 backgroundColor: '#006A4E',
  //                 borderRadius: 4,
  //                 paddingHorizontal: 4,
  //                 paddingVertical: 5,
  //                 gap: 4,
  //               }}>
  //               <Text style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>
  //                 {params?.aggregate_rating}
  //               </Text>
  //               <Ionicons name="ios-star" size={15} color="white" />
  //             </View>
  //             <Text style={{fontSize: 15, fontWeight: '500', marginLeft: 5}}>
  //               3.2K Đánh giá
  //             </Text>
  //           </View>
  //           <View
  //             style={{
  //               justifyContent: 'center',
  //               alignItems: 'center',
  //               backgroundColor: '#D0F0C0',
  //               borderRadius: 20,
  //               paddingHorizontal: 10,
  //               paddingVertical: 5,
  //               marginTop: 12,
  //             }}>
  //             <Text>30 - 40 phút • 6 km | Bắc Kạn</Text>
  //           </View>
  //         </View>

  //         {/* {recievedMenu?.map((item, index) => (
  //         <FoodItem key={index} item={item} />
  //       ))} */}

  //         {/* {Array.isArray(recievedMenu) &&
  //         recievedMenu.map((item, index) => (
  //           <FoodItem key={index} item={item} />
  //         ))} */}

  //         {recievedMenu.items.map((item, index) => (
  //           <FoodItem key={index} item={item} />
  //         ))}
  //       </ScrollView>

  //       {/* Hiện ở dưới bottom */}
  //       <View style={{flexDirection: 'row', backgroundColor: '#fff'}}>
  //         {/* {recievedMenu?.map((item, index) => ( */}
  //         {recievedMenu.items.map((item, index) => (
  //           <TouchableOpacity
  //             key={index}
  //             onPress={() => scrollToCategory(index)}
  //             style={{
  //               paddingHorizontal: 7,
  //               borderRadius: 4,
  //               paddingVertical: 5,
  //               marginVertical: 10,
  //               marginHorizontal: 10,
  //               alignItems: 'center',
  //               justifyContent: 'center',
  //               borderColor: '#181818',
  //               borderWidth: 1,
  //             }}>
  //             <Text>{item?.name}</Text>
  //           </TouchableOpacity>
  //         ))}
  //       </View>

  //       <View style={{backgroundColor: '#fff'}}>
  //         {cart?.length > 0 && (
  //           <Pressable
  //             onPress={() =>
  //               router.push({
  //                 pathname: '/cart',
  //                 params: {
  //                   name: params.name,
  //                 },
  //               })
  //             }
  //             style={{
  //               backgroundColor: '#fd5c63',
  //               paddingHorizontal: 10,
  //               paddingVertical: 10,
  //               justifyContent: 'center',
  //               alignItems: 'center',
  //               marginLeft: 20,
  //               marginRight: 20,
  //               borderRadius: '15%',
  //             }}>
  //             <Text
  //               style={{
  //                 paddingVertical: 10,
  //                 textAlign: 'center',
  //                 color: 'white',
  //                 fontSize: 15,
  //                 fontWeight: '600',
  //               }}>
  //               Đã thêm {cart.length} sản phẩm
  //             </Text>
  //           </Pressable>
  //         )}
  //       </View>
  //     </>
  //   );
}
