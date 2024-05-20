import React, {useState, useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';

// Icons
import {Octicons, Ionicons, AntDesign} from '@expo/vector-icons';

// Components
import CustomStatusBar from '../components/CustomStatusBar';
import SearchComponent from '../components/SearchComponent';

// Database
// import {supabase} from '../supabase';
import {collection, getDocs, getDoc, doc, updateDoc} from 'firebase/firestore';

// navigation
import {useNavigation, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// fetch Image
import {db, auth, storage} from '../firebase';

// for custom status bar
import {SafeAreaProvider} from 'react-native-safe-area-context';

const updateLocationForUser = (_userId, location) => {
  updateDoc(doc(db, 'Users', _userId), {
    location,
  })
    .then(() => {
      console.log('UPDATED LOCATION FOR USER: ', _userId);
      // save to AsyncStorage
      AsyncStorage.setItem('userLocation', location);
    })
    .catch(error => {
      console.log('error: ', error);
      alert('error: ', error);
    });
};

export default function HomeScreen({navigation}) {
  const navi = useNavigation();
  const isFocused = useIsFocused();

  // user photo
  const [userPhotoURL, setUserPhotoURL] = useState(null);
  const [viTriHienTai, setViTriHienTai] = useState(
    'Đang tìm vị trí của bạn...',
  );

  // HEIGHT & WIDTH DEVICE
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  console.log('screenWidth, screenHeight', screenWidth, screenHeight);

  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor='#fff' />
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: '#fff',
          paddingTop: 40,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            padding: 10,
          }}>
          <Octicons name='location' size={24} color='#E52850' />
          <View style={{flex: 1}}>
            <Text style={{fontSize: 15, fontWeight: '500'}}>Giao hàng tới</Text>
            <Text
              style={{color: 'gray', fontSize: 16, marginTop: 3}}
              numberOfLines={2}>
              {viTriHienTai}
            </Text>
          </View>
          {userPhotoURL && (
            <TouchableOpacity onPress={() => navi.navigate('Tài khoản')}>
              <Image
                source={{uri: userPhotoURL}}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                }}
              />
            </TouchableOpacity>
          )}
        </View>

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
            placeholder='Tìm kiếm cà phê, trà sữa, nước hoa quả...'
            style={{width: 335, height: '100%'}}
          />
          <TouchableOpacity onPress={() => console.log('SEARCHING...')}>
            <AntDesign name='search1' size={24} color='#E52B50' />
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <SearchComponent />

        <Text
          style={{
            textAlign: 'center',
            marginTop: 7,
            letterSpacing: 4,
            marginBottom: 5,
            color: 'gray',
          }}>
          KHÁM PHÁ
        </Text>

        <Text
          style={{
            textAlign: 'center',
            marginTop: 7,
            letterSpacing: 9,
            marginBottom: 5,
            color: 'gray',
          }}>
          SẢN PHẨM THỊNH HÀNH
        </Text>
      </ScrollView>
    </SafeAreaProvider>
  );
}
