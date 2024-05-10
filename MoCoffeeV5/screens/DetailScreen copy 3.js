import React, {useRef} from 'react';
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

// START: DynamicHeader
const DATA = [
  {id: 1},
  {id: 2},
  {id: 3},
  {id: 4},
  {id: 5},
  {id: 6},
  {id: 7},
  {id: 8},
  {id: 9},
  {id: 10},
];

const Header_Max_Height = 240;
const Header_Min_Height = 120;
const Scroll_Distance = Header_Max_Height - Header_Min_Height;

const DynamicHeader = ({value}) => {
  const animatedHeaderHeight = value.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: [Header_Max_Height, Header_Min_Height],
    extrapolate: 'clamp',
  });

  const animatedHeaderColor = value.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: ['#181D31', '#678983'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.header,
        {
          height: animatedHeaderHeight,
          backgroundColor: animatedHeaderColor,
        },
      ]}>
      {/* <Text style={styles.title}>Header Content</Text> */}
      {/* START: Image Slider*/}
      <View
        style={{
          alignItems: 'center',
          overflow: 'hidden',
          height: 200,
          borderWidth: 1,
        }}>
        <View
          style={{
            zIndex: 2,
            width: '100%',
            position: 'relative',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            paddingBottom: 0,
            // marginBottom: -100,
            // marginTop: -100,
            marginTop: -68,
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
        </View>
      </View>
      {/* END: Image Slider*/}
    </Animated.View>
  );
};
// END: DynamicHeader

export default function DetailScreen({}) {
  const route = useRoute();
  // console.log('route: ', route);

  const {item} = route?.params;

  // console.log('item: ', item);
  // console.log('typeof item: ', typeof item); //object

  // console.log('navigation: ', navigation);

  // START: DynamicHeader
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  // END: DynamicHeader

  return (
    // <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    <View style={{flex: 1}}>
      <DynamicHeader value={scrollOffsetY} />
      <ScrollView
        scrollEventThrottle={5}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollOffsetY}}}],
          {useNativeDriver: false},
        )}>
        {DATA.map(val => (
          <View key={val.id} style={styles.card}>
            <Text style={styles.subtitle}>({val.id})</Text>
          </View>
        ))}
      </ScrollView>
      {/* <CustomStatusBar
        canGoBack={true}
        navigation={() => meow}
        heightOfTop={28}
      /> */}
      <ScrollView>
        {/* START: Image Slider*/}
        <View
          style={{
            alignItems: 'center',
            overflow: 'hidden',
            height: 200,
            borderWidth: 1,
          }}>
          <View
            style={{
              zIndex: 2,
              width: '100%',
              position: 'relative',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              paddingBottom: 0,
              // marginBottom: -100,
              // marginTop: -100,
              marginTop: -68,
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
          </View>
        </View>
        {/* END: Image Slider*/}

        <Text
          onPress={() => navigation.navigate('Trang chủ')}
          style={{fontSize: 26, fontWeight: 'bold'}}>
          Detail Screen
        </Text>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 25,
  },
  title: {
    color: '#ffff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  card: {
    height: 100,
    backgroundColor: '#E6DDC4',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  subtitle: {
    color: '#181D31',
    fontWeight: 'bold',
  },
});
