import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
} from 'react-native';

import React, {useState, useEffect} from 'react';
import * as Location from 'expo-location';
import * as LocationGeocoding from 'expo-location';

const index = () => {
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    'fetching your location ...',
  );
  const [data, setData] = useState([]);

  useEffect(() => {
    CheckIfLocationEnabled();
    GetCurrentLocation();
  }, []);

  // START: func
  const CheckIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      Alert.alert(
        'Location Services not enabled',
        'Please enable your location services to continue',
        [{text: 'OK'}],
        {cancelable: false},
      );
    } else {
      setLocationServicesEnabled(true);
    }
  };

  const GetCurrentLocation = async () => {
    let {status} = await Location.requestBackgroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission not granted',
        'Allow the app to use the location service',
        [{text: 'OK'}],
        {cancelable: false},
      );
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    console.log('location: ', location);
    let {coords} = await Location.getCurrentPositionAsync();
    if (coords) {
      const {latitude, longitude} = coords;

      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const address = await LocationGeocoding.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const streetAddress = address[0].name;
      for (let item of response) {
        let address = `${item.name}, ${item?.postalCode}, ${item?.city}`;

        setDisplayCurrentAddress(address);
      }
    }
  };
  console.log('my address', displayCurrentAddress);

  // END: func

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{textAlign: 'center'}}>HOME SCREEN</Text>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
