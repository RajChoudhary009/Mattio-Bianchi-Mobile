import React, { useState, useContext, useEffect } from 'react';
import { SERVER_API_URL } from '../server/server';
import axios from "axios";
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Image, Text, FlatList, ScrollView, Modal, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { GlobleInfo } from '../context/GlobleInfoContext';


const Sunglasses = {
  PowerGlasses: {
    category: {
      Men: [
        'Daily Wear Lenses - Starting from ₹900',
        'Monthly Disposable Lenses - Starting from ₹1100',
      ],
      Women: [
        'Premium Color Lenses - Starting from ₹1500',
        'Moisture-Rich Lenses - Starting from ₹1300',
      ],
      Kids: [
        'Vibrant Blue - Starting from ₹950',
        'Soft Daily Lenses - Starting from ₹700',
      ],
    },

    brands: [
      'FreshLook',
      'Air Optix',
      'Dailies',
      'Biofinity',
    ],

    picks: [
      'Best for Sensitive Eyes',
      'Extended Wear Lenses',
      'Blue Light Blocking Lenses',
    ],

    frameShapes: [
      'Toric Lenses',
      'Multifocal Lenses',
      'Scleral Contact Lenses',
    ],

    collections: [
      'Comfort Max Series',
      'Vision Ultra Pro',
      'Fashion Color Lenses',
      'Hydration Plus Essentials',
    ],
  },
};


const contactLenses = {
  PowerGlasses: {
    category: {
      Men: [
        'Soft Contact Lenses - Starting from ₹800',
        'Disposable Daily Lenses - Starting from ₹1000',
      ],
      Women: [
        'Hydrogel Lenses - Starting from ₹1200',
      ],
      Kids: [
        'Natural Brown - Starting from ₹900',
      ],
    },

    brands: [
      'Acuvue',
      'Bausch + Lomb',
      'Alcon',
      'CooperVision',
    ],

    picks: [
      'Best for Dry Eyes',
      'Long-Lasting Comfort',
      'UV Protection Lenses',
    ],

    frameShapes: [
      'Soft Lenses',
      'Rigid Gas Permeable (RGP) Lenses',
      'Hybrid Contact Lenses',
    ],

    collections: [
      'BioComfort Series',
      'Vision Clarity Pro',
      'Style Enhancer Lenses',
      'All-Day Wear Essentials',
    ],
  },
};

const kidsGlasses = {
  PowerGlasses: {
    category: {
      Men: [
        'Sporty Frames - Starting from ₹1800',
      ],
      Women: [
        'Rose Gold Frames - Starting from ₹3000',
      ],
      Kids: [
        'Cartoon-Themed Glasses - Starting from ₹800',
        'Lightweight Flexible Frames - Starting from ₹1200',
      ],
    },

    brands: [
      'Prada Eyewear',
      'Versace Frames',
      'Coach Vision',
      'Lenskart Air',
    ],

    picks: [
      'Limited Edition Styles',
      'Ultra-Light Frames',
      'Anti-Glare Eyeglasses',
    ],

    frameShapes: [
      'Geometric Frames',
      'Retro Oval Frames',
      'Angular Sharp Frames',
      'Wraparound Frames',
      'Wide Rim Frames',
    ],

    collections: [
      'Artisan Craft',
      'Bold and Beautiful',
      'Retro Revival',
      'Urban Streetwear',
      'Elegant Edge',
    ],
  },
};

const screenSaver = {
  PowerGlasses: {
    category: {
      Men: ['Classic Spectacles - Starting from ₹2000'],
      Women: ['Premium Spectacles - Starting from ₹3500', 'Fashion Spectacles - Starting from ₹2500'],

    },
    brands: ['Ray-Ban', 'Tom Ford', 'Oakley', 'Burberry'],
    picks: ['Trending Styles', 'Top Picks', 'Multifocal Spectacles'],
    frameShapes: [
      'Rectangular Frames',
      'Rounded Frames',
      'Squared Frames',
      'Aviator-Style Frames',
      'Cat-Eye Frames',
    ],
    collections: [
      'Luxury Edition',
      'Bohemian',
      'Elegance',
      'Modern Metals',
      'Crystal Charm',
    ],
  },
};

const categories = {
  PowerGlasses: {
    // category: [
    //   { title: 'Classic Eyeglasses', price: 'Starting from ₹2000' },
    //   { title: 'Premium Eyeglasses', price: 'Starting from ₹3500' },
    // ],
    // category: {
    //   Men: ['Classic Eyeglasses - Starting from ₹2000'],
    //   Women: ['Premium Eyeglasses - Starting from ₹3500'],
    //   Kids: ['Screen Eyeglasses - Starting from ₹500'],
    // },
    category: {
      Men: ['Classic Eyeglasses - Starting from ₹2000', 'Premium Eyeglasses - Starting from ₹3500'],
      Women: ['Premium Eyeglasses - Starting from ₹3500', 'Fashionable Eyeglasses - Starting from ₹2500'],
      Kids: ['Screen Eyeglasses - Starting from ₹500', 'Durable Eyeglasses - Starting from ₹1500'],
    },

    brands: ['John Jacobs', 'New Balance', 'Fossil', 'Le Petit Lunetier'],
    picks: ['New Arrivals', 'Best Seller', 'Progressive Eyeglasses'],
    frameShapes: [
      'Rectangle Frames',
      'Round Frames',
      'Square Frames',
      'Aviator Frames',
      'Cat-Eye Frames',
    ],
    collections: [
      'Masaba',
      'Rhapsody',
      'Sobhita',
      'Pro Titanium',
      'Gilded Jewels',
    ],
  },
};
const trendingSearches = [
  "Eyeglasses",
  "Sunglasses",
  "Contact Lenses",
  "Vincent Chase Eyeglasses",
  "Vincent Chase Sunglasses",
  "John Jacobs Eyeglasses",
  "John Jacobs Sunglasses",
  "Mens Sunglasses",
  "Women Sunglasses",
  "Aviator",
  "Eyewear Accessories",
  "Purevision",
  "Acuvue",
  "Eye Checkup",
];




const Header = () => {
  const navigation = useNavigation();
  const { productCount, wishlistCount } = useContext(GlobleInfo);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [cartListItems, setCartlistItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);




  useEffect(() => {
    if (isWishlistOpen) {
      loadWishlist();
    }
  }, [isWishlistOpen]);

  useEffect(() => {
    if (isCartOpen) {
      loadCart();
    }
  }, [isCartOpen]);

  const loadWishlist = async () => {
    const data = await AsyncStorage.getItem('wishlist');
    setWishlistItems(JSON.parse(data) || []);
  };

  const loadCart = async () => {
    const data = await AsyncStorage.getItem('cart');
    setCartlistItems(JSON.parse(data) || []);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${SERVER_API_URL}/api/categories/all`);
      setCategoriesData(response.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const removeFromCart = async (id) => {
    const updatedCart = cartListItems.filter((item) => item.product_id !== id);
    setCartlistItems(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromWishlist = async (id) => {
    const updatedItems = wishlistItems.filter((item) => item.product_id !== id);
    setWishlistItems(updatedItems);
    await AsyncStorage.setItem('wishlist', JSON.stringify(updatedItems));
  };



  const togglePopup = (content) => {
    setPopupContent(content);
    setIsPopupOpen(true);
  };
  const onHandleSearch = () => {
    if (query) {
      navigation.replace('ProductDisplay', { query });
    }
  };

  const openFaq = () => {
    navigation.replace('FaqPage');
  };



  return (


    <View style={styles.headerBgContainer}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <View style={styles.leftTop}>
          <Image source={require('../Assets/images/logo.jpeg')} style={styles.logo} />
          <TouchableOpacity >
            <Text style={styles.tryOnText}>Metteo-Bianchi</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rightTop}>

          <TouchableOpacity onPress={() => navigation.navigate('LoginPage')} style={styles.iconWithBadge}>
            <Image
              source={require('../Assets/images/LoginImg.png')} // replace with your PNG file
              style={styles.iconImage}
            />
            <Text style={styles.linkText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsWishlistOpen(true)} style={styles.iconWithBadge}>
            <Image
              source={require('../Assets/images/add-to-favorites.png')} // replace with your PNG file
              style={styles.iconImage}
            />
            {wishlistItems.length > 0 && (
              <View style={styles.badgewishlist}>
                <Text style={styles.badgeText}>{wishlistCount}</Text>
              </View>
            )}
            <Text style={styles.linkText}>Wishlist</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsCartOpen(true)} style={styles.iconWithBadge}>
            <Image
              source={require('../Assets/images/add-to-cart.png')} // replace with your PNG file path
              style={styles.iconImage}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{productCount}</Text>
            </View>
            <Text style={styles.linkText}>Cart</Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* Bottom Row - Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchHomeMain}>
          <TextInput
            style={styles.searchInput}
            placeholder="What are you looking for?"
            value={query}
            onChangeText={setQuery}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 2000)}
          />
          <TouchableOpacity onPress={onHandleSearch}>
            <Image
              source={require('../Assets/images/search1.png')} // your image path
              style={styles.searchIcon}
            />
          </TouchableOpacity>

        </View>

        {showDropdown && (
          <View style={styles.searchDropdown}>
            <Text style={styles.dropdownHeader}>Trending Search</Text>
            <FlatList
              data={trendingSearches}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setQuery(item)}>
                  <Text style={styles.dropdownItem}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <View style={styles.navbarMainBottom}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.navbarBottom}
          >
            {/* Left Section Buttons */}
            <TouchableOpacity>
              <Text style={styles.navLink}>Power Glasses</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.navLink}>Sunglasses</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.navLink}>Screen Saver</Text>
            </TouchableOpacity>

            <TouchableOpacity >
              <Text style={styles.navLink}>Contact Lenses</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={[styles.navLink, styles.navLinkModify]}>Kids Glasses</Text>
            </TouchableOpacity>

            {/* Dynamic Categories */}
            {categoriesData.length > 0 &&
              categoriesData.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => togglePopup(category.categories_name)}
                >
                  <Text style={styles.navLink}>{category.categories_name}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>

        {/*
                <View style={styles.navbarButtons}>
                    <TouchableOpacity style={[styles.button, styles.btnTryon1]}>
                        <Text style={styles.btnTextTryon}>3D TRY ON</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.btnBlu]}>
                        <Text style={styles.btnTextBlu}>BLU</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.btnGold]} onPress={openFaq}>
                        <Text style={styles.btnTextGold}>GOLD MAX</Text>
                    </TouchableOpacity>
                </View>
                            */}



        {isPopupOpen && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={isPopupOpen}
            onRequestClose={() => setIsPopupOpen(false)} // Android back button
          >
            <View style={styles.overlay}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsPopupOpen(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>

              <View style={styles.popupContainer}>
                <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                  <Text style={styles.popupHeading}>{popupContent}</Text>

                  {popupContent === 'Power Glasses' && (
                    <>
                      {/* Category - Horizontal Scroll */}
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                        {Object.entries(categories.PowerGlasses.category).map(([heading, items], index) => (
                          <View key={index} style={styles.categoryCard}>
                            <Image
                              source={
                                heading === 'Men'
                                  ? require('../Assets/images/men_pic.webp')
                                  : heading === 'Women'
                                    ? require('../Assets/images/women_pic.webp')
                                    : heading === 'Kids'
                                      ? require('../Assets/images/kid_pic.webp')
                                      : require('../Assets/images/dceyewr-logo-no-text.png')
                              }
                              style={styles.categoryImage}
                            />
                            <Text style={styles.categoryText}>{heading}</Text>
                          </View>
                        ))}
                      </ScrollView>

                      {/* Brands Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Brands</Text>
                        <View style={styles.gridWrapper}>
                          {categories.PowerGlasses.brands.map((brand, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{brand}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Picks Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Our Top Picks</Text>
                        <View style={styles.gridWrapper}>
                          {categories.PowerGlasses.picks.map((pick, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{pick}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Frame Shape Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Frame Shape</Text>
                        <View style={styles.gridWrapper}>
                          {categories.PowerGlasses.frameShapes.map((shape, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{shape}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Collection Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Collection</Text>
                        <View style={styles.gridWrapper}>
                          {categories.PowerGlasses.collections.map((collection, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{collection}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    </>
                  )}


                  {popupContent === 'Screen Saver' && (
                    <>
                      {/* Category - Horizontal Scroll */}
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                        {Object.entries(screenSaver.PowerGlasses.category).map(([heading, items], index) => (
                          <View key={index} style={styles.categoryCard}>
                            <Image
                              source={
                                heading === 'Men'
                                  ? require('../Assets/images/men_pic.webp')
                                  : heading === 'Women'
                                    ? require('../Assets/images/women_pic.webp')
                                    : heading === 'Kids'
                                      ? require('../Assets/images/kid_pic.webp')
                                      : require('../Assets/images/dceyewr-logo-no-text.png')
                              }
                              style={styles.categoryImage}
                            />
                            <Text style={styles.categoryText}>{heading}</Text>
                          </View>
                        ))}
                      </ScrollView>

                      {/* Brands Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Brands</Text>
                        <View style={styles.gridWrapper}>
                          {screenSaver.PowerGlasses.brands.map((brand, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{brand}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Picks Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Our Top Picks</Text>
                        <View style={styles.gridWrapper}>
                          {screenSaver.PowerGlasses.picks.map((pick, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{pick}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Frame Shape Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Frame Shape</Text>
                        <View style={styles.gridWrapper}>
                          {screenSaver.PowerGlasses.frameShapes.map((shape, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{shape}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Collection Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Collection</Text>
                        <View style={styles.gridWrapper}>
                          {screenSaver.PowerGlasses.collections.map((collection, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{collection}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    </>
                  )}

                  {popupContent === 'Kids Glasses' && (
                    <>
                      {/* Category - Horizontal Scroll */}
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                        {Object.entries(kidsGlasses.PowerGlasses.category).map(([heading, items], index) => (
                          <View key={index} style={styles.categoryCard}>
                            <Image
                              source={
                                heading === 'Men'
                                  ? require('../Assets/images/men_pic.webp')
                                  : heading === 'Women'
                                    ? require('../Assets/images/women_pic.webp')
                                    : heading === 'Kids'
                                      ? require('../Assets/images/kid_pic.webp')
                                      : require('../Assets/images/dceyewr-logo-no-text.png')
                              }
                              style={styles.categoryImage}
                            />
                            <Text style={styles.categoryText}>{heading}</Text>
                          </View>
                        ))}
                      </ScrollView>

                      {/* Brands Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Brands</Text>
                        <View style={styles.gridWrapper}>
                          {kidsGlasses.PowerGlasses.brands.map((brand, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{brand}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Picks Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Our Top Picks</Text>
                        <View style={styles.gridWrapper}>
                          {categories.PowerGlasses.picks.map((pick, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{pick}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Frame Shape Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Frame Shape</Text>
                        <View style={styles.gridWrapper}>
                          {kidsGlasses.PowerGlasses.frameShapes.map((shape, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{shape}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Collection Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Collection</Text>
                        <View style={styles.gridWrapper}>
                          {kidsGlasses.PowerGlasses.collections.map((collection, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{collection}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    </>
                  )}

                  {popupContent === 'Contact Lenses' && (
                    <>
                      {/* Category - Horizontal Scroll */}
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                        {Object.entries(contactLenses.PowerGlasses.category).map(([heading, items], index) => (
                          <View key={index} style={styles.categoryCard}>
                            <Image
                              source={
                                heading === 'Men'
                                  ? require('../Assets/images/men_pic.webp')
                                  : heading === 'Women'
                                    ? require('../Assets/images/women_pic.webp')
                                    : heading === 'Kids'
                                      ? require('../Assets/images/kid_pic.webp')
                                      : require('../Assets/images/dceyewr-logo-no-text.png')
                              }
                              style={styles.categoryImage}
                            />
                            <Text style={styles.categoryText}>{heading}</Text>
                          </View>
                        ))}
                      </ScrollView>

                      {/* Brands Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Brands</Text>
                        <View style={styles.gridWrapper}>
                          {contactLenses.PowerGlasses.brands.map((brand, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{brand}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Picks Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Our Top Picks</Text>
                        <View style={styles.gridWrapper}>
                          {contactLenses.PowerGlasses.picks.map((pick, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{pick}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Frame Shape Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Frame Shape</Text>
                        <View style={styles.gridWrapper}>
                          {contactLenses.PowerGlasses.frameShapes.map((shape, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{shape}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Collection Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Collection</Text>
                        <View style={styles.gridWrapper}>
                          {contactLenses.PowerGlasses.collections.map((collection, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{collection}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    </>
                  )}

                  {popupContent === 'Sunglasses' && (
                    <>
                      {/* Category - Horizontal Scroll */}
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                        {Object.entries(Sunglasses.PowerGlasses.category).map(([heading, items], index) => (
                          <View key={index} style={styles.categoryCard}>
                            <Image
                              source={
                                heading === 'Men'
                                  ? require('../Assets/images/men_pic.webp')
                                  : heading === 'Women'
                                    ? require('../Assets/images/women_pic.webp')
                                    : heading === 'Kids'
                                      ? require('../Assets/images/kid_pic.webp')
                                      : require('../Assets/images/dceyewr-logo-no-text.png')
                              }
                              style={styles.categoryImage}
                            />
                            <Text style={styles.categoryText}>{heading}</Text>
                          </View>
                        ))}
                      </ScrollView>

                      {/* Brands Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Brands</Text>
                        <View style={styles.gridWrapper}>
                          {Sunglasses.PowerGlasses.brands.map((brand, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{brand}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Picks Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Our Top Picks</Text>
                        <View style={styles.gridWrapper}>
                          {Sunglasses.PowerGlasses.picks.map((pick, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{pick}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Frame Shape Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Frame Shape</Text>
                        <View style={styles.gridWrapper}>
                          {Sunglasses.PowerGlasses.frameShapes.map((shape, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{shape}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Collection Grid */}
                      <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionHeading}>Collection</Text>
                        <View style={styles.gridWrapper}>
                          {Sunglasses.PowerGlasses.collections.map((collection, index) => (
                            <TouchableOpacity key={index} style={styles.gridItem}>
                              <Text style={styles.gridItemText}>{collection}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    </>
                  )}





                </ScrollView>
              </View>

            </View>


          </Modal>
        )}

        <Modal
          visible={isWishlistOpen}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsWishlistOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.header}>
                <Text style={styles.title}>My Wishlist</Text>
                <TouchableOpacity onPress={() => setIsWishlistOpen(false)}>
                  <Text style={styles.closeButton1}>x</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.content}>
                {wishlistItems.length > 0 ? (
                  wishlistItems.map((item) => (
                    <View key={item.product_id} style={styles.item}>
                      <Image
                        source={{ uri: `${SERVER_API_URL}/${item.product_thumnail_img}` }}
                        style={styles.image}
                      />
                      <View style={styles.info}>
                        <Text style={styles.productTitle}>{item.product_title}</Text>
                        <Text style={styles.productPrice}>
                          ₹{(item.product_price - (item.product_price * item.discount / 100)).toFixed(0)}/-
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => removeFromWishlist(item.product_id)}>
                        <Text style={styles.deleteButton}>🗑</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No items in wishlist</Text>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal
          visible={isCartOpen}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsCartOpen(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setIsCartOpen(false)}
              >
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>

              <Text style={styles.header}>Shopping Cart</Text>

              <ScrollView style={styles.itemsContainer}>
                {cartListItems.length > 0 ? (
                  cartListItems.map((item, index) => (
                    <View key={index} style={styles.itemCard}>
                      <Image
                        source={{ uri: `${SERVER_API_URL}/${item?.product_thumnail_img}` }}
                        style={styles.itemImage}
                      />
                      <View style={styles.details}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemTitle}>{item.product_title}</Text>
                        <Text style={styles.itemPrice}>
                          ₹{(item.product_price - (item.product_price * item.discount / 100)).toFixed(0)}/-
                        </Text>
                        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                      </View>
                      <TouchableOpacity onPress={() => removeFromCart(item.product_id)}>
                        <Text style={styles.removeBtn}>🗑</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyCart}>Your cart is empty.</Text>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

      </View>
    </View>



  );
};



export default Header;


const styles = StyleSheet.create({
  headerBgContainer: {
    backgroundColor: '#fff',
    padding: 10,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: '',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 70,
    width: '100%',
    maxWidth: 1400, // This will be ignored unless used inside a responsive container
    alignSelf: 'center', // For centering within parent
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
    borderRadius: 50,
  },
  tryOnButton: {
    backgroundColor: '#00bcd4',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tryOnText: {
    // color: '#fff',
    fontWeight: 'bold',
    color: '#000',
    fontSize: 18,
  },
  rightTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  linkText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  iconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },

  iconWithBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    position: 'relative',
  },
  badgewishlist: {
    position: 'absolute',
    top: -5,
    right: 0,
    backgroundColor: '#00bcd4',
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#00bcd4',
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
  },
  searchContainer: {
    marginTop: 10,
  },
  searchHomeMain: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 10,
    color: '#333',
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  searchDropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 5,
    padding: 10,
    elevation: 2,
  },
  dropdownHeader: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dropdownItem: {
    paddingVertical: 5,
  },
  navbarMainBottom: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  navbarBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
  },
  navLink: {
    marginRight: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  navbarButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 8,
  },
  btnTryon1: {
    backgroundColor: '#00BCD4',
  },
  btnBlu: {
    backgroundColor: '#E0F7FA',
  },
  btnGold: {
    backgroundColor: '#000',
  },
  btnTextTryon: {
    color: '#fff',
    fontWeight: 'bold',
  },
  btnTextBlu: {
    color: '#007B8A',
    fontWeight: 'bold',
  },
  btnTextGold: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  overlay: {

    ...StyleSheet.absoluteFillObject,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 999,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  popupContainer: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '100%',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FF4D4D',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    zIndex: 1010,
  },

  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  popupHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  // Category Horizontal Scroll
  categoryScroll: {
    marginBottom: 30,
  },

  categoryCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    marginRight: 12,
    padding: 12,
    alignItems: 'center',
    width: 100,
    elevation: 3,
  },

  categoryImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 6,
  },

  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },

  // Section Layout
  sectionWrapper: {
    marginBottom: 20,
  },

  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
  },

  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  gridItem: {
    backgroundColor: '#eaeaea',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  gridItemText: {
    fontSize: 14,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '100%',
    height: '95%', // almost full screen height
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
    marginBottom: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },

  closeButton1: {
    fontSize: 22,
    color: '#ff4d4d',
    fontWeight: 'bold',
    position: 'absolute',
    top: 5,
    right: 20,
    zIndex: 1,
  },

  content: {
    flex: 1, // allows scrollable content
    marginTop: 10,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    shadowColor: '#ddd',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f2f2f2',
  },

  info: {
    flex: 1,
  },

  productTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },

  productPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2ecc71',
  },

  deleteButton: {
    fontSize: 20,
    color: '#e74c3c',
    paddingHorizontal: 6,
  },

  emptyText: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#aaa',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end', // push to bottom like a drawer
    alignItems: 'center',
  },

  container: {
    height: '95%', // make it almost full screen
    width: '100%', // take full width
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 40,
  },

  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 1,
  },

  closeText: {
    fontSize: 26,
    color: '#e74c3c',
  },

  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },

  itemsContainer: {
    flex: 1,
    marginTop: 20,
  },

  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },

  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },

  details: {
    flex: 1,
  },

  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },

  itemTitle: {
    fontSize: 13,
    color: '#777',
  },

  itemPrice: {
    fontSize: 14,
    color: '#3498db',
  },

  itemQuantity: {
    fontSize: 13,
    color: '#555',
  },

  removeBtn: {
    fontSize: 20,
    color: '#e74c3c',
  },

  emptyCart: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
  },





});

