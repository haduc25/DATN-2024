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
} from 'firebase/firestore';
// Import `db` từ file firebase.js
import {db} from '../firebase';

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [productsData, setProductsData] = useState([]);

  const read = async () => {
    try {
      const docSnap = await getDoc(
        doc(db, 'CoffeeTeaMenu', 'D4rhPpTw0VRSKEERLAp6'),
      );
      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
        // setUserData(docSnap.data());
      } else {
        console.log('Document does not exist');
        alert('Document does not exist');
        // setUserData(null);
      }
    } catch (error) {
      console.log('Error getting document:', error);
      alert('Error getting document:', error);
      // setUserData(null);
    }
  };

  // // Hàm lấy dữ liệu sản phẩm từ Firestore
  // const readAllIds = async () => {
  //   try {
  //     const querySnapshot = await getDocs(collection(db, 'CoffeeTeaMenu'));
  //     querySnapshot.forEach(doc => {
  //       console.log('Document ID:', doc.id);
  //       // Tại đây, bạn có thể thực hiện các thao tác khác với ID nếu cần
  //     });
  //   } catch (error) {
  //     console.error('Error getting documents: ', error);
  //     alert('Error getting documents: ', error);
  //   }
  // };
  const readAllIds = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'CoffeeTeaMenu'));
      const data = [];
      querySnapshot.forEach(doc => {
        data.push(doc.data());
      });
      setProductsData(data);
    } catch (error) {
      console.error('Error getting documents: ', error);
      alert('Error getting documents: ', error);
    }
  };

  useEffect(() => {
    // getProductsData(); // Gọi hàm lấy dữ liệu sản phẩm khi component được render
    // read();
    readAllIds();
  }, []);

  // Hàm tìm kiếm sản phẩm
  // Hàm tìm kiếm sản phẩm
  // Hàm tìm kiếm sản phẩm
  const handleSearch = () => {
    const results = productsData.filter(
      item =>
        item.drink_type &&
        item.drink_type.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setSearchResults(results);
  };

  // console.log('dữ liệu trong `productsData`: ', productsData);
  return (
    <View>
      <TextInput
        placeholder="Nhập từ khóa tìm kiếm..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{borderWidth: 1, padding: 10}}
      />
      <Button title="Tìm kiếm" onPress={handleSearch} />
      <FlatList
        style={{borderWidth: 1}}
        data={searchResults}
        keyExtractor={item => item.id} // Đảm bảo rằng mỗi sản phẩm có một id để định danh duy nhất
        renderItem={({item}) => (
          <View>
            <Text>{item.drink_type}</Text>
            <Text>{item.drink_description}</Text>
            <Image
              style={{width: 300, height: 300}}
              source={{uri: item?.featured_image}}
            />
            {/* Hiển thị các thông tin khác của mỗi sản phẩm */}
          </View>
        )}
      />
    </View>
  );
};

export default SearchComponent;
