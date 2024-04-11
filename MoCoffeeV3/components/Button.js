import React from 'react';
import {Text, StyleSheet, Pressable, ActivityIndicator} from 'react-native';

export default function Button(props) {
  const {onPress, title = 'Save', buttonStyleCustom, loading, disabled} = props;

  return (
    <Pressable
      style={[
        styles.button,
        buttonStyleCustom,
        disabled && {backgroundColor: '#4c4c4c'},
      ]}
      onPress={onPress}
      disabled={loading || disabled}>
      {loading ? (
        <ActivityIndicator size='small' color='#ffffff' />
      ) : (
        <Text style={[styles.text, disabled && {opacity: 0.6}]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#000',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
