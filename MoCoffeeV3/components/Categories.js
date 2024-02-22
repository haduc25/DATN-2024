import {FlatList, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

const Categories = () => {
  const items = [
    {
      id: '1',
      name: 'Giao hàng nhanh nhất',
    },
    {
      id: '2',
      name: 'Đánh giá 4.0+',
    },
    {
      id: '3',
      name: 'Ưu đãi',
    },
    {
      id: '4',
      name: 'Coffee',
    },
    {
      id: '5',
      name: 'Tea',
    },
    {
      id: '6',
      name: 'VIP PRO MAX',
    },
  ];
  return (
    <View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={items}
        renderItem={({item}) => (
          <TouchableOpacity activeOpacity={0.8} style={{marginTop: 5}}>
            <View
              style={{
                marginHorizontal: 10,
                marginVertical: 5,
                padding: 5,
                backgroundColor: '#DB7093',
                borderRadius: 4,
              }}>
              <Text
                style={{
                  paddingHorizontal: 5,
                  color: 'white',
                  fontWeight: '500',
                }}>
                {item?.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({});
