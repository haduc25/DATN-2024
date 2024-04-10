// Version 2
import React, {useState, useEffect} from 'react';
import {View, Image, Button, LogBox} from 'react-native';
import {auth, db, storage} from '../firebase';
import {ref, getDownloadURL, uploadBytesResumable} from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

function UploadImageToStorageDemo() {
  const [imageURI, setImageURI] = useState(null);
  const [imageURI2, setImageURI2] = useState(null);
  const [uploadedImageName, setUploadedImageName] = useState(null); // Lưu tên của ảnh đã tải lên

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

    if (!result.canceled) {
      setImageURI(result.assets[0].uri);
    }
  };

  //   This func upload to (root of storage)
  const uploadImage = async () => {
    try {
      if (!imageURI) {
        alert('Please select an image first!');
        return;
      }
      const response = await fetch(imageURI);
      const blob = await response.blob();
      const imageName = imageURI.substring(imageURI.lastIndexOf('/') + 1);
      console.log('imageName: ', imageName);
      setUploadedImageName(imageName); // Lưu tên của ảnh đã tải lên
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

  //   This func upload to (path of storage) - specific is `assets/avatars/users/`
  //   const uploadImageToUsersFolder = async () => {
  //     try {
  //       if (!imageURI) {
  //         alert('Please select an image first!');
  //         return;
  //       }
  //       const response = await fetch(imageURI);
  //       const blob = await response.blob();
  //       const imageName = imageURI.substring(imageURI.lastIndexOf('/') + 1);
  //       const storageRef = ref(storage, `assets/avatars/users/${imageName}`); // Đường dẫn mong muốn
  //       const uploadTask = uploadBytesResumable(storageRef, blob);

  //       uploadTask.on(
  //         'state_changed',
  //         snapshot => {
  //           // Progress tracking can be implemented here if needed
  //           const progress =
  //             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //           console.log('Upload is ' + progress + '% done');
  //         },
  //         error => {
  //           console.error('Error uploading image:', error);
  //           alert('Error uploading image!');
  //         },
  //         () => {
  //           uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
  //             console.log('File available at', downloadURL);
  //             alert('Image uploaded successfully!');
  //           });
  //         },
  //       );
  //     } catch (error) {
  //       console.error('Error uploading image:', error);
  //       alert('Error uploading image!');
  //     }
  //   };

  const uploadImageToUsersFolder = async () => {
    try {
      if (!imageURI) {
        alert('Please select an image first!');
        return;
      }
      const response = await fetch(imageURI);
      const blob = await response.blob();
      const imageName = imageURI.substring(imageURI.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `assets/avatars/users/${imageName}`);
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
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File available at', downloadURL);
            alert('Image uploaded successfully!');
            // Đường dẫn đầy đủ của ảnh sẽ được lưu trong biến downloadURL
            // Bạn có thể sử dụng nó để hiển thị hoặc thực hiện các tác vụ khác
          } catch (error) {
            console.error('Error getting download URL:', error);
            alert('Error getting download URL!');
          }
        },
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image!');
    }
  };

  const handleFetch2ButtonClick = async () => {
    try {
      if (!uploadedImageName) {
        alert('No image has been uploaded!');
        return;
      }
      const url = await getDownloadURL(ref(storage, uploadedImageName)); // Sử dụng tên của ảnh đã tải lên
      setImageURI2(url);
    } catch (error) {
      console.error('Error fetching image:', error);
      alert('Error fetching image!');
    }
  };

  const removeImage = () => {
    setImageURI(null);
    setUploadedImageName(null); // Reset tên của ảnh đã tải lên
  };

  // Ignore specific warning for deprecated 'cancelled' key
  useEffect(() => {
    LogBox.ignoreLogs([
      'Key "cancelled" in the image picker result is deprecated',
    ]);
  }, []);

  return (
    <View style={{alignItems: 'center'}}>
      <View style={{height: 200}}>
        {imageURI && (
          <Image source={{uri: imageURI}} style={{width: 200, height: 200}} />
        )}
      </View>
      <Button title='Select Image' onPress={pickImage} />
      <Button title='Upload Image' onPress={uploadImage} />
      <Button
        title='Upload Image to Users Folder'
        onPress={uploadImageToUsersFolder}
      />
      {imageURI && <Button title='Remove Image' onPress={removeImage} />}
      <Button title='Fetch Image' onPress={handleFetch2ButtonClick} />
      <View style={{height: 200}}>
        {imageURI2 && (
          <Image source={{uri: imageURI2}} style={{width: 200, height: 200}} />
        )}
      </View>
    </View>
  );
}

export default UploadImageToStorageDemo;
