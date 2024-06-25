import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { setIp, setPort } from './Actions';

export default function Connection() {  

  const dispatch = useDispatch();
  const ip = useSelector((state) => state.ip);
  const port = useSelector((state) => state.port);
  const navigation = useNavigation();

  async function testConnection () {
    try {
      const response = await fetch(`http://${ip}:${port}`);
      if (response.ok) {
        navigation.navigate('Main');
      } 
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Connexion impossible !',
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Adresse IP" value={ip} onChangeText={(value) => dispatch(setIp(value))} style={styles.input} />
      <TextInput placeholder="Port" value={port} onChangeText={(value) => dispatch(setPort(value))} style={styles.input} />
      <Button title="Tester la connexion" onPress={testConnection} />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '80%',
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
});