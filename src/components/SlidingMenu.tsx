// src/components/SlidingMenu.tsx - GROUPED VERSION based on mockup slide 2
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface SlidingMenuProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  route: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SlidingMenu: React.FC<SlidingMenuProps> = ({ visible, onClose }) => {
  const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const menuGroups: MenuGroup[] = [
    {
      title: 'Accounts',
      items: [
        { id: '1', title: 'Cash', route: '/cash', icon: 'account-balance-wallet', color: '#27AE60' },
        { id: '2', title: 'Accounts', route: '/accounts', icon: 'account-balance', color: '#2196F3' },
        { id: '3', title: 'Crypto Assets', route: '/crypto', icon: 'currency-bitcoin', color: '#FF9800' },
      ]
    },
    {
      title: 'Liabilities',
      items: [
        { id: '4', title: 'Loans', route: '/loans', icon: 'trending-down', color: '#E74C3C' },
        { id: '5', title: 'Credit Cards', route: '/credit-cards', icon: 'credit-card', color: '#9C27B0' },
      ]
    },
    {
      title: 'Investments',
      items: [
        { id: '6', title: 'Receivables', route: '/receivables', icon: 'receipt', color: '#009688' },
        { id: '7', title: 'Investments', route: '/investments', icon: 'trending-up', color: '#FF5722' },
      ]
    },
    {
      title: 'Analytics',
      items: [
        { id: '8', title: 'Dashboard', route: '/dashboard', icon: 'dashboard', color: '#4A90E2' },
        { id: '9', title: 'Trends', route: '/trends', icon: 'show-chart', color: '#795548' },
        { id: '15', title: 'Cashflow', route: '/cashflow', icon: 'swap-horiz', color: '#FF6F00' },
      ]
    },
    {
      title: 'Quick Actions',
      items: [
        { id: '10', title: 'Menu', route: '/menu', icon: 'menu', color: '#607D8B' },
        { id: '11', title: 'Liquidity', route: '/liquidity', icon: 'water-drop', color: '#03DAC6' },
        { id: '12', title: 'Liabilities', route: '/liabilities', icon: 'remove-circle', color: '#F44336' },
        { id: '13', title: 'Investments & Receivables', route: '/investments-receivables', icon: 'pie-chart', color: '#8BC34A' },
        { id: '14', title: 'Analytics', route: '/analytics', icon: 'analytics', color: '#673AB7' },
      ]
    }
  ];

  React.useEffect(() => {
    if (visible) {
      // Slide up
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide down
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleMenuItemPress = (route: string) => {
    onClose();
    // Small delay to allow menu to close before navigation
    setTimeout(() => {
      router.push(route as any);
    }, 100);
  };

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleMenuItemPress(item.route)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <MaterialIcons name={item.icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.menuItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderMenuGroup = (group: MenuGroup) => (
    <View key={group.title} style={styles.menuGroup}>
      <Text style={styles.groupTitle}>{group.title}</Text>
      <View style={styles.groupGrid}>
        {group.items.map(renderMenuItem)}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.menuContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.appName}>Pocket</Text>
              <Text style={styles.appNameAccent}>Workx</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={20} color="#666666" />
            </TouchableOpacity>
          </View>

          {/* Scrollable Menu Groups */}
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {menuGroups.map(renderMenuGroup)}
          </ScrollView>

          {/* Handle bar at bottom */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: SCREEN_HEIGHT * 0.85,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  appNameAccent: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4A90E2',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  menuGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 12,
    marginLeft: 24,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  groupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  menuItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  menuItemText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
    lineHeight: 14,
    minHeight: 28,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#D0D0D0',
    borderRadius: 2,
  },
});

export default SlidingMenu;