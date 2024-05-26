// NOI NÀY LƯU DỮ LIỆU CỦA DANH SÁCH SẢN PHẨM TỪ HOME => SẢN PHẨM
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {FontAwesome, Ionicons} from '@expo/vector-icons';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from '../redux/CartReducer';
// import {useRouter} from 'expo-router';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {getMinSizeAndPrice} from '../utils/globalHelpers';

const MenuItem = ({item}) => {
  // console.log('MenuItem_item: ', item);
  const [additems, setAddItems] = useState(0);

  const dispatch = useDispatch();
  const isCartClean = useSelector(state => state.cart.isClean);

  useEffect(() => {
    if (isCartClean) {
      // Nếu mà ấn clean thì set lại cái dữ liệu
      setAddItems(0);
    }
  }, [isCartClean]);

  // const router = useRouter();
  const navi = useNavigation();

  // console.log('\n\n ================== \n\n');
  // console.log('item_MenuItem: ', item);
  // console.log('item_priceBySize_MenuItem: ', item?.priceBySize);
  // if (item?.priceBySize !== undefined) {
  //   let minSizeAndMoney = getMinSizeAndPrice(item?.priceBySize);
  //   console.log('item_priceBySize_MenuItem__PRICE: ', minSizeAndMoney.price);
  // }
  // console.log('additems: ', additems);

  // minSizeAndMoney được xác định trước khi render JSX || LẤY RA SIZE TIỀN NHỎ NHẤT
  const minSizeAndMoney =
    item?.priceBySize !== undefined
      ? getMinSizeAndPrice(item.priceBySize)
      : null;

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
        paddingHorizontal: 6,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: {width: 0, height: 0},
        elevation: 5,
      }}>
      <TouchableOpacity
        // sang page `detail sp`
        onPress={() =>
          navi.navigate('DetailScreen', {
            item,
            currentScreen: 'ProductTypeScreen',
          })
        }
        style={{
          margin: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 15,
          // borderWidth: 1,
          // borderColor: '#000',
        }}>
        <View>
          {/* Title sp */}
          <Text style={{fontSize: 18, fontWeight: '600', width: 220}}>
            {item?.name}
          </Text>
          <Text style={{marginTop: 4, fontSize: 15, fontWeight: '500'}}>
            {minSizeAndMoney ? minSizeAndMoney.price : 'Đang cập nhật giá'}
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
                  i < Math.floor(item.ratings['average_rating'])
                    ? 'star'
                    : 'star-o'
                }
                size={15}
                color='#FFD700'
              />
            ))}
          </Text>
          <Text style={{width: 200, marginTop: 8, color: 'gray', fontSize: 16}}>
            {item?.description.length > 40
              ? item?.description.substr(0, 37) + '...'
              : item?.description}
          </Text>
        </View>

        <Pressable style={{marginRight: 10}}>
          <Image
            style={{width: 120, height: 120, borderRadius: 8}}
            source={{uri: item?.featured_image[0]}}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (additems == 0) {
                setAddItems(c => c + 1);
              }
              dispatch(addToCart(item));
            }}
            style={{
              position: 'absolute',
              top: 95,
              left: 42,
              flexDirection: 'row',
              paddingHorizontal: 2,
              paddingVertical: 4,
              alignItems: 'center',
              backgroundColor: '#fd5c63',
              borderRadius: 5,
            }}>
            {/* Dấu + */}
            <View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '900',
                  color: 'white',
                  paddingHorizontal: 12,
                  paddingVertical: 3,
                }}>
                +
              </Text>
            </View>
          </TouchableOpacity>
        </Pressable>
      </TouchableOpacity>
    </View>
  );
};

export default MenuItem;

const styles = StyleSheet.create({});
