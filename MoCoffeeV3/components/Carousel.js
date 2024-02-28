import {StyleSheet, Text, View, LogBox} from 'react-native';
import React from 'react';

import {SliderBox} from 'react-native-image-slider-box';

// Bỏ qua cảnh báo liên quan đến ViewPropTypes
LogBox.ignoreLogs(['ViewPropTypes will be removed from React Native']);

const Carousel = () => {
  const images = [
    'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fbanner-images%2Fcafe-photo-banner-1.jpg?alt=media&token=7de07bd0-9e9d-492b-976b-f2361e6ad1a2',
    'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fbanner-images%2Fcafe-photo-banner-2.jpg?alt=media&token=1ccd6b46-0953-46eb-b87e-0892d354b4bc',
    'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fbanner-images%2Fjuice-banner-1.jpg?alt=media&token=b27e0902-4391-41b5-b313-f0c4ab1622db',
    'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fbanner-images%2Fjuice-banner-2.jpg?alt=media&token=934f71a7-d85e-439b-8572-148a80d3c30d',
    'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fbanner-images%2Fkem-banner-2.jpg?alt=media&token=70bd6615-e3a3-46fa-a57b-4a7c084cf0d9',
    'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fbanner-images%2Fmatcha-banner-1.jpg?alt=media&token=fcfa6b4e-a307-49e0-bb0c-3cdab5b4c05e',
    'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fbanner-images%2Fsmoothie-banner-1.jpg?alt=media&token=f39cba9a-e22a-4ff4-8833-f4f8ffc706e0',
    'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fbanner-images%2Fsmoothie-banner-2.jpg?alt=media&token=0d4b5b94-3321-480b-9a05-8b4b0445eb5a',
    'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fbanner-images%2Fsmoothie-banner-3.jpg?alt=media&token=f7846743-e570-4f72-9747-348fa6129f62',
    'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fbanner-images%2Fsmoothie-banner-4.jpg?alt=media&token=6dfce047-7007-4946-8ee2-2096ca9d1a3a',
    // 'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fbanner-images%2Ftea-banner-1.jpg?alt=media&token=c4228d28-3fb6-4f68-98da-c992780fbc85',
    'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fbanner-images%2Ftea-banner-2.jpg?alt=media&token=5f478c5a-76ff-4eca-897a-25d9632c5881',
    'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fbanner-images%2Ftra-sua-banner-1.jpg?alt=media&token=88f9c4cd-afb8-41a5-9ebd-609073c0f01e',
    'https://firebasestorage.googleapis.com/v0/b/mo-coffee-tea.appspot.com/o/assets%2Fbanner-images%2Ftra-sua-banner-2.jpg?alt=media&token=7362daad-e384-440e-ae39-535955b77a91',
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
          width: '94%',
          // width: '100%', //nếu cho lên đầu
          marginTop: 10,
        }}
      />
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({});
