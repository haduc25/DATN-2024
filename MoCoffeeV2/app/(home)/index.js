import {StatusBar} from 'expo-status-bar';
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
import {useState, useEffect} from 'react';
import * as Location from 'expo-location';
import {Octicons, Ionicons} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';

export default function App() {
  const [location, setLocation] = useState();
  const [address, setAddress] = useState();
  const [viTriHienTai, setViTriHienTai] = useState(
    'Đang tìm vị trí của bạn...',
  );

  const [permissionsGranted, setPermissionsGranted] = useState(false); // Thêm biến cờ để check quyền đc cấp thì mới chạy

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
      setPermissionsGranted(true); // Đặt cờ thành true sau khi quyền đã được cấp
    };
    getPermissions();

    // tu chay
    // reverseGeocode();
  }, []);

  useEffect(() => {
    if (permissionsGranted) {
      reverseGeocode(); // Gọi reverseGeocode chỉ khi quyền đã được cấp
    }
  }, [permissionsGranted]); // Sử dụng permissionsGranted làm dependency

  const reverseGeocode = async () => {
    console.log('\n\n=======================================\n\n');
    console.log('location: ', location);
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
    <ScrollView style={{flex: 1, backgroundColor: '#f8f8f8'}}>
      {/* START: HEADER LOCATION */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          padding: 10,
        }}>
        <Octicons name="location" size={24} color="#E52850" />
        <View style={{flex: 1}}>
          <Text style={{fontSize: 15, fontWeight: '500'}}>Giao hàng tới</Text>
          <Text style={{color: 'gray', fontSize: 16, marginTop: 3}}>
            {viTriHienTai}
          </Text>
        </View>
        <Pressable
          style={{
            backgroundColor: '#6CB4EE',
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>MD</Text>
        </Pressable>
      </View>
      {/* END: HEADER LOCATION */}

      {/* START: SEARCH */}
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
        <TextInput placeholder="Search for food, hotels" />
        <AntDesign name="search1" size={24} color="#E52B50" />
      </View>
      {/* END: SEARCH */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
