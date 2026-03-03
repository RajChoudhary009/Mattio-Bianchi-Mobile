import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SERVER_API_URL } from '../server/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Header from '../components/Header';



const categories = [
  { name: 'Aviator', image: require('../Assets/images/goggles/aviator-vector.webp') },
  { name: 'Cats Eye', image: require('../Assets/images/goggles/cats-eye.webp') },
  { name: 'Rectangle', image: require('../Assets/images/goggles/rectangle-vector.webp') },
  { name: 'Round', image: require('../Assets/images/goggles/round-vector.webp') },
  { name: 'Square', image: require('../Assets/images/goggles/square-vector.webp') },
  { name: 'Wayfarer', image: require('../Assets/images/goggles/wayfarer-vector.webp') },


];

const glasses = [
  {
    src: "https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/M/8/M8021BU20V_1_lar.jpg",
    glass_brand: "Tees By Fastrack ",
    glass_name: "Premium Blue Aviator Sunglasses For Men And Women with UV Protection",
    glass_price: "₹1,000",
    glass_tax: "Inclusive of all taxes"
  },
  {
    src: "https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/P/5/P513GY5V_1_lar.jpg",
    glass_brand: "RayShield Signature ",
    glass_name: "Stylish Grey Rectangle Sunglasses for Men with Polarized Lenses",
    glass_price: "₹850",
    glass_tax: "Inclusive of all taxes"
  },
  {
    src: "https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/F/T/FT1508UFP5MRDV_1_lar.jpg",
    glass_brand: "Urban Eyes Elite ",
    glass_name: "Matte Red Round Sunglasses with Anti-Glare Coating for All-Day Comfort",
    glass_price: "₹1,200",
    glass_tax: "Inclusive of all taxes"
  },
  {
    src: "https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/F/T/FT1510UFA1MBLV_1_lar.jpg",
    glass_brand: "SunBlaze Luxe ",
    glass_name: "Blue Mirror Finish Sunglasses for Women with Lightweight Frame",
    glass_price: "₹999",
    glass_tax: "Inclusive of all taxes"
  },
  {
    src: "https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/p/4/p420bk3p_1_lar.jpg",
    glass_brand: "VisionPro Classic ",
    glass_name: "Classic Black Wayfarer Sunglasses for Men – Timeless Design",
    glass_price: "₹950",
    glass_tax: "Inclusive of all taxes"
  },
  {
    src: "https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/F/T/FT1278WFP6MOLV_1_lar.jpg",
    glass_brand: "OpticOne Urban ",
    glass_name: "Olive Green Square Frame Sunglasses with Gradient Lenses",
    glass_price: "₹1,100",
    glass_tax: "Inclusive of all taxes"
  },
  {
    src: "https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/F/T/FT1508UFP5MRDV_1_lar.jpg",
    glass_brand: "ZoomWear Exclusive ",
    glass_name: "Limited Edition Matte Red Aviator Sunglasses with HD Vision",
    glass_price: "₹1,050",
    glass_tax: "Inclusive of all taxes"
  }
];
const { width } = Dimensions.get('window');

const HomePage = () => {
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);


  const [scrollIndex, setScrollIndex] = useState(0);

  const [bannerData, setBannerData] = useState([])
  const [brandHeading, setBrandHeading] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [newArrivel, setNewArrivel] = useState([]);
  const [slidersData, setSlidersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  // ✅ Call hooks unconditionally
  useEffect(() => {
    if (!newArrivel || newArrivel.length === 0) return;

    const interval = setInterval(() => {
      setScrollIndex((prevIndex) =>
        prevIndex < newArrivel.length - 1 ? prevIndex + 1 : 0
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [newArrivel]);

  useEffect(() => {
    if (scrollRef.current && newArrivel && newArrivel.length > 0) {
      scrollRef.current.scrollTo({
        x: scrollIndex * 200, // Adjust width and margin to your layout
        animated: true,
      });
    }
  }, [scrollIndex]);

  useEffect(() => {
    if (scrollRef2.current && newArrivel && newArrivel.length > 0) {
      scrollRef2.current.scrollTo({
        x: scrollIndex * 200, // Adjust width and margin to your layout
        animated: true,
      });
    }
  }, [scrollIndex]);

  useEffect(() => {
    if (scrollRef3.current && newArrivel && newArrivel.length > 0) {
      scrollRef3.current.scrollTo({
        x: scrollIndex * 200, // Adjust width and margin to your layout
        animated: true,
      });
    }
  }, [scrollIndex]);

  useEffect(() => {
    fetchBannerData();
    fetchBrandHeading();
  }, []);

  const fetchBannerData = async () => {
    try {
      const response = await axios.get(`${SERVER_API_URL}/api/carousel/all`);
      console.log("Carousel Data:", response.data);
      setBannerData(response.data);
    } catch (error) {
      console.error("Error fetching banner data:", error.message);
      Alert.alert("Error", "Failed to fetch banner data.");
    }
  };

  const fetchBrandHeading = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8000/brand`);
      setBrandHeading(response.data.result);
    } catch (err) {
      console.error("Error fetching brand heading:", err.message);
      Alert.alert("Error", "Failed to fetch brand heading.");
    }
  };



  useEffect(() => {
    const fetchAllData = async (retries = 3, delay = 1000) => {
      try {
        // Fetch sliders
        const sliderResponse = await axios.get(`http://10.0.2.2:8000/api/slider`);
        if (Array.isArray(sliderResponse.data?.data)) {
          setSlidersData(sliderResponse.data.data);
        }

        // Fetch products
        const productResponse = await axios.get(`http://10.0.2.2:8000/product`);
        setAllProducts(productResponse.data.result);

        // Fetch new arrival
        const newArrivalResponse = await axios.get(`http://10.0.2.2:8000/new/arrivel/`);
        setNewArrivel(newArrivalResponse.data.result);

        setIsLoading(false); // Only after all data fetched
      } catch (error) {
        if (retries > 0) {
          setTimeout(() => fetchAllData(retries - 1, delay), delay);
        } else {
          console.error("Data fetch failed after retries", error);
          Alert.alert("Error", "Failed to fetch data. Please try again later.");
          setIsLoading(false);
        }
      }
    };

    fetchAllData();
  }, []);



  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#000" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading data...</Text>
      </View>
    );
  }






  const textBanner = bannerData.find(b => b.section === 'section_2' && b.place === "Group_A" && b.exact_place === "left")?.image_url;

  const heliusGlasses = bannerData.find(b => b.section === 'section_1' && b.place === "Group_B" && b.exact_place === "center_poster")?.image_url;

  const lykosEyewear = bannerData.find(b => b.section === 'section_3' && b.place === "Group_B" && b.exact_place === "center_poster")?.image_url;

  const stayAheadInStyleBanner = bannerData.find(b => b.section === 'section_2' && b.place === "Group_C" && b.exact_place === "center_poster")?.image_url;

  const Blinkers = bannerData.find(b => b.section === 'section_3' && b.place === "Group_C" && b.exact_place === "center_poster")?.image_url;

  const EyePoppin = bannerData.find(b => b.section === 'section_4' && b.place === "Group_C" && b.exact_place === "center_poster")?.image_url;





  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Manual Slider Section */}

        <View style={styles.sliderMainContainer}>
          <View style={styles.topIconContainer}>
            {slidersData.map((item, index) =>
              item.slider_name === 'top_mini_image' ? (
                <TouchableOpacity key={index} style={styles.topIconWrapper}
                  onPress={() => navigation.navigate('ProductDisplay', { cetegoris: item.slider_url })}
                >
                  <Image
                    source={{ uri: `${SERVER_API_URL}/uploads/${item.slider_url}` }}
                    resizeMode="contain"
                    style={styles.topIconImage}
                  />
                </TouchableOpacity>
              ) : null
            )}
          </View>

          {/* Navigation Buttons */}
          {/* <View style={styles.sliderNavigation}>
            <Text style={styles.navButton}>{'\u276E'}</Text>
            <Text style={styles.navButton}>{'\u276F'}</Text>
          </View> */}

          {!isLoading && slidersData.length > 0 ? (
            <ScrollView
              horizontal
              ref={scrollRef}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
            >
              {slidersData.map((item, index) =>
                item.slider_name === 'banner' ? (
                  <TouchableOpacity
                    key={index}
                    onPress={() => navigation.navigate('ProductDisplay', { id: item.slider_link })}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: `${SERVER_API_URL}/uploads/${item.slider_url}` }}
                      style={styles.bannerImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ) : null
              )}
            </ScrollView>
          ) : (
            <ActivityIndicator size="small" color="#000" />
          )}
        </View>


        <View style={styles.sunglassgrid}>
          {slidersData.map((item, index) =>
            item.slider_name === 'product_image' ? (
              <TouchableOpacity
                key={index}
                style={styles.sunglasscard}
              //onPress={() => navigation.navigate('ProductDisplay', { id: item.slider_link })}
              >
                <Image
                  source={{ uri: `${SERVER_API_URL}/uploads/${item.slider_url}` }}
                  style={styles.sunglassimage}
                  resizeMode="cover"
                />
                <View style={styles.sunglassoverlay}>
                  <Text style={styles.sunglasstitle}>Sunglass Styles </Text>
                </View>
              </TouchableOpacity>
            ) : null
          )}
        </View>

        <View style={styles.newArrivalContainer}>
          <Text style={styles.heading}>New Arrivel</Text>

          {isLoading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : newArrivel?.length > 0 ? (
            <ScrollView
              horizontal
              ref={scrollRef2}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
            >

              {newArrivel.slice(0, 9).map((frame) => {
                const finalPrice = (
                  frame.product_price -
                  (frame.product_price * frame.discount) / 100
                ).toFixed(0);

                return (
                  <TouchableOpacity
                    key={frame.product_id}
                    //onPress={() => {
                    // Navigation to `/product-item/${frame.product_id}`
                    //}}
                    style={styles.card}
                  >
                    <Image
                      source={{ uri: `http://10.0.2.2:8000/${frame.product_thumnail_img}` }}
                      style={styles.image}
                    />
                    <Text style={styles.brand}>{frame.product_title}</Text>
                    <Text style={styles.name}>{frame.highlights}</Text>

                    <View style={styles.discountContainer}>
                      <Text style={styles.originalPrice}>₹{frame.product_price}</Text>
                      <Text style={styles.discountText}>
                        ({frame.discount}% OFF)
                        <Text style={styles.stockWarning}> For {frame.gender}</Text>
                      </Text>
                    </View>

                    <Text style={styles.finalPrice}>₹{finalPrice}/-</Text>
                    <Text style={styles.taxText}>Inclusive of all taxes</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <Text style={styles.noProductsText}>No products found</Text>
          )}
        </View>
        {/* Categories Grid */}
        <View style={styles.grid}>
          {categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryItem}
            //onPress={() => navigation.navigate('ProductDisplay', { category: item.name })}
            >
              <Image source={item.image} style={styles.icon} />
              <Text style={styles.label}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.bannerContainer}>
          {brandHeading
            .filter((heading) => heading.section === 'section_1')
            .map((heading, index) => (
              <Text key={index} style={styles.brandTitle}>
                {heading.brand_name}
              </Text>
            ))}
          <View style={styles.hrLine} />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
        //onPress={() => navigation.navigate('ProductDetail', { id: 41 })}
        >
          <Image
            source={{ uri: `${SERVER_API_URL}/uploads/${heliusGlasses}` }}
            style={styles.glassesImage}
            resizeMode="contain"
          />
        </TouchableOpacity>


        <View style={styles.newArrivalContainer}>
          <Text style={styles.heading}>Frequently Bought</Text>

          {isLoading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : allProducts?.length > 0 ? (
            <ScrollView
              horizontal
              ref={scrollRef3}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
            >

              {allProducts.slice(0, 9).map((frame) => {
                const finalPrice = (
                  frame.product_price -
                  (frame.product_price * frame.discount) / 100
                ).toFixed(0);

                return (
                  <TouchableOpacity
                    key={frame.product_id}
                    onPress={() => {
                      // Navigation to `/product-item/${frame.product_id}`
                    }}
                    style={styles.card}
                  >
                    <Image
                      source={{ uri: `http://10.0.2.2:8000/${frame.product_thumnail_img}` }}
                      style={styles.image}
                    />
                    <Text style={styles.brand}>{frame.product_title}</Text>
                    <Text style={styles.name}>{frame.highlights}</Text>

                    <View style={styles.discountContainer}>
                      <Text style={styles.originalPrice}>₹{frame.product_price}</Text>
                      <Text style={styles.discountText}>
                        ({frame.discount}% OFF)
                        <Text style={styles.stockWarning}> For {frame.gender}</Text>
                      </Text>
                    </View>

                    <Text style={styles.finalPrice}>₹{finalPrice}/-</Text>
                    <Text style={styles.taxText}>Inclusive of all taxes</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <Text style={styles.noProductsText}>No products found</Text>
          )}
        </View>

      </ScrollView>







    </View>

  );
};



const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },



  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },

  categoryItem: {
    width: '30%',
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },

  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
  },

  // top image

  topIconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    // paddingVertical: 12,
  },
  topIconWrapper: {
    width: 70,
    height: 70,
    // borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',

    // Shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,

    // Elevation for Android
    // elevation: 3,

    marginVertical: 1,
  },

  topIconImage: {
    width: 70,
    height: 70,
  },
  // top image

  sliderMainContainer: {
    width: '100%',
    // marginTop: 16,
    marginBottom: 16,
    position: 'relative',
  },
  sliderNavigation: {
    position: 'absolute',
    top: '45%',
    left: 10,
    right: 10,
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    fontSize: 26,
    color: '#333',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  sliderScroll: {
    paddingHorizontal: 16,
  },
  bannerImage: {
    width: width - 50,
    height: 200,
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },




  newArrivalContainer: {
    width: '100%',
    backgroundColor: '#43cea2',
    paddingVertical: 16,
  },

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    paddingLeft: 16,
    marginBottom: 10,
  },
  loadingText: {
    textAlign: 'center',
    color: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  card: {
    width: '200',
    backgroundColor: '#fff',
    marginRight: 16,
    borderRadius: 10,
    padding: 10,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 130,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  brand: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 6,
  },
  name: {
    fontSize: 12,
    color: '#333',
  },
  discountContainer: {
    marginTop: 6,
  },
  originalPrice: {
    fontSize: 11,
    fontWeight: '700',
    color: '#272932',
  },
  discountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#272932',
  },
  stockWarning: {
    color: '#00c2cb',
    fontWeight: '600',
  },
  finalPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#272932',
    marginTop: 4,
  },
  taxText: {
    fontSize: 10,
    color: '#777',
    marginTop: 2,
  },
  noProductsText: {
    textAlign: 'center',
    color: '#fff',
  },


  sunglassgrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  sunglasscard: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  sunglassimage: {
    width: '100%',
    height: '100%',
  },
  sunglassoverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 6,
  },
  sunglasstitle: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },


  bannerContainer: {
    width: '98%',

    alignItems: 'center',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  hrLine: {
    marginTop: 8,
    width: 90,
    height: 1,
    backgroundColor: '#000',
  },
  glassesImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },



});
export default HomePage;