import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AntDesign} from '@expo/vector-icons';
import MenuItem from './MenuItem';

const FoodItem = ({item}) => {
  const data = [item];

  // console.log('\n\n =============================== \n\n');
  // console.log('FoodItem_item: ', item);
  // console.log('FoodItem_data: ', data);

  const newData = data.map(item => ({
    ...item,
    isShowQuantityCalculator: false,
  }));

  // console.log('Updated_FoodItem_data: ', newData);
  // console.log('data?.length: ', data?.length);
  // console.log('item?.items?.length: ', item?.items?.length);
  // console.log('item?.items?: ', item?.items);
  // console.log('typeof item: ', typeof item);

  // return (
  //   <View>
  //     <Text>meow</Text>
  //   </View>
  // );

  const handleShowQuantityCalculator = itemId => {
    // Tìm kiếm item trong newData và cập nhật trạng thái isShowQuantityCalculator thành true
    const updatedData = newData.map(item => {
      if (item.id === itemId) {
        return {...item, isShowQuantityCalculator: true};
      }
      return item;
    });
    // Cập nhật state newData với trạng thái mới
    setNewData(updatedData);
  };

  return (
    <View>
      {newData?.map((item, index) => (
        <React.Fragment key={index}>
          <Pressable
            style={{
              margin: 10,
              marginTop: -10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {/* Title */}
            {/* <Text style={{fontSize: 19, fontWeight: 'bold'}}>{item?.name}</Text>
            <AntDesign name='down' size={20} color='black' /> */}
          </Pressable>

          {/* {console.log('FOODITEM_DATA: ', data)} */}
          {/* {item?.items?.map((item, subIndex) => ( */}

          {newData?.map((item, subIndex) => (
            <MenuItem
              key={subIndex}
              item={item}
              handleShowQuantityCalculator={handleShowQuantityCalculator}
            />
          ))}
        </React.Fragment>
      ))}
    </View>
  );
};

export default FoodItem;

const styles = StyleSheet.create({});
