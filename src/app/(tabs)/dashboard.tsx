// src/app/(tabs)/dashboard.tsx
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
import { LinearGradient } from 'expo-linear-gradient';

interface DashboardData {
  netWorth: string;
  liquidCash: string;
  totalLiabilities: string;
  investmentsReceivables: string;
  userName: string;
  userEmail: string;
}

interface Transaction {
  id: string;
  merchant: string;
  date: string;
  amount: string;
  status: 'Success' | 'Pending' | 'Failed';
}

interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}

const DashboardScreen: React.FC = () => {
  // Mock data matching the mockup
  const dashboardData: DashboardData = {
    netWorth: '₹1,03,25,550',
    liquidCash: '₹23,45,300',
    totalLiabilities: '₹75,00,550',
    investmentsReceivables: '₹1,78,32,550',
    userName: 'Donna',
    userEmail: 'hello@reallygreatsite.com'
  };

  const recentTransactions: Transaction[] = [
    {
      id: '1',
      merchant: 'Borcelle Store',
      date: 'Friday, 10 September 2026',
      amount: '$35.00',
      status: 'Success'
    },
    {
      id: '2',
      merchant: 'Timmerman Industries',
      date: 'Saturday, 12 June 2026',
      amount: '$65.00',
      status: 'Success'
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Scan\nreceipts',
      icon: 'qr-code-scanner',
      onPress: () => console.log('Scan receipts')
    },
    {
      id: '2',
      title: 'Upload\nStatements',
      icon: 'upload-file',
      onPress: () => console.log('Upload statements')
    },
    {
      id: '3',
      title: 'Scan SMS for\ntransactions',
      icon: 'message',
      onPress: () => console.log('Scan SMS')
    },
    {
      id: '4',
      title: 'Scan Emails for\ntransactions',
      icon: 'email',
      onPress: () => console.log('Scan emails')
    },
    {
      id: '5',
      title: 'Add Cash',
      icon: 'add-circle',
      onPress: () => console.log('Add cash')
    }
  ];

  const renderWelcomeHeader = () => (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.welcomeText}>Welcome Back, {dashboardData.userName}</Text>
        <Text style={styles.emailText}>{dashboardData.userEmail}</Text>
      </View>
      <TouchableOpacity style={styles.menuButton}>
        <MaterialIcons name="menu" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );

  const renderNetWorthCard = () => (
    <LinearGradient
      colors={['#4A90E2', '#357ABD']}
      style={styles.netWorthCard}
    >
      <Text style={styles.netWorthLabel}>Your total net worth</Text>
      <Text style={styles.netWorthAmount}>{dashboardData.netWorth}</Text>
    </LinearGradient>
  );

  const renderFinancialSummary = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Your liquid cash balance</Text>
          <Text style={styles.summaryAmount}>{dashboardData.liquidCash}</Text>
        </View>
      </View>
      
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, styles.halfCard]}>
          <Text style={styles.summaryLabel}>Your total liabilities</Text>
          <Text style={[styles.summaryAmount, styles.liabilityAmount]}>
            {dashboardData.totalLiabilities}
          </Text>
        </View>
        
        <View style={[styles.summaryCard, styles.halfCard]}>
          <Text style={styles.summaryLabel}>Your Investments & recievables</Text>
          <Text style={[styles.summaryAmount, styles.investmentAmount]}>
            {dashboardData.investmentsReceivables}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickActionsScroll}
      >
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.quickActionButton}
            onPress={action.onPress}
          >
            <View style={styles.quickActionIcon}>
              <MaterialIcons name={action.icon} size={24} color="#4A90E2" />
            </View>
            <Text style={styles.quickActionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderTransactionItem = (transaction: Transaction) => (
    <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <Text style={styles.transactionMerchant}>{transaction.merchant}</Text>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
      </View>
      <View style={styles.transactionRight}>
        <Text style={styles.transactionAmount}>{transaction.amount}</Text>
        <View style={[styles.statusBadge, styles.successBadge]}>
          <Text style={styles.statusText}>{transaction.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderLatestTransactions = () => (
    <View style={styles.transactionsContainer}>
      <Text style={styles.sectionTitle}>Latest Transactions</Text>
      {recentTransactions.map(renderTransactionItem)}
      <TouchableOpacity style={styles.viewAllButton}>
        <Text style={styles.viewAllText}>View All Transactions</Text>
        <MaterialIcons name="arrow-forward" size={16} color="#4A90E2" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderWelcomeHeader()}
        {renderNetWorthCard()}
        {renderFinancialSummary()}
        {renderQuickActions()}
        {renderLatestTransactions()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  emailText: {
    fontSize: 14,
    color: '#666666',
  },
  menuButton: {
    padding: 8,
  },
  netWorthCard: {
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
  netWorthLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  netWorthAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
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
  halfCard: {
    flex: 1,
    marginHorizontal: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 16,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  liabilityAmount: {
    color: '#E74C3C',
  },
  investmentAmount: {
    color: '#27AE60',
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  quickActionsScroll: {
    paddingHorizontal: 16,
  },
  quickActionButton: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 80,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionText: {
    fontSize: 10,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 12,
  },
  transactionsContainer: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  transactionLeft: {
    flex: 1,
  },
  transactionMerchant: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666666',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  successBadge: {
    backgroundColor: '#E8F5E8',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#27AE60',
  },
  viewAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4A90E2',
    marginRight: 4,
  },
});

export default DashboardScreen;