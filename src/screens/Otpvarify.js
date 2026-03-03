import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';



const OtpVerify = ({ route }) => {
  const { phoneNumber } = route.params;
  const navigation = useNavigation();
  const [varifyOtp, setVarifyOtp] = useState('');
  const [displayOtp, setDisplayOtp] = useState(false);
  const [displayStoreOtp, setDisplayStoreOtp] = useState('');
  
  useEffect(() => {
    const duration = 120000; // 2 minutes expiration time
    const displayDelay = 3000; // Delay before showing OTP

    const getOtp = async () => {
      const storedOtp = await AsyncStorage.getItem('otp');
      console.log("Fetched OTP from AsyncStorage:", storedOtp);

      if (storedOtp) {
        setDisplayStoreOtp(storedOtp); // Directly use the OTP as a string
      }

      const displayTimeout = setTimeout(() => {
        setDisplayOtp(true); // Show OTP after 3 seconds
      }, displayDelay);

      const otpTimeout = setTimeout(() => {
        setDisplayOtp(false);
        setDisplayStoreOtp('');
        AsyncStorage.removeItem('otp'); // Remove OTP after expiration
      }, duration);

      // Cleanup function to clear timeouts on unmount
      return () => {
        clearTimeout(displayTimeout);
        clearTimeout(otpTimeout);
      };
    };

    getOtp();
  }, []);

  const submitHandler = async () => {
    try {
      const storedOtp = await AsyncStorage.getItem('otp');
      console.log('Stored OTP:', storedOtp);

      if (storedOtp) {
        if (String(varifyOtp) === String(storedOtp)) {
          await AsyncStorage.removeItem('otp'); // Clear OTP after successful verification
          navigation.replace('Home'); // Navigate to Home page
        } else {
          Alert.alert('Incorrect OTP', 'Please enter the correct OTP');
        }
      } else {
        Alert.alert('OTP Expired', 'The OTP has expired, please request a new one.');
      }
    } catch (error) {
      console.error('OTP error:', error);
      Alert.alert('Error', 'An error occurred during OTP verification.');
    }
  };
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {displayOtp && displayStoreOtp !== '' && (
        <View style={styles.otpPopup}>
          <Text style={styles.otpPopupText}>{displayStoreOtp}</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.heading}>
          Please enter the OTP we've sent you on your mobile number
        </Text>
        <Text style={styles.subHeading}>
          {phoneNumber} 
          <TouchableOpacity onPress={() => navigation.navigate('LoginPage')}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </Text>


        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          value={varifyOtp}
          onChangeText={setVarifyOtp}
          keyboardType="numeric"
          maxLength={6}
        />

        <TouchableOpacity style={styles.button} onPress={submitHandler}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  card: {
    backgroundColor: '#fff',
    width: '100%',
    height: '300',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  heading: {
    color: '#333',
    fontWeight: '700',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  subHeading: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginRight: 8, 
  },
  editText: {
    color: '#007bff',
  fontWeight: '600',
  textDecorationLine: 'underline',
  fontSize: 16,
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    paddingHorizontal: 18,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#00bfff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  });
  

  export default OtpVerify;