import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Animated,
  StyleSheet,
} from 'react-native';
import {useRoute} from '@react-navigation/native';

// Image slider
import {ImageSlider} from '@pembajak/react-native-image-slider-banner';

// for custom status bar
import {SafeAreaProvider} from 'react-native-safe-area-context';
import CustomStatusBar from '../components/CustomStatusBar';

// imnport DynamicHeader
import {BANNER_H} from './DynamicHeaderAnimation/constants';
import TopNavigation from './DynamicHeaderAnimation/TopNavigation';
import DummyText from './DynamicHeaderAnimation/DummyText';

// START: DynamicHeader

// END: DynamicHeader

export default function DetailScreen({}) {
  const route = useRoute();
  // console.log('route: ', route);

  const {item} = route?.params;

  // console.log('item: ', item);
  // console.log('typeof item: ', typeof item); //object

  // console.log('navigation: ', navigation);

  // START: DynamicHeader
  const scrollA = useRef(new Animated.Value(0)).current;

  const [titlePage, setTitlePage] = useState('Home');
  // END: DynamicHeader

  return (
    <View style={{flex: 1}}>
      <View>
        <TopNavigation title={titlePage} scrollA={scrollA} />
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
              </View>
            </View>
          </View>
          {/* <DummyText /> */}
          <View style={{height: 800, borderWidth: 1}}>
            <Text>{titlePage}</Text>
            <Text>{item.name}</Text>
            <Text>Giá: {item.price}.000 ₫</Text>
            <Text>Mô tả: {item.description}</Text>
            <Text>Đã bán: {item.sold_count}</Text>
            <Text>
              {item.ratings['average_rating']} / 5 Icon ngôi sao (
              {item.ratings['total_ratings']})
            </Text>
            <Text>Thời gian chuẩn bị: ~{item.preparation_time} phút</Text>
            <Text>{item.category == 'tea' ? 'Trà' : item.category}</Text>
          </View>
        </Animated.ScrollView>
      </View>
      {/*  */}
      {/* <ScrollView>
        <View>
          <Text>{item.name}</Text>
          <Text>Giá: {item.price}.000 ₫</Text>
          <Text>Mô tả: {item.description}</Text>
          <Text>Đã bán: {item.sold_count}</Text>
          <Text>
            {item.ratings['average_rating']} / 5 Icon ngôi sao (
            {item.ratings['total_ratings']})
          </Text>
          <Text>Thời gian chuẩn bị: ~{item.preparation_time} phút</Text>
          <Text>{item.category == 'tea' ? 'Trà' : item.category}</Text>
          <Text>
            Size:{' '}
            {item.available_sizes.map((size, index) => (
              <Text key={index}>
                {size}
                {index !== item.available_sizes.length - 1 && ', '}
              </Text>
            ))}
          </Text>

          <Image
            style={{width: 265, height: 180, resizeMode: 'contain'}}
            source={{
              uri: item.featured_image,
            }}
          />
        </View>
      </ScrollView> */}
      {/* <CustomStatusBar
        canGoBack={true}
        navigation={() => meow}
        heightOfTop={28}
      /> */}
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
