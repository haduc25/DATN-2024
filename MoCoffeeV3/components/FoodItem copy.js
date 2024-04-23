import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AntDesign} from '@expo/vector-icons';
import MenuItem from './MenuItem';

const FoodItem = ({item}) => {
  const data = [item];

  console.log('\n\n =============================== \n\n');
  console.log('item: ', item);
  console.log('data: ', data);
  console.log('data?.length: ', data?.length);
  console.log('item?.items?.length: ', item?.items?.length);
  console.log('item?.items?: ', item?.items);
  console.log('typeof item: ', typeof item);

  // return (
  //   <View>
  //     <Text>meow</Text>
  //   </View>
  // );
  return (
    <View>
      {data?.map((item, index) => (
        <React.Fragment key={index}>
          <Pressable
            style={{
              margin: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {/* Title */}
            <Text style={{fontSize: 19, fontWeight: 'bold'}}>
              {/* {item?.name} ({item?.items?.length}) */}
              {item?.name} ({data?.length})
            </Text>
            <AntDesign name='down' size={20} color='black' />
          </Pressable>

          {/* {item?.items?.map((item, subIndex) => ( */}
          {data?.map((item, subIndex) => (
            <MenuItem key={subIndex} item={item} />
          ))}
        </React.Fragment>
      ))}
    </View>
  );
};

export default FoodItem;

const styles = StyleSheet.create({});
