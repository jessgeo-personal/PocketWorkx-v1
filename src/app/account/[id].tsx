// src/app/account/[id].tsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenLayout from '../../components/ScreenLayout';
import { formatCompactCurrency } from '../../utils/currency';
import { colors } from '../../utils/theme';
import {
  fetchAccountById,
  Account,
  Transaction,
} from '../../services/accountService';

const AccountDetailScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;

  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAccount = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAccountById(id);
      setAccount(data);
    } catch {
      Alert.alert('Error', 'Failed to load account data.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchAccountById(id);
      setAccount(data);
    } catch {
      Alert.alert('Error', 'Refresh failed.');
    } finally {
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      Alert.alert('Error', 'No account ID.', [{ text: 'OK', onPress: () => router.back() }]);
      return;
    }
    loadAccount();
  }, [id, loadAccount]);

  if (loading) {
    return (
      <ScreenLayout>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenLayout>
    );
  }
  if (!account) return null;

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isDebit = item.type === 'debit';
    return (
      <View style={styles.txnRow}>
        <View>
          <Text style={styles.txnDesc}>{item.description}</Text>
          <Text style={styles.txnDate}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
        <Text style={[styles.txnAmount, { color: isDebit ? colors.error : colors.secondary }]}>
          {isDebit ? '-' : '+'}
          {formatCompactCurrency(item.amount, item.currency)}
        </Text>
      </View>
    );
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        {/* Header with Add Transaction */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{account.nickname}</Text>
          <TouchableOpacity
            style={styles.addIconContainer}
            onPress={() => router.push(`/account/${id}/transaction/new`)}
          >
            <MaterialIcons name="add" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Account Summary */}
        <Text style={styles.subtitle}>
          {account.bankName} • {account.accountNumberMasked}
        </Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceValue}>
            {formatCompactCurrency(account.balance.amount, account.balance.currency)}
          </Text>
        </View>
        <Text style={styles.meta}>Type: {account.type.toUpperCase()}</Text>
        <Text style={styles.meta}>
          Last synced: {new Date(account.lastSynced!).toLocaleDateString()}
        </Text>

        {/* Transactions */}
        <Text style={styles.sectionHeader}>Recent Transactions</Text>
        <FlatList
          data={account.transactions}
          keyExtractor={t => t.id}
          renderItem={renderTransaction}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          style={styles.txnList}
          ListEmptyComponent={() => (
            <View style={styles.emptyTxn}>
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubtext}>
                Add your first transaction using the + button
              </Text>
            </View>
          )}
        />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 20, backgroundColor: '#F8F9FA' },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addIconContainer: {
    padding: 8,
    borderRadius: 20,
  },
  title: { fontSize: 24, fontWeight: '600', color: '#1A1A1A' },

  subtitle: { fontSize: 14, color: '#666666', marginVertical: 8 },

  balanceContainer: { marginVertical: 24 },
  balanceLabel: { fontSize: 14, color: '#999999', marginBottom: 4 },
  balanceValue: { fontSize: 32, fontWeight: '700', color: colors.secondary },

  meta: { fontSize: 12, color: '#666666', marginBottom: 8 },

  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 24,
    marginBottom: 12,
  },

  txnList: { flexGrow: 0 },
  txnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  txnDesc: { fontSize: 14, color: '#333333' },
  txnDate: { fontSize: 12, color: '#999999' },
  txnAmount: { fontSize: 16, fontWeight: '600' },
  sep: { height: 1, backgroundColor: '#E0E0E0' },

  emptyTxn: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 16, color: '#666666', marginBottom: 4 },
  emptySubtext: { fontSize: 12, color: '#999999' },
});

export default AccountDetailScreen;
