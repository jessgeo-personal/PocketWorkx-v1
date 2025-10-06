// src/components/ScreenLayout.tsx

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SlidingMenu from './SlidingMenu';
import FloatingMenuButton from './FloatingMenuButton';
import { colors } from '../utils/theme';

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
    <View style={styles.container}>
      {children}

      <FloatingMenuButton onPress={toggleMenu} isMenuOpen={isMenuVisible} />

      <SlidingMenu visible={isMenuVisible} onClose={closeMenu} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default ScreenLayout;
