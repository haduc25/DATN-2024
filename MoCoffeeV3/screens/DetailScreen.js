import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Animated,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {useRoute, useNavigation, useIsFocused} from '@react-navigation/native';

// Icons
import {Ionicons} from '@expo/vector-icons';

// for custom status bar
import {SafeAreaProvider} from 'react-native-safe-area-context';
import CustomStatusBar from '../components/CustomStatusBar';

// import DynamicHeader
import {BANNER_H} from './DynamicHeaderAnimation/constants';
import TopNavigation from './DynamicHeaderAnimation/TopNavigation';
import DummyText from './DynamicHeaderAnimation/DummyText';
import {Pressable} from 'react-native';

// Redux
import {useSelector} from 'react-redux';
import {SliderBox} from 'react-native-image-slider-box';

// import for user
import {db, auth} from '../firebase';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// START: DynamicHeader

// END: DynamicHeader

export default function DetailScreen({}) {
  // heart product
  const [isFavorite, setIsFavorite] = useState(false);
  const userId = auth.currentUser.uid;

  //
  const route = useRoute();
  const {item, currentScreen} = route?.params;
  console.log('DETAIL_item: ', item);
  console.log('currentScreen: ', currentScreen);

  const isFocused = useIsFocused();

  // auth - user
  console.log('user-auth: ', userId);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        let itemId = item.id || item._id;
        console.log('itemId_DETAIL1: ', item);
        console.log('itemId_DETAIL2: ', itemId);
        getFavoritedItems2(itemId);
      } catch (error) {
        console.log('Error checking favorite:', error);
      }
    };
    checkFavorite();
    console.log('run to here1');
  }, [item.id, userId, isFavorite, currentScreen, isFocused]);

  // useEffect(() => {
  //   const checkFavorite = async () => {
  //     try {
  //       const docSnap = await getDoc(doc(db, 'Users', userId));
  //       if (docSnap.exists()) {
  //         const userData = docSnap.data();
  //         if (userData.itemFavorited.includes(item.id)) {
  //           setIsFavorite(true);
  //           console.log('maybe true: ', isFavorite);
  //         } else {
  //           setIsFavorite(false);
  //           console.log('cmn dell on roi: ', isFavorite);
  //         }
  //       }
  //       console.log('user id:', userId);
  //       console.log('product id:', item.id);
  //     } catch (error) {
  //       console.log('Error checking favorite:', error);
  //     }
  //   };
  //   checkFavorite();
  // }, [item.id, userId]);

  // ############# START: AsyncStorage #############
  const getAllKeys = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log('All keys:', keys);
      // Điều gì đó với keys
    } catch (error) {
      console.error('Error getting all keys:', error);
    }
  };

  const getFavoritedItems = async () => {
    try {
      const favoritedItems = await AsyncStorage.getItem('favoritedItems');
      if (favoritedItems !== null) {
        console.log('Favorited items:', favoritedItems);
        // Xử lý dữ liệu favoritedItems ở đây
      } else {
        console.log('No favorited items found');
      }
    } catch (error) {
      console.error('Error getting favorited items:', error);
    }
  };

  const getFavoritedItems2 = async itemId => {
    try {
      const favoritedItems = await AsyncStorage.getItem('favoritedItems');
      if (favoritedItems !== null) {
        // Chuyển đổi dữ liệu favoritedItems từ JSON string sang mảng JavaScript
        const parsedFavoritedItems = JSON.parse(favoritedItems);
        // Kiểm tra xem id của sản phẩm có trong mảng favoritedItems hay không
        const isFavorited = parsedFavoritedItems.includes(itemId);
        console.log(
          'Giá trị bên trong (getFavoritedItems2) - Is favorited:',
          isFavorited,
          parsedFavoritedItems,
        );
        console.log('\n\n===================\n\n');
        console.log('Giá trị hiện tại của <3: ', isFavorite);
        setIsFavorite(isFavorited);
        // Trả về giá trị isFavorited
        return isFavorited;
      } else {
        console.log('No favorited items found');
        return false; // Trả về false nếu không có sản phẩm nào được yêu thích
      }
    } catch (error) {
      console.error('Error getting favorited items:', error);
      return false; // Trả về false nếu có lỗi xảy ra
    }
  };

  const addItemToFavoritedItems = async itemId => {
    try {
      // Lấy danh sách favoritedItems từ AsyncStorage
      let favoritedItems = await AsyncStorage.getItem('favoritedItems');

      // Nếu danh sách không tồn tại, tạo một mảng mới
      if (favoritedItems === null) {
        favoritedItems = [];
      } else {
        // Chuyển đổi danh sách từ JSON string thành mảng JavaScript
        favoritedItems = JSON.parse(favoritedItems);
      }

      // Kiểm tra xem id đã tồn tại trong danh sách favoritedItems hay không
      if (!favoritedItems.includes(itemId)) {
        // Nếu không tồn tại, thêm id vào danh sách
        favoritedItems.push(itemId);

        // Lưu mảng mới vào AsyncStorage
        await AsyncStorage.setItem(
          'favoritedItems',
          JSON.stringify(favoritedItems),
        );

        console.log('Item added to favoritedItems:', itemId);
        setIsFavorite(true);
      } else {
        // Nếu đã tồn tại, loại bỏ id khỏi danh sách
        favoritedItems = favoritedItems.filter(id => id !== itemId);

        // Lưu mảng mới vào AsyncStorage
        await AsyncStorage.setItem(
          'favoritedItems',
          JSON.stringify(favoritedItems),
        );

        console.log('Item removed from favoritedItems:', itemId);
        setIsFavorite(false);
      }

      // Update to DB (CẦM THẰNG NÀY VỨT LÊN DB LÀ MỌI CHUYỆN ĐC GIẢI QUYẾT)
      console.log('DETAIL_ favoritedItems: ', favoritedItems);
      // UPDATE DÂT FROM `ASYNCSTORAGE` TO `FIREBASE`

      updateDoc(doc(db, 'Users', userId), {
        itemFavorited: favoritedItems,
      })
        .then(() => {
          // Data create successfully!
          console.log('Data updated');
        })
        .catch(error => {
          alert('error: ', error);
        });
    } catch (error) {
      console.error('Error updating favoritedItems:', error);
    }
  };
  // ############# END: AsyncStorage #############

  // // Read from firebase
  // const read = async () => {
  //   try {
  //     const docSnap = await getDoc(doc(db, 'Users', userId));
  //     if (docSnap.exists()) {
  //       console.log('Document data:', docSnap.data());
  //       // setUserData(docSnap.data());
  //       console.log('data: ', docSnap.data());
  //     } else {
  //       console.log('Document does not exist');
  //       alert('Document does not exist');
  //       // setUserData(null);
  //     }
  //   } catch (error) {
  //     console.log('Error getting document:', error);
  //     alert('Error getting document:', error);
  //     // setUserData(null);
  //   }
  // };
  // // read();

  // const update = () => {
  //   // summit data
  //   // LA: id of docs
  //   updateDoc(doc(db, 'users', '1Z3PJNDlVQLDEETfacjV'), {
  //     cat: ['meomeow', 'mèo méo meo mèo meo'],
  //   })
  //     .then(() => {
  //       // Data create successfully!
  //       console.log('Data created');
  //       alert('Data updated');
  //     })
  //     .catch(error => {
  //       console.log('error: ', error);
  //       alert('error: ', error);
  //     });
  // };

  // // update();

  // redux
  const productInfo = useSelector(state => state.productInfo);
  // console.log('DATA FROM REDUX: ', productInfo); // Hiển thị thông tin sản phẩm từ Redux trong console

  // const route = useRoute();
  const navi = useNavigation();
  // console.log('route: ', route);
  // console.log('Detail-navi: ', navi);
  // console.log('Detail-navi.getParent(): ', navi.getState());
  // const {item} = route?.params;

  // console.log('DetailScreen_item: ', item);
  // console.log('DetailScreen_item-id: ', item.id);
  // console.log('typeof item: ', typeof item); //object

  // console.log('navigation: ', navigation);

  // START: DynamicHeader
  const scrollA = useRef(new Animated.Value(0)).current;

  // const [titlePage, setTitlePage] = useState(item.name);
  // END: DynamicHeader

  // Size: active
  const [activeSize, setActiveSize] = useState(item.available_sizes[0]); //mặc định là `active` size đầu tiên
  const [sizeSelected, setSizeSelected] = useState(false);

  const handleSizeSelect = size => {
    if (!sizeSelected || activeSize !== size) {
      setActiveSize(size);
      setSizeSelected(true);
      // console.log('set này');
      // Xử lý logic khi kích thước được chọn
    } else {
      // console.log('k sét');
    }
  };

  // return (
  //   <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
  //     <Text
  //       onPress={() =>
  //         navi.navigate('ProductTypeScreen', {
  //           name: productInfo.name,
  //           category: productInfo.category,
  //         })
  //       }
  //       style={{fontSize: 26, fontWeight: 'bold'}}>
  //       Detail Screen
  //     </Text>
  //   </View>
  // );

  const toggleFavorite = () => {
    let itemId = item.id || item._id;
    // setIsFavorite(!isFavorite);
    addItemToFavoritedItems(itemId);
  };

  //
  // const imagesSlider = [
  //   item.featured_image[0],
  //   'https://scontent.fhan15-1.fna.fbcdn.net/v/t39.30808-6/237037430_1178782892533825_3904563212716546943_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=chAgwQH2-esAX_0pN9J&_nc_ht=scontent.fhan15-1.fna&oh=00_AfAxMSUXfwqTfK6Ia3j-RJ3F8cjug74wu45wHhMveckI1Q&oe=65EE4A8F',
  //   'https://www.crane-tea.com/wp-content/uploads/2021/07/HONG-TRA-CHANH.jpg',
  //   'https://quangon.vn/resources/2020/04/22/cach-pha-tra-chanh-leo-3.jpg',
  // ];

  console.log('currentScreen: ', currentScreen);
  console.log('productInfo.name: ', productInfo.name);
  console.log('productInfo.category: ', productInfo.category);

  return (
    <View style={{flex: 1}}>
      <View style={{position: 'relative'}}>
        <TopNavigation title={item.name} scrollA={scrollA} />
        <Animated.ScrollView
          // onScroll={e => console.log(e.nativeEvent.contentOffset.y)}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollA}}}],
            {useNativeDriver: true},
          )}
          scrollEventThrottle={16}>
          {/* <View style={styles.bannerContainer}> */}
          <View>
            {/* START */}
            <View
              style={[
                {
                  alignItems: 'center',
                  overflow: 'hidden',
                  height: 500,
                },
              ]}>
              <SliderBox
                // images={imagesSlider}
                images={item.featured_image}
                dotColor={'brown'}
                inactiveDotColor={'lightblue'}
                sliderBoxHeight={'100%'}
                onCurrentImagePressed={index =>
                  console.warn(`Image at index ${index} pressed`)
                }
                ImageComponentStyle={{}}
                circleLoop={true} // Kích hoạt chuyển đổi tròn tròn, tạo hiệu ứng vòng lặp
                autoplay={false} // Tự động chuyển đổi giữa các hình ảnh
                imageLoadingColor='#E91E63'
                autoplayInterval={100}
              />
            </View>
          </View>
          {/* <DummyText /> */}
          <View
            style={{
              // height: 1000,
              minHeight: 800,
              // borderWidth: 1,
              padding: 10,
            }}>
            <View
              style={{
                marginBottom: 10,
                // borderWidth: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 22,
                  fontWeight: '500',
                  maxWidth: 270,
                }}>
                {item.name}
              </Text>
              {/* START: HEART ICON */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity onPress={toggleFavorite} style={{}}>
                  <View>
                    <Ionicons
                      name={isFavorite ? 'heart' : 'heart-outline'}
                      size={26}
                      // color={isFavorite ? 'red' : '#b7b7b7'}
                      color={isFavorite ? '#ff424f' : '#b7b7b7'}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={{paddingLeft: 10}}>Đã thích ({item.likes}k)</Text>
              </View>
              {/* END: HEART ICON */}
            </View>

            <Text style={{fontSize: 16, marginBottom: 8}}>
              {item.description}
            </Text>
            {/* START: RATING */}
            <Text
              style={{
                fontSize: 16,
                marginBottom: 8,
              }}>
              <View style={{paddingRight: 8}}>
                {/* <Ionicons name='ios-star' size={15} color='#FFD700' /> */}
                <Ionicons name='ios-star' size={15} color='#e5c100' />
              </View>
              <Text style={{fontWeight: '600'}}>
                {item.ratings['average_rating']}
              </Text>
              <Text style={{fontSize: 12}}>
                ({item.ratings['total_ratings']})
              </Text>
              <Text style={{fontSize: 16, marginBottom: 8}}>
                {' '}
                | {item.sold_count} đã bán
              </Text>
            </Text>
            {/* END: RATING */}

            <Text style={{fontSize: 20, marginBottom: 8}}>
              {/* Giá bán:{' '} */}
              <Text style={{color: '#ee4d2d', fontWeight: '600'}}>
                {item.price}
              </Text>
            </Text>
            {/* <Text style={{fontSize: 16, marginBottom: 8}}>
              Thời gian chuẩn bị: ~{item.preparation_time} phút
            </Text> */}
            {/* <Text style={{fontSize: 16, marginBottom: 8}}>
              {item.category == 'tea' ? 'Trà' : item.category}
            </Text> */}
            {/* <Text>
              Size{' '}
              {item.available_sizes.map((size, index) => (
                <Text key={index}>
                  {size}
                  {index !== item.available_sizes.length - 1 && ', '}
                </Text>
              ))}
            </Text> */}
            {/* Size */}
            <View>
              <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 5}}>
                Size
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {item.available_sizes.map((size, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 46,
                      backgroundColor:
                        activeSize === size ? 'transparent' : '#ccc',
                      borderRadius: 12,
                      marginRight: 10,
                      marginBottom: 10,
                      borderColor:
                        activeSize === size ? '#6E5532' : 'transparent',
                      borderWidth: 1,
                    }}
                    onPress={() => handleSizeSelect(size)}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: activeSize === size ? '#6E5532' : 'black',
                      }}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {/* Số lượng (có khi cứ thêm vào rooif chinhr sl owr cart)*/}
            {/* <View>
              <Text>
                Số lượng
                <Text>+</Text>
                <Text>6</Text>
                <Text>-</Text>
              </Text>
            </View> */}
            {/* START: Line split component */}
            <View
              style={{
                alignItems: 'center',
                height: 1,
                width: '100%',
                // backgroundColor: '#6E5532',
                backgroundColor: '#ccc',
                marginVertical: 40,
              }}
            />
            {/* END: Line split component */}

            {/* Comment */}
            {/* <Text style={{fontSize: 16, marginBottom: 8}}>Bình luận</Text> */}
            <Text style={{fontSize: 16, marginBottom: 20}}>Nhận xét</Text>
            <View style={{alignItems: 'center', paddingTop: 20}}>
              <Image
                style={{height: 100, width: 100}}
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/11449/11449811.png',
                }}
              />
            </View>
            <View style={{alignItems: 'center', paddingTop: 10}}>
              <Text>Chưa có đánh giá</Text>
              <Text
                style={{
                  paddingTop: 10,
                  paddingBottom: 40,
                  textAlign: 'center',
                }}>
                Chia sẻ trải nghiệm đặt hàng của bạn với mọi người nhé!
              </Text>
              <TouchableOpacity
                onPress={getAllKeys}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 46,
                  // backgroundColor: activeSize === size ? 'transparent' : '#ccc',
                  backgroundColor: 'transparent',
                  borderRadius: 12,
                  marginRight: 10,
                  marginBottom: 10,
                  // borderColor: activeSize === size ? '#6E5532' : 'transparent',
                  borderColor: '#6E5532',
                  borderWidth: 1,
                  alignItems: 'center',
                  width: 200,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#6E5532',
                  }}>
                  Đặt món ngay
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={getFavoritedItems2}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 46,
                  // backgroundColor: activeSize === size ? 'transparent' : '#ccc',
                  backgroundColor: 'transparent',
                  borderRadius: 12,
                  marginRight: 10,
                  marginBottom: 10,
                  // borderColor: activeSize === size ? '#6E5532' : 'transparent',
                  borderColor: '#6E5532',
                  borderWidth: 1,
                  alignItems: 'center',
                  width: 200,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#6E5532',
                  }}>
                  Đặt món ngay2
                </Text>
              </TouchableOpacity> */}

              {/* ĐỆM DƯỚI  */}
              <View
                style={{
                  // backgroundColor: 'red',
                  height: 180,
                  width: '100%',
                }}></View>
            </View>
          </View>
        </Animated.ScrollView>
      </View>
      {/*  */}
      {/* <ScrollView>
        <View>

        </View>
      </ScrollView> */}
      {/* <CustomStatusBar
        canGoBack={true}
        navigation={() => meow}
        heightOfTop={28}
      /> */}

      <CustomStatusBar
        arrowIconBackgroundColor={'transparent'}
        canGoBack={true}
        heightOfTop={28}
        // onPressBack={data => console.log(data)}
        dataNavigation={{
          screen: currentScreen,
          name: productInfo.name,
          category: productInfo.category,
        }}
      />

      {/* Button Order */}
      <View
        style={{
          // paddingVertical: 25,
          // height: 50,
          // width: 100,
          paddingBottom: 40,
          backgroundColor: 'transparent',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        <Pressable
          // onPress={() => navi.canGoBack() && navi.goBack()}
          // onPress={() => console.log('Detail Navi: ', navi.getState())}
          onPress={() =>
            // console.log('detail_Navi: ', navi.getState().history[1])
            // console.log('detail_Navi: ', navi.getState().history[0])
            // navi.navigate('ProductTypeScreen', {
            //   name: productInfo.name,
            //   category: productInfo.category,
            // })

            alert(123)
          }
          style={{
            // backgroundColor: '#fd5c63',
            // backgroundColor: 'lightblue',
            backgroundColor: '#7EC7E7',
            paddingHorizontal: 10,
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 20,
            marginRight: 20,
            borderRadius: '15%',
            zIndex: 999,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                paddingVertical: 10,
                textAlign: 'center',
                color: 'white',
                fontSize: 15,
                fontWeight: 'bold',
                paddingRight: 20,
              }}>
              {item.price} | Giao hàng ngay
            </Text>
            <Image
              style={{width: 40, height: 40}}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/9561/9561688.png',
              }}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = {
  bannerContainer: {
    // marginTop: -1000,
    // paddingTop: 1000,
    alignItems: 'center',
    overflow: 'hidden',
  },
  banner: scrollA => ({
    height: BANNER_H,
    width: '200%',
    transform: [
      {
        translateY: scrollA.interpolate({
          inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
          outputRange: [-BANNER_H / 2, 0, BANNER_H * 0.75, BANNER_H * 0.75],
        }),
      },
      {
        scale: scrollA.interpolate({
          inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
          outputRange: [2, 1, 0.5, 0.5],
        }),
      },
    ],
  }),
};
