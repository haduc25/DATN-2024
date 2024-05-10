import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {doc, getDoc} from 'firebase/firestore';
import {db} from '../firebase';

export default function FavouriteScreen({navigation}) {
  const [listItemFavorited, setListItemFavorited] = useState([]);
  const [itemDetails, setItemDetails] = useState([]);

  useEffect(() => {
    readUserData();
  }, []);

  const readUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('usersProfile');

      if (data !== null) {
        const userProfile = JSON.parse(data);
        console.log('User profiles:', userProfile);
        console.log('User profiles-id:', userProfile.currentUser._userId);

        const docSnap = await getDoc(
          doc(db, 'Users', userProfile.currentUser._userId),
        );

        if (docSnap.exists()) {
          console.log('Document data:', docSnap.data());
          console.log('data: ', docSnap.data());

          console.log('itemFavorited: ', docSnap.data().itemFavorited);
          setListItemFavorited(docSnap.data().itemFavorited);
        } else {
          console.log('Document does not exist');
          alert('Document does not exist');
        }
      } else {
        console.log('No user profiles found');
      }
    } catch (error) {
      console.log('Error getting document:', error);
      alert('Error getting document:', error);
    }
  };

  const fetchItemDetails = async itemId => {
    try {
      const itemDocRef = doc(db, 'MenuMoC&T', itemId);
      const itemDocSnap = await getDoc(itemDocRef);

      if (itemDocSnap.exists()) {
        console.log('Item details:', itemDocSnap.data());
        return itemDocSnap.data();
      } else {
        console.log('Item does not exist');
        return null;
      }
    } catch (error) {
      console.log('Error getting item details:', error);
      return null;
    }
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 26, fontWeight: 'bold', paddingBottom: 20}}>
        Favourite Screen
      </Text>
      <Text>Những sản phẩm được yêu thích</Text>
      {listItemFavorited.map((itemId, index) => {
        const itemDetail = fetchItemDetails(itemId);
        if (itemDetail) {
          return <Text key={index}>{itemDetail.name}</Text>;
        }
        return null;
      })}
      <Button
        title='Navigate to Home Screen'
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}
