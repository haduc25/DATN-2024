import React, {useState, useEffect} from 'react';
import {View, TextInput, Button, FlatList, Text, Image} from 'react-native';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  db,
  query,
  where,
} from '../firebase';

//
const readMenuData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'MenuMoC&T'));
    const menuItems = [];

    querySnapshot.forEach(doc => {
      if (doc.exists()) {
        menuItems.push({id: doc.id, ...doc.data()});
        console.log('Document data:', doc.id, doc.data());
      } else {
        console.log('Document does not exist:', doc.id);
      }
    });

    // Sắp xếp theo một trường nào đó trong đơn hàng, ví dụ: theo ngày tạo
    // menuItems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return menuItems;
  } catch (error) {
    console.error('Error getting documents:', error);
    alert('Error getting documents:', error);
    return [];
  }
};

const SearchComponent = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await readMenuData();
      setMenuItems(data);
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text>Menu</Text>
      <FlatList
        data={menuItems}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View>
            <Text>
              {item.name} - {item.category}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default SearchComponent;
