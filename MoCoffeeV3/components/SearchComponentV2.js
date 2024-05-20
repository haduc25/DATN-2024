import {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Octicons, Ionicons, AntDesign, FontAwesome} from '@expo/vector-icons';

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
import {getMinSizeAndPrice, translateCategory} from '../utils/globalHelpers';

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

export default function SearchComponentV2({navigation}) {
  const [keyword, setKeyword] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [isEnterToButtonSearch, setIsEnterToButtonSearch] = useState(false);

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
    setIsEnterToButtonSearch(true);
  };

  const handleChangeText = text => {
    setKeyword(text);
    setNoResults(false);
    setIsEnterToButtonSearch(false);
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: '#C0C0C0',
          paddingVertical: 8,
          paddingHorizontal: 10,
          borderRadius: 11,
          marginTop: 10,
          marginHorizontal: 10,
        }}>
        <TextInput
          value={keyword}
          onChangeText={text => handleChangeText(text)}
          placeholder='Tìm kiếm cà phê, trà sữa, nước hoa quả...'
          style={{width: 335, height: '100%'}}
        />
        <TouchableOpacity onPress={handleSearch}>
          <AntDesign name='search1' size={24} color='#E52B50' />
        </TouchableOpacity>
      </View>
      {noResults && keyword ? (
        <View
          style={{
            minHeight: 450,
            alignItems: 'center',
            paddingTop: 40,
            borderBottomColor: '#ccc',
            borderBottomWidth: 0.5,
          }}>
          <Text style={{fontSize: 18}}>
            Không tìm thấy kết quả phù hợp với "{keyword}"
          </Text>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/7465/7465563.png',
            }}
            style={{width: 180, height: 180, marginTop: 50}}
          />
        </View>
      ) : keyword && isEnterToButtonSearch ? (
        <FlatList
          data={menuItems}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={{
                paddingHorizontal: 12,
                borderBottomColor:
                  index === menuItems.length - 1 ? '#ccc' : 'transparent',
                borderBottomWidth: index === menuItems.length - 1 ? 0.5 : 0,
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 4,
                  marginTop: 16,
                  marginBottom: index === menuItems.length - 1 ? 50 : 0, // Thêm marginBottom nếu là phần tử cuối cùng
                  flexDirection: 'row',
                  shadowColor: '#333',
                  shadowOpacity: 0.23,
                  shadowRadius: 7,
                  shadowOffset: {width: 0, height: 5},
                  elevation: 5,
                }}>
                {/* IMAGE */}
                <View>
                  {item.featured_image && item.featured_image.length > 0 && (
                    <Image
                      source={{uri: item.featured_image[0]}}
                      style={{
                        width: 130,
                        height: 130,
                        borderTopLeftRadius: 4,
                        borderBottomLeftRadius: 4,
                      }}
                    />
                  )}
                </View>
                {/* INFO */}
                <View style={{paddingLeft: 10, paddingTop: 4}}>
                  <Text
                    numberOfLines={1}
                    style={{maxWidth: 230, fontSize: 15, fontWeight: '600'}}>
                    {item.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{maxWidth: 230, fontSize: 14, fontStyle: 'italic'}}>
                    {translateCategory(item.category)}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      maxWidth: 230,
                      fontSize: 14,
                      minHeight: 45,
                      maxHeight: 45,
                    }}>
                    {translateCategory(item.description)}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      maxWidth: 230,
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#ee4d2d',
                    }}>
                    {(item?.priceBySize !== undefined &&
                      item?.priceBySize !== null &&
                      getMinSizeAndPrice(item.priceBySize).price) ||
                      'Đang cập nhật giá'}
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      borderRadius: 4,
                    }}>
                    {[0, 0, 0, 0, 0].map((en, i) => (
                      <FontAwesome
                        key={i}
                        style={{paddingHorizontal: 3}}
                        name={
                          i < Math.floor(item.ratings['average_rating'])
                            ? 'star'
                            : 'star-o'
                        }
                        size={15}
                        color='#FFD700'
                      />
                    ))}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : null}
    </View>
  );
}
