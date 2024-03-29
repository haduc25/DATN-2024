import React, {useRef} from 'react';
import {View, ScrollView, Image, Animated, Text} from 'react-native';
import {BANNER_H} from './DynamicHeaderAnimation/constants';
import TopNavigation from './DynamicHeaderAnimation/TopNavigation';
import DummyText from './DynamicHeaderAnimation/DummyText';

const ImageAnimation = () => {
  const scrollA = useRef(new Animated.Value(0)).current;
  return (
    <View>
      <TopNavigation title='Home1' scrollA={scrollA} />
      <Animated.ScrollView
        // onScroll={e => console.log(e.nativeEvent.contentOffset.y)}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollA}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}>
        <View style={styles.bannerContainer}>
          <Animated.Image
            style={styles.banner(scrollA)}
            source={require('./DynamicHeaderAnimation/banner.jpg')}
          />
        </View>
        {/* <DummyText /> */}
        <View style={{height: 800, borderWidth: 1}}>
          <Text>San pham 1</Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

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

export default ImageAnimation;
