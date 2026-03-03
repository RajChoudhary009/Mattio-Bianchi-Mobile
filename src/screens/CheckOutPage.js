import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, Alert, ToastAndroid, Platform, TouchableOpacity,
  ScrollView, StyleSheet, TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // RN version of useNavigate
import { GlobleInfo } from '../context/GlobleInfoContext'; // Update path as needed
import { SERVER_API_URL } from '../server/server'; // Adjust if required
import {
  CFPaymentGatewayService,
  CFSession,
  CFEnvironment,
  CFThemeBuilder,
  CFPaymentComponentBuilder,
} from 'react-native-cashfree-pg-sdk';

// import RazorpayCheckout from 'react-native-razorpay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const CheckoutPage = () => {
  const { checkoutData } = useContext(GlobleInfo);
  const navigation = useNavigation();

  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addNewAddress, setAddNewAddress] = useState(true);

  const [createformData, setCreateformData] = useState({
    pincode: '',
    city: '',
    state: '',
    house_flat_office_no: '',
    address: '',
    contact_name: '',
    phone_number: '',
    mobile_num: checkoutData?.product?.mobile_number || '',
    address_type: 'home',
    landmark: '',
  });

  const [message, setMessage] = useState('');


  // Redirect if checkoutData is empty
  useEffect(() => {
    if (!checkoutData || Object.keys(checkoutData).length === 0) {
      navigation.goBack();
    }
  }, [checkoutData]);

  const amount = checkoutData?.power?.selectedLensOrProducrPrice || 0;

  // Fetch address data from the API
  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Token is missing.");
        Alert.alert("Error", "User not authenticated.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${SERVER_API_URL}/getalladdressinfo`, config);
      const data = response.data;
      setAddressList(data);

      console.warn('Address data:', data); // Optional for debug

      if (Platform.OS === 'android') {
        ToastAndroid.show('Address data loaded', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error fetching address info:', error);
      alert('Error fetching address'); // Optional visual alert
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    if (addressList.length > 0) {
      setSelectedAddress(addressList[0]);
    }
  }, [addressList]);


  // Handle input change
  const newCreateHandleChange = ({ target: { name, value } }) => {
    setCreateformData(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  // Initiate payment
  // const handlePayment = async (amount) => {
  //   try {
  //     const response = await axios.post(
  //       `http://10.0.2.2:8000/api/payment/order`,
  //       { amount },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     const data = response.data;
  //     console.log(data);
  //     handlePaymentVerify(data.data);
  //   } catch (error) {
  //     console.error('Payment initiation failed:', error);
  //     Alert.alert('Error', 'Failed to initiate payment');
  //   }
  // };

  // Verify payment
  // const handlePaymentVerify = async (data, selectedAddressId = null) => {
  //   const options = {
  //     key: "rzp_test_6nQE4mF6koMgtv",
  //     amount: Math.round(data.amount * 100),
  //     currency: data.currency,
  //     name: "EYE ZONES",
  //     description: "Test Mode",
  //     order_id: data.id,
  //     prefill: {
  //       name: createformData.contact_name || '',
  //       contact: createformData.phone_number || '',
  //     },
  //     theme: {
  //       color: "#5f63b8"
  //     }
  //   };

  //   RazorpayCheckout.open(options)
  //     .then(async (response) => {
  //       try {
  //         const res = await fetch(`http://10.0.2.2:8000/api/payment/verify`, {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({
  //             razorpay_order_id: response.razorpay_order_id,
  //             razorpay_payment_id: response.razorpay_payment_id,
  //             razorpay_signature: response.razorpay_signature,
  //             checkoutData,
  //             selectedAddressId
  //           }),
  //         });

  //         const verifyData = await res.json();

  //         if (verifyData.message) {
  //           Alert.alert("Success", verifyData.message);
  //           setTimeout(() => {
  //             navigation.navigate("ProductDisplay", { category: "All" });
  //           }, 2000);
  //         }
  //       } catch (error) {
  //         console.error("Verification error", error);
  //         Alert.alert("Error", "Payment verification failed");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("Payment Cancelled", err);
  //       Alert.alert("Payment Cancelled", "You cancelled the payment");
  //     });
  // };



  // const handleDeliverHereAndPayment = async () => {
  //   if (!selectedAddress) {
  //     Alert.alert("Error", "Please select an address");
  //     return;
  //   }

  //   const amount = checkoutData?.power?.selectedLensOrProducrPrice;
  //   if (!amount || isNaN(amount)) {
  //     Alert.alert("Error", "Invalid amount for payment");
  //     return;
  //   }

  //   console.log("Selected Address ID:", selectedAddress.addresses_id);
  //   console.log("Amount:", amount);

  //   try {
  //     const response = await axios.post(
  //       `http://10.0.2.2:8000/api/payment/order`,
  //       { amount },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = response.data;
  //     console.log("Order Created:", data);

  //     handlePaymentVerifyHere(data.data);
  //   } catch (error) {
  //     console.error("Payment initiation failed:", error);
  //     Alert.alert("Error", "Failed to initiate payment");
  //   }
  // };



  // const handlePaymentVerifyHere = async (data) => {
  //   if (!selectedAddress) {
  //     Alert.alert("Error", "Please select an address");
  //     return;
  //   }

  //   const options = {
  //     key: "rzp_test_6nQE4mF6koMgtv",
  //     amount: Math.round(data.amount * 100),
  //     currency: data.currency,
  //     name: "EYE ZONES",
  //     description: "Test Mode",
  //     order_id: data.id,
  //     prefill: {
  //       name: createformData.contact_name || '',
  //       contact: createformData.phone_number || '',
  //     },
  //     theme: {
  //       color: "#5f63b8"
  //     }
  //   };

  //   RazorpayCheckout.open(options)
  //     .then(async (response) => {
  //       try {
  //         const res = await fetch(`http://10.0.2.2:8000/api/payment/verify`, {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({
  //             razorpay_order_id: response.razorpay_order_id,
  //             razorpay_payment_id: response.razorpay_payment_id,
  //             razorpay_signature: response.razorpay_signature,
  //             checkoutData,
  //             selectedAddressId: selectedAddress.addresses_id
  //           }),
  //         });

  //         const verifyData = await res.json();

  //         if (verifyData.message) {
  //           Alert.alert("Success", verifyData.message);
  //           setTimeout(() => {
  //             navigation.navigate("ProductDisplay", { category: "All" });
  //           }, 2000);
  //         }
  //       } catch (error) {
  //         console.error("Verification error", error);
  //         Alert.alert("Error", "Payment verification failed");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("Payment Cancelled", err);
  //       Alert.alert("Payment Cancelled", "You cancelled the payment");
  //     });
  // };

  const createCashfreeOrder = async (amount) => {
    try {
      const res = await axios.post(
        `${SERVER_API_URL}/api/cashfree-order`,
        {
          amount,
          mobile_number: checkoutData?.product?.mobile_number,
        }
      );
  
      return res.data; // { order_id, payment_session_id }
    } catch (err) {
      Alert.alert("Error", "Order create failed");
      return null;
    }
  };

  const verifyCashfreePayment = async (orderId, addressId) => {
    try {
      const res = await axios.post(
        `${SERVER_API_URL}/api/cashfree-verify`,
        {
          orderId,
          checkoutData,
          selectedAddressId: addressId,
        }
      );
  
      if (res.data?.payment_status === "SUCCESS") {
        Alert.alert("Success", "Payment successful 🎉");
        navigation.navigate("ProductDisplay", { category: "All" });
      } else {
        Alert.alert("Payment Pending / Failed");
      }
    } catch (err) {
      Alert.alert("Verification Failed");
    }
  };

  const handleDeliverHereAndPayment = async () => {
    if (!selectedAddress) {
      Alert.alert("Error", "Please select address");
      return;
    }
  
    const amount = checkoutData?.power?.selectedLensOrProducrPrice;
    if (!amount) {
      Alert.alert("Error", "Invalid amount");
      return;
    }
  
    const orderData = await createCashfreeOrder(amount);
    if (!orderData) return;
  
    const session = new CFSession(
      orderData.payment_session_id,
      orderData.order_id,
      CFEnvironment.PRODUCTION // sandbox ke liye SANDBOX
    );
  
    const paymentComponent = new CFPaymentComponentBuilder().build();
    const theme = new CFThemeBuilder().setNavigationBarColor("#5f63b8").build();
  
    CFPaymentGatewayService.doPayment({
      session,
      paymentComponent,
      theme,
    });
  
    // ✅ SUCCESS / FAILURE CALLBACK
    CFPaymentGatewayService.setCallback(
      async (event) => {
        if (event.name === "PAYMENT_SUCCESS") {
          await verifyCashfreePayment(
            orderData.order_id,
            selectedAddress.addresses_id
          );
        }
  
        if (event.name === "PAYMENT_FAILED") {
          Alert.alert("Payment Failed");
        }
      },
      () => {
        Alert.alert("Payment Cancelled");
      }
    );
  };

  
  ///////////////////////////// payment without address id ////////////////////////////////////////////

  // const handleNewSubmitAddress1 = async () => {
  //   try {
  //     // Retrieve token from AsyncStorage
  //     const token = await AsyncStorage.getItem("token");
  //     if (!token) {
  //       console.error("Token is missing.");
  //       Alert.alert("Error", "User not authenticated.");
  //       return;
  //     }

  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     };

  //     // Sending POST request to the server
  //     const response = await axios.post(
  //       "http://10.0.2.2:8000/addaddress",
  //       createformData, // This should be your form data object
  //       config
  //     );

  //     console.log("API Response:", response.data);
  //     // Show success message using Alert
  //     Alert.alert("Success", response.data.message || "Address submitted successfully!");

  //     // Proceed with the payment after submitting the address
  //     handlePayment(amount);
  //   } catch (error) {
  //     console.error("Error submitting address:", error);
  //     // Show error message using Alert
  //     Alert.alert("Error", "Failed to submit the address. Please try again.");
  //   }
  // };

  const verifyCashfreePaymentwhioutId = async (orderId) => {
    try {
      const res = await axios.post(
        `${SERVER_API_URL}/api/cashfree-verify`,
        {
          orderId,
          checkoutData,
        }
      );
  
      if (res.data?.payment_status === "SUCCESS") {
        Alert.alert("Success", "Payment successful 🎉");
        navigation.navigate("ProductDisplay", { category: "All" });
      } else {
        Alert.alert("Payment Pending / Failed");
      }
    } catch (err) {
      Alert.alert("Verification Failed");
    }
  };

  const handlePaymentWithoutAddId = async () => {
    const amount = checkoutData?.power?.selectedLensOrProducrPrice;
    if (!amount) {
      Alert.alert("Error", "Invalid amount");
      return;
    }
  
    const orderData = await createCashfreeOrder(amount);
    if (!orderData) return;
  
    const session = new CFSession(
      orderData.payment_session_id,
      orderData.order_id,
      CFEnvironment.PRODUCTION // sandbox ke liye SANDBOX
    );
  
    const paymentComponent = new CFPaymentComponentBuilder().build();
    const theme = new CFThemeBuilder().setNavigationBarColor("#5f63b8").build();
  
    CFPaymentGatewayService.doPayment({
      session,
      paymentComponent,
      theme,
    });
  
    // ✅ SUCCESS / FAILURE CALLBACK
    CFPaymentGatewayService.setCallback(
      async (event) => {
        if (event.name === "PAYMENT_SUCCESS") {
          await verifyCashfreePaymentwhioutId(
            orderData.order_id,
          );
        }
  
        if (event.name === "PAYMENT_FAILED") {
          Alert.alert("Payment Failed");
        }
      },
      () => {
        Alert.alert("Payment Cancelled");
      }
    );
  };

  const handleNewSubmitAddress = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "User not authenticated.");
        return;
      }
  
      const response = await axios.post(
        `${SERVER_API_URL}/addaddress`,
        createformData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // ✅ ONLY STATUS 200 CHECK
      if (response.status === 200) {
        Alert.alert("Success", "Address saved successfully");
  
        // 🔥 Address save ke baad hi payment
        handlePaymentWithoutAddId();
      }
  
    } catch (error) {
      console.error("Address Save Error:", error);
      Alert.alert("Error", "Address save failed");
    }
  };
  
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Existing Addresses */}
      {addressList.length > 0 && (
        <View style={styles.section}>
          <View style={styles.header}>
            <Text style={styles.stepBadge}>{addressList.length}</Text>
            <Text style={styles.headerTitle}>DELIVERY ADDRESS</Text>
          </View>

          {addressList.map((user) => (
            <View key={user.addresses_id} style={styles.addressCard}>
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() => setSelectedAddress(user)}
                  style={styles.radioOuter}
                >
                  {selectedAddress?.addresses_id === user.addresses_id && (
                    <View style={styles.radioInner} />
                  )}
                </TouchableOpacity>
                <View style={styles.addressInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{user.contact_name}</Text>
                    <Text style={styles.badge}>{user.address_type?.toUpperCase()}</Text>
                    <Text style={styles.phone}>{user.mobile_num}</Text>
                  </View>
                  <Text style={styles.fullAddress}>
                    01, {user.address}, {user.city}, {user.state} - <Text style={{ fontWeight: 'bold' }}>{user.pincode}</Text>
                  </Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.editBtn}>EDIT</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                disabled={selectedAddress?.addresses_id !== user.addresses_id}
                onPress={handleDeliverHereAndPayment}
                style={[
                  styles.deliverBtn,
                  selectedAddress?.addresses_id === user.addresses_id
                    ? styles.deliverBtnActive
                    : styles.deliverBtnDisabled
                ]}
              >
                <Text style={styles.deliverText}>DELIVER HERE</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Add New Address Trigger */}
          <TouchableOpacity
            style={styles.addNewContainer}
            onPress={() => setAddNewAddress(!addNewAddress)}
          >
            <Text style={styles.plus}>+</Text>
            <Text style={styles.addNewText}>Add a new address</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* New Address Form */}
      {addNewAddress && (
        <View style={styles.formContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.radioOuter}>
              <View style={styles.radioInner} />
            </View>
            <Text style={styles.sectionTitle}>ADD A NEW ADDRESS</Text>
          </View>

          <View style={styles.inputGrid}>
            <TextInput
              placeholder="Name"
              value={createformData.contact_name}
              onChangeText={(text) => setCreateformData(prev => ({ ...prev, contact_name: text }))}
              style={styles.input}
            />
            <TextInput
              placeholder="10-digit mobile number"
              value={createformData.mobile_num}
              onChangeText={(text) => setCreateformData(prev => ({ ...prev, mobile_num: text }))}
              style={[styles.input, { backgroundColor: '#f0f0f0' }]}
            />
            <TextInput
              placeholder="Pincode"
              value={createformData.pincode}
              keyboardType="numeric"
              onChangeText={(text) => setCreateformData(prev => ({ ...prev, pincode: text }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Alternate Phone (Optional)"
              value={createformData.phone_number}
              onChangeText={(text) => setCreateformData(prev => ({ ...prev, phone_number: text }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Address (Area and Street)"
              value={createformData.address}
              onChangeText={(text) => setCreateformData(prev => ({ ...prev, address: text }))}
              style={[styles.input, styles.fullWidth]}
            />
            <TextInput
              placeholder="City/District/Town"
              value={createformData.city}
              onChangeText={(text) => setCreateformData(prev => ({ ...prev, city: text }))}
              style={styles.input}
            />
            <TextInput
              placeholder="State"
              value={createformData.state}
              onChangeText={(text) => setCreateformData(prev => ({ ...prev, state: text }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Landmark (Optional)"
              value={createformData.landmark}
              onChangeText={(text) => setCreateformData(prev => ({ ...prev, landmark: text }))}
              style={styles.input}
            />
            <TextInput
              placeholder="House/Flat/Office No"
              value={createformData.house_flat_office_no}
              onChangeText={(text) => setCreateformData(prev => ({ ...prev, house_flat_office_no: text }))}
              style={styles.input}
            />
          </View>

          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setCreateformData(prev => ({ ...prev, address_type: 'home' }))}
            >
              <View style={styles.radioOuter}>
                {createformData.address_type === 'home' && <View style={styles.radioInner} />}
              </View>
              <Text>Home (All day delivery)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setCreateformData(prev => ({ ...prev, address_type: 'work' }))}
            >
              <View style={styles.radioOuter}>
                {createformData.address_type === 'work' && <View style={styles.radioInner} />}
              </View>
              <Text>Work (Delivery between 10 AM - 5 PM)</Text>
            </TouchableOpacity>
          </View>


          <View style={styles.formActions}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleNewSubmitAddress}>
              <Text style={styles.saveBtnText}>SAVE AND DELIVER HERE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setAddNewAddress(false)}>
              <Text style={styles.cancelBtnText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};




const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  stepBadge: {
    backgroundColor: '#5f63b8',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 10
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 16
  },
  addressCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#5f63b8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#5f63b8'
  },
  addressInfo: {
    flex: 1,
    marginHorizontal: 8
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16
  },
  badge: {
    fontSize: 12,
    color: '#555',
    marginLeft: 8
  },
  phone: {
    marginLeft: 8,
    fontSize: 12,
    color: '#555'
  },
  fullAddress: {
    marginTop: 4,
    fontSize: 14,
    color: '#444'
  },
  editBtn: {
    color: '#007bff',
    fontWeight: 'bold'
  },
  deliverBtn: {
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center'
  },
  deliverBtnActive: {
    backgroundColor: '#5f63b8'
  },
  deliverBtnDisabled: {
    backgroundColor: '#ccc'
  },
  deliverText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  addNewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  plus: {
    fontSize: 22,
    color: '#5f63b8',
    marginRight: 8
  },
  addNewText: {
    fontSize: 16,
    color: '#5f63b8',
    fontWeight: 'bold'
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8
  },
  inputGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between'
  },
  input: {
    width: '48%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 10,
    backgroundColor: '#fff'
  },
  fullWidth: {
    width: '100%'
  },
  radioGroup: {
    marginVertical: 16
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  saveBtn: {
    backgroundColor: '#98e3e6',
    padding: 12,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
    marginRight: 8
  },
  cancelBtn: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center'
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  cancelBtnText: {
    color: '#333'
  }
});







export default CheckoutPage;