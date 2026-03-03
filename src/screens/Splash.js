import React, { useEffect } from 'react';
import { Image, View, Text } from 'react-native';
import logo from '../Assets/images/logo.jpeg';
import { useNavigation } from '@react-navigation/native';

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Home'); // Ensure 'About' screen exists in your navigator
    }, 4000);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <Image
        source={logo}
        style={{ width: 200, height: 200}}
        resizeMode="contain"
      />
      
      <Text style={{ color: "#fff"}}>Metteo Bianchi</Text>
    </View>
  );
}

export default Splash;
