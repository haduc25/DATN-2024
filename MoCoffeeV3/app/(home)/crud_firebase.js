import {StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';
import React, {useState} from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {db} from '../../firebase';
import {useRouter} from 'expo-router';

const crud_firebase = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  console.log('username: ', username);
  console.log('email: ', email);

  //   Create
  const create = () => {
    // summit data
    setDoc(doc(db, 'users', '_id_' + Math.random()), {
      username,
      email,
    })
      .then(() => {
        // Data create successfully!
        console.log('Data created');
        alert('Data created');
      })
      .catch(error => {
        console.log('error: ', error);
        alert('error: ', error);
      });
  };

  //   Create2
  const create2 = () => {
    // summit data
    // auto_id
    addDoc(collection(db, 'users'), {
      username,
      email,
    })
      .then(() => {
        // Data create successfully!
        console.log('Data created');
        alert('Data created');
      })
      .catch(error => {
        console.log('error: ', error);
        alert('error: ', error);
      });
  };

  //   Update
  const update = () => {
    // summit data
    // LA: id of docs
    updateDoc(doc(db, 'users', 'LA'), {
      username,
      email,
    })
      .then(() => {
        // Data create successfully!
        console.log('Data created');
        alert('Data updated');
      })
      .catch(error => {
        console.log('error: ', error);
        alert('error: ', error);
      });
  };

  //   Delete
  const deleteDocs = () => {
    // summit data
    // LA: id of docs
    deleteDoc(doc(db, 'users', 'LA'))
      .then(() => {
        // Data create successfully!
        console.log('Data deleted');
        alert('Data deleted');
      })
      .catch(error => {
        console.log('error: ', error);
        alert('error: ', error);
      });
  };

  return (
    <View>
      <Text style={{textAlign: 'center', marginTop: 30}}>CRUD Firebase</Text>
      <View>
        <TextInput
          style={styles.input}
          //   onChangeText={setUsername}
          onChangeText={username => {
            setUsername(username);
          }}
          placeholder="User name"
          value={username}
        />
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          //   keyboardType="numeric"
        />
        <Button title="Create a new user" onPress={create} />
        <Button title="Create a new user2" onPress={create2} />
        <Button title="Update a user" onPress={update} />
        <Button title="Delete a user" onPress={deleteDocs} />
        <Button
          title="Back to login"
          onPress={() => router.replace('/login')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default crud_firebase;
