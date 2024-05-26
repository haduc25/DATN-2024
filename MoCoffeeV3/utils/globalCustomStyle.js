// globalCustomStyle.js
import {BaseToast, ErrorToast} from 'react-native-toast-message';

export const toastConfigMessage = {
  success: props => (
    <BaseToast
      {...props}
      style={{
        position: 'absolute',
        top: 10,
        borderLeftColor: '#6666ff',
        minWidth: 400,
        maxWidth: 400,
        minHeight: 80,
        backgroundColor: '#1c1c1e',
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '400',
        color: '#fff',
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  tomatoToast: ({text1, props}) => (
    <View style={{height: 60, width: '100%', backgroundColor: 'tomato'}}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};
