import React, {useState, useEffect} from 'react';
import {View, Image, Button} from 'react-native';
import {auth, db, storage} from '../firebase';
import {ref, getDownloadURL, uploadBytesResumable} from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

function UploadImageToStorageDemo() {
  const [imageURI, setImageURI] = useState(null);

  const pickImage = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImageURI(result.uri);
    }
  };

  const uploadImage = async () => {
    try {
      const response = await fetch(imageURI);
      const blob = await response.blob();
      const imageName = imageURI.substring(imageURI.lastIndexOf('/') + 1);
      const storageRef = ref(storage, imageName);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        snapshot => {
          // Progress tracking can be implemented here if needed
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        error => {
          console.error('Error uploading image:', error);
          alert('Error uploading image!');
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log('File available at', downloadURL);
            alert('Image uploaded successfully!');
          });
        },
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image!');
    }
  };

  const handleFetchButtonClick = async () => {
    try {
      const url = await getDownloadURL(ref(storage, 'bae.jpg'));
      setImageURI(url);
    } catch (error) {
      console.error('Error fetching image:', error);
      alert('Error fetching image!');
    }
  };

  return (
    <View>
      {imageURI && (
        <Image source={{uri: imageURI}} style={{width: 200, height: 200}} />
      )}
      <Button title='Select Image' onPress={pickImage} />
      <Button title='Upload Image' onPress={uploadImage} />
      <Button title='Fetch Image' onPress={handleFetchButtonClick} />
    </View>
  );
}

export default UploadImageToStorageDemo;
