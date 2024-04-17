import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import CustomStatusBar from '../components/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Button from '../components/Button';

import {AntDesign} from '@expo/vector-icons';
import {db, getDocs, collection} from '../firebase';

import {useNavigation} from '@react-navigation/native';

export default function AdminProductsCRUD({navigation}) {
  const renderItem = ({item}) => (
    <View
      key={item._id}
      style={{
        width: 395,
        minHeight: 200,
        //   paddingHorizontal: 20,
        //   marginHorizontal: 10,

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
      <View style={{flexDirection: 'row'}}>
        {/* TOP */}
        <View
          style={{
            padding: 14,
            //   borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            //   backgroundColor: 'blue',
            backgroundColor: '#fff',
            //   height: 120,
            borderRadius: 10,
          }}>
          <View
            style={{
              // backgroundColor: 'pink',
              backgroundColor: '#fff',
              height: 120,
            }}>
            {/* product name */}
            <Text
              numberOfLines={1}
              style={{fontSize: 16, fontWeight: '600', maxWidth: 245}}>
              {item.name}
            </Text>
            {/* desc */}
            <Text
              numberOfLines={1}
              style={{
                color: 'gray',
                fontWeight: '600',
                maxWidth: 245,
              }}>
              {item.description}
            </Text>
            {/* price */}
            <Text
              style={{
                color: '#ee4d2d',
                fontWeight: '600',
                fontSize: 18,
              }}>
              {item.price}.000 ₫
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 12,
              }}>
              <View style={{flexDirection: 'row'}}>
                <AntDesign name={'tago'} size={18} style={{paddingRight: 6}} />
                <Text>Đã bán: {item.sold_count}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <AntDesign
                  name={'hearto'}
                  size={18}
                  style={{paddingRight: 6}}
                />
                <Text>Lượt thích: {item.likes}</Text>
              </View>
            </View>
          </View>
          <Image
            style={{width: 100, height: 100, borderRadius: 8}}
            source={{
              uri: 'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fproducts%2Ftemp%2Fimages.jpg?alt=media&token=378984d7-948f-4240-8c8d-f41c31ca0b12',
            }}
          />
        </View>
        {/* BOTTOM */}
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderTopColor: '#ccc',
          borderTopWidth: 0.5,

          // backgroundColor: 'red',
          backgroundColor: '#fff',
          height: 65,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            height: 45,
            width: 120,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
            borderRadius: 8,
          }}>
          <Text style={{fontWeight: '600'}}>Xem chi tiết</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            height: 45,
            width: 120,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
          }}>
          <Text style={{fontWeight: '600'}}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            height: 45,
            width: 120,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
            borderRadius: 8,
          }}>
          <Text style={{fontWeight: '600'}}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // GET ITEMS FROM FIREBASE
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const readMultiple = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'MenuMoC&T'));
        const products = [];

        querySnapshot.forEach(doc => {
          if (doc.exists()) {
            products.push({id: doc.id, ...doc.data()});
            console.log('Document data:', doc.id, doc.data());
          } else {
            console.log('Document does not exist1:', doc.id);
          }
        });

        return products;
      } catch (error) {
        console.error('Error getting documents:', error);
        alert('Error getting documents:', error);
        return [];
      }
    };

    const fetchData = async () => {
      try {
        const productsData = await readMultiple();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();

    // readMultiple()
    // const fetchData = async () => {
    //   try {
    //     const data = await AsyncStorage.getItem('favoritedItems');
    //     if (data !== null) {
    //       const userProfile = JSON.parse(data);
    //       console.log('User profiles:', userProfile);
    //       // Gọi hàm readMultiple với danh sách userIds
    //       readMultiple(userProfile);
    //     } else {
    //       console.log('No user profiles found');
    //     }
    //   } catch (error) {
    //     console.log('Error getting document:', error);
    //     alert('Error getting document:', error);
    //   }
    // };

    // fetchData();
  }, []); // Chỉ chạy một lần khi component được mount

  // navigation
  const navi = useNavigation();

  return (
    <SafeAreaProvider>
      <CustomStatusBar
        backgroundColor='#fff'
        canGoBack={true}
        heightOfTop={50}
        customStyleIconBack={{marginBottom: 20}}
        customStyleFormStatusBar={{
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 10,
          shadowOffset: {width: 0, height: 0},
          elevation: 5,
          maxHeight: 200,
        }}
        arrowIconColor={'#fff'}
        arrowIconBackgroundColor={'#6E5532'}
        titleOfScreen={'Danh sách sản phẩm'}
        onPressBack={data => console.log(data)}
        dataNavigation={{
          screen: 'AdminDashboardScreen',
        }}
      />
      <View
        style={{
          flex: 1,
          paddingTop: 100,
          backgroundColor: '#fff',
        }}>
        {/* PARENT OF THIS COMPONENT */}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            // justifyContent: 'center',
            // borderTopColor: '#ccc',
            // borderTopWidth: 0.5,
          }}>
          {/* ITEMS */}
          <FlatList
            style={{width: '100%', paddingBottom: 250}}
            data={products}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />

          {/* {products.map(product => (
            <View key={product._id}>
              <Text>{product.name}</Text>
            </View>
          ))} */}
        </View>
      </View>
      {/* BUTTON */}
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          // backgroundColor: 'yellow',
          flexDirection: 'row',
          justifyContent: 'center',
          // paddingHorizontal: 20,
          // paddingVertical: 10,
          // backgroundColor: '#fff', // Change this to match your background color
          borderColor: '#ccc', // Change this to match your border color
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}>
        {/* <TouchableOpacity
          onPress={() => navi.navigate('Trang chủ')}
          style={{
            justifyContent: 'center',
            // borderWidth: 1,
            borderRadius: '15%',
            width: '100%',
            alignItems: 'center',
            backgroundColor: '#000',
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: '600',
            }}>
            Trang chủ
          </Text>
        </TouchableOpacity> */}
        <Button
          title={'Thêm 1 sản phẩm mới'}
          onPress={() => navi.navigate('AdminCRUDItem')}
          // loading={loading.buttonLoading}
          // disabled={loading.buttonLoading}
          buttonStyleCustom={{
            borderRadius: '15%',
            paddingVertical: 16,
            backgroundColor: '#ff4c4c',
            width: '100%',
          }}
          textStyleInsideButtonCustom={{textTransform: 'uppercase'}}
        />
      </View>
    </SafeAreaProvider>
  );
}
