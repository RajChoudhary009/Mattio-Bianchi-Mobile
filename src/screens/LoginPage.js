// Login.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { SERVER_API_URL } from '../server/server';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = () => {
  const navigation = useNavigation();
  const [mobileNum, setMobileNum] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to validate mobile number
  const isValidMobileNumber = (number) => {
    // Simple validation for 10-digit numbers, you can adjust this regex for your specific requirements
    const regex = /^[0-9]{10}$/;
    return regex.test(number);
  };

  const handleSubmit = async () => {
    if (!isValidMobileNumber(mobileNum)) {
      Alert.alert('Invalid Mobile Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true); // Show loading spinner or indicator

    try {
      const response = await axios.post(
        `${SERVER_API_URL}/api/login`,
        { mobile_num: mobileNum },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      const data = response.data;
  
      if (data?.token && data?.otp) {
        // ✅ Clear any old malformed token
        await AsyncStorage.removeItem('token');
        // ✅ Store the raw token string directly (no JSON.stringify)
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('otp', data.otp);
  
        console.log("Token saved:", data.token); // 🔍 Debug output
        navigation.replace('OtpVerify', { phoneNumber: mobileNum });
      } else {
        Alert.alert('Login Failed', 'Could not retrieve a valid token or OTP. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'An error occurred. Please check the mobile number and try again.');
    } finally {
      setLoading(false); // Hide loading indicator after process
    }
  };
  
  

  return (
    <View style={styles.container}>
     
      <Image
          source={require('../Assets/images/your-perfect-pair-banner.webp')}
          style={styles.banner}
          resizeMode="contain"
        />
        
        <Text style={styles.heading}>Login or Sign up</Text>

        <TextInput
          placeholder="Enter a 10-digit mobile number"
          keyboardType="numeric"
          style={styles.input}
          value={mobileNum}
          onChangeText={setMobileNum}
          maxLength={10}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>CONTINUE</Text>
        </TouchableOpacity>

        <Text style={styles.desc}>
          By creating an account or logging in, you agree to our Terms of Use and Privacy Policy and
          consent to the collection and use of your personal information.
        </Text>
      
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: 250,
    marginBottom: 30,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 18,
    fontSize: 16,
    backgroundColor: '#f1f1f1',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#00bfff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  desc: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginTop: 40,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },

});


export default LoginPage;