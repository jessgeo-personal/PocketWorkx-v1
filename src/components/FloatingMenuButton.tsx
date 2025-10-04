// src/components/FloatingMenuButton.tsx
import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface FloatingMenuButtonProps {
  onPress: () => void;
  isMenuOpen: boolean;
}

const FloatingMenuButton: React.FC<FloatingMenuButtonProps> = ({ onPress, isMenuOpen }) => {
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isMenuOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isMenuOpen]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <MaterialIcons 
            name={isMenuOpen ? "close" : "menu"} 
            size={28} 
            color="#FFFFFF" 
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#666666', // Grey button as per mockup
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
});

export default FloatingMenuButton;