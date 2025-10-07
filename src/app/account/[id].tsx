// src/app/account/[id].tsx

import React, { useCallback, useState } from 'react';
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
import {
  useRouter,
  useLocalSearchParams,
  useFocusEffect,
} from 'expo-router';
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
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id as string;

  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAccount = useCallback(async () => {
    try {
      const data = await fetchAccountById(id);
      setAccount(data);
    } catch {
      Alert.alert('Error', 'Failed to load account data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadAccount();
    }, [loadAccount])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAccount();
  }, [loadAccount]);

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
          <Text style={styles.txnDate}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>
        <Text
          style={[
            styles.txnAmount,
            { color: isDebit ? colors.error : colors.secondary },
          ]}
        >
          {isDebit ? '-' : '+'}
          {formatCompactCurrency(item.amount, item.currency)}
        </Text>
      </View>
    );
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{account.nickname}</Text>
          <TouchableOpacity
            style={styles.addIconContainer}
            onPress={() => router.push(`/account/${id}/transaction/new`)}
          >
            <MaterialIcons
              name="add"
              size={28}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          {account.bankName} • {account.accountNumberMasked}
        </Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceValue}>
            {formatCompactCurrency(
              account.balance.amount,
              account.balance.currency
            )}
          </Text>
        </View>
        <View style={styles.accountActions}>
          <TouchableOpacity
            style={styles.rowAction}
            onPress={() => router.push(`/account/${id}/edit`)}
          >
            <MaterialIcons
              name="edit"
              size={18}
              color={colors.textPrimary}
            />
            <Text style={styles.rowActionText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>Recent Transactions</Text>
        <FlatList
          data={account.transactions}
          keyExtractor={(t) => t.id}
          renderItem={renderTransaction}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
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

  accountActions: { flexDirection: 'row', marginBottom: 16 },
  rowAction: { flexDirection: 'row', alignItems: 'center' },
  rowActionText: { fontSize: 13, color: colors.textPrimary, marginLeft: 6 },

  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 24,
    marginBottom: 12,
  },

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
