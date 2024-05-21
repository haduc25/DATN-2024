import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import MenuItem from './MenuItem';

const FoodItem = ({item}) => {
  const data = [item];

  const initialData = data.map(item => ({
    ...item,
    isShowQuantityCalculator: false,
  }));

  const [newData, setNewData] = useState(initialData); // Khai báo state và hàm cập nhật state

  console.log('Updated_FoodItem_data: ', newData);

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

  const handleHideQuantityCalculator = itemId => {
    // Tìm kiếm item trong newData và cập nhật trạng thái isShowQuantityCalculator thành false
    const updatedData = newData.map(item => {
      if (item.id === itemId) {
        return {...item, isShowQuantityCalculator: false};
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
          {newData?.map((item, subIndex) => (
            <MenuItem
              key={subIndex}
              item={item}
              handleShowQuantityCalculator={handleShowQuantityCalculator}
              handleHideQuantityCalculator={handleHideQuantityCalculator} // Truyền hàm mới xuống MenuItem
            />
          ))}
        </React.Fragment>
      ))}
    </View>
  );
};

export default FoodItem;

const styles = StyleSheet.create({});
