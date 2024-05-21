import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {useState, useEffect, useRef} from 'react';
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

// Import firebase.js
import {db, collection, query, where, getDocs} from '../../firebase';

// Helper
import {translateCategory} from '../../utils/globalHelpers';

// AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

// export default function ProductType({navigation, route}) {
export default function ProductType({navigation}) {
  // Redux
  const dispatch = useDispatch();
  const isCartClean = useSelector(state => state.cart.isClean);
  const route = useRoute();
  const navi = useNavigation();
  const isFocused = useIsFocused();
  const cart = useSelector(state => state.cart.cart);

  const {name, category} = route.params || {};

  const scrollViewRef = useRef(null);
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const ITEM_HEIGHT = 650;

  const [categoryItems, setCategoryItems] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});

  useEffect(() => {
    if (isFocused) {
      fetchCategoryItems(category);
    }
  }, [category, isFocused]);

  useEffect(() => {
    setDefaultSizes(cart);
  }, [cart]);

  const fetchCategoryItems = async category => {
    try {
      const q = query(
        collection(db, 'MenuMoC&T'),
        where('category', '==', category),
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategoryItems(items);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const setDefaultSizes = cartItems => {
    const defaultSizes = {};
    cartItems.forEach(item => {
      defaultSizes[item._id] = item.available_sizes[0];
    });
    setSelectedSizes(defaultSizes);
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes(prevState => ({
      ...prevState,
      [productId]: size,
    }));
  };

  const saveSelectedSizes = async () => {
    try {
      const jsonValue = JSON.stringify(selectedSizes);
      await AsyncStorage.setItem('selectedSizes_CART', jsonValue);
    } catch (e) {
      console.error('Failed to save selected sizes.', e);
    }
  };

  const scrollToCategory = index => {
    const yOffset = index * ITEM_HEIGHT;
    Animated.timing(scrollAnim, {
      toValue: yOffset,
      duration: 500,
      useNativeDriver: true,
    }).start();
    scrollViewRef.current.scrollTo({y: yOffset, animated: true});
  };

  const handleGoBack = () => {
    if (cart?.length) {
      Alert.alert(
        'Sản phẩm chưa được thêm vào giỏ hàng',
        'Sản phẩm chưa được thêm vào giỏ hàng. Bạn có chắc chắn muốn quay lại?',
        [
          {
            text: 'Hủy',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Đồng ý',
            onPress: () => {
              dispatch(cleanCart());
              navigation.goBack();
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaProvider>
      <ScrollView ref={scrollViewRef} style={styles.scrollView}>
        <View style={styles.header}>
          <Ionicons
            // onPress={() => navigation.canGoBack() && navigation.goBack()}
            onPress={() => navigation.canGoBack() && handleGoBack()}
            style={styles.iconPadding}
            name='arrow-back'
            size={24}
            color='black'
          />
          <View style={styles.headerIcons}>
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
        <View style={styles.centerContent}>
          <Text style={styles.titleText}>
            {translateCategory(category)} ({categoryItems.length})
          </Text>
          <Text style={styles.subtitleText}>♥ • Coffee & Tea • ♥</Text>
          <View style={styles.ratingRow}>
            <View style={styles.ratingBox}>
              <Text style={styles.ratingText}>4.8</Text>
              <Ionicons
                name={Ionicons['ios-star'] ? 'ios-star' : 'star'}
                size={15}
                color='#fff'
              />
            </View>
            <Text style={styles.reviewCountText}>3.2K Đánh giá</Text>
          </View>
          <View style={styles.deliveryInfo}>
            <Text>10 - 15 phút • 2 km | Bắc Kạn</Text>
          </View>
        </View>

        <Text style={styles.productListTitle}>
          Các sản phẩm từ {translateCategory(category)}
        </Text>
        {categoryItems.map((item, index) => (
          <FoodItem key={index} item={item} />
        ))}
        <View style={styles.bottomPadding} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categoryItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => scrollToCategory(index)}
              style={styles.categoryButton}>
              <Text>♥_{item?.name}_♥</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.cartContainer}>
        {cart?.length > 0 && (
          <View>
            <ScrollView style={styles.cartScrollView}>
              {cart?.map((item, index) => (
                <View key={index}>
                  <View style={styles.cartItemRow}>
                    <Text style={styles.cartItemText}>{`${index + 1}. ${
                      item.name
                    }`}</Text>
                    <Text style={styles.cartItemPrice}>
                      {item.priceBySize?.[
                        selectedSizes[item._id] || item.available_sizes[0]
                      ] ?? 'Giá không có sẵn'}
                    </Text>
                  </View>
                  <View style={styles.sizeSelectionRow}>
                    {item.available_sizes.map((size, _index) => (
                      <TouchableOpacity
                        onPress={() => handleSizeChange(item._id, size)}
                        key={_index}
                        style={[
                          styles.sizeButton,
                          selectedSizes[item._id] === size &&
                            styles.selectedSizeButton,
                        ]}>
                        <Text
                          style={[
                            styles.sizeButtonText,
                            selectedSizes[item._id] === size &&
                              styles.selectedSizeButtonText,
                          ]}>{`Size ${size}`}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>

            <Pressable
              onPress={() => {
                // dispatch(cleanCartUI());
                saveSelectedSizes(selectedSizes);
                navi.navigate('Cart', {
                  currentScreen: 'ProductTypeScreen',
                  category,
                });
              }}
              style={styles.addToCartButton}>
              <Text style={styles.addToCartButtonText}>
                Thêm {cart?.length} sản phẩm vào giỏ hàng
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
    paddingTop: 60,
  },
  header: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconPadding: {
    padding: 5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitleText: {
    marginTop: 5,
    color: 'gray',
    fontWeight: '500',
    fontSize: 15,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006A4E',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 5,
    gap: 4,
  },
  ratingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewCountText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 5,
  },
  deliveryInfo: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D0F0C0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 12,
  },
  productListTitle: {
    marginTop: 10,
    marginLeft: 12,
    fontSize: 19,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 60,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '100%',
  },
  categoryButton: {
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
  },
  cartContainer: {
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  cartScrollView: {
    maxHeight: 380,
  },
  cartItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cartItemText: {
    paddingLeft: 30,
    fontWeight: '600',
  },
  cartItemPrice: {
    paddingRight: 30,
    color: '#ee4d2d',
    fontWeight: '600',
  },
  sizeSelectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
    paddingLeft: 28,
    paddingRight: 28,
    marginBottom: 20,
  },
  sizeButton: {
    minWidth: 75,
    maxWidth: 75,
    minHeight: 28,
    maxHeight: 28,
    borderWidth: 0.5,
    borderRadius: 12,
    borderColor: 'gray',
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSizeButton: {
    borderColor: '#ee4d2d',
    backgroundColor: '#ee4d2d',
  },
  sizeButtonText: {
    color: '#000',
  },
  selectedSizeButtonText: {
    color: '#fff',
  },
  addToCartButton: {
    backgroundColor: '#fd5c63',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 15,
  },
  addToCartButtonText: {
    paddingVertical: 10,
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});
