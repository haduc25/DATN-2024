// import React from 'react';
// import {View, StatusBar, Text} from 'react-native';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';

// const CustomStatusBar = ({
//   backgroundColor = '#fff',
//   barStyle = 'dark-content',
// }) => {
//   const insets = useSafeAreaInsets();

//   return (
//     <View
//       style={{
//         height: insets.top,
//         backgroundColor,
//         // opacity: 0,
//       }}>
//       <StatusBar
//         animated={true}
//         backgroundColor={'transparent'}
//         barStyle={barStyle}
//         opacity={0}
//       />
//       {/* <View style={{paddingTop: 30, paddingLeft: 12}}>
//         <Text>Back</Text>
//       </View> */}
//     </View>
//   );
// };

// export default CustomStatusBar;

// // ver2
// import React from 'react';
// import {View, StatusBar} from 'react-native';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';

// const CustomStatusBar = ({
//   backgroundColor = '#fff',
//   barStyle = 'dark-content',
// }) => {
//   const insets = useSafeAreaInsets();

//   return (
//     <View
//       style={{
//         height: insets.top,
//         backgroundColor,
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         zIndex: 999, // Đảm bảo StatusBar hiển thị trên cùng
//       }}>
//       <StatusBar
//         animated={true}
//         backgroundColor={backgroundColor}
//         barStyle={barStyle}
//       />
//     </View>
//   );
// };

// export default CustomStatusBar;

// ver3
import React from 'react';
import {View, StatusBar, TouchableOpacity, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

// Icons
import {Ionicons} from '@expo/vector-icons';

const CustomStatusBar = ({
  backgroundColor = 'transparent',
  barStyle = 'dark-content',
  onPressBack,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        height: insets.top + 28,
        backgroundColor,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999, // Đảm bảo StatusBar hiển thị trên cùng
        flexDirection: 'row', // Để nút và StatusBar có thể hiển thị cùng nhau
        alignItems: 'center', // Canh giữa các thành phần theo chiều dọc
        justifyContent: 'space-between', // Canh nút quay lại về phía trái và StatusBar về phía phải
        paddingHorizontal: 10, // Khoảng cách giữa các phần tử
        // borderWidth: 1,
      }}>
      <Text
        style={{
          overflow: 'hidden',
          color: 'white',
          marginTop: 50,
          marginLeft: -5,
          // borderWidth: 0.5,
          // backgroundColor: '#6E5532',
          backgroundColor: 'rgba(110, 85, 50, .4)',
          borderRadius: 14,
        }}>
        <Ionicons
          // onPress={() => navigation.canGoBack() && navigation.goBack()}
          onPress={() => alert(123)}
          style={{padding: 5}}
          name='arrow-back'
          size={24}
          color='black'
        />
      </Text>
      <StatusBar
        animated={true}
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />
    </View>
  );
};

export default CustomStatusBar;
