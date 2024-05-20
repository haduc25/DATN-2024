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
  const [keyword, setKeyword] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await readMenuData();
      setAllMenuItems(data);
      setMenuItems(data); // Hiển thị tất cả các mục ban đầu
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const filteredItems = allMenuItems.filter(
      item =>
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.description.toLowerCase().includes(keyword.toLowerCase()) ||
        item.category.toLowerCase().includes(keyword.toLowerCase()),
    );
    setMenuItems(filteredItems);
    setNoResults(filteredItems.length === 0);
  };
  const handleChangeText = text => {
    setKeyword(text);
    setNoResults(false);
  };

  return (
    <View>
      <TextInput
        placeholder='Enter keyword'
        value={keyword}
        onChangeText={text => handleChangeText(text)}
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
      />
      <Button title='Search' onPress={handleSearch} />
      {noResults ? (
        <Text>Không tìm thấy kết quả phù hợp với "{keyword}"</Text>
      ) : (
        <FlatList
          data={menuItems}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          renderItem={({item}) => (
            <View>
              <Text>
                {item.name} - {item.category}
              </Text>
              {item.featured_image && item.featured_image.length > 0 && (
                <Image
                  source={{uri: item.featured_image[0]}}
                  style={{width: 100, height: 100}}
                />
              )}
              {/* <Text>{item.description}</Text> */}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default SearchComponent;
