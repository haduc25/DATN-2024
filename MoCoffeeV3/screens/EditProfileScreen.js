import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useState} from 'react';

import CustomStatusBar from '../components/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';

// Icons
import {Ionicons, AntDesign} from '@expo/vector-icons';

export default function EditProfileScreen({navigation}) {
  const route = useRoute();
  const {userInfo} = route.params;

  //info
  const [userDisplayName, setUserDisplayName] = useState('Minh Đức');
  const [userEmail, setUserEmail] = useState(null);

  console.log('EditProfileScreen_userInfo: ', userInfo);

  return (
    <SafeAreaProvider>
      <CustomStatusBar
        backgroundColor='#fff'
        canGoBack={true}
        heightOfTop={50}
        customStyleIconBack={{marginBottom: 20}}
        arrowIconColor={'#fff'}
        arrowIconBackgroundColor={'#6E5532'}
        titleOfScreen={'Chỉnh sửa hồ sơ'}
        onPressBack={data => console.log(data)}
        dataNavigation={{
          screen: 'Tài khoản',
        }}
      />
      <ScrollView
        style={{
          flex: 1,
          paddingTop: 100,
          backgroundColor: '#fff',
        }}>
        <View
          style={{
            borderWidth: 1,
            alignItems: 'center',

            //
            marginTop: 10,
            backgroundColor: '#fff',
            paddingHorizontal: 14,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowOffset: {width: 0, height: 4},
            elevation: 5,
          }}>
          <TouchableOpacity
            onPress={() => alert('Upload new image')}
            style={{paddingVertical: 20}}>
            <LinearGradient
              colors={['yellow', 'pink', 'teal', 'cyan', 'magenta']}
              style={{
                width: 160,
                height: 160,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 999,
              }}>
              <Image
                style={{
                  width: 150,
                  height: 150,
                  resizeMode: 'cover',
                  borderRadius: 999,
                  position: 'relative',
                }}
                source={{uri: userInfo.photoURL}}
              />
            </LinearGradient>
            <View
              style={{
                zIndex: 999,
                position: 'absolute',
                bottom: 28,
                right: 8,
                backgroundColor: '#ddd',
                borderRadius: 60,
                height: 35,
                width: 35,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name={'camera-outline'} size={25} color={'#000'} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Thông tin cá nhân */}
        <View style={{borderWidth: 1, marginTop: 10, paddingHorizontal: 14}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', paddingTop: 20}}>
            Thông tin cá nhân
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 10,
            }}>
            <AntDesign name={'key'} size={18} color={'#000'} />
            <TextInput
              readOnly={true}
              value={userInfo.uid}
              style={{
                marginLeft: 20,
                color: 'gray',
                marginVertical: 10,
                width: 220,
                maxWidth: 220,
                height: 40,
                borderBottomWidth: 0.5,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 10,
            }}>
            <AntDesign name={'user'} size={18} color={'#000'} />
            <TextInput
              value={userDisplayName}
              onChangeText={text => setUserDisplayName(text)}
              style={{
                marginLeft: 20,
                color: 'gray',
                marginVertical: 10,
                width: 220,
                maxWidth: 220,
                height: 40,
                borderBottomWidth: 0.5,
              }}
              placeholder='Nhập tên hiển thị'
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 10,
            }}>
            <AntDesign name={'mail'} size={18} color={'#000'} />
            <TextInput
              //   value={userEmail ? userEmail : 'Chưa cập nhật'}
              value={userInfo.email}
              onChangeText={text => setUserEmail(text)}
              style={{
                marginLeft: 20,
                color: 'gray',
                marginVertical: 10,
                width: 220,
                maxWidth: 220,
                height: 40,
                borderBottomWidth: 0.5,
              }}
              placeholder='Nhập địa chỉ E-mail'
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 10,
            }}>
            <AntDesign name={'mail'} size={18} color={'#000'} />
            <TextInput
              readOnly={true}
              value={
                userInfo.emailVerified
                  ? 'Email đã xác thực'
                  : 'Email chưa xác thực'
              }
              onChangeText={text => setUserDisplayName(text)}
              style={{
                marginLeft: 20,
                color: 'gray',
                marginVertical: 10,
                width: 220,
                maxWidth: 220,
                height: 40,
                borderBottomWidth: 0.5,
              }}
              placeholder='Nhập địa chỉ E-mail'
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 10,
            }}>
            <AntDesign name={'phone'} size={18} color={'#000'} />
            <TextInput
              readOnly={true}
              value={
                userInfo.phoneNumber ? userInfo.phoneNumber : 'Chưa cập nhật'
              }
              onChangeText={text => setUserDisplayName(text)}
              style={{
                marginLeft: 20,
                color: 'gray',
                marginVertical: 10,
                width: 220,
                maxWidth: 220,
                height: 40,
                borderBottomWidth: 0.5,
              }}
              placeholder='Nhập địa chỉ E-mail'
            />
          </View>

          {/*  */}
          {/* <LinearGradient
            colors={['red', 'green', 'blue', 'yellow', 'orange']}
            style={{
              width: '100%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <Text
              style={[
                {
                  fontSize: 16,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  color: '#fff',
                },
              ]}>
              'children'
            </Text>
          </LinearGradient> */}

          {/* <LinearGradient
            colors={['yellow', 'pink', 'teal', 'cyan', 'magenta']}
            style={{
              width: 210,
              height: 210,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 999,
            }}>
            <Image
              style={{
                width: 200,
                height: 200,
                resizeMode: 'cover',
                borderRadius: 999,
                position: 'relative',
              }}
              source={{uri: userInfo.photoURL}}
            />
          </LinearGradient> */}
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}
