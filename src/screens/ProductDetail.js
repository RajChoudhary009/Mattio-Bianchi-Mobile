import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  Pressable,
  Linking,
  Alert,
  PermissionsAndroid, Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { GlobleInfo } from '../context/GlobleInfoContext'; // Replace with actual context path
import { SERVER_API_URL } from '../server/server';
import { SERVER_URL } from '../server/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import jwtDecode from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';




// Local assets
import tdesign from '../Assets/images/tdesign_cart.png';
import forward from '../Assets/images/forword.png';
import backward from '../Assets/images/backword.png';
import wishlist from '../Assets/images/wishlist.png';
import wishlist1 from '../Assets/images/wishlist1.png';


const reviews = [
  { id: 1, user: "Nasrin Ahmed", comment: "Very perfect and beautiful.", date: "3 days ago", rating: 5 },
  { id: 2, user: "Nasrin Ahmed", comment: "Very perfect and beautiful.", date: "3 days ago", rating: 5 },
  { id: 3, user: "Nasrin Ahmed", comment: "Very perfect and beautiful.", date: "3 days ago", rating: 5 },
  { id: 4, user: "Nasrin Ahmed", comment: "Very perfect and beautiful.", date: "3 days ago", rating: 5 }
];

// const suggestedFrames = [
//     { id: 1, name: "Black Full Rim Rectangle", price: 2750, color: "Black", material: "Plastic", rating: 5 },
//     { id: 2, name: "Black Full Rim Rectangle", price: 2750, color: "Black", material: "Plastic", rating: 5 },
//     { id: 3, name: "Black Full Rim Rectangle", price: 2750, color: "Black", material: "Plastic", rating: 5 },
//     { id: 4, name: "Black Full Rim Rectangle", price: 2750, color: "Black", material: "Plastic", rating: 5 }
// ];


const lensData = {
  Plano: [
    { type: "Blue Block", price: 800 },
    { type: "Photo CR", price: 1800 },
    { type: "Tinteble", price: 1200 }
  ],
  SingleVision: [
    { type: "Blue Block", price: 800 },
    { type: "Photo CR", price: 1800 },
    { type: "Tinteble", price: 1200 }
  ],
  Bifocal: [
    { type: "Arc", price: 1500 },
    { type: "Blue Block", price: 1800 },
    { type: "Photo CR", price: 1800 },
    { type: "Drivex", price: 3200 }
  ],
  Progressive: [
    { type: "Arc", price: 2500 },
    { type: "Blue Block", price: 2800 },
    { type: "Photo CR", price: 3600 },
    { type: "Drivex", price: 4000 }
  ]
}


const Images = {
  banner: require('../Assets/images/EyePoppin.webp'),
  filter: require('../Assets/images/setting.png'),
  sort: require('../Assets/images/sort.png'),
  tdesign: require('../Assets/images/tdesign_cart.png'),
  forward: require('../Assets/images/forword.png'),
  backward: require('../Assets/images/backword.png'),
  wishlist: require('../Assets/images/wishlist.png'),
  wishlist1: require('../Assets/images/wishlist1.png'),
  share: require('../Assets/images/share.png'),
  close: require('../Assets/images/close.png'),
}

const colorMap = {
  Yellow: '#FFD700',
  Blue: '#007BFF',
  Gold: '#7f6000',
  Purple: '#800080',
  Orange: '#FFA500',
  Violet: '#8F00FF',
};



const ProductDetail = () => {
  const scrollRef = useRef(null);
  const scrollViewRef = useRef();

  const navigation = useNavigation();

  const route = useRoute();
  const { product_id } = route.params;
  const [mobile_num, setMobile_num] = useState("");
  const { getProductCount, saveCheckoutData, updateCounts } = useContext(GlobleInfo)
  const [item, setItem] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPowerPopup, setShowPowerPopup] = useState(false);
  const [showPopupContainer, setShowPopupContainer] = useState(true);
  const [showPopuplensePrice, setShowPopuplensePrice] = useState(false);
  const [selectLansType, setSelectLansType] = useState('')
  const [selectedLens, setSelectedLens] = useState({ type: '', price: '' });
  const [leftLens, setLeftLens] = useState({ SPH: "-0.00", CYL: "-0.25" });
  const [rightLens, setRightLens] = useState({ SPH: "-0.00", CYL: "-0.25" });
  const [add, setAdd] = useState('')
  const [axis, setAxis] = useState('')
  const [showAll, setShowAll] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null); // State for selected color

  const [showSharePopup, setShowSharePopup] = useState(false);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const shareUrl = `${SERVER_URL}/product-item/${product_id}`;
  const [copied, setCopied] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);


  const [mapDisplayAddress, setMapDisplayAddress] = useState(null);
  const [productQuntity, setProductQuntity] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(item?.result);
  const [selectedId, setSelectedId] = useState(null);
  console.log("productQuntity", productQuntity)
  console.log("selectedColor", selectedColor)




  useEffect(() => {
    if (item?.result?.frameColor && item?.result?.lenshColor) {
      try {
        setSelectedColor({
          frameColor: item.result.frameColor,
          lenshColor: item.result.lenshColor,
        });
      } catch (error) {
        console.error('Error setting colors:', error);
      }
    }
  }, [item]);



  useEffect(() => {
    const getToken = async () => {
      try {
        let token = await AsyncStorage.getItem('token');

        if (!token) {
          console.warn('No token found');
          return;
        }

        console.warn('[RAW TOKEN]', token);

        // ✅ Bearer remove 
        if (token.startsWith('Bearer ')) {
          token = token.replace('Bearer ', '');
        }

        // ✅ JWT format check
        if (token.split('.').length !== 3) {
          console.error('Invalid JWT token format');
          return;
        }

        const decodedToken = jwtDecode(token);
        console.warn('[RAW TOKEN] decodedToken:', decodedToken.mobile_num);
        setMobile_num(decodedToken.mobile_num);

      } catch (error) {
        console.error('JWT Decode Error:', error);
      }
    };

    getToken();
  }, []);

  // useEffect(() => {
  //   const fetchAddress = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("token");
  //       if (!token) {
  //         console.error("Token is missing.");
  //         return;
  //       }

  //       const config = {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       };

  //       const response = await axios.get( "http://10.0.2.2:8000/getallUserinfo", config);
  //       const data = response.data;

  //       console.log("Full API response:", data);

  //       // Ensure mobile_num is defined
  //       if (!mobile_num) {
  //         console.error("mobile_num is not defined.");
  //         return;
  //       }

  //       const dataAddress = data.filter(
  //         (user) => String(user.mobile_num) === String(mobile_num)
  //       );

  //       if (dataAddress.length > 0) {
  //         const selected = dataAddress[0];
  //         setMapDisplayAddress(`${selected.city}, ${selected.state}, ${selected.pincode}`);
  //       }

  //     } catch (error) {
  //       console.error("Error fetching address info:", error);
  //     }
  //   };

  //   fetchAddress();
  // }, [product_id, mobile_num]); 

  useEffect(() => {
    if (!mobile_num) return;

    const fetchAddress = async () => {
      try {
        let token = await AsyncStorage.getItem("token");
        if (!token) return;

        if (token.startsWith("Bearer ")) {
          token = token.replace("Bearer ", "");
        }

        const response = await axios.get(
          `${SERVER_API_URL}/getallUserinfo`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        const dataAddress = data.filter(
          (user) => String(user.mobile_num) === String(mobile_num)
        );

        if (dataAddress.length > 0) {
          const selected = dataAddress[0];
          setMapDisplayAddress(
            `${selected.city}, ${selected.state}, ${selected.pincode}`
          );
        }

      } catch (error) {
        console.error("Error fetching address info:", error);
      }
    };

    fetchAddress();
  }, [product_id, mobile_num]);


  // scrollToSection
  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });

    }
  };

  const handleOpenGoogleMap = async () => {
    try {
      // Get location permission
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn("Location permission denied");
          return;
        }
      }

      // Get current location
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Optional: Fetch user info
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            console.error("Token is missing.");
            return;
          }

          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          const response = await axios.get(`${SERVER_API_URL}/getallUserinfo`, config);
          const data = response.data;

          const dataAddress = data.filter((user) =>
            String(user.mobile_num) === String(mobile_num)
          );

          if (dataAddress.length > 0) {
            const address = `${dataAddress[0].city}, ${dataAddress[0].state}`;
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            Linking.openURL(googleMapsUrl);
          } else {
            console.error("No address found for this mobile number.");
          }
        },
        (error) => {
          console.error("Location Error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } catch (error) {
      console.error("Error in handleOpenGoogleMap:", error);
    }
  };

  const handleShare = (platform) => {
    let url = '';

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(item?.result?.product_name)}`;
        break;
      case 'email':
        url = `mailto:?subject=Check out this product&body=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        break;
    }

    if (url) {
      Linking.openURL(url).catch(err => {
        Alert.alert("Error", "Failed to open link");
        console.error("Error opening link:", err);
      });
    }
  };

  const handleCopy = async () => {
    await ClipboardAPI.setStringAsync(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    if (selectLansType) {
      const power = {
        selectLansType,
        selectedLensOrProducrPrice: selectedLens.price + product_price,
        selectedType: selectedLens.type,
        leftLens,
        rightLens,
        axis,
        add,
      };
      const product = {
        mobile_number: mobile_num,
        selectedColor,
        product_id,
      };

      saveCheckoutData({ power, product });
      navigation.navigate('ChekOutPage');
    } else {
      Alert.alert('Validation', 'Please select valid options.');
    }
  };

  const handleDirectPayment = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      // 🔐 Token check
      if (!token) {
        navigation.navigate('LoginPage'); // ya 'LoginScreen'
        return;
      }

      // 🔹 Special logs
      // console.warn('[PAYMENT DEBUG] product_price:', product_price);
      // console.warn('[PAYMENT DEBUG] mobile_num:', mobile_num);
      // console.warn('[PAYMENT DEBUG] product_id:', product_id);
      // console.warn('[PAYMENT DEBUG] productQuntity:', productQuntity);
      // console.warn('[PAYMENT DEBUG] selectedColor:', selectedColor);

      // ✅ Validation
      if (product_price && mobile_num && product_id && productQuntity) {
        const power = {
          selectedLensOrProducrPrice: product_price,
        };

        const product = {
          mobile_number: mobile_num,
          selectedColor: selectedColor,
          product_id: product_id,
          productQuntity: productQuntity,
        };

        saveCheckoutData({ power, product });
        navigation.navigate('CheckOutPage');
      } else {
        Alert.alert('Validation', 'Please select valid options.');
      }
    } catch (error) {
      console.error('Error checking token:', error);
    }
  };


  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const handlePowerClick = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'User details not found.');
      navigation.replace('Login');
      return;
    }
    setShowPowerPopup(!showPowerPopup);
  };

  const handleLanseClick = (type) => {
    setSelectLansType(type);
    setShowPopupContainer(false);
    setShowPopuplensePrice(true);
  };

  const showPawerPopup = (lensType, lensPrice) => {
    setShowPopuplensePrice(false);
    setSelectedLens({ type: lensType, price: lensPrice });
  };

  const handleLensChange = (lens, field, value) => {
    if (lens === 'left') {
      setLeftLens((prev) => ({ ...prev, [field]: value }));
    } else {
      setRightLens((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleChangeAdd = (field, value) => {
    if (field === 'ADD') {
      setAdd(parseFloat(value));
    }
  };

  const handleChangeAxis = (field, value) => {
    if (field === 'AXIS') {
      setAxis(parseFloat(value));
    }
  };

  const addToCart = async (item) => {
    const productDetails = item.result;
    const cartRaw = await AsyncStorage.getItem('cart');
    let existingCartItems = cartRaw ? JSON.parse(cartRaw) : [];

    const itemIndex = existingCartItems.findIndex(
      (cartItem) => cartItem.product_id === productDetails.product_id
    );

    if (itemIndex !== -1) {
      existingCartItems[itemIndex].quantity = Number(existingCartItems[itemIndex].quantity) || 1;
      existingCartItems[itemIndex].quantity += 1;
    } else {
      const newItem = {
        ...productDetails,
        quantity: 1,
      };
      existingCartItems.push(newItem);
    }

    await AsyncStorage.setItem('cart', JSON.stringify(existingCartItems));
    Alert.alert('Cart', `${productDetails.product_title} added to cart successfully!`);
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      const raw = await AsyncStorage.getItem('wishlist');
      setWishlistItems(raw ? JSON.parse(raw) : []);
    };

    fetchWishlist();
  }, []);

  const toggleWishlist = async (product) => {
    let updatedWishlist = [...wishlistItems];
    const index = updatedWishlist.findIndex((item) => item.product_id === product.product_id);

    if (index !== -1) {
      updatedWishlist.splice(index, 1);
    } else {
      updatedWishlist.push(product);
    }

    await AsyncStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setWishlistItems(updatedWishlist);
    updateCounts();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${SERVER_API_URL}/product/productdetail/${product_id}`);
        console.log("response new", response.data);
        setItem(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setSelectedImage(null);
  }, [product_id]);

  useEffect(() => {
    const fetchData1 = async () => {
      try {
        const response = await axios.get(`${SERVER_API_URL}/product`);
        const products = response.data;
        setAllProducts(products);
        console.log("products", products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData1();
  }, [product_id]);

  const handleColorSelect = (colorObj) => {
    setSelectedProduct(colorObj);
    setSelectedColor({ frameColor: colorObj.frameColor, lensColor: colorObj.lenshColor });
    setSelectedId(colorObj.productId);
  };



  const getColorsForProduct = (productTitle) => {
    const productsArray = Array.isArray(allProducts?.result)
      ? allProducts.result
      : [];

    return productsArray
      .filter(p => p.product_title === productTitle)
      .map(p => ({
        productId: p.product_id,
        frameColor: p.frameColor || 'Yellow',
        lenshColor: p.lenshColor || 'Blue',
        product_thumnail_img: p.product_thumnail_img,
        product_title: p.product_title,
        product_price: p.product_price,
        discount: p.discount,
        highlights: p.highlights,
        gender: p.gender,
      }));
  };


  // Logs for debugging
  console.log("item new", item);
  console.log("wishlist", wishlistItems);
  console.log("item?.result?.product_id", item?.result?.product_id);

  const images = item?.result?.product_all_img || [];


  const handleImageClickPopup = (index) => {
    setCurrentIndex(index);
    setSelectedImage(`${SERVER_API_URL}/${images[index]}`);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(`${SERVER_API_URL}/${images[nextIndex]}`);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(`${SERVER_API_URL}/${images[prevIndex]}`);
  };

  const product_price = item?.result?.product_price -
    (item?.result?.product_price * item?.result?.discount / 100);


  const renderReview = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.stars}>{'★'.repeat(item.rating)}</Text>
        <Text style={styles.title}> • Really Nice</Text>
      </View>
      <Text style={styles.comment}>{item.comment}</Text>
      <Text style={styles.user}>{item.user}</Text>
      <Text style={styles.verified}>✔ Verified Purchase • {item.date}</Text>
    </View>
  );


  const [scrollX, setScrollX] = useState(0);

  // const lowStockItems = allProducts?.result?.filter(
  //     frame => frame.count_in_stock > 0 && frame.count_in_stock < 7
  //   ) || [];

  // useEffect(() => {
  //   let interval;
  //   if (lowStockItems.length > 1) {
  //     interval = setInterval(() => {
  //       setScrollX(prev => {
  //         const newX = prev + 200;
  //         scrollRef.current?.scrollToOffset({ offset: newX, animated: true });
  //         return newX >= lowStockItems.length * 200 ? 0 : newX;
  //       });
  //     }, 1000); // every 3 seconds
  //   }
  //   return () => clearInterval(interval);
  // }, [lowStockItems]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size={60}
          color="#00ffff"
        />
      </View>
    );
  }

  return (
    <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.mainContent}>
        {/* Banner */}
        <Image
          source={Images['banner']}
          style={styles.banner}
          resizeMode="cover"
        />
        {/* Product Image Section */}
        <View style={styles.productImageSection}>
          <View style={styles.mainImage}>
            {/* Wishlist + Share Icons */}
            <View style={styles.shareContainer}>
              {/* Wishlist Toggle */}
              <TouchableOpacity onPress={() => toggleWishlist(item.result)}>
                <Image
                  source={
                    wishlistItems.some(
                      wishlistItem => wishlistItem.product_id === item?.result?.product_id
                    )
                      ? Images['wishlist']   // filled heart
                      : Images['wishlist1']  // empty heart
                  }
                  style={styles.shareIcon}
                />
              </TouchableOpacity>

              {/* Share Button */}
              <TouchableOpacity onPress={() => setShowSharePopup(true)}>
                <Image source={Images['share']} style={styles.shareIcon} />
              </TouchableOpacity>
            </View>


            {/* Share Modal */}
            <Modal
              visible={showSharePopup}
              transparent
              animationType="slide"
              onRequestClose={() => setShowSharePopup(false)}
            >
              <View style={styles.sharePopupOverlay}>
                <View style={styles.sharePopup}>
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => setShowSharePopup(false)}
                  >
                    <Image source={Images['close']} style={styles.icon} />
                  </TouchableOpacity>

                  <Text style={styles.shareTitleText}>Share this Product</Text>


                  <View style={styles.shareProductInfo}>
                    <Image
                      source={{ uri: `${SERVER_API_URL}/${item?.result?.product_thumnail_img}` }}
                      style={styles.shareProductImg}
                    />
                    <View style={styles.shareProductText}>
                      <Text style={styles.shareBrand}>{item?.result?.product_title}</Text>
                      <Text style={styles.shareHighlights}>{item?.result?.highlights}</Text>
                      <Text style={styles.shareHighlights}>Amezing...</Text>
                    </View>
                  </View>

                  <View style={styles.copyContainer}>
                    <TextInput
                      value={shareUrl}
                      editable={false}
                      style={styles.shareLink}
                    />
                    <TouchableOpacity
                      style={[styles.copyBtn, copied && styles.copiedBtn]}
                      onPress={handleCopy}
                    >
                      <Text style={styles.copyBtnText}>{copied ? 'Copied!' : 'Copy'}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.shareIcons}>
                    <Text style={styles.socialIcon} onPress={() => handleShare("facebook")}>📘</Text>
                    <Text style={styles.socialIcon} onPress={() => handleShare("twitter")}>🐦</Text>
                    <Text style={styles.socialIcon} onPress={() => handleShare("email")}>✉️</Text>
                    <Text style={styles.socialIcon} onPress={() => handleShare("whatsapp")}>💬</Text>
                  </View>

                </View>
              </View>
            </Modal>

            <TouchableOpacity
              onPress={() => handleImageClickPopup(0)}
              style={styles.largeImageWrapper}
            >
              <Image
                source={{ uri: selectedImage || `${SERVER_API_URL}/${item?.result?.product_thumnail_img}` }}
                style={styles.largeImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.thumbnailRow}>
          {item?.result?.product_all_img?.slice(0, 4).map((img, index) => (
            <TouchableOpacity
              key={`${img}-${index}`}
              style={styles.thumbnail}
              onPress={() => handleImageClick(`${SERVER_API_URL}/${img}`)}
            >
              <Image
                source={{ uri: `${SERVER_API_URL}/${img}` }}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Product Info Section */}

        <View style={styles.productInfoSection}>
          <Text style={styles.productHighlight}>
            {item?.result?.highlights} Stylish Sunglasses
          </Text>
          <Text style={styles.productTitle}>{item?.result?.product_title}</Text>
        </View>


        <View style={styles.cardContainer}>
          <Text style={styles.price}>₹{(product_price * productQuntity).toFixed(0)}/-</Text>

          <Text style={styles.shipping}>Get <Text style={styles.bold}>Fast, Free Shipping</Text> with</Text>

          {mapDisplayAddress && (
            <>
              <TouchableOpacity onPress={handleOpenGoogleMap}>
                <Text style={styles.location}>
                  <Icon name="location-sharp" size={20} /> Delivering to {mapDisplayAddress}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleOpenGoogleMap}>
                <Text style={styles.updateLocation}>- location</Text>
              </TouchableOpacity>
            </>
          )}

          <Text style={styles.stock}>In Stock</Text>

          <View style={styles.quantityContainer}>
            <Text style={styles.label}>Quantity:</Text>
            <TouchableOpacity style={styles.dropdownToggle} onPress={() => setShowDropdown(true)}>
              <Text style={styles.dropdownText}>{productQuntity}</Text>
            </TouchableOpacity>
          </View>

          {/* Quantity Modal */}
          <Modal visible={showDropdown} transparent animationType="fade">
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowDropdown(false)}>
              <View style={styles.dropdownMenu}>
                {[...Array(6)].map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setProductQuntity(index + 1);
                      setShowDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItem}>{index + 1}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>

          <TouchableOpacity style={styles.cartButton} onPress={() => addToCart(item)}>
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buyButton, !selectedColor && { opacity: 0.5 }]}
            onPress={handleDirectPayment}
            disabled={!selectedColor}
          >
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>

          <Text style={styles.infoText}>Ships from <Text style={styles.bold}>Softgenics Ind. Pvt. Ltd.</Text></Text>
          <Text style={styles.infoText}>Sold by <Text style={styles.link}>SOJOS Vision</Text></Text>
          <Text style={styles.infoText}>Returns <Text style={styles.link}>30-day refund / replacement</Text></Text>
          <Text style={styles.infoText}>Payment <Text style={styles.link}>Secure transaction</Text></Text>
        </View>





        <View style={styles.technicalDetails}>
          <Text style={styles.sectionTitle}>Technical Details</Text>

          <View style={styles.detailList}>
            <Text style={styles.detailItem}><Text style={styles.bold}>Product ID:</Text> DCM413</Text>
            <Text style={styles.detailItem}><Text style={styles.bold}>Frame Shape:</Text> 54 mm / 16 mm / 145 mm</Text>
            <Text style={styles.detailItem}><Text style={styles.bold}>Frame Type:</Text> 54 mm / 16 mm / 145 mm</Text>

            <View style={styles.colorSection}>
              <Text style={styles.bold}>Frame Color:</Text>
              {!selectedColor && <Text style={styles.chooseColor}>Please select color</Text>}

              <View style={styles.colorOptions}>
                {getColorsForProduct(item?.result?.product_title).length > 0 ? (
                  getColorsForProduct(item?.result?.product_title).map((colorObj, index) => (
                    <TouchableOpacity
                      key={`${colorObj.productId}-${index}`}
                      onPress={() => {
                        // handleColorSelect(colorObj.frameColor, colorObj.lenshColor)
                        handleColorSelect(colorObj)
                        navigation.navigate('ProductDetail', {
                          product_id: colorObj.productId,
                        })
                      }}
                    >
                      <View style={styles.colorDot}>
                        <View
                          style={[
                            styles.halfColor,
                            { backgroundColor: colorMap[colorObj.frameColor] || '#ccc' },
                          ]}
                        />
                        <View
                          style={[
                            styles.halfColor,
                            { backgroundColor: colorMap[colorObj.lenshColor] || '#eee' },
                          ]}
                        />
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noColor}>No Colors Available</Text>
                )}
              </View>

            </View>

            {showAll && (
              <>
                <Text style={styles.detailItem}><Text style={styles.bold}>Discount:</Text> 20%</Text>
                <Text style={styles.detailItem}><Text style={styles.bold}>Frame Material:</Text> Metal</Text>
                <Text style={styles.detailItem}><Text style={styles.bold}>Frame Description:</Text> Stylish & durable</Text>
                <Text style={styles.detailItem}><Text style={styles.bold}>Lens Information:</Text> UV Protected</Text>
                <Text style={styles.detailItem}><Text style={styles.bold}>Model No:</Text> 2023-A1</Text>
                <Text style={styles.detailItem}><Text style={styles.bold}>Frame Size:</Text> 54 mm / 16 mm / 145 mm</Text>
              </>
            )}
          </View>

          {selectedColor && (
            <Text style={styles.selectedColorText}>
              Selected Color: <Text style={styles.bold}>{selectedColor.frameColor}</Text> (Frame) &{" "}
              <Text style={styles.bold}>{selectedColor.lensColor}</Text> (Lens)
            </Text>
          )}

          <TouchableOpacity onPress={() => setShowAll(!showAll)} style={styles.seeAllBtn}>
            <Text style={styles.seeAllBtnText}>{showAll ? "See Less" : "See All"}</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.container}>
          <Text style={styles.heading}>Customer Reviews & Ratings</Text>
          <Text style={styles.subheading}>4.0 ★★★★ - 45 reviews</Text>

          <FlatList
            data={reviews.slice(0, 2)}
            keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
            renderItem={renderReview}
            scrollEnabled={false}
          />


          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.seeAll}>See all reviews</Text>
          </TouchableOpacity>

          {/* Modal */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>All Reviews</Text>
                  <Pressable onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeButton}>✕</Text>
                  </Pressable>
                </View>

                <ScrollView>
                  {reviews.map((item, index) => (
                    <View key={index} style={styles.card}>
                      <View style={styles.row}>
                        <Text style={styles.stars}>{'★'.repeat(item.rating)}</Text>
                        <Text style={styles.title}> • Really Nice</Text>
                      </View>
                      <Text style={styles.comment}>{item.comment}</Text>
                      <Text style={styles.user}>{item.user}</Text>
                      <Text style={styles.verified}>✔ Verified Purchase • {item.date}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>


        <View style={styles.suggestedSection}>
          <Text style={styles.sectionHeading}>Suggested Frames</Text>
          <View style={styles.framesRow}>
            {item?.suggestedProducts?.length > 0 ? (
              item.suggestedProducts.map((frame) => (
                <View key={frame.id} style={styles.frameCard}>
                  <TouchableOpacity
                    onPress={() => {
                      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                      navigation.navigate("ProductDetail", { product_id: frame.product_id });
                    }}

                  >
                    <View style={styles.frameImage}>
                      {frame.product_thumnail_img ? (
                        <Image
                          source={{ uri: `${SERVER_API_URL}/${frame.product_thumnail_img}` }}
                          style={styles.productImage}
                          resizeMode="contain"
                        />
                      ) : (
                        <Text style={styles.noImage}>Image Not Available</Text>
                      )}
                    </View>
                  </TouchableOpacity>

                  <Text style={styles.frameTitle}>{frame.product_title || 'Unnamed Product'}</Text>

                  <View style={styles.discountContainer}>
                    <Text style={styles.discountTitle}>₹{frame.product_price}</Text>
                    <Text style={styles.discountOff}>
                      ({frame.discount}% OFF)
                      <Text style={styles.genderText}>For {frame.gender}</Text>
                    </Text>
                  </View>

                  <Text style={styles.discountedPrice}>
                    ₹{(frame.product_price - (frame.product_price * frame.discount / 100)).toFixed(0)}/-
                  </Text>

                  <Text style={styles.highlightText}>{frame.highlights || 'N/A'}</Text>
                  <Text style={styles.materialText}>Material: {frame.material || 'fiber'}</Text>
                </View>
              ))
            ) : (
              <Text>No products match the selected criteria.</Text>
            )}
          </View>
        </View>

      </View>
    </ScrollView>
  );

};


const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  scrollViewContainer: {
    paddingBottom: 20,  // or any value to avoid content getting cut off at the bottom
  },
  mainContent: {
    justifyContent: 'center', // vertical alignment in a column
    alignItems: 'center',
    width: '100%',
    gap: 20,
    // marginTop: 10,
    backgroundColor: '#ffffff',
  },
  banner: {
    width: '100%',
    height: 200,
  },
  productImageSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  mainImage: {
    alignSelf: 'center',     // 'centre' is invalid, use 'center'
    width: '100%',
    height: 300,
    padding: 10,             // Adds space inside the container on all sides
    margin: 10,              // (Optional) Adds space outside the image
    borderRadius: 8,         // (Optional) Smooth edges
  },

  shareContainer: {
    position: 'absolute',
    right: 22,
    top: 3,
    flexDirection: 'column',
    gap: 8,
    zIndex: 2,
    padding: 10,        // Adds space inside the container
    backgroundColor: 'transparent', // Optional for visual clarity
    borderRadius: 25,   // Optional if you want rounded container
  },

  shareIcon: {
    width: 25,
    height: 25,
    padding: 8,
    borderRadius: 50,
    marginBottom: 5,
  },
  largeImageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeImage: {
    width: '90%',
    height: 300,
    borderRadius: 8,
  },
  sharePopupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sharePopup: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  closeBtn: {
    alignSelf: 'flex-end',
  },
  shareTitleText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  shareProductInfo: {
    flexDirection: 'row',
    marginVertical: 10,
    width: '85%',
  },
  shareProductImg: {
    width: 120,
    height: 80,
    marginRight: 10,
    borderRadius: 6,
  },
  shareProductText: {
    flex: 1,
    paddingTop: 10,
  },
  shareBrand: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  shareHighlights: {
    color: '#666',
    fontSize: 14,
  },
  copyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 8,
  },
  shareLink: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    color: '#333',
  },
  copyBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#007BFF',
    borderRadius: 6,
  },
  copiedBtn: {
    backgroundColor: 'green',
  },
  copyBtnText: {
    color: '#fff',
  },
  shareIcons: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 12,
  },
  socialIcon: {
    fontSize: 24,
    color: '#444',
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 40,
    marginBottom: 5,
  },
  thumbnailRow: {
    flexDirection: 'row',
    padding: 10,             // Adds space inside the container on all sides
    margin: 10,              // (Optional) Adds space outside the image
    borderRadius: 8,

    gap: 8, // reduce gap to fit better
    // marginTop: 10,
    justifyContent: 'center',
  },
  thumbnail: {
    width: 85, // reduced width
    height: 80,
    backgroundColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: 83,
    height: 80,
    borderRadius: 4,
  },

  productInfoSection: {
    width: '95%',
    alignSelf: 'center',
    padding: 5,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 0.5,
    marginTop: 7,
  },
  productHighlight: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '550',
    color: '#444',

  },

  technicalDetails: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 16,
    borderRadius: 16,
    width: '95%',
    alignSelf: 'center',

  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 6,
  },

  detailList: {
    marginBottom: 12,
  },

  detailItem: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
    lineHeight: 22,
  },

  bold: {
    fontWeight: '600',
    color: '#000',
  },

  colorSection: {
    marginTop: 12,
  },

  chooseColor: {
    fontSize: 14,
    color: '#d32f2f',
    marginVertical: 5,
    fontStyle: 'italic',
  },

  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 10,
  },

  colorBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },

  selectedColorBox: {
    borderColor: '#007aff',
    borderWidth: 2,
    shadowColor: '#007aff',
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },

  selectedColorText: {
    marginTop: 14,
    fontSize: 15,
    color: '#2c2c2c',
    fontWeight: '500',
  },

  seeAllBtnText: {
    color: '#98e3e6',
    fontWeight: 'bold',
    fontSize: 15,

  },
  cardContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  selectedColorText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },
  bold: {
    fontWeight: '600',
    color: '#000',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    alignItems: 'center',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#2874f0',
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    alignItems: 'center',
  },
  productTitlee: {
    fontSize: 12,
    color: '#222',
    marginBottom: 6,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d32f2f',
  },

  cardContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,  // only left and right
    marginBottom: 10,      // only bottom
    elevation: 0.5,
    width: '95%',
  },

  price: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333'
  },
  shipping: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6
  },
  bold: {
    fontWeight: 'bold'
  },
  location: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4
  },
  updateLocation: {
    color: '#007BFF',
    marginBottom: 8
  },
  stock: {
    color: 'green',
    marginBottom: 10
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  label: {
    marginRight: 10
  },
  dropdownToggle: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    width: 60,
    alignItems: 'center'
  },
  dropdownText: {
    fontSize: 14
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // slightly darker for more depth
  },

  dropdownMenu: {
    backgroundColor: '#e0f7f8', // lightened version of #98e3e6
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5, // for Android shadow
    minWidth: 160,
  },

  dropdownItem: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomColor: '#bcecef', // subtle divider
    borderBottomWidth: 1,
    color: '#333',
  },
  cartButton: {
    backgroundColor: '#f0c14b',
    padding: 10,
    marginVertical: 8,
    borderRadius: 5
  },
  buyButton: {
    backgroundColor: '#98e3e6',

    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  buttonText: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold'
  },
  infoText: {
    fontSize: 13,
    color: '#333',
    marginTop: 4
  },
  link: {
    color: '#007BFF'
  },


  container: {
    flex: 1,
    padding: 15,
    width: '95%',

  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  subheading: {
    color: '#FCBF02',
    marginBottom: 10
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  stars: {
    color: '#00B300',
    fontWeight: 'bold'
  },
  title: {
    marginLeft: 6,
    fontWeight: '600'
  },
  comment: {
    color: '#333',
    marginVertical: 6,
    fontSize: 14
  },
  user: {
    color: '#666',
    fontSize: 13
  },
  verified: {
    color: '#888',
    fontSize: 12,
    marginTop: 4
  },
  seeAll: {
    //color: '#007BFF',
    color: '#98e3e6',
    textAlign: 'left',
    marginTop: 6,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '80%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  closeButton: {
    fontSize: 20,
    color: '#FF0000',
    padding: 4
  },


  suggestedSection: {
    padding: 16,
    backgroundColor: '#ffffff',
    flex: 1,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000000',
  },
  framesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  frameCard: {
    width: '48%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    elevation: 3,
  },
  frameImage: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 8,
  },

  noImage: {
    color: '#999',
    textAlign: 'center',
  },
  frameTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  discountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountTitle: {
    fontSize: 14,
    color: 'gray',
    fontWeight: 'bold',
    textDecorationLine: 'line-through',
  },
  discountOff: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#e53935',
  },
  genderText: {
    color: '#e8a617',
    textTransform: 'uppercase',
    fontSize: 9,
  },
  discountedPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#388e3c',
    marginTop: 2,
  },
  highlightText: {
    fontSize: 12,
    color: '#555',
    marginTop: 3,
  },
  materialText: {
    fontSize: 12,
    color: '#333',
  },



  lowStockContainer: {
    padding: 10,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  lowStockCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    height: 250,
  },
  lowStockImage: {
    width: '100%',
    height: 120,
    borderRadius: 5,
  },
  noImage: {
    textAlign: 'center',
    padding: 10,
    color: 'gray',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
  },
  discountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  discount: {
    color: '#e53935',
    fontWeight: 'bold',
  },
  stockWarning: {
    color: '#e8a617',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  finalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388e3c',
  },
  productDescription: {
    fontSize: 12,
    color: '#444',
    marginVertical: 2,
  },
  productMaterial: {
    fontSize: 12,
    color: '#888',
  },


  // color modifiy

  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },

  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  halfColor: {
    flex: 1,
  },







});


export default ProductDetail;