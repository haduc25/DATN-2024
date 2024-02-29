import * as React from 'react';
import {View, Text} from 'react-native';

// import SearchComponent from '../components/SearchComponent ';
import GetItemsTea from '../components/GetItemsTea';

export default function FavouriteScreen({navigation}) {
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
      <GetItemsTea />
    </View>
  );
}
