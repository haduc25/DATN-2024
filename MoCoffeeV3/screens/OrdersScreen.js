import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {doc, getDoc} from 'firebase/firestore';
import {db} from '../firebase';

import {useRoute, useNavigation} from '@react-navigation/native';
import {Ionicons, FontAwesome} from '@expo/vector-icons';

export default function FavouriteScreen({navigation}) {
  const [listItemFavorited, setListItemFavorited] = useState([]);
  const [userDataList, setUserDataList] = useState([]);

  const route = useRoute();
  const navi = useNavigation();

  useEffect(() => {
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

    fetchData();
  }, []); // Chỉ chạy một lần khi component được mount

  // Hàm render item cho FlatList
  const renderItem = ({item}) => (
    // <TouchableOpacity
    //   style={{
    //     // borderWidth: 1,
    //     margin: 10,
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     marginVertical: 15,

    //     backgroundColor: '#fff',
    //     borderRadius: 10,
    //     margin: 10,
    //     marginBottom: 10,
    //     shadowColor: '#000',
    //     shadowOpacity: 0.25,
    //     shadowRadius: 10,
    //     shadowOffset: {width: 0, height: 0},
    //     elevation: 5,
    //   }}>
    //   <View style={{padding: 14}}>
    //     {/* <Text>User ID: {item.userId}</Text> */}
    //     <Text
    //       numberOfLines={2}
    //       style={{fontSize: 16, fontWeight: '600', maxWidth: 180}}>
    //       {item.data.name}
    //     </Text>
    //     <Text numberOfLines={3} style={{maxWidth: 165}}>
    //       {item.data.description}
    //     </Text>
    //     <Text style={{color: '#ee4d2d', fontWeight: '600', fontSize: 18}}>
    //       {item.data.price}.000 ₫
    //     </Text>
    //     <Text>{item.data.ratings['average_rating']} sao</Text>

    //     <View>
    //       <Ionicons
    //         name={true ? 'heart' : 'heart-outline'}
    //         size={26}
    //         // color={true ? 'red' : '#b7b7b7'}
    //         color={true ? '#ff424f' : '#b7b7b7'}
    //       />
    //     </View>
    //   </View>
    //   <Image
    //     source={{uri: item.data.featured_image[0]}}
    //     style={{
    //       width: 200,
    //       height: 200,
    //       borderTopRightRadius: 10,
    //       borderBottomRightRadius: 10,
    //     }}
    //   />
    // </TouchableOpacity>
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
        <Text numberOfLines={2} style={{maxWidth: 165}}>
          {item.data.description}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // backgroundColor: 'yellow',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              marginTop: 10,
              borderRadius: 4,
              fontSize: 16,
            }}>
            SL: 1
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
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // backgroundColor: 'yellow',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              marginTop: 10,
              borderRadius: 4,
              fontSize: 16,
            }}>
            Thành tiền:{' '}
          </Text>
          <Text
            style={{
              color: '#ee4d2d',
              fontWeight: '600',
              fontSize: 18,
              marginTop: 10,
            }}>
            41.000 ₫
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 14,
            // backgroundColor: 'red',
            maxWidth: 170,
          }}>
          <View
            style={{flexDirection: 'row', maxWidth: 160, alignItems: 'center'}}>
            <Image
              style={{
                width: 23,
                height: 23,
              }}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/2769/2769388.png',
              }}
            />
            <Text style={{color: 'green', paddingLeft: 10}}>
              Đơn hàng của bạn đang được xử lý
            </Text>
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
          Đơn hàng của bạn
        </Text>
      </View>
      {/* Sử dụng FlatList để hiển thị dữ liệu người dùng */}
      <FlatList
        style={{width: '100%'}}
        data={userDataList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
