// src/app/(tabs)/accounts.tsx
import React, { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { 
  BankAccount, 
  Money 
} from '../../types/finance';
import { formatCompactCurrency } from '../../utils/currency';

const AccountsScreen: React.FC = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      name: 'Primary Savings',
      type: 'savings',
      bank: 'ICICI Bank',
      branch: 'Bandra West',
      ifscCode: 'ICIC0000001',
      accountNumber: '****2847',
      balance: { amount: 4567800, currency: 'INR' },
      isActive: true,
      openingDate: new Date('2020-01-15'),
      interestRate: 3.5,
      minimumBalance: { amount: 10000, currency: 'INR' },
      // Required enhanced fields
      encryptedData: {
        encryptionKey: '',
        encryptionAlgorithm: 'AES-256',
        lastEncrypted: new Date(),
        isEncrypted: false,
      },
      auditTrail: {
        createdBy: 'user',
        createdAt: new Date('2020-01-15'),
        updatedBy: 'user',
        updatedAt: new Date(),
        version: 1,
        changes: [],
      },
      linkedTransactions: [],
    },
    {
      id: '2',
      name: 'Salary Account',
      type: 'salary',
      bank: 'HDFC Bank',
      branch: 'Powai',
      ifscCode: 'HDFC0000123',
      accountNumber: '****5691',
      balance: { amount: 2845600, currency: 'INR' },
      isActive: true,
      openingDate: new Date('2019-06-01'),
      interestRate: 3.0,
      minimumBalance: { amount: 0, currency: 'INR' },
      // Required enhanced fields
      encryptedData: {
        encryptionKey: '',
        encryptionAlgorithm: 'AES-256',
        lastEncrypted: new Date(),
        isEncrypted: false,
      },
      auditTrail: {
        createdBy: 'user',
        createdAt: new Date('2019-06-01'),
        updatedBy: 'user',
        updatedAt: new Date(),
        version: 1,
        changes: [],
      },
      linkedTransactions: [],
    },
    {
      id: '3',
      name: 'Emergency Fund',
      type: 'savings',
      bank: 'SBI',
      branch: 'Mumbai Central',
      ifscCode: 'SBIN0000456',
      accountNumber: '****7123',
      balance: { amount: 1236400, currency: 'INR' },
      isActive: true,
      openingDate: new Date('2021-03-10'),
      interestRate: 2.7,
      minimumBalance: { amount: 5000, currency: 'INR' },
      // Required enhanced fields
      encryptedData: {
        encryptionKey: '',
        encryptionAlgorithm: 'AES-256',
        lastEncrypted: new Date(),
        isEncrypted: false,
      },
      auditTrail: {
        createdBy: 'user',
        createdAt: new Date('2021-03-10'),
        updatedBy: 'user',
        updatedAt: new Date(),
        version: 1,
        changes: [],
      },
      linkedTransactions: [],
    },
  ]);

  const totalBalance = accounts
    .filter(account => account.isActive)
    .reduce((sum, account) => sum + account.balance.amount, 0);

  const getBankColor = (bank: string) => {
    const colors = {
      'ICICI Bank': '#ED6C02',
      'HDFC Bank': '#004C8F',
      'SBI': '#1976D2',
      'Axis Bank': '#9C27B0',
      'Kotak Bank': '#E53935',
    };
    return colors[bank as keyof typeof colors] || '#666666';
  };

  const getBankIcon = (bank: string) => {
    const icons = {
      'ICICI Bank': 'account-balance',
      'HDFC Bank': 'account-balance',
      'SBI': 'account-balance',
      'Axis Bank': 'account-balance',
      'Kotak Bank': 'account-balance',
    };
    return icons[bank as keyof typeof icons] || 'account-balance';
  };

  const getAccountTypeLabel = (type: string) => {
    const labels = {
      savings: 'Savings Account',
      salary: 'Salary Account',
      current: 'Current Account',
      checking: 'Checking Account',
      business: 'Business Account',
    };
    return labels[type as keyof typeof labels] || 'Account';
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Bank Accounts</Text>
      <TouchableOpacity style={styles.addButton}>
        <MaterialIcons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderTotalCard = () => (
    <LinearGradient
      colors={['#2E7D32', '#388E3C']}
      style={styles.totalCard}
    >
      <Text style={styles.totalLabel}>Total Account Balance</Text>
      <Text style={styles.totalAmount}>
        {formatCompactCurrency(totalBalance, 'INR')}
      </Text>
      <Text style={styles.accountCount}>
        {accounts.filter(acc => acc.isActive).length} Active Accounts
      </Text>
    </LinearGradient>
  );

  const renderAccountCard = (account: BankAccount) => (
    <TouchableOpacity key={account.id} style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View style={styles.accountLeft}>
          <View style={[styles.bankIcon, { backgroundColor: getBankColor(account.bank) }]}>
            <MaterialIcons 
              name={getBankIcon(account.bank) as any} 
              size={24} 
              color="#FFFFFF" 
            />
          </View>
          <View style={styles.accountDetails}>
            <Text style={styles.accountName}>{account.name}</Text>
            <Text style={styles.accountType}>{getAccountTypeLabel(account.type)}</Text>
            <Text style={styles.bankName}>{account.bank}</Text>
            <Text style={styles.accountNumber}>{account.accountNumber}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MaterialIcons name="more-vert" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.balanceContainer}>
        <View style={styles.balanceLeft}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>
            {formatCompactCurrency(account.balance.amount, account.balance.currency)}
          </Text>
        </View>
        
        <View style={styles.balanceRight}>
          <TouchableOpacity style={styles.actionBtn}>
            <MaterialIcons name="swap-horiz" size={16} color="#4A90E2" />
            <Text style={styles.actionBtnText}>Transfer</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.accountFooter}>
        <View style={styles.accountInfo}>
          <Text style={styles.infoLabel}>Interest Rate</Text>
          <Text style={styles.infoValue}>{account.interestRate}% p.a.</Text>
        </View>
        
        <View style={styles.accountInfo}>
          <Text style={styles.infoLabel}>Min. Balance</Text>
          <Text style={styles.infoValue}>
            {formatCompactCurrency(account.minimumBalance?.amount || 0, account.minimumBalance?.currency || 'INR')}
          </Text>
        </View>
        
        <View style={styles.accountInfo}>
          <Text style={styles.infoLabel}>Branch</Text>
          <Text style={styles.infoValue}>{account.branch}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionGrid}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="add-circle" size={24} color="#2E7D32" />
          <Text style={styles.actionText}>Add Account</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="swap-horiz" size={24} color="#2E7D32" />
          <Text style={styles.actionText}>Transfer Money</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="receipt-long" size={24} color="#2E7D32" />
          <Text style={styles.actionText}>Statements</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="account-balance" size={24} color="#2E7D32" />
          <Text style={styles.actionText}>Checkbook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {renderHeader()}
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderTotalCard()}
        {renderQuickActions()}
        
        <View style={styles.accountsContainer}>
          <Text style={styles.sectionTitle}>Your Accounts</Text>
          {accounts.map(renderAccountCard)}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  addButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 20,
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  totalCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  accountCount: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  quickActionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    width: '47%',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#333333',
    marginTop: 8,
    textAlign: 'center',
  },
  accountsContainer: {
    paddingHorizontal: 20,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  accountType: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  bankName: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 12,
    color: '#999999',
  },
  moreButton: {
    padding: 4,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLeft: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E7D32',
  },
  balanceRight: {
    alignItems: 'flex-end',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  actionBtnText: {
    fontSize: 12,
    color: '#4A90E2',
    marginLeft: 4,
  },
  accountFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  accountInfo: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: '#999999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 11,
    color: '#666666',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default AccountsScreen;