// import React, {useRef} from 'react';
// import {Animated, ScrollView, StyleSheet, Text, View} from 'react-native';

// const DATA = [
//   {id: 1},
//   {id: 2},
//   {id: 3},
//   {id: 4},
//   {id: 5},
//   {id: 6},
//   {id: 7},
//   {id: 8},
//   {id: 9},
//   {id: 10},
// ];

// const Header_Max_Height = 240;
// const Header_Min_Height = 120;
// const Scroll_Distance = Header_Max_Height - Header_Min_Height;

// const DynamicHeader = ({value}) => {
//   const animatedHeaderHeight = value.interpolate({
//     inputRange: [0, Scroll_Distance],
//     outputRange: [Header_Max_Height, Header_Min_Height],
//     extrapolate: 'clamp',
//   });

//   const animatedHeaderColor = value.interpolate({
//     inputRange: [0, Scroll_Distance],
//     outputRange: ['#181D31', '#678983'],
//     extrapolate: 'clamp',
//   });

//   return (
//     <Animated.View
//       style={[
//         styles.header,
//         {
//           height: animatedHeaderHeight,
//           backgroundColor: animatedHeaderColor,
//         },
//       ]}>
//       <Text style={styles.title}>Header Content</Text>
//     </Animated.View>
//   );
// };

// const ScrollViewScreen = () => {
//   const scrollOffsetY = useRef(new Animated.Value(0)).current;
//   return (
//     <View style={{flex: 1}}>
//       <DynamicHeader value={scrollOffsetY} />
//       <ScrollView
//         scrollEventThrottle={5}
//         showsVerticalScrollIndicator={false}
//         onScroll={Animated.event(
//           [{nativeEvent: {contentOffset: {y: scrollOffsetY}}}],
//           {useNativeDriver: false},
//         )}>
//         {DATA.map(val => (
//           <View key={val.id} style={styles.card}>
//             <Text style={styles.subtitle}>({val.id})</Text>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// export default ScrollViewScreen;

// const styles = StyleSheet.create({
//   header: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingTop: 25,
//   },
//   title: {
//     color: '#ffff',
//     fontWeight: 'bold',
//     fontSize: 20,
//   },
//   card: {
//     height: 100,
//     backgroundColor: '#E6DDC4',
//     marginTop: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 10,
//   },
//   subtitle: {
//     color: '#181D31',
//     fontWeight: 'bold',
//   },
// });

// ##############################
import React, {useRef} from 'react';
import {Text, View} from 'react-native';
import ScrollViewScreen from '../components/ScrollViewScreen';

export default function DynamicHeaderScrollView({navigation, route}) {
  console.log('navigation: ', navigation);
  console.log('route: ', route);
  return (
    <View style={{flex: 1}}>
      <ScrollViewScreen />
    </View>
  );
}
