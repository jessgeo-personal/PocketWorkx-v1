// src/app/(tabs)/loans.tsx
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

interface Loan {
  id: string;
  type: 'home' | 'personal' | 'car' | 'education' | 'gold';
  bank: string;
  accountNumber: string;
  principalAmount: number;
  currentBalance: number;
  interestRate: number;
  tenure: number; // months
  emi: number;
  nextPaymentDate: Date;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

const LoansScreen: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: '1',
      type: 'home',
      bank: 'HDFC Bank',
      accountNumber: '7845',
      principalAmount: 5000000, // ₹50 lakhs
      currentBalance: 3750000, // ₹37.5 lakhs remaining
      interestRate: 8.5,
      tenure: 240, // 20 years
      emi: 43500,
      nextPaymentDate: new Date('2025-11-01'),
      startDate: new Date('2020-01-01'),
      endDate: new Date('2040-01-01'),
      isActive: true,
    },
    {
      id: '2',
      type: 'car',
      bank: 'ICICI Bank',
      accountNumber: '2156',
      principalAmount: 800000, // ₹8 lakhs
      currentBalance: 350000, // ₹3.5 lakhs remaining
      interestRate: 9.2,
      tenure: 84, // 7 years
      emi: 12800,
      nextPaymentDate: new Date('2025-10-15'),
      startDate: new Date('2022-03-01'),
      endDate: new Date('2029-03-01'),
      isActive: true,
    },
    {
      id: '3',
      type: 'personal',
      bank: 'SBI',
      accountNumber: '9834',
      principalAmount: 300000, // ₹3 lakhs
      currentBalance: 125000, // ₹1.25 lakhs remaining
      interestRate: 11.5,
      tenure: 36, // 3 years
      emi: 10200,
      nextPaymentDate: new Date('2025-10-20'),
      startDate: new Date('2023-06-01'),
      endDate: new Date('2026-06-01'),
      isActive: true,
    },
  ]);

  const totalOutstanding = loans
    .filter(loan => loan.isActive)
    .reduce((sum, loan) => sum + loan.currentBalance, 0);

  const totalEMI = loans
    .filter(loan => loan.isActive)
    .reduce((sum, loan) => sum + loan.emi, 0);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  const getLoanTypeIcon = (type: string) => {
    const icons = {
      home: 'home',
      car: 'directions-car',
      personal: 'person',
      education: 'school',
      gold: 'attach-money',
    };
    return icons[type as keyof typeof icons] || 'account-balance-wallet';
  };

  const getLoanTypeColor = (type: string) => {
    const colors = {
      home: '#4CAF50',
      car: '#2196F3',
      personal: '#FF9800',
      education: '#9C27B0',
      gold: '#FFD700',
    };
    return colors[type as keyof typeof colors] || '#666666';
  };

  const calculateProgress = (principal: number, current: number) => {
    return ((principal - current) / principal) * 100;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Loans</Text>
      <TouchableOpacity style={styles.addButton}>
        <MaterialIcons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderSummaryCards = () => (
    <View style={styles.summaryContainer}>
      <LinearGradient
        colors={['#E74C3C', '#C0392B']}
        style={styles.summaryCard}
      >
        <Text style={styles.summaryLabel}>Total Outstanding</Text>
        <Text style={styles.summaryAmount}>{formatCurrency(totalOutstanding)}</Text>
      </LinearGradient>
      
      <View style={styles.emiCard}>
        <Text style={styles.emiLabel}>Monthly EMI</Text>
        <Text style={styles.emiAmount}>{formatCurrency(totalEMI)}</Text>
        <Text style={styles.emiCount}>{loans.filter(l => l.isActive).length} Active Loans</Text>
      </View>
    </View>
  );

  const renderLoanCard = (loan: Loan) => {
    const progress = calculateProgress(loan.principalAmount, loan.currentBalance);
    const daysUntilPayment = Math.ceil(
      (loan.nextPaymentDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    );

    return (
      <TouchableOpacity key={loan.id} style={styles.loanCard}>
        <View style={styles.loanHeader}>
          <View style={styles.loanLeft}>
            <View style={[styles.loanIcon, { backgroundColor: getLoanTypeColor(loan.type) }]}>
              <MaterialIcons 
                name={getLoanTypeIcon(loan.type) as any} 
                size={24} 
                color="#FFFFFF" 
              />
            </View>
            <View style={styles.loanDetails}>
              <Text style={styles.loanType}>
                {loan.type.charAt(0).toUpperCase() + loan.type.slice(1)} Loan
              </Text>
              <Text style={styles.bankName}>{loan.bank}</Text>
              <Text style={styles.accountNumber}>*{loan.accountNumber}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MaterialIcons name="more-vert" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.balanceContainer}>
          <View style={styles.balanceLeft}>
            <Text style={styles.outstandingLabel}>Outstanding</Text>
            <Text style={styles.outstandingAmount}>{formatCurrency(loan.currentBalance)}</Text>
            <Text style={styles.principalAmount}>
              of {formatCurrency(loan.principalAmount)}
            </Text>
          </View>
          
          <View style={styles.balanceRight}>
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <View 
                  style={[styles.progressBar, { width: `${progress}%` }]}
                />
              </View>
              <Text style={styles.progressText}>{progress.toFixed(0)}% paid</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.loanFooter}>
          <View style={styles.emiInfo}>
            <MaterialIcons name="calendar-today" size={16} color="#666" />
            <Text style={styles.emiText}>EMI: {formatCurrency(loan.emi)}</Text>
          </View>
          
          <View style={styles.nextPayment}>
            <MaterialIcons name="schedule" size={16} color="#E74C3C" />
            <Text style={styles.nextPaymentText}>
              Due in {daysUntilPayment} days
            </Text>
          </View>
        </View>
        
        <View style={styles.interestInfo}>
          <Text style={styles.interestRate}>Rate: {loan.interestRate}% p.a.</Text>
          <Text style={styles.tenure}>
            Tenure: {Math.floor(loan.tenure / 12)}Y {loan.tenure % 12}M
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionGrid}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="add" size={24} color="#E74C3C" />
          <Text style={styles.actionText}>Add Loan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="payment" size={24} color="#E74C3C" />
          <Text style={styles.actionText}>Pay EMI</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="description" size={24} color="#E74C3C" />
          <Text style={styles.actionText}>Statements</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="calculate" size={24} color="#E74C3C" />
          <Text style={styles.actionText}>EMI Calculator</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {renderHeader()}
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderSummaryCards()}
        {renderQuickActions()}
        
        <View style={styles.loansContainer}>
          <Text style={styles.sectionTitle}>Your Loans</Text>
          {loans.map(renderLoanCard)}
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
    backgroundColor: '#E74C3C',
    borderRadius: 20,
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emiCard: {
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
  emiLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  emiAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E74C3C',
    marginBottom: 4,
  },
  emiCount: {
    fontSize: 12,
    color: '#999999',
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
  loansContainer: {
    paddingHorizontal: 20,
  },
  loanCard: {
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
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  loanLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  loanIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  loanDetails: {
    flex: 1,
  },
  loanType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
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
  outstandingLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  outstandingAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E74C3C',
    marginBottom: 2,
  },
  principalAmount: {
    fontSize: 12,
    color: '#999999',
  },
  balanceRight: {
    alignItems: 'flex-end',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBackground: {
    width: 80,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#27AE60',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 10,
    color: '#666666',
  },
  loanFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  emiInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emiText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  nextPayment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextPaymentText: {
    fontSize: 12,
    color: '#E74C3C',
    marginLeft: 4,
    fontWeight: '500',
  },
  interestInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  interestRate: {
    fontSize: 11,
    color: '#999999',
  },
  tenure: {
    fontSize: 11,
    color: '#999999',
  },
});

export default LoansScreen;