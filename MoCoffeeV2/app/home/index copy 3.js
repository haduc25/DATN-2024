import {StatusBar} from 'expo-status-bar';
import {Button, StyleSheet, TextInput, View} from 'react-native';
import {useState, useEffect} from 'react';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState();
  const [address, setAddress] = useState();
  const [viTriHienTai, setViTriHienTai] = useState(
    'fetching your location ...',
  );

  Location.setGoogleApiKey('AIzaSyD5GUOMMrDY5Ml8JOQ5j7z7p9f8GaGCDBg');

  useEffect(() => {
    const getPermissions = async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Please grant location permissions');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log('Location (vị trí): ', currentLocation);
    };
    getPermissions();

    // tu chay
    reverseGeocode();
  }, []);

  const geocode = async () => {
    const geocodedLocation = await Location.geocodeAsync(address);
    console.log(
      'Geocoded Address(Địa chỉ được mã hóa địa lý): ',
      geocodedLocation,
    );
  };

  const reverseGeocode = async () => {
    console.log('\n\n=======================================\n\n');
    const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
    });

    const [{district, name, subregion, city, region, country, isoCountryCode}] =
      reverseGeocodedAddress;

    const xa = district || name;
    const huyen = subregion || city;
    const tinh = region;
    const quocGia = country || isoCountryCode;

    const viTri = xa + ', ' + huyen + ', ' + tinh + ', ' + quocGia;
    setViTriHienTai(viTri);

    // console.log(
    //   'Reverse Geocoded (Mã hóa địa lý đảo ngược): ',
    //   reverseGeocodedAddress,
    // );
  };

  console.log('Địa chỉ của tôi: ' + viTriHienTai);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <Button title="Geocode Address" onPress={geocode} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
