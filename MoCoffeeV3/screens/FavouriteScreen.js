import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {db, doc, getDoc} from '../firebase';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {Ionicons, FontAwesome} from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';

export default function FavouriteScreen() {
  const [userDataList, setUserDataList] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isLoadingSpinner, setIsLoadingSpinner] = useState(true);

  const fetchFavoriteData = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem('favoritedItems');
      if (data) {
        const favoriteItems = JSON.parse(data);
        console.log('Favorited items from AsyncStorage:', favoriteItems);
        await readMultiple(favoriteItems);
      } else {
        console.log('No favorite items found in AsyncStorage.');
      }
    } catch (error) {
      console.error('Error fetching data from AsyncStorage:', error);
      alert('Error fetching data from AsyncStorage');
    }
  }, []);

  const readMultiple = useCallback(async productIds => {
    try {
      const docRefs = productIds.map(productId =>
        doc(db, 'MenuMoC&T', productId),
      );
      const docSnaps = await Promise.all(docRefs.map(getDoc));

      const fetchedData = docSnaps
        .map((docSnap, index) => {
          if (docSnap.exists()) {
            return {productId: productIds[index], data: docSnap.data()};
          } else {
            console.log(`No document found for item ${productIds[index]}`);
            return null;
          }
        })
        .filter(data => data !== null);

      setUserDataList(fetchedData);
    } catch (error) {
      console.error('Error fetching documents from Firestore:', error);
      alert('Error fetching documents from Firestore');
      setUserDataList([]);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchFavoriteData();
      console.log('Fetching data...');
    }
  }, [isFocused, fetchFavoriteData]);

  // LOADING SPINNER
  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingSpinner(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('DetailScreen', {
          item: item.data,
          currentScreen: 'Yêu thích',
        })
      }
      style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Text numberOfLines={1} style={styles.itemName}>
          {item.data.name}
        </Text>
        <Text numberOfLines={3} style={styles.itemDescription}>
          {item.data.description}
        </Text>
        <Text style={styles.itemPrice}>{item.data.price}</Text>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <FontAwesome
              key={i}
              style={styles.starIcon}
              name={
                i < Math.floor(item.data.ratings['average_rating'])
                  ? 'star'
                  : 'star-o'
              }
              size={15}
              color='#FFD700'
            />
          ))}
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => alert('Đã thêm sản phẩm vào giỏ hàng!')}
            style={styles.cartButton}>
            <Ionicons name='cart-outline' size={24} color='#fff' />
          </TouchableOpacity>
          <Text>Đã bán {item.data.sold_count}</Text>
        </View>
      </View>
      <Image
        source={{uri: item.data.featured_image[0]}}
        style={styles.itemImage}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <Spinner
        overlayColor={'#fff'}
        color='#000'
        visible={true}
        textContent={'Đang tải danh sách sản phẩm yêu thích...'}
        textStyle={styles.spinnerText}
      /> */}

      {isLoadingSpinner ? (
        <Spinner
          overlayColor={'#fff'}
          color='#999'
          visible={isLoadingSpinner}
          textContent={'Đang tải danh sách sản phẩm yêu thích...'}
          textStyle={styles.spinnerText}
        />
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Yêu thích</Text>
          </View>
          {userDataList.length > 0 ? (
            <FlatList
              style={styles.flatList}
              data={userDataList}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <View style={styles.emptyState}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/5089/5089733.png',
                }}
                style={{width: 200, height: 200}}
              />
              <Text style={styles.emptyStateTitle}>Opps...!</Text>
              <Text style={styles.emptyStateSubtitle}>
                Danh sách sản phẩm yêu thích trống
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    width: '100%',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '500',
    paddingBottom: 20,
  },
  flatList: {
    width: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 0},
    elevation: 5,
    maxHeight: 200,
  },
  itemDetails: {
    padding: 14,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    maxWidth: 160,
  },
  itemDescription: {
    maxWidth: 165,
    minWidth: 165,
    minHeight: 55,
    maxHeight: 55,
  },
  itemPrice: {
    color: '#ee4d2d',
    fontWeight: '600',
    fontSize: 18,
    marginTop: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 5,
    borderRadius: 4,
  },
  starIcon: {
    paddingHorizontal: 3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  cartButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    backgroundColor: 'red',
    borderRadius: 20,
  },
  itemImage: {
    width: 200,
    height: 200,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  emptyState: {
    // height: '100%',
    minHeight: 713,
    maxHeight: 713,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontWeight: '700',
    fontSize: 28,
    marginTop: 16,
  },
  emptyStateSubtitle: {
    fontSize: 20,
  },
});
