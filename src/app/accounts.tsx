// src/app/accounts.tsx

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenLayout from '../components/ScreenLayout';
import { formatCompactCurrency } from '../utils/currency';
import { colors } from '../utils/theme';

// Types aligned to PRD, allowing future extension
type Currency = 'INR';

type Money = {
  amount: number;
  currency: Currency;
};

type AccountType = 'savings' | 'current' | 'salary' | 'other';

type Account = {
  id: string;
  bankName: string;
  nickname: string;
  accountNumberMasked: string; // e.g., ****1234
  type: AccountType;
  balance: Money;
  institutionLogo?: string;
  lastSynced?: Date | null;
  encryptedData: {
    encryptionKey: string;
    encryptionAlgorithm: 'AES-256';
    lastEncrypted: Date | null;
    isEncrypted: boolean;
  };
  auditTrail: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    version: number;
    changes: Array<{ field: string; from?: any; to?: any; at: Date }>;
  };
  linkedTransactions: string[];
  metadata?: {
    ifsc?: string;
    holderName?: string;
    branch?: string;
    notes?: string;
  };
};

const initialAccounts: Account[] = [
  {
    id: 'a1',
    bankName: 'ICICI Bank',
    nickname: 'ICICI Savings',
    accountNumberMasked: '****1235',
    type: 'savings',
    balance: { amount: 10023550, currency: 'INR' },
    lastSynced: new Date('2025-10-01'),
    encryptedData: {
      encryptionKey: '',
      encryptionAlgorithm: 'AES-256',
      lastEncrypted: null,
      isEncrypted: false,
    },
    auditTrail: {
      createdBy: 'user',
      createdAt: new Date('2025-09-01'),
      updatedBy: 'user',
      updatedAt: new Date(),
      version: 1,
      changes: [],
    },
    linkedTransactions: [],
    metadata: { holderName: 'Donna', ifsc: 'ICIC0000123' },
  },
  {
    id: 'a2',
    bankName: 'ICICI Bank',
    nickname: 'ICICI Salary',
    accountNumberMasked: '****3366',
    type: 'salary',
    balance: { amount: 329556, currency: 'INR' },
    lastSynced: new Date('2025-10-03'),
    encryptedData: {
      encryptionKey: '',
      encryptionAlgorithm: 'AES-256',
      lastEncrypted: null,
      isEncrypted: false,
    },
    auditTrail: {
      createdBy: 'user',
      createdAt: new Date('2025-09-08'),
      updatedBy: 'user',
      updatedAt: new Date(),
      version: 1,
      changes: [],
    },
    linkedTransactions: [],
    metadata: { holderName: 'Donna', ifsc: 'ICIC0000456' },
  },
  {
    id: 'a3',
    bankName: 'HDFC Bank',
    nickname: 'HDFC Savings',
    accountNumberMasked: '****4353',
    type: 'savings',
    balance: { amount: 329556, currency: 'INR' },
    lastSynced: new Date('2025-10-02'),
    encryptedData: {
      encryptionKey: '',
      encryptionAlgorithm: 'AES-256',
      lastEncrypted: null,
      isEncrypted: false,
    },
    auditTrail: {
      createdBy: 'user',
      createdAt: new Date('2025-09-10'),
      updatedBy: 'user',
      updatedAt: new Date(),
      version: 1,
      changes: [],
    },
    linkedTransactions: [],
    metadata: { holderName: 'Donna', ifsc: 'HDFC0000789' },
  },
];

const AccountsScreen: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // Add Account form
  const [bankName, setBankName] = useState('');
  const [nickname, setNickname] = useState('');
  const [accountNumberMasked, setAccountNumberMasked] = useState('');
  const [type, setType] = useState<AccountType>('savings');
  const [balanceAmount, setBalanceAmount] = useState('');
  const totalBalance = useMemo(
    () => accounts.reduce((sum, a) => sum + (a.balance?.amount || 0), 0),
    [accounts]
  );

  // Quick Action placeholders
  const handleUploadStatements = () => {
    Alert.alert('Coming Soon', 'Upload Statements flow will be implemented next.');
  };
  const handleScanSMS = () => {
    Alert.alert('Coming Soon', 'SMS scanning flow will be implemented next.');
  };
  const handleScanEmails = () => {
    Alert.alert('Coming Soon', 'Email scanning flow will be implemented next.');
  };

  const handleOpenAdd = () => setIsAddModalVisible(true);
  const resetAddForm = () => {
    setBankName('');
    setNickname('');
    setAccountNumberMasked('');
    setType('savings');
    setBalanceAmount('');
  };
  const handleCloseAdd = () => {
    resetAddForm();
    setIsAddModalVisible(false);
  };

  const handleAddAccount = () => {
    if (!bankName.trim() || !nickname.trim() || !balanceAmount.trim()) {
      Alert.alert('Error', 'Bank, Nickname, and Balance are required.');
      return;
    }
    const amt = parseFloat(balanceAmount);
    if (Number.isNaN(amt) || amt < 0) {
      Alert.alert('Error', 'Enter a valid non-negative balance.');
      return;
    }
    const newAccount: Account = {
      id: Date.now().toString(),
      bankName: bankName.trim(),
      nickname: nickname.trim(),
      accountNumberMasked: accountNumberMasked.trim() || '****XXXX',
      type,
      balance: { amount: amt, currency: 'INR' },
      lastSynced: null,
      encryptedData: {
        encryptionKey: '',
        encryptionAlgorithm: 'AES-256',
        lastEncrypted: null,
        isEncrypted: false,
      },
      auditTrail: {
        createdBy: 'user',
        createdAt: new Date(),
        updatedBy: 'user',
        updatedAt: new Date(),
        version: 1,
        changes: [],
      },
      linkedTransactions: [],
      metadata: {},
    };
    setAccounts(prev => [...prev, newAccount]);
    handleCloseAdd();
  };

  const handleDeleteAccount = (id: string) => {
    Alert.alert('Confirm Delete', 'Remove this account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setAccounts(prev => prev.filter(a => a.id !== id)),
      },
    ]);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Accounts</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleOpenAdd}>
        <MaterialIcons name="add" size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderTotalCard = () => (
    <LinearGradient colors={['#2F80ED', '#56CCF2']} style={styles.totalCard}>
      <Text style={styles.totalLabel}>Total Bank Accounts</Text>
      <Text style={styles.totalAmount}>{formatCompactCurrency(totalBalance, 'INR')}</Text>
      <Text style={styles.entriesCount}>
        {accounts.length} {accounts.length === 1 ? 'Account' : 'Accounts'}
      </Text>
    </LinearGradient>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionGrid}>
        <TouchableOpacity style={styles.actionButton} onPress={handleUploadStatements}>
          <MaterialIcons name="upload-file" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Upload Statements</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleScanSMS}>
          <MaterialIcons name="sms" size={24} color={colors.secondary} />
          <Text style={styles.actionText}>Scan SMS for transactions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleScanEmails}>
          <MaterialIcons name="email" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Scan Emails for transactions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleOpenAdd}>
          <MaterialIcons name="add-circle-outline" size={24} color={colors.secondary} />
          <Text style={styles.actionText}>Add Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getBankBadgeColor = (bankName: string) => {
    const b = bankName.toLowerCase();
    if (b.includes('icici')) return '#F37021';
    if (b.includes('hdfc')) return '#0054A6';
    if (b.includes('sbi')) return '#1E88E5';
    if (b.includes('axis')) return '#AE275F';
    return '#666666';
  };

  const renderAccountCard = (acc: Account) => (
    <View key={acc.id} style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View style={styles.accountLeft}>
          <View style={[styles.bankIcon, { backgroundColor: getBankBadgeColor(acc.bankName) }]}>
            <MaterialIcons name="account-balance" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.accountDetails}>
            <Text style={styles.accountNickname}>{acc.nickname}</Text>
            <Text style={styles.accountSubtext}>
              {acc.bankName} • {acc.accountNumberMasked}
            </Text>
            <Text style={styles.accountMeta}>
              {acc.type.toUpperCase()} {acc.lastSynced ? `• Synced ${acc.lastSynced.toLocaleDateString()}` : ''}
            </Text>
          </View>
        </View>

        <View style={styles.accountRight}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceValue}>{formatCompactCurrency(acc.balance.amount, acc.balance.currency)}</Text>
        </View>
      </View>

      <View style={styles.accountActions}>
        <TouchableOpacity style={styles.rowAction} onPress={() => Alert.alert('Coming Soon', 'View Account details will open next.')}>
          <MaterialIcons name="visibility" size={18} color={colors.textPrimary} />
          <Text style={styles.rowActionText}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rowAction} onPress={() => Alert.alert('Coming Soon', 'Edit Account flow to be implemented.')}>
          <MaterialIcons name="edit" size={18} color={colors.textPrimary} />
          <Text style={styles.rowActionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rowAction} onPress={() => handleDeleteAccount(acc.id)}>
          <MaterialIcons name="delete-outline" size={18} color={colors.error} />
          <Text style={[styles.rowActionText, { color: colors.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAccountsList = () => (
    <View style={styles.accountsContainer}>
      <Text style={styles.sectionTitle}>Your Accounts</Text>
      {accounts.length > 0 ? (
        accounts.map(renderAccountCard)
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="account-balance" size={48} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>No accounts yet</Text>
          <Text style={styles.emptySubtext}>Add your first bank account to get started</Text>
        </View>
      )}
    </View>
  );

  const renderAddAccountModal = () => (
    <Modal visible={isAddModalVisible} transparent animationType="slide" onRequestClose={handleCloseAdd}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Account</Text>
            <TouchableOpacity onPress={handleCloseAdd}>
              <MaterialIcons name="close" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Bank Name *</Text>
              <TextInput
                style={styles.textInput}
                value={bankName}
                onChangeText={setBankName}
                placeholder="e.g., ICICI Bank"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nickname *</Text>
              <TextInput
                style={styles.textInput}
                value={nickname}
                onChangeText={setNickname}
                placeholder="e.g., ICICI Savings"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Masked Account Number</Text>
              <TextInput
                style={styles.textInput}
                value={accountNumberMasked}
                onChangeText={setAccountNumberMasked}
                placeholder="e.g., ****1235"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.rowItem]}>
                <Text style={styles.inputLabel}>Type</Text>
                <View style={styles.pillRow}>
                  {(['savings', 'salary', 'current', 'other'] as AccountType[]).map(opt => (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.pill, type === opt && styles.pillSelected]}
                      onPress={() => setType(opt)}
                    >
                      <Text style={[styles.pillText, type === opt && styles.pillTextSelected]}>
                        {opt.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={[styles.inputContainer, styles.rowItem]}>
                <Text style={styles.inputLabel}>Starting Balance (₹) *</Text>
                <TextInput
                  style={styles.textInput}
                  value={balanceAmount}
                  onChangeText={setBalanceAmount}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCloseAdd}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={handleAddAccount}>
              <Text style={styles.primaryButtonText}>Add Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScreenLayout>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 24 }}>
        {renderHeader()}
        {renderTotalCard()}
        {renderQuickActions()}
        {renderAccountsList()}
      </ScrollView>
      {renderAddAccountModal()}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: '#F8F9FA' },

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
  headerTitle: { fontSize: 24, fontWeight: '600', color: '#1A1A1A' },
  addButton: { backgroundColor: colors.primary, borderRadius: 20, padding: 8 },

  totalCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  totalLabel: { fontSize: 14, color: '#FFFFFF', opacity: 0.9, marginBottom: 8 },
  totalAmount: { fontSize: 32, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  entriesCount: { fontSize: 12, color: '#FFFFFF', opacity: 0.8 },

  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', marginBottom: 12 },

  quickActionsContainer: { paddingHorizontal: 20, marginBottom: 24 },
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: { fontSize: 12, color: '#333333', marginTop: 8, textAlign: 'center' },

  accountsContainer: { paddingHorizontal: 20, marginBottom: 100 },
  accountCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  accountLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountDetails: { flex: 1 },
  accountNickname: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 2 },
  accountSubtext: { fontSize: 14, color: '#666666', marginBottom: 4 },
  accountMeta: { fontSize: 12, color: '#999999' },

  accountRight: { alignItems: 'flex-end' },
  balanceLabel: { fontSize: 12, color: '#666666', marginBottom: 4 },
  balanceValue: { fontSize: 20, fontWeight: '700', color: colors.secondary },

  accountActions: { flexDirection: 'row', marginTop: 8 },
  rowAction: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  rowActionText: { fontSize: 13, color: colors.textPrimary, marginLeft: 6 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 480,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A' },
  modalBody: { padding: 20 },
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '500', color: '#333333', marginBottom: 8 },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
  },
  row: { flexDirection: 'row' },
  rowItem: { flex: 1 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap' },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
    marginBottom: 8,
  },
  pillSelected: { backgroundColor: '#E8F0FE', borderColor: colors.secondary },
  pillText: { fontSize: 12, color: '#333333' },
  pillTextSelected: { color: colors.secondary, fontWeight: '600' },

  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: { paddingHorizontal: 16, paddingVertical: 8, marginRight: 12 },
  cancelButtonText: { fontSize: 16, color: '#666666' },
  primaryButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  primaryButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },

  // Empty state
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#666666', marginTop: 16, marginBottom: 4 },
  emptySubtext: { fontSize: 14, color: '#999999', textAlign: 'center' },
});

export default AccountsScreen;
