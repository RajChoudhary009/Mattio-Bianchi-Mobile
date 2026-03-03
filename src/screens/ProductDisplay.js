import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity, StyleSheet, FlatList, Picker, Modal, Switch, Dimensions, Animated, } from 'react-native';
import axios from 'axios';
import { GlobleInfo } from '../context/GlobleInfoContext';
import { SERVER_API_URL } from '../server/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
// import { useRoute } from '@react-navigation/native';
import BouncyCheckbox from "react-native-bouncy-checkbox";


const Images = {
  banner: require('../Assets/images/EyePoppin.webp'),
  filter: require('../Assets/images/setting.png'),
  sort: require('../Assets/images/sort.png'),

}


// Replace web image imports with require
const frameImages = {
  Aviator: require('../Assets/images/Aviator.png'),
  CatsEye: require('../Assets/images/CatsEye.png'),
  Rectangle: require('../Assets/images/Rectangle.png'),
  Round: require('../Assets/images/Round.png'),
  Square: require('../Assets/images/Square.png'),
  Sports: require('../Assets/images/Sports.png'),
  Hexagonal: require('../Assets/images/Hexagonal.png'),
  Oval: require('../Assets/images/Oval.png'),
  Fullrim: require('../Assets/images/Fullrim.png'),
  Halfrim: require('../Assets/images/Halfrim.png'),
  Rimless: require('../Assets/images/Rimless.png'),
  wishlist: require('../Assets/images/wishlist.png'),
  wishlist1: require('../Assets/images/wishlist1.png'),


};

const frameType = ['Fullrim', 'Halfrim', 'Rimless'];
const frameShapes = ['Aviator', 'CatsEye', 'Rectangle', 'Round', 'Square', 'Oval'];
const genders = ['Men', 'Women', 'Unisex', 'Kids'];

const frameColors = [
  { name: "Black" }, { name: "Gold" }, { name: "Brown" }, { name: "Blue" },
  { name: "Silver" }, { name: "Transparent" }, { name: "Green" }, { name: "Grey" },
  { name: "Pink" }, { name: "Red" }, { name: "White" }, { name: "Purple" }, { name: "Orange" },
];

const lensColors = [
  { name: "Blue", count: 0 }, { name: "Green", count: 0 }, { name: "Yellow", count: 0 },
  { name: "Transparent", count: 0 }, { name: "Pink", count: 0 }, { name: "Brown", count: 0 },
  { name: "Grey", count: 0 }, { name: "Black", count: 0 }, { name: "Red", count: 0 },
  { name: "Violet", count: 0 }, { name: "White", count: 0 },
];

const colorMap = {
  Yellow: '#FFD700',
  Blue: '#007BFF',
  Gold: '#7f6000',
  Purple: '#800080',
  Orange: '#FFA500',
  Violet: '#8F00FF',
};



const { width } = Dimensions.get('window');
const cardWidth = (width - 30) / 2;


const ProductDisplay = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const category = params?.category || null;
  const { getProductCount, updateCounts } = useContext(GlobleInfo);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hoveredImages, setHoveredImages] = useState({});

  const [selectedFrameShape, setSelectedFrameShape] = useState([]);
  const [selectedFrameType, setSelectedFrameType] = useState([]);
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedLensColor, setSelectedLensColor] = useState([]);
  const [selectedFrameColor, setSelectedFrameColor] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  // const [sortOption, setSortOption] = useState('Price: High to Low');

  const [sortOption, setSortOption] = useState('Price: All');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [wishlistItems, setWishlistItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;



  const sortOptions = [
    'Price: All item',
    'Price: High to Low',
    'Price: Low to High',
    'Newest First',
  ];

  const toggleFilterModal = () => {
    setFilterModalVisible(!filterModalVisible);
  };


  const toggleSortModal = () => setSortModalVisible(!sortModalVisible);

  const handleSortBy = () => {
    // TODO: Open sort modal
    console.log("Sort By pressed");
  };

  const handleFilters = () => {
    // TODO: Open filters modal
    console.log("Filters pressed");
  };

  const footerAnim = useRef(new Animated.Value(0)).current;
  let scrollOffset = 0;
  let timeoutId = null;

  const handleScroll = (e) => {
    const currentOffset = e.nativeEvent.contentOffset.y;
    const direction = currentOffset > scrollOffset ? 'down' : 'up';
    scrollOffset = currentOffset;

    if (direction === 'down') {
      Animated.timing(footerAnim, {
        toValue: 100,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        Animated.timing(footerAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }, 250);
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${SERVER_API_URL}/product`);
        const products = response.data.result;
        // console.log('FULL RESPONSE 👉', response);
        // console.log('PRODUCT RESULT 👉', response.data.result);

        setAllProducts(products);

        const initialFiltered = filterByCategory(products, category);
        setFilteredProducts(initialFiltered);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, [category]);

  const filterByCategory = (products, category) => {
    if (!category || category.toLowerCase() === "both") return products;

    const keywords = category.toLowerCase().match(/\b\w+\b/g) || [];

    if (keywords.length === 0) return products;

    const filtered = products
      .map((product) => {
        let matchCount = 0;
        const frameShape = product.frame_shape?.toLowerCase() || "";
        const frameType = product.frem_type?.toLowerCase() || "";
        const gender = product.gender?.toLowerCase() || "";
        const highlights = product.highlights?.toLowerCase() || "";
        const frameColor = product.frameColor?.toLowerCase() || "";
        const lenshColor = product.lenshColor?.toLowerCase() || "";

        keywords.forEach((keyword) => {
          if (
            frameShape.includes(keyword) ||
            frameType.includes(keyword) ||
            gender.includes(keyword) ||
            highlights.includes(keyword) ||
            frameColor.includes(keyword) ||
            lenshColor.includes(keyword)
          ) {
            matchCount++;
          }
        });

        return matchCount > 0 ? { product, matchCount } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.matchCount - a.matchCount)
      .map((item) => item.product);

    return filtered.length ? filtered : products;
  };

  const addToCart = async (item) => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      const existingCartItems = cartData ? JSON.parse(cartData) : [];

      const itemIndex = existingCartItems.findIndex(cartItem => cartItem.id === item.id);

      if (itemIndex !== -1) {
        existingCartItems[itemIndex].quantity = Number(existingCartItems[itemIndex].quantity) || 1;
        existingCartItems[itemIndex].quantity += 1;
      } else {
        item.quantity = 1;
        existingCartItems.push(item);
      }

      await AsyncStorage.setItem('cart', JSON.stringify(existingCartItems));
      const uniqueItemCount = existingCartItems.length;

      Alert.alert('Success', `${item.product_title} added to cart successfully!`);
      getProductCount(uniqueItemCount);
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const toggleWishlist = async (product) => {
    try {
      const wishlistData = await AsyncStorage.getItem('wishlist');
      let wishlist = wishlistData ? JSON.parse(wishlistData) : [];

      const index = wishlist.findIndex(item => item.product_id === product.product_id);

      if (index !== -1) {
        wishlist.splice(index, 1);
      } else {
        wishlist.push(product);
      }

      await AsyncStorage.setItem('wishlist', JSON.stringify(wishlist));
      setWishlistItems(wishlist);
      updateCounts();
    } catch (error) {
      console.error('Toggle wishlist error:', error);
    }
  };

  useEffect(
    useCallback(() => {
      const loadWishlist = async () => {
        const storedWishlist = await AsyncStorage.getItem('wishlist');
        setWishlistItems(storedWishlist ? JSON.parse(storedWishlist) : []);
      };
      loadWishlist();
    }, [])
  );

  // Toggle frame type selection
  const handleFrameTypeChange = (framtype) => {
    setSelectedFrameType((prev) =>
      prev.includes(framtype) ? prev.filter((f) => f !== framtype) : [...prev, framtype]
    );
  };

  // Toggle frame shape selection
  const handleFrameShapeChange = (frame) => {
    setSelectedFrameShape((prev) =>
      prev.includes(frame) ? prev.filter((f) => f !== frame) : [...prev, frame]
    );
  };

  // Toggle gender selection
  const handleGenderChange = (gender) => {
    setSelectedGender((prev) =>
      prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
    );
  };

  // Toggle lens color selection
  const handleLensColor = (color) => {
    setSelectedLensColor((prev) =>
      prev.includes(color) ? prev.filter((item) => item !== color) : [...prev, color]
    );
  };

  // Toggle frame color selection
  const handleFrameColor = (color) => {
    setSelectedFrameColor((prev) =>
      prev.includes(color) ? prev.filter((item) => item !== color) : [...prev, color]
    );
  };

  // Update min price
  const handleMinChange = (value) => {
    const numericValue = Number(value);
    setMinPrice(Math.min(numericValue, maxPrice - 1));
  };

  // Update max price
  const handleMaxChange = (value) => {
    const numericValue = Number(value);
    setMaxPrice(Math.max(numericValue, minPrice + 1));
  };

  // Update using slider (React Native doesn't use event objects)
  const handleSliderChange = (value, type) => {
    const numericValue = Number(value);
    if (type === 'min') {
      setMinPrice(Math.min(numericValue, maxPrice - 1));
    } else {
      setMaxPrice(Math.max(numericValue, minPrice + 1));
    }
  };

  const getColorsForProduct = useCallback((productTitle) => {
    return allProducts
      .filter(p => p.product_title === productTitle)
      .map(p => ({
        productId: p.product_id,
        frameColor: p.frameColor || "#ff0000",
        lenshColor: p.lenshColor || "#fff",
      }));
  },
    [allProducts]
  );


  // Reset filters (frame type, shape, and gender)
  const resetFilters = () => {
    setSelectedFrameType([]);
    setSelectedFrameShape([]);
    setSelectedGender([]);
  };

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };



  useEffect(() => {
    const filterAndSortProducts = () => {
      let filteredProducts = filterByCategory(allProducts, category); // Start with category-based filtering

      // **Filter by Frame Type**
      if (selectedFrameType.length > 0) {
        filteredProducts = filteredProducts.filter((product) =>
          selectedFrameType.some(
            (frame) => frame.replace(/\s+/g, "").toLowerCase() === product.frem_type?.replace(/\s+/g, "").toLowerCase()
          )
        );
      }

      // **Filter by Frame Shape**
      if (selectedFrameShape.length > 0) {
        filteredProducts = filteredProducts.filter((product) =>
          selectedFrameShape.some(
            (shape) => shape.replace(/\s+/g, "").toLowerCase() === product.frame_shape?.replace(/\s+/g, "").toLowerCase()
          )
        );
      }

      // **Filter by Gender**
      if (selectedGender.length > 0) {
        filteredProducts = filteredProducts.filter((product) =>
          selectedGender.some(
            (gender) => gender.trim().toLowerCase() === product.gender?.trim().toLowerCase()
          )
        );
      }

      // **Filter by Lens Color**
      if (selectedLensColor.length > 0) {
        filteredProducts = filteredProducts.filter((product) => {
          if (!product.lenshColor) return false;
          return selectedLensColor.some(
            (color) => product.lenshColor.trim().toLowerCase() === color.trim().toLowerCase()
          );
        });
      }

      // **Filter by Frame Color**
      if (selectedFrameColor.length > 0) {
        filteredProducts = filteredProducts.filter((product) => {
          if (!product.frameColor) return false;
          return selectedFrameColor.some(
            (color) => product.frameColor.trim().toLowerCase() === color.trim().toLowerCase()
          );
        });
      }

      // **Filter by Price Range**
      filteredProducts = filteredProducts.filter((product) => {
        return product.product_price >= minPrice && product.product_price <= maxPrice;
      });

      // **Sorting Logic**
      let sortedProducts = [...filteredProducts];

      switch (sortOption) {
        case 'Price: High to Low':
          sortedProducts.sort((a, b) => (b.product_price - (b.product_price * b.discount / 100)) -
            (a.product_price - (a.product_price * a.discount / 100)));
          break;
        case 'Price: Low to High':
          sortedProducts.sort((a, b) => (a.product_price - (a.product_price * a.discount / 100)) -
            (b.product_price - (b.product_price * b.discount / 100)));
          break;
        case 'Newest First':
          sortedProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        default:
          break;
      }

      // console.log("Final Sorted & Filtered Products:", sortedProducts);
      setFilteredProducts(sortedProducts.length > 0 ? sortedProducts : []);
      setCurrentPage(1);
    };

    filterAndSortProducts();
  }, [selectedFrameType, selectedFrameShape, selectedGender, selectedFrameColor, minPrice, maxPrice, selectedLensColor, allProducts, category, sortOption]

  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Banner */}
        <Image
          source={Images[selectedFrameType] || Images['banner']}
          style={styles.banner}
          resizeMode="cover"
        />

        {/* Product Grid */}
        <View style={styles.gridContainer}>
          {currentProducts.map((product, index) => {
            const defaultImage = product.product_thumnail_img;
            const imageSrc = product.product_all_img?.[0] || defaultImage;
            const productPrice = (
              product.product_price -
              (product.product_price * product.discount) / 100
            ).toFixed(0);

            return (
              <TouchableOpacity
                key={index}
                style={styles.card}
              onPress={() =>
                navigation.navigate('ProductDetail', {
                  product_id: product.product_id,
                })
              }
              >
                {/* Wishlist Icon */}
                <TouchableOpacity
                  onPress={() => toggleWishlist(product)}
                  style={styles.wishlistIcon}
                >
                  <Image
                    source={
                      wishlistItems.some(
                        item => item.product_id === product.product_id
                      )
                        ? frameImages['wishlist']
                        : frameImages['wishlist1']
                    }
                    style={styles.heartIcon}
                  />
                </TouchableOpacity>

                {/* Product Image */}
                <Image
                  source={{ uri: `${SERVER_API_URL}/${imageSrc}` }}
                  style={styles.productImage}
                  resizeMode="contain"
                />

                {/* Info */}
                <View style={styles.info}>
                  <Text
                    style={[
                      styles.stock,
                      {
                        color:
                          product.count_in_stock === 0 ? 'red' : 'green',
                      },
                    ]}
                  >
                    {product.count_in_stock === 0
                      ? 'Out of stock'
                      : 'In stock'}
                  </Text>
                  <Text style={styles.title}>
                    {product.product_title.slice(0, 20)}
                  </Text>
                  <Text style={styles.highlight}>
                    {product.highlights.slice(0, 28)} ..
                  </Text>

                  {/* Price */}
                  <View style={styles.priceRow}>
                    <Text style={styles.originalPrice}>
                      ₹{product.product_price}
                    </Text>
                    <Text style={styles.discount}>
                      ({product.discount}% OFF)
                    </Text>
                  </View>
                  <Text style={styles.finalPrice}>
                    ₹{productPrice}/-
                  </Text>

                  {/* Colors */}
                  <View style={{ width: '90%', flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
                    {/* Adjust width to fit ~3 colors */}
                    <Text style={styles.attr}>Colors:</Text>

                    {(() => {
                      const colors = getColorsForProduct(product.product_title);
                      // console.log("Colors for product:", colors);
                      return (
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          style={styles.colorRow}
                        >
                          {colors.length > 0 ? (
                            colors.map((colorObj, i) => (
                              <View key={`${colorObj.productId}-${i}`} style={styles.colorDot}>
                                <View
                                  style={[
                                    styles.halfColor,
                                    { backgroundColor: colorMap[colorObj.frameColor] }
                                  ]}
                                />
                                <View
                                  style={[
                                    styles.halfColor,
                                    { backgroundColor: colorMap[colorObj.lenshColor] }
                                  ]}
                                />
                              </View>

                            ))
                          ) : (
                            <Text style={styles.noColor}>No Colors</Text>
                          )}
                        </ScrollView>
                      );
                    })()}
                  </View>

                  {/* Material */}
                  {/* <View style={styles.attrBlock}>
                    <Text style={styles.attrLabel}>
                      Frame material:
                    </Text>
                    <Text style={styles.attrValue}>
                      {product.material}
                    </Text>
                   </View> */}

                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <Animated.View
        style={[
          styles.footerButtonsContainer,
          { transform: [{ translateY: footerAnim }] },
        ]}
      >
        <View style={styles.footerButtonsContainer}>
          <TouchableOpacity style={styles.footerButton} onPress={toggleSortModal}>
            <Image
              source={Images['sort']}// Replace with your sort icon
              style={styles.icon}

            />
            <Text style={styles.footerButtonTitle}>Sort</Text>
          </TouchableOpacity >

          <View style={styles.separator} />

          <TouchableOpacity style={styles.footerButton} onPress={toggleFilterModal}>
            <Image
              source={Images['filter']} // Replace with your filter icon
              style={styles.icon}
            />
            <Text style={styles.footerButtonTitle}>Filter</Text>
          </TouchableOpacity>

        </View>
      </Animated.View>

      {/* Sort Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sortModalVisible}
        onRequestClose={toggleSortModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.sortHeader}>

              <Text style={styles.sortTitle}>SORT BY:</Text>
            </View>

            {sortOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionItem,
                  option === sortOption && styles.activeOption,
                ]}
                onPress={() => setSortOption(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    option === sortOption && styles.activeOptionText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleSortModal}
            >
              <Text style={styles.closeText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={toggleFilterModal}
      >
        <View style={styles.modalOverlayy}>
          <ScrollView contentContainerStyle={styles.modalContainerr}>


            <Text style={styles.filterTitle}>FILTERS</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.applyBtn} onPress={toggleFilterModal}>
                <Text style={styles.btnText}>Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
                <Text style={styles.btnText}>Reset</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Gender</Text>
            <View style={styles.genderContainer}>
              {genders.map((gender) => (
                <TouchableOpacity
                  key={gender}
                  onPress={() => handleGenderChange(gender)}
                  style={[
                    styles.genderItem,
                    selectedGender.includes(gender) && styles.genderSelected
                  ]}
                >
                  <Text style={styles.genderText}>{gender}</Text>
                </TouchableOpacity>
              ))}
            </View>



            <Text style={styles.sectionTitle}>Frame Type</Text>
            <View style={styles.imageOptionsContainer}>
              {frameType.map((shape) => (
                <TouchableOpacity
                  key={shape}
                  style={[styles.imageOption, selectedFrameType.includes(shape) && styles.selected]}
                  onPress={() => handleFrameTypeChange(shape)}
                >
                  <Image source={frameImages[shape]} style={styles.image} />

                  <Text>{shape}</Text>
                </TouchableOpacity>
              ))}
            </View>


            <Text style={styles.sectionTitle}>Frame Shape</Text>
            <View style={styles.imageOptionsContainer}>
              {frameShapes.map((shape) => (
                <TouchableOpacity
                  key={shape}
                  style={[styles.imageOption, selectedFrameShape.includes(shape) && styles.selected]}
                  onPress={() => handleFrameShapeChange(shape)}
                >
                  <Image source={frameImages[shape]} style={styles.image} />

                  <Text>{shape}</Text>
                </TouchableOpacity>
              ))}
            </View>


            <Text style={styles.filterTitle}>Frame Color</Text>
            <View style={styles.colorList}>
              {frameColors.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.colorItem}
                  onPress={() => handleFrameColor(color.name)}
                >
                  <View style={[
                    styles.colorCircle,
                    { backgroundColor: color.name.toLowerCase() }
                  ]} />
                  <Text style={styles.colorLabel}>{color.name}</Text>
                  {selectedColors.includes(color.name) && <Text>✅</Text>}
                </TouchableOpacity>
              ))}
            </View>


            <Text style={styles.filterTitle}>Lens Color</Text>
            <View style={styles.colorList}>
              {lensColors.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.colorItem}
                  onPress={() => handleLensColor(color.name)}
                >
                  <View style={[
                    styles.colorCircle,
                    { backgroundColor: color.name.toLowerCase() }
                  ]} />
                  <Text style={styles.colorLabel}>{color.name}</Text>
                  {selectedColors.includes(color.name) && <Text>✅</Text>}
                </TouchableOpacity>
              ))}
            </View>


            <Text style={styles.filterTitle}>Price</Text>
            <View style={styles.priceInputContainer}>
              <View style={styles.priceInput}>
                <Text>₹</Text>
                <TextInput
                  style={styles.priceTextInput}
                  value={minPrice.toString()}
                  onChangeText={(val) => handleMinChange(Number(val))}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.priceInput}>
                <Text>₹</Text>
                <TextInput
                  style={styles.priceTextInput}
                  value={maxPrice.toString()}
                  onChangeText={(val) => handleMaxChange(Number(val))}
                  keyboardType="numeric"
                />
              </View>
            </View>



            <TouchableOpacity style={styles.closeButton} onPress={toggleFilterModal}>
              <Text style={styles.closeText}>Apply Filter</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>



    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    flex: 1
  },
  banner: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    backgroundColor: '#fdfdfd',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    elevation: 3,
  },
  wishlistIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 2,
  },
  heartIcon: {
    width: 22,
    height: 22,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  info: {
    width: '100%',
    marginTop: 5,
  },
  stock: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  highlight: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    color: '#888',
  },
  discount: {
    fontSize: 11,
    color: '#e8a617',
    marginLeft: 5,
  },
  finalPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e8b57',
    marginTop: 2,
  },
  attr: {
    fontSize: 11,
    marginTop: 6,
    fontWeight: 'bold',
  },
  colorRow: {
    flexDirection: 'row',
    marginTop: 3,
    marginLeft: 10,
  },
  // colorDot: {
  //   width: 20,
  //   height: 10,
  //   borderRadius: 10,
  //   marginRight: 5,
  //   backgroundColor: '#000',
  //   borderColor: '#ccc',
  //   borderWidth: 1,
  // },

  colorDot: {
    width: 28,
    height: 10,
    borderRadius: 2,
    overflow: 'hidden',   // ⚠️ very important
    flexDirection: 'row', // side by side
    marginRight: 6,
    borderWidth: 1,
    // borderColor: 'green',
  },

  halfColor: {
    width: '50%',
    height: '100%',
  },

  noColor: {
    fontSize: 10,
    color: '#aaa',
  },
  attrBlock: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  attrLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  attrValue: {
    fontSize: 12,
    color: '#555',
    marginLeft: 4,
  },
  footerButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 999,
  },

  footerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 6,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    shadowColor: '#009688',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },


  icon: {
    width: 22,
    height: 22,
    marginBottom: 4,
    //tintColor: '#98e3e6',
    //tintColor: '#009688',
  },

  footerButtonTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#004d40',
    letterSpacing: 0.5,
  },

  footerButtonSubtitle: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },

  separator: {
    width: 2,
    height: 40,
    backgroundColor: '#009688',
    opacity: 0.6,
    borderRadius: 3,
    marginHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sortHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sortTitle: {
    fontSize: 14,
    color: '#98e3e6',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
  },
  activeOption: {
    backgroundColor: '#009688',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  activeOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#98e3e6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  modalOverlayy: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainerr: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  applyBtn: {
    backgroundColor: '#98e3e6',
    paddingVertical: 12,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
    elevation: 2,
  },
  resetBtn: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 12,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
    elevation: 2,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },

  genderItem: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f8f8f8',
  },

  genderSelected: {
    borderColor: '#00aaff',
    backgroundColor: '#98e3e6',
  },

  genderText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },

  imageOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageOption: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
    width: 90,
    elevation: 1,
  },
  selected: {
    borderWidth: 2,
    borderColor: '#007aff',
    backgroundColor: '#98e3e6',
  },
  image: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  colorList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  colorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 1,
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  colorLabel: {
    fontSize: 14,
    color: '#333',
  },
  priceInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: '48%',
    backgroundColor: '#f9f9f9',
  },
  priceTextInput: {
    marginLeft: 6,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  closeButton: {
    backgroundColor: '#98e3e6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    elevation: 2,
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

});




export default ProductDisplay;
