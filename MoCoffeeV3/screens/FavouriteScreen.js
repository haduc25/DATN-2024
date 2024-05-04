import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {db, doc, getDoc} from '../firebase';

import {useRoute, useNavigation, useIsFocused} from '@react-navigation/native';
import {Ionicons, FontAwesome} from '@expo/vector-icons';

export default function FavouriteScreen({navigation}) {
  const [listItemFavorited, setListItemFavorited] = useState([]);
  const [userDataList, setUserDataList] = useState([]);

  const route = useRoute();
  const navi = useNavigation();

  // Hàm render item cho FlatList
  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navi.navigate('DetailScreen', {
          item: item.data,
          currentScreen: 'Yêu thích',
        })
      }
      style={{
        // borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,

        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: {width: 0, height: 0},
        elevation: 5,
        maxHeight: 200,
      }}>
      <View style={{padding: 14}}>
        {/* <Text>User ID: {item.userId}</Text> */}
        <Text
          numberOfLines={1}
          style={{fontSize: 16, fontWeight: '600', maxWidth: 160}}>
          {item.data.name}
        </Text>
        {console.log('item.data_FAV: ', item.data.id)}
        <Text numberOfLines={3} style={{maxWidth: 165, minWidth: 165}}>
          {item.data.description}
        </Text>
        <Text
          style={{
            color: '#ee4d2d',
            fontWeight: '600',
            fontSize: 18,
            marginTop: 10,
          }}>
          {item.data.price}
        </Text>
        <Text
          style={{
            marginTop: 5,
            borderRadius: 4,
          }}>
          {[0, 0, 0, 0, 0].map((en, i) => (
            <FontAwesome
              // key={`${food.id}-${i}`}
              key={i}
              style={{paddingHorizontal: 3}}
              // name={i < Math.floor(item.rating) ? 'star' : 'star-o'}
              name={
                i < Math.floor(item.data.ratings['average_rating'])
                  ? 'star'
                  : 'star-o'
              }
              size={15}
              color='#FFD700'
            />
          ))}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
          }}>
          {/* ADD TO CART */}
          <TouchableOpacity
            onPress={() => alert('Đã thêm sản phẩm vào giỏ hàng!')}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              backgroundColor: 'red',
              borderRadius: 20,
            }}>
            <Ionicons
              name={true ? 'cart-outline' : 'heart-outline'}
              size={24}
              color={true ? '#fff' : '#b7b7b7'}
              // color={true ? '#ff424f' : '#b7b7b7'}
            />
          </TouchableOpacity>
          <View>
            <Text>Đã bán {item.data.sold_count}</Text>
          </View>
        </View>
      </View>
      <Image
        source={{uri: item.data.featured_image[0]}}
        style={{
          width: 200,
          height: 200,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
        }}
      />
    </TouchableOpacity>
  );

  // // refresh test
  const isFocused = useIsFocused();
  // useEffect(() => {
  //   if (isFocused) {
  //     // Gọi hàm refreshData() khi màn hình được focus
  //     refreshData();
  //   }
  // }, [isFocused]);

  // const refreshData = () => {
  //   // Đặt logic làm mới dữ liệu ở đây, ví dụ: gọi API để lấy danh sách sản phẩm yêu thích mới
  //   console.log('Refreshing favourite data...');
  // };

  // UPGRADE TO AUTO FETCHING DATA FROM FIREBASE
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem('favoritedItems');
        if (data !== null) {
          const userProfile = JSON.parse(data);
          console.log('User profiles:', userProfile);
          // Gọi hàm readMultiple với danh sách userIds
          readMultiple(userProfile);
        } else {
          console.log('No user profiles found');
        }
      } catch (error) {
        console.log('Error getting document:', error);
        alert('Error getting document:', error);
      }
    };

    const readMultiple = async userIds => {
      try {
        const docRefs = userIds.map(userId => doc(db, 'MenuMoC&T', userId));
        const docSnaps = await Promise.all(
          docRefs.map(docRef => getDoc(docRef)),
        );

        const userDataList = docSnaps.map((docSnap, index) => {
          if (docSnap.exists()) {
            console.log(
              `Document data for user ${userIds[index]}:`,
              docSnap.data(),
            );
            return {userId: userIds[index], data: docSnap.data()};
          } else {
            console.log(`Document does not exist for user ${userIds[index]}`);
            return null;
          }
        });

        setUserDataList(userDataList.filter(data => data !== null));
      } catch (error) {
        console.error('Error getting documents:', error);
        alert('Error getting documents:', error);
        setUserDataList([]);
      }
    };

    if (isFocused) {
      fetchData();
      console.log('Fetching...');
    }
  }, [isFocused]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        width: '100%',
      }}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
        }}>
        <Text
          style={{
            fontSize: 26,
            fontWeight: '500',
            paddingBottom: 20,
          }}>
          Yêu thích
        </Text>
      </View>
      {/* Sử dụng FlatList để hiển thị dữ liệu người dùng */}
      {userDataList.length > 0 ? (
        <FlatList
          style={{width: '100%'}}
          data={userDataList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View
          style={{
            height: '100%',
            maxHeight: 713,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontWeight: '700', fontSize: 28}}>Opps...!</Text>
          <Text style={{fontSize: 20}}>Danh sách sản phẩm yêu thích trống</Text>
        </View>
      )}
    </View>
  );
}
