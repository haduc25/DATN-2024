import React, {useState} from 'react';
import {View, Text} from 'react-native';

// import SearchComponent from '../components/SearchComponent ';
import GetItemsTea from '../components/GetItemsTea';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {doc, getDoc} from 'firebase/firestore';
import {db} from '../firebase';

export default function FavouriteScreen({navigation}) {
  const [listItemFavorited, setListItemFavorited] = useState([]);
  const [userDataList, setUserDataList] = useState([]);

  const read = async () => {
    try {
      // Lấy dữ liệu từ AsyncStorage
      const data = await AsyncStorage.getItem('favoritedItems');

      if (data !== null) {
        // Chuyển đổi chuỗi JSON thành object
        const userProfile = JSON.parse(data);
        console.log('User profiles:', userProfile);

        // ########################## START
        const readMultiple = async userIds => {
          try {
            // Tạo mảng các tham chiếu đến các tài liệu tương ứng với userIds
            const docRefs = userIds.map(userId => doc(db, 'MenuMoC&T', userId));

            // Gửi các yêu cầu đọc đồng thời và chờ tất cả chúng được giải quyết
            const docSnaps = await Promise.all(
              docRefs.map(docRef => getDoc(docRef)),
            );

            // Xử lý kết quả từ các tài liệu đọc được
            const userDataList = docSnaps.map((docSnap, index) => {
              // Kiểm tra xem tài liệu có tồn tại hay không
              if (docSnap.exists()) {
                console.log(
                  `Document data for user ${userIds[index]}:`,
                  docSnap.data(),
                );
                // Trả về một đối tượng chứa userId và dữ liệu của tài liệu
                return {userId: userIds[index], data: docSnap.data()};
              } else {
                console.log(
                  `Document does not exist for user ${userIds[index]}`,
                );
                // Trả về null nếu tài liệu không tồn tại
                return null;
              }
            });

            // Lọc bỏ các đối tượng null khỏi mảng userDataList và cập nhật state
            setUserDataList(userDataList.filter(data => data !== null));
          } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Error getting documents:', error);
            alert('Error getting documents:', error);
            // Nếu có lỗi, đặt state userDataList thành mảng rỗng
            setUserDataList([]);
          }
        };

        // readMultiple(['NXDp8GVx5w0LCupXSYja']);

        // ########################## END

        // console.log('User profiles-id:', userProfile.currentUser._userId);

        // // READ
        // const docSnap = await getDoc(
        //   doc(db, 'Users', userProfile.currentUser._userId),
        // );
        // if (docSnap.exists()) {
        //   console.log('Document data:', docSnap.data());
        //   console.log('data: ', docSnap.data());

        //   console.log('itemFavorited: ', docSnap.data().itemFavorited);

        //   // setListItemFavorited();
        // } else {
        //   console.log('Document does not exist');
        //   alert('Document does not exist');
        //   // setUserData(null);
        // }
      } else {
        console.log('No user profiles found');
      }
    } catch (error) {
      console.log('Error getting document:', error);
      alert('Error getting document:', error);
      // setUserData(null);
    }
  };
  read();

  // console.log('itemFavorited: ', listItemFavorited);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        onPress={() => navigation.navigate('Home')}
        style={{
          fontSize: 26,
          fontWeight: 'bold',
          display: 'flex',
          paddingBottom: 100,
        }}>
        Favourite Screen
      </Text>
      {/* <SearchComponent /> */}
      {/* <GetItemsTea /> */}
      {/* Show item faverites list */}
      <Text>Những sản phẩm được yêu thích</Text>
      {/* {listItemFavorited.map((item, index) => (
        <Text key={index}>{item}</Text>
      ))} */}
    </View>
  );
}
