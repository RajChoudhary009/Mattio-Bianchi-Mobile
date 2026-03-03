import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../screens/Splash';
import HomePage from '../screens/HomePage';
import LoginPage from '../screens/LoginPage';
import OtpVerify from '../screens/Otpvarify';
import ProductDisplay from '../screens/ProductDisplay';
import ProductDetail from '../screens/ProductDetail';
import CheckOutPage from '../screens/CheckOutPage';

const Stack = createStackNavigator();


const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
        <Stack.Screen name="OtpVerify" component={OtpVerify} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDisplay" component={ProductDisplay} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ headerShown: false }} />
        <Stack.Screen name="CheckOutPage" component={CheckOutPage} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;


