import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Pressable,
} from 'react-native';

const SocialLink = ({ label, url }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onPress={() => Linking.openURL(url)}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      <Text style={[styles.socialText, isHovered && styles.hoveredText]}>
        {label}
      </Text>
    </Pressable>
  );
};

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.heading}>SIGNUP FOR OFFERS & TIPS</Text>

      <View style={styles.subscribeBox}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Subscribe</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.socialMedia}>
        <SocialLink label="Facebook" url="https://facebook.com" />
        <SocialLink label="Instagram" url="https://instagram.com" />
        <SocialLink label="Twitter" url="https://twitter.com" />
        <SocialLink label="YouTube" url="https://youtube.com" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#111',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  heading: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subscribeBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    shadowColor: '#00c2cb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 20,
  },
  input: {
    padding: 12,
    flex: 1,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    fontSize: 16,
    backgroundColor: '#f3f3f3',
  },
  button: {
    backgroundColor: '#00c2cb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  socialMedia: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialText: {
    color: '#fff',
    fontSize: 14,
    marginHorizontal: 10,
  },
  hoveredText: {
    color: '#00c2cb',
    textDecorationLine: 'underline',
  },
});

export default Footer;
