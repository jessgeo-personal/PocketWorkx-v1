// src/components/ScreenLayout.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Image, SafeAreaView } from 'react-native';
import SlidingMenu from './SlidingMenu';
import FloatingMenuButton from './FloatingMenuButton';
import { colors } from '../utils/theme';
import logo from '../assets/logo.png';

interface ScreenLayoutProps {
  children: React.ReactNode;
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({ children }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.content}>{children}</View>

      <FloatingMenuButton onPress={toggleMenu} isMenuOpen={isMenuVisible} />
      <SlidingMenu visible={isMenuVisible} onClose={closeMenu} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 60,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  logo: {
    width: 150,
    height: 40,
  },
  content: {
    flex: 1,
  },
});

export default ScreenLayout;
