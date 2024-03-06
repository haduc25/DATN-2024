import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';

// Icons
import {Ionicons} from '@expo/vector-icons';

// Image slider
import {ImageSlider} from '@pembajak/react-native-image-slider-banner';

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

// START: DynamicHeader

// END: DynamicHeader

export default function DetailScreen({}) {
  // redux
  const productInfo = useSelector(state => state.productInfo);
  console.log('DATA FROM REDUX: ', productInfo); // Hiển thị thông tin sản phẩm từ Redux trong console

  const route = useRoute();
  const navi = useNavigation();
  // console.log('route: ', route);
  console.log('Detail-navi: ', navi);
  console.log('Detail-navi.getParent(): ', navi.getState());
  const {item} = route?.params;

  console.log('DetailScreen_item: ', item);
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
          <View style={styles.bannerContainer}>
            {/* START */}
            {/* <Animated.View
              style={{
                zIndex: 2,
                width: '100%',
                position: 'relative',
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                paddingBottom: 0,
                // marginBottom: -100,
                // marginTop: -100,
                marginTop: -68,
                // Sử dụng animated value ở đây
                transform: [
                  {
                    translateY: scrollA.interpolate({
                      inputRange: [0, 200], // Khoảng giá trị của scrollA
                      outputRange: [0, -100], // Khoảng giá trị tương ứng với translateY
                      extrapolate: 'clamp', // Giữ cho giá trị không vượt ra khỏi khoảng inputRange
                    }),
                  },
                ],
              }}>
              <ImageSlider
                // data={imageSrc}
                data={[
                  {
                    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5a5uCP-n4teeW2SApcIqUrcQApev8ZVCJkA&usqp=CAU',
                  },
                  {
                    img: 'https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg',
                  },
                  {
                    img: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__340.jpg',
                  },
                  {
                    img: 'https://cong-news.appwifi.com/wp-content/uploads/2023/02/tra%CC%80-qua%CC%82%CC%81t-ma%CC%A3%CC%82t-ong_%C4%91a%CC%81.jpg',
                  },
                ]}
                autoPlay={true}
                timer={2000}
                caroselImageContainerStyle={{
                  paddingBottom: 0,
                  overflow: 'hidden',
                  resizeMode: 'fill',
                }}
                showIndicator={false}
                preview={true}
              />
            </Animated.View> */}
            {/* END */}
            {/* <Animated.Image
              style={styles.banner(scrollA)}
              // source={require('./DynamicHeaderAnimation/banner.jpg')}
              source={{
                uri: item.featured_image,
              }}
            /> */}
            <View
              style={[
                {
                  alignItems: 'center',
                  overflow: 'hidden',
                  height: 200,
                  borderWidth: 1,
                },
              ]}>
              {/* style={[
                {
                  alignItems: 'center',
                  overflow: 'hidden',
                  height: 200,
                  borderWidth: 1,
                },
                styles.banner(scrollA),
              ]}> */}

              {/* Start: fak */}
              {/* <Animated.View
                style={[
                  {
                    zIndex: 2,
                    width: '100%',
                    position: 'relative',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    paddingBottom: 0,
                    marginTop: -68,
                  },
                  styles.banner(scrollA),
                ]}>
                <ImageSlider
                  // data={imageSrc}
                  data={[
                    {
                      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5a5uCP-n4teeW2SApcIqUrcQApev8ZVCJkA&usqp=CAU',
                    },
                    {
                      img: 'https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg',
                    },
                    {
                      img: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__340.jpg',
                    },
                    {
                      img: 'https://cong-news.appwifi.com/wp-content/uploads/2023/02/tra%CC%80-qua%CC%82%CC%81t-ma%CC%A3%CC%82t-ong_%C4%91a%CC%81.jpg',
                    },
                  ]}
                  autoPlay={true}
                  timer={2000}
                  caroselImageContainerStyle={{
                    paddingBottom: 0,
                    overflow: 'hidden',
                    resizeMode: 'fill',
                  }}
                  showIndicator={false}
                  preview={true}
                />
              </Animated.View> */}
              <View
                style={[
                  {
                    zIndex: 2,
                    width: '100%',
                    position: 'relative',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    paddingBottom: 0,
                    marginTop: -68,
                  },
                ]}>
                <ImageSlider
                  // data={imageSrc}
                  data={[
                    {
                      img: item.featured_image[0],
                    },
                    {
                      img: 'https://i.ytimg.com/vi/NlyXpQYBS8Y/maxresdefault.jpg',
                    },
                    {
                      img: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__340.jpg',
                    },
                    {
                      img: 'https://cong-news.appwifi.com/wp-content/uploads/2023/02/tra%CC%80-qua%CC%82%CC%81t-ma%CC%A3%CC%82t-ong_%C4%91a%CC%81.jpg',
                    },
                  ]}
                  autoPlay={true}
                  timer={2000}
                  caroselImageContainerStyle={{
                    paddingBottom: 0,
                    overflow: 'hidden',
                    resizeMode: 'fill',
                  }}
                  showIndicator={false}
                  preview={true}
                />
              </View>
            </View>
          </View>
          {/* <DummyText /> */}
          <View
            style={{
              height: 1000,
              borderWidth: 1,
              padding: 10,
            }}>
            <Text style={{fontSize: 22, marginBottom: 10}}>{item.name}</Text>
            <Text style={{fontSize: 16, marginBottom: 8}}>
              Giá bán:{' '}
              <Text style={{color: 'red', fontWeight: '600'}}>
                {item.price}.000 ₫
              </Text>
            </Text>
            <Text style={{fontSize: 16, marginBottom: 8}}>
              {item.description}
            </Text>
            <Text style={{fontSize: 16, marginBottom: 8}}>
              {item.sold_count} đã bán | {item.likes} lượt thích
            </Text>
            <Text style={{fontSize: 16, marginBottom: 8}}>
              <View style={{paddingRight: 8}}>
                <Ionicons name='ios-star' size={15} color='#FFD700' />
              </View>
              <Text style={{fontWeight: '600'}}>
                {item.ratings['average_rating']}
              </Text>
              <Text style={{fontSize: 12}}>
                ({item.ratings['total_ratings']})
              </Text>
            </Text>
            <Text style={{fontSize: 16, marginBottom: 8}}>
              Thời gian chuẩn bị: ~{item.preparation_time} phút
            </Text>
            <Text style={{fontSize: 16, marginBottom: 8}}>
              {item.category == 'tea' ? 'Trà' : item.category}
            </Text>
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
            <View style={{marginBottom: 20}}>
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
            <View style={{alignItems: 'center', paddingVertical: 80}}>
              <Text>-------------------------------------------------</Text>
            </View>
            {/* Comment */}
            <Text style={{fontSize: 16, marginBottom: 8}}>Bình luận</Text>
            <View style={{alignItems: 'center', paddingTop: 50}}>
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
        canGoBack={true}
        heightOfTop={28}
        // onPressBack={data => console.log(data)}
        dataNavigation={{
          screen: 'ProductTypeScreen',
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
              20.000 đ | Giao hàng ngay
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
    marginTop: -1000,
    paddingTop: 1000,
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
