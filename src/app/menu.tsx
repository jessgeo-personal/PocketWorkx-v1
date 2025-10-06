// src/app/menu.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenLayout from '../components/ScreenLayout';

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  badge?: string;
}

const MenuScreen: React.FC = () => {
  const menuGroups: MenuGroup[] = [
    {
      title: 'Accounts',
      items: [
        {
          id: 'cash',
          title: 'Cash',
          icon: 'account-balance-wallet',
          onPress: () => console.log('Cash')
        },
        {
          id: 'accounts',
          title: 'Accounts',
          icon: 'account-balance',
          onPress: () => console.log('Accounts')
        },
        {
          id: 'crypto',
          title: 'Crypto Assets',
          icon: 'currency-bitcoin',
          onPress: () => console.log('Crypto Assets')
        }
      ]
    },
    {
      title: 'Liabilities',
      items: [
        {
          id: 'loans',
          title: 'Loans',
          icon: 'home',
          onPress: () => console.log('Loans')
        },
        {
          id: 'credit-cards',
          title: 'Credit Cards',
          icon: 'credit-card',
          onPress: () => console.log('Credit Cards')
        }
      ]
    },
    {
      title: 'Investments',
      items: [
        {
          id: 'receivables',
          title: 'Receivables',
          icon: 'receipt',
          onPress: () => console.log('Receivables')
        },
        {
          id: 'investments',
          title: 'Investments',
          icon: 'trending-up',
          onPress: () => console.log('Investments')
        }
      ]
    },
    {
      title: 'Analytics',
      items: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          icon: 'dashboard',
          onPress: () => console.log('Dashboard')
        },
        {
          id: 'trends',
          title: 'Trends',
          icon: 'analytics',
          onPress: () => console.log('Trends')
        },
        {
          id: 'cashflow',
          title: 'Cashflow',
          icon: 'water-drop',
          onPress: () => console.log('Cashflow')
        }
      ]
    },
    {
      title: 'Quick Actions',
      items: [
        {
          id: 'add-account',
          title: 'Add Account',
          icon: 'add-circle',
          onPress: () => console.log('Add Account')
        },
        {
          id: 'add-crypto',
          title: 'Add Crypto Acct',
          icon: 'add-circle-outline',
          onPress: () => console.log('Add Crypto Account')
        },
        {
          id: 'scan-receipts',
          title: 'Scan receipts',
          icon: 'qr-code-scanner',
          onPress: () => console.log('Scan receipts')
        },
        {
          id: 'upload-statements',
          title: 'Upload Statements',
          icon: 'upload-file',
          onPress: () => console.log('Upload Statements')
        },
        {
          id: 'scan-sms',
          title: 'Scan SMS for transactions',
          icon: 'message',
          onPress: () => console.log('Scan SMS')
        },
        {
          id: 'scan-emails',
          title: 'Scan Emails for transactions',
          icon: 'email',
          onPress: () => console.log('Scan Emails')
        },
        {
          id: 'add-cash',
          title: 'Add Cash',
          icon: 'add',
          onPress: () => console.log('Add Cash')
        }
      ]
    }
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemIcon}>
        <MaterialIcons name={item.icon} size={24} color="#4A90E2" />
      </View>
      <Text style={styles.menuItemText}>{item.title}</Text>
      {item.badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}
      <MaterialIcons name="chevron-right" size={20} color="#CCCCCC" />
    </TouchableOpacity>
  );

  const renderMenuGroup = (group: MenuGroup) => (
    <View key={group.title} style={styles.menuGroup}>
      <Text style={styles.groupTitle}>{group.title}</Text>
      <View style={styles.groupContainer}>
        {group.items.map(renderMenuItem)}
      </View>
    </View>
  );

  return (
    <ScreenLayout>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Menu</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {menuGroups.map(renderMenuGroup)}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  menuGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
    marginHorizontal: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  groupContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F0F0',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default MenuScreen;