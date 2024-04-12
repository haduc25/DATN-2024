import React, {useEffect, useRef, useState} from 'react';
import {Animated, Text} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

const LogoLiner2 = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex(prevIndex => (prevIndex + 1) % 5); // 5 is the number of colors
    }, 3000); // Change color every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const colors = ['yellow', 'pink', 'teal', 'cyan', 'magenta'];

  return (
    <Animated.View
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <LinearGradient
        colors={[
          colors[currentColorIndex],
          colors[(currentColorIndex + 1) % 5],
        ]}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
        style={{
          width: 330,
          height: 160,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
        }}>
        <Text>123</Text>
      </LinearGradient>
    </Animated.View>
  );
};

export default LogoLiner2;
