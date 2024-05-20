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

const SearchComponent = () => {
  // const [searchQuery, setSearchQuery] = useState('');
  // const [searchResults, setSearchResults] = useState([]);
  // const [productsData, setProductsData] = useState([]);

  // const readAllIds = async () => {
  //   try {
  //     const querySnapshot = await getDocs(collection(db, 'MenuMoC&T'));
  //     const data = [];
  //     querySnapshot.forEach(doc => {
  //       const productData = doc.data();
  //       if (productData.listItems && productData.listItems.items) {
  //         data.push(...productData.listItems.items);
  //       }
  //       console.log('LOADING DATA THANH CONG: ', productData);
  //     });
  //     setProductsData(data);
  //     console.log('Data set successfully:', data); // Kiểm tra dữ liệu sau khi cập nhật
  //   } catch (error) {
  //     console.error('Error getting documents: ', error);
  //     alert('Error getting documents: ', error);
  //   }
  // };

  // useEffect(() => {
  //   readAllIds();
  // }, []);

  // // Hàm tìm kiếm sản phẩm
  // const handleSearch = () => {
  //   const results = productsData.filter(
  //     item =>
  //       item.name &&
  //       item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  //   );
  //   setSearchResults(results);
  // };

  // console.log('dữ liệu trong `productsData`: ', productsData);

  // SEARCH V2
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const searchProductByName = async productName => {
    try {
      const productsRef = collection(db, 'MenuMoC&T');
      const q = query(productsRef, where('name', '==', productName));
      const querySnapshot = await getDocs(q);

      const products = [];
      querySnapshot.forEach(doc => {
        products.push({id: doc.id, ...doc.data()});
      });

      return products;
    } catch (error) {
      console.error('Error searching products by name:', error);
      throw error;
    }
  };

  const handleSearch = async productName => {
    try {
      const products = await searchProductByName(productName);
      setSearchResults(products);
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    }
  };

  const renderItem = ({item}) => (
    <View style={{padding: 10}}>
      <Text>{item.name}</Text>
      {/* Add more details to display */}
    </View>
  );

  return (
    <View>
      <TextInput
        placeholder='Nhập từ khóa tìm kiếm...'
        value={searchKeyword}
        // onChangeText={setSearchQuery}
        onChangeText={setSearchKeyword}
        style={{borderWidth: 1, padding: 10}}
        onSubmitEditing={() => handleSearch(searchKeyword)}
      />
      <Button title='Tìm kiếm' onPress={handleSearch} />

      {/* <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Text style={styles.itemPrice}>{item.price} VND</Text>
          </View>
        )}
      /> */}
      <FlatList
        // style={{borderWidth: 1, height: 100}}
        // // data={searchResults}
        // data={results}
        // keyExtractor={item => item.id} // Đảm bảo rằng mỗi sản phẩm có một id để định danh duy nhất
        // renderItem={({item}) => (
        //   <View>
        //     <Text>{item.name}</Text>
        //     <Text>{item.description}</Text>
        //     <Text>{item.price}</Text>
        //     <Image style={{width: 300, height: 300}} />
        //   </View>
        // )}

        data={searchResults}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default SearchComponent;
