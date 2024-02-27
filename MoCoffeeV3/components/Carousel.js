import {StyleSheet, Text, View, LogBox} from 'react-native';
import React from 'react';

import {SliderBox} from 'react-native-image-slider-box';

// Bỏ qua cảnh báo liên quan đến ViewPropTypes
LogBox.ignoreLogs(['ViewPropTypes will be removed from React Native']);

const Carousel = () => {
  const images = [
    'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_508,h_320,c_fill/lhnwo9ezxo7mpkpvtdcy',
    'https://c0.wallpaperflare.com/preview/390/550/388/beverage-caffeine-close-up-coffee-thumbnail.jpg',
    'https://www.crushpixel.com/big-static16/preview4/coffee-cup-with-morning-sunlight-2465397.jpg',
    'https://img.freepik.com/premium-photo/hot-latte-art-coffee-wood-table-relax-time-made-by-aiartificial-intelligence_41969-14374.jpg',
  ];
  return (
    <View>
      <SliderBox
        images={images}
        autoPlay={true}
        circleLoop={true}
        dotColor="#13274F"
        inactiveDotColor="#90A4AE"
        ImageComponentStyle={{
          borderRadius: 6,
          // width: '94%',
          width: '100%', //nếu cho lên đầu
          marginTop: 10,
        }}
      />
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({});
