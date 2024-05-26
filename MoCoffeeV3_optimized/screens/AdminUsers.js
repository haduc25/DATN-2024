import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import CustomStatusBar from '../components/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {db, getDocs, collection, deleteDoc, doc} from '../firebase';

import {useNavigation, useIsFocused} from '@react-navigation/native';
import {translateRole} from '../utils/globalHelpers';

// TOAST MESSAGE
import Toast from 'react-native-toast-message';
import {toastConfigMessage} from '../utils/globalCustomStyle';

export default function AdminUsers({navigation}) {
  const renderItem = ({item, index}) => (
    <TouchableOpacity
      key={item?.id | index}
      style={{
        width: 395,
        minHeight: 200,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,

        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
        marginBottom: index === products.length - 1 ? 120 : 8,
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
              {item?.displayName}
            </Text>
            {/* desc */}
            <Text
              numberOfLines={1}
              style={{
                color: 'gray',
                fontWeight: '600',
                maxWidth: 245,
                minWidth: 245,
              }}>
              Email: {item?.email}
            </Text>
            {/* desc */}
            <Text
              numberOfLines={1}
              style={{
                color: 'gray',
                fontWeight: '600',
                maxWidth: 245,
                minWidth: 245,
              }}>
              Ngày sinh: {item?.dob}
            </Text>
            {/* desc */}
            <Text
              numberOfLines={1}
              style={{
                color: 'gray',
                fontWeight: '600',
                maxWidth: 245,
                minWidth: 245,
              }}>
              Địa chỉ: {item?.location}
            </Text>
            {/* desc */}
            <Text
              numberOfLines={1}
              style={{
                color: 'gray',
                fontWeight: '600',
                maxWidth: 245,
                minWidth: 245,
              }}>
              Chức vụ: {translateRole(item?.role)}
            </Text>
          </View>
          <Image
            style={{width: 100, height: 100, borderRadius: 8}}
            source={{
              uri: item?.photoURL,
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
          backgroundColor: '#fff',
          height: 65,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}>
        <TouchableOpacity
          onPress={() =>
            navi.navigate('DetailScreen', {
              item,
              currentScreen: 'AdminProductsCRUD',
            })
          }
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
          onPress={() => navi.navigate('AdminEditItem', {thisItem: item})}
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
          onPress={() => handleRemoveItem(item?.id)}
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
    </TouchableOpacity>
  );

  // GET ITEMS FROM FIREBASE
  const [products, setProducts] = useState([]);
  const isFocused = useIsFocused();

  // ############################# START: FECTHING DATA #############################
  const readMultiple = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Users'));
      const products = [];

      querySnapshot.forEach(doc => {
        if (doc.exists()) {
          products.push({id: doc.id, ...doc.data()});
          //   console.log('Document data (USER):', doc.id, doc.data());
        } else {
          console.log('Document does not exist1:', doc.id);
        }
      });

      // Sắp xếp theo alphabet
      //   products.sort((a, b) => a.displayName.localeCompare(b.displayName));

      return products;
    } catch (error) {
      console.error('Error getting documents:', error);
      return [];
    }
  };

  const fetchData = async () => {
    try {
      const productsData = await readMultiple();
      //   console.log('productsData: ', productsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  // ############################# END: FECTHING DATA #############################

  useEffect(() => {
    if (isFocused) {
      fetchData();
      console.log('AdminProductsCRUD(DS sản phẩm)_Fetching...');
    }
  }, [isFocused]);

  // navigation
  const navi = useNavigation();

  // handle remove
  const handleRemoveItem = itemId => {
    if (itemId) {
      Alert.alert(
        'Xác nhận xóa người dùng',
        'Bạn có chắc chắn muốn xóa người dùng này? Thao tác này không thể hoàn tác.',
        [
          {
            text: 'Hủy bỏ',
            style: 'cancel',
          },
          {
            text: 'Xóa',
            style: 'destructive',
            textStyle: {
              color: 'red',
            },
            onPress: () => removeItemFromFirebase(itemId),
          },
        ],
        {cancelable: false},
      );
    }
  };

  const removeItemFromFirebase = itemId => {
    deleteDoc(doc(db, 'Users', itemId))
      .then(() => {
        console.log('Nguời dùng đã được xóa. ', itemId);
        Toast.show({
          type: 'successHigher',
          text1: 'Xóa người dùng',
          text2: `Người dùng #${itemId.slice(0, 15)} đã được xóa`,
        });
        setIsRefresh(!isRefresh);
      })
      .catch(error => {
        console.log('error: ', error);
      });
  };

  // refresh sau khi xóa sản phẩm
  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    console.log('isRefresh: ', isRefresh);
    fetchData();
  }, [isRefresh]);

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
        arrowIconColor={'#000'}
        arrowIconBackgroundColor={'#fff'}
        titleOfScreen={'Danh sách người dùng'}
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
          }}>
          {/* Chức năng SORT */}
          <ScrollView
            scrollEnabled={false}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              height: 50,
              width: '100%',
              marginTop: 8,
              borderBottomWidth: 0.5,
              borderBottomColor: '#ccc',
            }}>
            <View
              style={{
                marginLeft: 14,
                height: 40,
                minWidth: 80,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                padding: 4,
              }}>
              <Text style={{color: '#000', fontWeight: '600'}}>
                Tổng số người dùng: {products.length}
              </Text>
            </View>
          </ScrollView>
          {/* ITEMS */}
          <FlatList
            style={{width: '100%'}}
            data={products}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
      {/* BUTTON */}
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          borderColor: '#ccc', // Change this to match your border color
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}></View>
      <Toast config={toastConfigMessage} />
    </SafeAreaProvider>
  );
}
