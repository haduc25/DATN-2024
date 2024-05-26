import {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useRoute, useNavigation, useIsFocused} from '@react-navigation/native';

// Icons
import {Ionicons} from '@expo/vector-icons';

// Custom status bar
import {SafeAreaProvider} from 'react-native-safe-area-context';
import CustomStatusBar from '../components/CustomStatusBar';

// import DynamicHeader
import {BANNER_H} from './DynamicHeaderAnimation/constants';
import TopNavigation from './DynamicHeaderAnimation/TopNavigation';
import {Pressable} from 'react-native';

// Redux
import {useSelector, useDispatch} from 'react-redux';
import {SliderBox} from 'react-native-image-slider-box';
import {addToCart} from '../redux/CartReducer';

// import for user
import {db, auth, doc, updateDoc} from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  convertStringToNumber,
  getAllKeyAndDataInAsyncStorage,
  getMinSizeAndPrice,
  sortSizes,
} from '../utils/globalHelpers';

// VIEW IMAGE FULL SCREEN
import ImageView from 'react-native-image-viewing';

export default function DetailScreen() {
  const [isFavorite, setIsFavorite] = useState(false);
  const userId = auth.currentUser.uid;

  const route = useRoute();
  const {item, currentScreen} = route?.params;
  const isFocused = useIsFocused();

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        let itemId = item?.id || item?._id;
        await getFavoritedItems2(itemId);
      } catch (error) {
        console.log('Error checking favorite:', error);
      }
    };
    checkFavorite();

    if (isFocused) {
      setActiveSize(minSizeAndMoney.size);
      setImagesLoaded(true);

      const timer = setTimeout(() => setImagesLoaded(false), 800);
      return () => clearTimeout(timer);
    }
  }, [item?.id, userId, isFavorite, currentScreen, isFocused]);

  // Lấy danh sách sản phẩm yêu thích từ AsyncStorage và kiểm tra xem sản phẩm hiện tại có trong danh sách không
  const getFavoritedItems2 = async itemId => {
    try {
      const favoritedItems = await AsyncStorage.getItem('favoritedItems');
      if (favoritedItems !== null) {
        const parsedFavoritedItems = JSON.parse(favoritedItems);
        const isFavorited = parsedFavoritedItems.includes(itemId);
        setIsFavorite(isFavorited);
        return isFavorited;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error getting favorited items:', error);
      return false;
    }
  };

  // Thêm hoặc xóa sản phẩm khỏi danh sách yêu thích và cập nhật lên Firebase
  const addItemToFavoritedItems = async itemId => {
    try {
      let favoritedItems = await AsyncStorage.getItem('favoritedItems');
      favoritedItems = favoritedItems ? JSON.parse(favoritedItems) : [];

      if (!favoritedItems.includes(itemId)) {
        favoritedItems.push(itemId);
        setIsFavorite(true);
      } else {
        favoritedItems = favoritedItems.filter(id => id !== itemId);
        setIsFavorite(false);
      }

      await AsyncStorage.setItem(
        'favoritedItems',
        JSON.stringify(favoritedItems),
      );
      await updateDoc(doc(db, 'Users', userId), {
        itemFavorited: favoritedItems,
      });
    } catch (error) {
      console.error('Error updating favoritedItems:', error);
    }
  };

  const productInfo = useSelector(state => state.productInfo);
  const dispatch = useDispatch();
  const navi = useNavigation();
  const scrollA = useRef(new Animated.Value(0)).current;

  const minSizeAndMoney = item?.priceBySize
    ? getMinSizeAndPrice(item?.priceBySize)
    : null;
  const [activeSize, setActiveSize] = useState(minSizeAndMoney.size);
  const [sizeSelected, setSizeSelected] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});

  const handleSizeSelect = (productId, size) => {
    if (!sizeSelected || activeSize !== size) {
      setSelectedSizes(prevState => ({...prevState, [productId]: size}));
      setActiveSize(size);
      setSizeSelected(true);
    }
  };

  const toggleFavorite = () => {
    let itemId = item?.id || item?._id;
    addItemToFavoritedItems(itemId);
  };

  const saveSelectedSizes = async selectedSizes => {
    try {
      const jsonValue = JSON.stringify(selectedSizes);
      await AsyncStorage.setItem('selectedSizes_CART', jsonValue);
    } catch (e) {
      console.error('Failed to save selected sizes.', e);
    }
  };

  const sortedSizes = sortSizes(item?.available_sizes);

  // HANDLE IMAGE FULLSCREEN
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onCurrentImagePressed = index => {
    setCurrentIndex(index);
    setImageViewVisible(true);
  };

  // LIKE COUNT
  const [likesCount, setLikesCount] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  useEffect(() => {
    // setImagesLoaded(true);
    setLikesCount(Math.floor(Math.random() * 5) + 1);
    setTotalRating(Math.floor(Math.random() * 71) + 10);
    setTotalSold(Math.floor(Math.random() * 46) + 5);
    console.log('imagesLoaded: ', imagesLoaded);
    console.log('activeSize: ', activeSize);

    // const timer = setTimeout(() => setImagesLoaded(false), 800);
    // return () => clearTimeout(timer);
  }, [item?.id]);

  // IMAGE LOADING
  const [imagesLoaded, setImagesLoaded] = useState(true);

  // handle add 2 cart
  const handleAddItemToCart = () => {
    Alert.alert(
      'Xác nhận',
      'Sản phẩm này sẽ được thêm vào giỏ hàng. Bạn có chắc chắn muốn tiếp tục?',
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'OK',
          onPress: () => {
            dispatch(addToCart(item));
            console.log('DETAIL: ', item, selectedSizes);
            console.log('selectedSizes_PRODUCTTYPE: ', selectedSizes);
            saveSelectedSizes(selectedSizes);
            alert('ĐÃ THÊM SẢN PHẨM VÀO GIỎ HÀNG');
            setTimeout(() => {
              navi.navigate('Cart', {
                currentScreen: 'DetailScreen',
                category: productInfo.category,
                item: item,
              });
            }, 3000);
          },
        },
      ],
    );
  };

  return (
    <View style={{flex: 1}}>
      <View style={{position: 'relative'}}>
        <TopNavigation title={item?.name} scrollA={scrollA} />
        <Animated.ScrollView
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollA}}}],
            {useNativeDriver: true},
          )}
          scrollEventThrottle={16}>
          <View>
            {/* Banner Slider */}
            <View style={styles.bannerContainer}>
              {imagesLoaded ? (
                <View
                  style={{
                    // backgroundColor: 'red',
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator size='large' color='#0000ff' />
                </View>
              ) : (
                <SliderBox
                  onImageLoad={() => console.log('123')}
                  disableOnPress={false}
                  images={item?.featured_image}
                  dotColor='brown'
                  inactiveDotColor='lightblue'
                  sliderBoxHeight='100%'
                  onCurrentImagePressed={onCurrentImagePressed}
                  ImageComponentStyle={{}}
                  circleLoop={true}
                  autoplay={false}
                  imageLoadingColor='#0000ff'
                  autoplayInterval={100}
                />
              )}
            </View>
            {/* )} */}
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Text numberOfLines={2} style={styles.itemName}>
                {item?.name}
              </Text>
              {/* Heart Icon */}
              <View style={styles.favoriteContainer}>
                <TouchableOpacity onPress={toggleFavorite}>
                  <Ionicons
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={26}
                    color={isFavorite ? '#ff424f' : '#b7b7b7'}
                  />
                </TouchableOpacity>
                {/* <Text style={styles.likesText}>
                  Đã thích (
                  {item?.likes === '0'
                    ? Math.floor(Math.random() * 5) + 1
                    : item?.likes}
                  k)
                </Text> */}
                {/* <Text style={styles.likesText}>Đã thích ({likesCount}k)</Text> */}
                <Text style={styles.likesText}>
                  Đã thích ({item?.likes === '0' ? likesCount : item?.likes}
                  k)
                </Text>
              </View>
            </View>
            {/* Item Price */}
            <Text style={styles.priceText}>
              <Text style={styles.priceValue}>
                {item?.priceBySize?.[activeSize] ?? 'Đang cập nhật'}
              </Text>
            </Text>
            {/* Item Description */}
            <Text style={styles.descriptionText}>{item?.description}</Text>
            {/* Item Rating */}
            <Text style={styles.ratingText}>
              <View style={styles.ratingIconContainer}>
                <Ionicons
                  name={Ionicons['ios-star'] ? 'ios-star' : 'star'}
                  size={15}
                  color='#e5c100'
                />
              </View>
              <Text style={styles.ratingValue}>
                {item?.ratings['average_rating']}
              </Text>
              <Text style={styles.totalRatings}>
                (
                {convertStringToNumber(
                  item?.ratings['total_ratings'],
                  totalRating,
                )}
                )
              </Text>
              <Text style={styles.soldCount}>
                | {convertStringToNumber(item?.sold_count, totalSold)} đã bán
              </Text>
            </Text>
            {/* Size Options */}
            <View>
              <Text style={styles.sizeTitle}>Size</Text>
              <View style={styles.sizeContainer}>
                {sortedSizes.map((size, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.sizeButton,
                      {
                        backgroundColor:
                          activeSize === size ? 'transparent' : '#ccc',
                        borderColor:
                          activeSize === size ? '#6E5532' : 'transparent',
                      },
                    ]}
                    onPress={() => handleSizeSelect(item?._id, size)}>
                    <Text
                      style={[
                        styles.sizeText,
                        {color: activeSize === size ? '#6E5532' : 'black'},
                      ]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {/* Line Split Component */}
            <View style={styles.lineSplit} />
            {/* Comments */}
            <Text style={styles.commentsTitle}>Nhận xét</Text>
            <View style={styles.noCommentsContainer}>
              <Image
                style={styles.noCommentsImage}
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/11449/11449811.png',
                }}
              />
            </View>
            <View style={styles.noCommentsTextContainer}>
              <Text>Chưa có đánh giá</Text>
              <Text style={styles.noCommentsDescription}>
                Chia sẻ trải nghiệm đặt hàng của bạn với mọi người nhé!
              </Text>
              <TouchableOpacity
                // onPress={getAllKeyAndDataInAsyncStorage}
                onPress={handleAddItemToCart}
                style={styles.orderButton}>
                <Text style={styles.orderButtonText}>Đặt món ngay</Text>
              </TouchableOpacity>
            </View>
            {/* Spacer */}
            <View style={styles.spacer} />
          </View>
        </Animated.ScrollView>
      </View>
      <CustomStatusBar
        arrowIconBackgroundColor='transparent'
        canGoBack={true}
        heightOfTop={28}
        dataNavigation={{
          screen:
            currentScreen === undefined ? 'ProductTypeScreen' : currentScreen,
          name: productInfo.name,
          category: productInfo.category,
        }}
      />
      {/* Order Button */}
      <View style={styles.orderButtonContainer}>
        <Pressable onPress={handleAddItemToCart} style={styles.orderPressable}>
          <View style={styles.orderPressableContent}>
            <Text style={styles.orderPressableText}>
              {item?.priceBySize?.[activeSize] ?? 'Đang cập nhật'} | Đặt hàng
              ngay
            </Text>
            <Image
              style={styles.orderPressableImage}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/9561/9561688.png',
              }}
            />
          </View>
        </Pressable>
      </View>

      {/* IMAGE FULL SCREEN */}
      <ImageView
        images={item?.featured_image.map(image => ({uri: image}))}
        imageIndex={currentIndex}
        visible={isImageViewVisible}
        onRequestClose={() => setImageViewVisible(false)}
      />
    </View>
  );
}

const styles = {
  bannerContainer: {
    alignItems: 'center',
    overflow: 'hidden',
    height: 500,
    // opacity: 0,
  },
  contentContainer: {
    minHeight: 800,
    padding: 10,
  },
  header: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 22,
    fontWeight: '500',
    maxWidth: 270,
  },
  favoriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesText: {
    paddingLeft: 10,
  },
  priceText: {
    fontSize: 20,
    marginBottom: 8,
  },
  priceValue: {
    color: '#ee4d2d',
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    marginBottom: 8,
  },
  ratingIconContainer: {
    paddingRight: 8,
  },
  ratingValue: {
    fontWeight: '600',
  },
  totalRatings: {
    fontSize: 12,
  },
  soldCount: {
    fontSize: 16,
    marginBottom: 8,
  },
  sizeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeButton: {
    paddingVertical: 8,
    paddingHorizontal: 46,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  sizeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  lineSplit: {
    alignItems: 'center',
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
    marginVertical: 40,
  },
  commentsTitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  noCommentsContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  noCommentsImage: {
    height: 100,
    width: 100,
  },
  noCommentsTextContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  noCommentsDescription: {
    paddingTop: 10,
    paddingBottom: 40,
    textAlign: 'center',
  },
  orderButton: {
    paddingVertical: 8,
    paddingHorizontal: 46,
    backgroundColor: 'transparent',
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
    borderColor: '#6E5532',
    borderWidth: 1,
    alignItems: 'center',
    width: 200,
  },
  orderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6E5532',
  },
  spacer: {
    height: 180,
    width: '100%',
  },
  orderButtonContainer: {
    paddingBottom: 40,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  orderPressable: {
    backgroundColor: '#7EC7E7',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    borderRadius: '15%',
    zIndex: 999,
  },
  orderPressableContent: {
    flexDirection: 'row',
  },
  orderPressableText: {
    paddingVertical: 10,
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    paddingRight: 20,
  },
  orderPressableImage: {
    width: 40,
    height: 40,
  },
};
