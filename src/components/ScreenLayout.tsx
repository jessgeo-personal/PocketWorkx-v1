// src/components/ScreenLayout.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import SlidingMenu from './SlidingMenu';
import FloatingMenuButton from './FloatingMenuButton';

interface ScreenLayoutProps {
  children: React.ReactNode;
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({ children }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const closeMenu = () => {
    setIsMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      {children}
      
      <FloatingMenuButton 
        onPress={toggleMenu} 
        isMenuOpen={isMenuVisible}
      />
      
      <SlidingMenu 
        visible={isMenuVisible} 
        onClose={closeMenu}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffd21f', // Add your background color
  },
});

export default ScreenLayout;