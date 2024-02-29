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
import {useSelector} from 'react-redux';

// Navigation router
import {useRoute} from '@react-navigation/native';

// export default function ProductType({navigation, route}) {
export default function ProductType({navigation}) {
  //
  //   const params = useLocalSearchParams();
  const route = useRoute();
  console.log('router123: ', route);
  const cart = useSelector(state => state.cart.cart);
  console.log('ProductType-Cart: ', cart);

  console.log('navigation: ', navigation);
  // console.log('route: ', route);

  const {name, adress, smalladress, cuisines, aggregate_rating, menu} =
    route.params || {};

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

  // return (
  //   <View style={{paddingTop: 40}}>
  //     <Text>name: {name}</Text>
  //     <Text>adress: {adress}</Text>
  //     <Text>smalladress: {smalladress}</Text>
  //     <Text>cuisines: {cuisines}</Text>
  //     <Text>aggregate_rating: {aggregate_rating}</Text>
  //     <Text>menu: {menu}</Text>
  //   </View>
  // );

  console.log('menu: ', menu);
  console.log('typeof menu: ', typeof menu);

  const recievedMenu = menu ? JSON.parse(menu) : [];

  // new
  const dataMenu = JSON.parse(menu).items;

  console.log('recievedMenu: ', recievedMenu);
  console.log('typeof recievedMenu: ', typeof recievedMenu);

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        style={{backgroundColor: 'white', paddingTop: 40}}>
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
            name="arrow-back"
            size={24}
            color="black"
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 14,
              gap: 10,
            }}>
            <SimpleLineIcons name="camera" size={24} color="black" />
            <Ionicons name="bookmark-outline" size={24} color="black" />
            <MaterialCommunityIcons
              name="share-outline"
              size={24}
              color="black"
            />
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 12,
          }}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>{name}</Text>
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
                {aggregate_rating}
              </Text>
              <Ionicons name="ios-star" size={15} color="white" />
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
            <Text>30 - 40 phút • 6 km | Bắc Kạn</Text>
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
        {dataMenu.map((item, index) => (
          <FoodItem key={index} item={item} />
          // <Text key={index}>123</Text>
        ))}
        {/* Đệm dưới */}
        <View style={{height: 40}}></View>
      </ScrollView>

      {/* Hiện ở dưới bottom */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{flexDirection: 'row', backgroundColor: '#fff'}}>
        {/* {recievedMenu?.map((item, index) => ( */}
        {/* {recievedMenu.items.map((item, index) => ( */}
        {dataMenu.map((item, index) => (
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
        ))}
      </ScrollView>

      <View style={{backgroundColor: '#fff', paddingBottom: 40}}>
        {cart?.length > 0 && (
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/cart',
                params: {
                  name: params.name,
                },
              })
            }
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
    </>
  );
}
