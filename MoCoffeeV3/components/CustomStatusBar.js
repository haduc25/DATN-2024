// ver4 + have can go back, navigation
import React from 'react';
import {View, StatusBar, TouchableOpacity, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

// Icons
import {Ionicons} from '@expo/vector-icons';

// navigation
import {useNavigation} from '@react-navigation/native';

const CustomStatusBar = ({
  backgroundColor = 'transparent',
  barStyle = 'dark-content',
  onPressBack,
  canGoBack = false,
  heightOfTop = 0,
  dataNavigation = null, // Thêm prop data để nhận dữ liệu từ bên ngoài
  customStyleIconBack,
  customStyleFormStatusBar,
  titleOfScreen = null,
  arrowIconColor = '#000',
  arrowIconBackgroundColor = 'rgba(110, 85, 50, .4)',
}) => {
  const insets = useSafeAreaInsets();

  // navigation
  const navi = useNavigation();

  const handlePressBack = () => {
    // Kiểm tra xem onPressBack đã được truyền vào chưa
    if (onPressBack) {
      onPressBack(dataNavigation); // Truyền dữ liệu data khi gọi hàm onPressBack
    }

    // case 1
    // let lengthOfDataNavigation = Object.keys(dataNavigation).length;
    // console.log('lengthOfDataNavigation: ', lengthOfDataNavigation);
    // if (lengthOfDataNavigation > 0) {
    //   switch (lengthOfDataNavigation) {
    //     case 1:
    //       if (dataNavigation?.screen) {
    //         console.log('only have 1 -> navigate to here and no props');
    //       }
    //       break;
    //     default:
    //       if (dataNavigation?.screen) {
    //         console.log('have many props -> navigate to here and have props');
    //       } else {
    //         console.log('dont have screen -> pls add more props is screen');
    //       }
    //   }
    // }

    // case 2: tối ưu hơn khi dùng chát GPT
    const {screen, ...otherProps} = dataNavigation;
    if (screen) {
      if (Object.keys(otherProps).length > 0) {
        // console.log('navigate to here - and have props');
        navi.navigate(screen, otherProps);
      } else {
        // console.log('navigate to here - and no props');
        navi.navigate(screen);
      }
    } else {
      console.log('pls add more props is screen');
    }
  };

  return (
    <View
      style={[
        {
          // height: insets.top + 28,
          height: insets.top + heightOfTop,
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
          borderWidth: 0,
        },
        customStyleFormStatusBar,
      ]}>
      {canGoBack && dataNavigation && (
        <Text
          style={[
            {
              overflow: 'hidden',
              color: 'white',
              marginTop: 50,
              marginLeft: -5,
              // borderWidth: 0.5,
              // backgroundColor: '#6E5532',
              backgroundColor: arrowIconBackgroundColor,
              borderRadius: 14,
            },
            customStyleIconBack,
          ]}>
          <Ionicons
            onPress={handlePressBack} // Sử dụng hàm handlePressBack thay vì alert
            style={{padding: 5}}
            name='arrow-back'
            size={26}
            color={arrowIconColor}
          />
        </Text>
      )}
      {titleOfScreen && (
        <View
          style={{
            flex: 1,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: 31,
            // borderWidth: 1,
          }}>
          <Text
            numberOfLines={1}
            style={{
              maxWidth: 250,
              fontSize: 18,
              fontWeight: '600',
              paddingTop: 24,
            }}>
            {titleOfScreen}
          </Text>
        </View>
      )}
      <StatusBar
        animated={true}
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />
    </View>
  );
};

export default CustomStatusBar;
