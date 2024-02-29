import React, {useState, useEffect} from 'react';
import {View, Text, FlatList} from 'react-native';
import {collection, query, where, getDocs} from 'firebase/firestore';
import {db} from '../firebase';

const GetItemsTea = () => {
  const [teaItems, setTeaItems] = useState([]);

  useEffect(() => {
    const fetchTeaItems = async () => {
      try {
        const q = query(
          collection(db, 'MenuMoC&T'),
          where('category', '==', 'tea'), // Đảm bảo chuỗi so sánh là 'tea' hoặc 'Tea'
        );
        const querySnapshot = await getDocs(q);
        const teaItemsData = [];
        querySnapshot.forEach(doc => {
          teaItemsData.push({id: doc.id, ...doc.data()});
        });
        console.log('Tea Items Data:', teaItemsData);
        setTeaItems(teaItemsData); // Cập nhật state với dữ liệu đã lấy được
      } catch (error) {
        console.error('Error fetching tea items:', error);
      }
    };

    fetchTeaItems();
  }, []);

  return (
    <View>
      <Text>Tea Items</Text>
      <FlatList
        data={teaItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View>
            <Text>{item.name}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default GetItemsTea;
