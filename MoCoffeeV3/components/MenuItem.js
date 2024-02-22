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
import {useDispatch} from 'react-redux';
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from '../redux/CartReducer';
import {useRouter} from 'expo-router';

const MenuItem = ({item}) => {
  const [additems, setAddItems] = useState(0);
  const [selected, setSelected] = useState(false);
  const dispatch = useDispatch();

  const router = useRouter();

  console.log('\n\n ================== \n\n');
  console.log('item: ', item);
  return (
    <View>
      <TouchableOpacity
        // onPress={() => alert(123)}
        // sang page `detail sp`
        onPress={() =>
          router.push({
            pathname: '/detailItem',
            // params: {
            //   id: item._id,
            //   name: item.drink_name,
            //   adress: item.adress,
            //   smalladress: item.smalladress,
            //   cuisines: item.cuisines,
            //   aggregate_rating: item.aggregate_rating,
            //   menu: menuItems,
            //   // menu: listItems,
            // },
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
            {item?.price}.000 ₫
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
                name={i < Math.floor(item.rating) ? 'star' : 'star-o'}
                size={15}
                color="#FFD700"
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
            source={{uri: item?.image}}
          />
          {selected ? (
            <Pressable
              style={{
                position: 'absolute',
                top: 95,
                left: 10,
                backgroundColor: '#fd5c63',
                flexDirection: 'row',
                paddingHorizontal: 10,
                paddingVertical: 2,
                alignItems: 'center',
                borderRadius: 5,
                minWidth: 100,
              }}>
              <Pressable
                onPress={() => {
                  if (additems == 1) {
                    dispatch(removeFromCart(item));
                    setAddItems(0);
                    setSelected(false);
                    return;
                  }
                  setAddItems(c => c - 1);
                  dispatch(decrementQuantity(item));
                }}>
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: '700',
                    color: 'white',
                    paddingHorizontal: 6,
                  }}>
                  -
                </Text>
              </Pressable>

              {/* số lượng sp */}
              <Pressable>
                <Text
                  style={{
                    color: 'white',
                    paddingHorizontal: 6,
                    fontSize: 15,
                    fontWeight: '700',
                    minWidth: 30,
                    textAlign: 'center',
                  }}>
                  {additems}
                </Text>
              </Pressable>

              {/* Dấu + */}
              <Pressable
                onPress={() => {
                  setAddItems(c => c + 1);
                  dispatch(incrementQuantity(item));
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: 'white',
                    paddingHorizontal: 6,
                  }}>
                  +
                </Text>
              </Pressable>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                setSelected(true);
                if (additems == 0) {
                  setAddItems(c => c + 1);
                }
                dispatch(addToCart(item));
              }}
              style={{
                position: 'absolute',
                top: 95,
                // left: 10,
                left: 42,
                // borderColor: '#E32636',
                // borderWidth: 1,
                flexDirection: 'row',
                // paddingHorizontal: 33,
                paddingHorizontal: 2,
                paddingVertical: 4,
                alignItems: 'center',
                backgroundColor: '#fd5c63',
                borderRadius: 5,
              }}>
              {/* Dấu + ban đầu */}
              <View>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '900',
                    color: 'white',
                    // paddingHorizontal: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 3,
                  }}>
                  +
                </Text>
              </View>
            </Pressable>
          )}
        </Pressable>
      </TouchableOpacity>
    </View>
  );
};

export default MenuItem;

const styles = StyleSheet.create({});
