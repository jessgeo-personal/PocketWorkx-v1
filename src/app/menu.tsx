// src/app/menu.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ScreenLayout from '../components/ScreenLayout';

const MenuScreen: React.FC = () => {
  const menuSections = [
    {
      title: 'Financial Overview',
      items: [
        { name: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
        { name: 'Net Worth', route: '/dashboard', icon: 'account-balance-wallet' },
        { name: 'Financial Health', route: '/analytics', icon: 'favorite' },
      ]
    },
    {
      title: 'Assets & Accounts',
      items: [
        { name: 'Cash', route: '/cash', icon: 'account-balance-wallet' },
        { name: 'Bank Accounts', route: '/accounts', icon: 'account-balance' },
        { name: 'Crypto Assets', route: '/crypto', icon: 'currency-bitcoin' },
        { name: 'Investments', route: '/investments', icon: 'trending-up' },
        { name: 'Liquidity', route: '/liquidity', icon: 'water-drop' },
      ]
    },
    {
      title: 'Liabilities',
      items: [
        { name: 'Loans', route: '/loans', icon: 'trending-down' },
        { name: 'Credit Cards', route: '/credit-cards', icon: 'credit-card' },
        { name: 'Liabilities', route: '/liabilities', icon: 'remove-circle' },
      ]
    },
    {
      title: 'Income & Receivables',
      items: [
        { name: 'Receivables', route: '/receivables', icon: 'receipt' },
        { name: 'Cash Flow', route: '/cashflow', icon: 'swap-horiz' },
      ]
    },
    {
      title: 'Analysis & Reports',
      items: [
        { name: 'Analytics', route: '/analytics', icon: 'analytics' },
        { name: 'Trends', route: '/trends', icon: 'show-chart' },
      ]
    }
  ];

  const handleMenuPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <ScreenLayout>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Menu</Text>
          <MaterialIcons name="menu" size={24} color="#607D8B" />
        </View>
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {menuSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.menuSection}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={styles.menuItem}
                  onPress={() => handleMenuPress(item.route)}
                >
                  <MaterialIcons 
                    name={item.icon as any} 
                    size={24} 
                    color="#607D8B" 
                  />
                  <Text style={styles.menuItemText}>{item.name}</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#999" />
                </TouchableOpacity>
              ))}
            </View>
          ))}
          
          <View style={styles.appInfo}>
            <Text style={styles.appInfoTitle}>PocketWorkx</Text>
            <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
            <Text style={styles.appInfoDescription}>
              Your personal financial management companion
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 16,
    flex: 1,
  },
  appInfo: {
    alignItems: 'center',
    padding: 40,
    marginBottom: 100,
  },
  appInfoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#607D8B',
    marginBottom: 4,
  },
  appInfoVersion: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 8,
  },
  appInfoDescription: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default MenuScreen;