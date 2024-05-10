import * as React from 'react';
import {View, Text, Image} from 'react-native';
import {useRoute} from '@react-navigation/native';

// Image slider
import {ImageSlider} from '@pembajak/react-native-image-slider-banner';

export default function DetailScreen({navigation}) {
  const route = useRoute();
  // console.log('route: ', route);

  const {item} = route?.params;

  console.log('item: ', item);
  console.log('typeof item: ', typeof item); //object

  // console.log('navigation: ', navigation);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {/* <View style={{borderWidth: 1, height: 300}}> */}
      <View
        style={{
          borderWidth: 1,
          height: 300,
          width: '100%',
          position: 'relative',
        }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5,
            backgroundColor: 'yellow',
          }}>
          <ImageSlider
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
            ]}
            autoPlay={false}
            onItemChanged={item => console.log('item', item)}
            closeIconColor='#fff'
            imageContainerStyle={{flex: 1}}
            imageStyle={{resizeMode: 'cover', height: '100%', zIndex: 1}}
          />
        </View>
      </View>

      {/* START */}
      <View style={{alignItems: 'center', overflow: 'hidden'}}>
        <View
          style={{
            zIndex: 2,
            width: 360,
            position: 'relative',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            paddingBottom: 0,
            marginBottom: -100,
            marginTop: -100,
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
            ]}
            autoPlay={true}
            timer={2000}
            caroselImageContainerStyle={{
              paddingBottom: 0,
              overflow: 'hidden',
              resizeMode: 'fill',
            }}
            showIndicator={false}
            preview={false}
          />
        </View>
      </View>
      {/* END */}

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
    </View>
  );
}
