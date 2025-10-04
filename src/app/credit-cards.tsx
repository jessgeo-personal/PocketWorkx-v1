// src/app/(tabs)/credit-cards.tsx
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
  CreditCard, 
  Money 
} from '../types/finance';
import { formatCompactCurrency } from '../utils/currency';

const CreditCardsScreen: React.FC = () => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([
    {
      id: '1',
      bank: 'HDFC Bank',
      cardNumber: '****4523',
      cardType: 'visa',
      cardName: 'MoneyBack+ Credit Card',
      creditLimit: { amount: 500000, currency: 'INR' },
      currentBalance: { amount: 125000, currency: 'INR' },
      availableCredit: { amount: 375000, currency: 'INR' },
      minimumPayment: { amount: 6250, currency: 'INR' },
      paymentDueDate: new Date('2025-11-15'),
      statementDate: new Date('2025-10-20'),
      interestRate: 3.5,
      annualFee: { amount: 500, currency: 'INR' },
      rewardProgram: {
        type: 'cashback',
        rate: 1.5,
        currentBalance: 2340,
      },
      isActive: true,
      // Required enhanced fields
      encryptedData: {
        encryptionKey: '',
        encryptionAlgorithm: 'AES-256',
        lastEncrypted: new Date(),
        isEncrypted: false,
      },
      auditTrail: {
        createdBy: 'user',
        createdAt: new Date('2022-01-15'),
        updatedBy: 'user',
        updatedAt: new Date(),
        version: 1,
        changes: [],
      },
      linkedTransactions: [],
    },
    {
      id: '2',
      bank: 'ICICI Bank',
      cardNumber: '****7891',
      cardType: 'mastercard',
      cardName: 'Amazon Pay Credit Card',
      creditLimit: { amount: 300000, currency: 'INR' },
      currentBalance: { amount: 85000, currency: 'INR' },
      availableCredit: { amount: 215000, currency: 'INR' },
      minimumPayment: { amount: 4250, currency: 'INR' },
      paymentDueDate: new Date('2025-11-20'),
      statementDate: new Date('2025-10-25'),
      interestRate: 3.65,
      annualFee: { amount: 0, currency: 'INR' },
      rewardProgram: {
        type: 'points',
        rate: 2,
        currentBalance: 15680,
      },
      isActive: true,
      // Required enhanced fields
      encryptedData: {
        encryptionKey: '',
        encryptionAlgorithm: 'AES-256',
        lastEncrypted: new Date(),
        isEncrypted: false,
      },
      auditTrail: {
        createdBy: 'user',
        createdAt: new Date('2021-08-10'),
        updatedBy: 'user',
        updatedAt: new Date(),
        version: 1,
        changes: [],
      },
      linkedTransactions: [],
    },
    {
      id: '3',
      bank: 'SBI Card',
      cardNumber: '****2456',
      cardType: 'rupay',
      cardName: 'Simply SAVE Credit Card',
      creditLimit: { amount: 150000, currency: 'INR' },
      currentBalance: { amount: 42000, currency: 'INR' },
      availableCredit: { amount: 108000, currency: 'INR' },
      minimumPayment: { amount: 2100, currency: 'INR' },
      paymentDueDate: new Date('2025-11-12'),
      statementDate: new Date('2025-10-18'),
      interestRate: 3.25,
      annualFee: { amount: 499, currency: 'INR' },
      rewardProgram: {
        type: 'points',
        rate: 1,
        currentBalance: 4200,
      },
      isActive: true,
      // Required enhanced fields
      encryptedData: {
        encryptionKey: '',
        encryptionAlgorithm: 'AES-256',
        lastEncrypted: new Date(),
        isEncrypted: false,
      },
      auditTrail: {
        createdBy: 'user',
        createdAt: new Date('2023-03-20'),
        updatedBy: 'user',
        updatedAt: new Date(),
        version: 1,
        changes: [],
      },
      linkedTransactions: [],
    },
  ]);

  const totalCreditLimit = creditCards
    .filter(card => card.isActive)
    .reduce((sum, card) => sum + card.creditLimit.amount, 0);

  const totalCurrentBalance = creditCards
    .filter(card => card.isActive)
    .reduce((sum, card) => sum + card.currentBalance.amount, 0);

  const totalAvailableCredit = creditCards
    .filter(card => card.isActive)
    .reduce((sum, card) => sum + card.availableCredit.amount, 0);

  const getCardBrandColor = (cardType: string) => {
    const colors = {
      visa: '#1A1F71',
      mastercard: '#EB001B',
      amex: '#006FCF',
      rupay: '#097969',
      diners: '#0079BE',
    };
    return colors[cardType as keyof typeof colors] || '#666666';
  };

  const getCardBrandName = (cardType: string) => {
    const names = {
      visa: 'VISA',
      mastercard: 'MasterCard',
      amex: 'American Express',
      rupay: 'RuPay',
      diners: 'Diners Club',
    };
    return names[cardType as keyof typeof names] || cardType.toUpperCase();
  };

  const calculateUtilization = (current: Money, limit: Money) => {
    return (current.amount / limit.amount) * 100;
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage < 30) return '#27AE60';
    if (percentage < 70) return '#F39C12';
    return '#E74C3C';
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Credit Cards</Text>
      <TouchableOpacity style={styles.addButton}>
        <MaterialIcons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderSummaryCards = () => (
    <View style={styles.summaryContainer}>
      <LinearGradient
        colors={['#8E44AD', '#9B59B6']}
        style={styles.summaryCard}
      >
        <Text style={styles.summaryLabel}>Total Credit Limit</Text>
        <Text style={styles.summaryAmount}>
          {formatCompactCurrency(totalCreditLimit, 'INR')}
        </Text>
        <Text style={styles.summarySubtext}>
          Available: {formatCompactCurrency(totalAvailableCredit, 'INR')}
        </Text>
      </LinearGradient>
      
      <View style={styles.utilizationCard}>
        <Text style={styles.utilizationLabel}>Total Outstanding</Text>
        <Text style={styles.utilizationAmount}>
          {formatCompactCurrency(totalCurrentBalance, 'INR')}
        </Text>
        <Text style={styles.utilizationPercent}>
          {((totalCurrentBalance / totalCreditLimit) * 100).toFixed(1)}% Utilization
        </Text>
      </View>
    </View>
  );

  const renderCreditCardItem = (card: CreditCard) => {
    const utilization = calculateUtilization(card.currentBalance, card.creditLimit);
    const daysUntilDue = Math.ceil(
      (card.paymentDueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    );

    return (
      <View key={card.id} style={styles.cardContainer}>
        <LinearGradient
          colors={[getCardBrandColor(card.cardType), '#000000']}
          style={styles.creditCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.bankName}>{card.bank}</Text>
            <Text style={styles.cardBrand}>{getCardBrandName(card.cardType)}</Text>
          </View>
          
          <View style={styles.cardMiddle}>
            <Text style={styles.cardNumber}>{card.cardNumber}</Text>
            <Text style={styles.cardName}>{card.cardName}</Text>
          </View>
          
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardLabel}>Available Credit</Text>
              <Text style={styles.cardAmount}>
                {formatCompactCurrency(card.availableCredit.amount, card.availableCredit.currency)}
              </Text>
            </View>
            <TouchableOpacity style={styles.cardMoreButton}>
              <MaterialIcons name="more-horiz" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        
        <View style={styles.cardDetails}>
          <View style={styles.utilizationContainer}>
            <View style={styles.utilizationHeader}>
              <Text style={styles.utilizationTitle}>Credit Utilization</Text>
              <Text style={styles.utilizationValue}>{utilization.toFixed(1)}%</Text>
            </View>
            <View style={styles.utilizationBarContainer}>
              <View style={styles.utilizationBarBackground}>
                <View 
                  style={[
                    styles.utilizationBar, 
                    { 
                      width: `${utilization}%`,
                      backgroundColor: getUtilizationColor(utilization)
                    }
                  ]}
                />
              </View>
            </View>
          </View>
          
          <View style={styles.paymentInfo}>
            <View style={styles.paymentRow}>
              <View style={styles.paymentDetail}>
                <Text style={styles.paymentLabel}>Outstanding</Text>
                <Text style={styles.paymentAmount}>
                  {formatCompactCurrency(card.currentBalance.amount, card.currentBalance.currency)}
                </Text>
              </View>
              
              <View style={styles.paymentDetail}>
                <Text style={styles.paymentLabel}>Min Payment</Text>
                <Text style={styles.paymentAmount}>
                  {formatCompactCurrency(card.minimumPayment.amount, card.minimumPayment.currency)}
                </Text>
              </View>
              
              <View style={styles.paymentDetail}>
                <Text style={styles.paymentLabel}>Due in</Text>
                <Text style={[styles.paymentAmount, daysUntilDue <= 7 ? styles.dueSoon : {}]}>
                  {daysUntilDue} days
                </Text>
              </View>
            </View>
          </View>
          
          {card.rewardProgram && (
            <View style={styles.rewardInfo}>
              <MaterialIcons name="card-giftcard" size={16} color="#F39C12" />
              <Text style={styles.rewardText}>
                {card.rewardProgram.currentBalance} {card.rewardProgram.type} earned
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionGrid}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="add-card" size={24} color="#8E44AD" />
          <Text style={styles.actionText}>Add Card</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="payment" size={24} color="#8E44AD" />
          <Text style={styles.actionText}>Pay Bill</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="history" size={24} color="#8E44AD" />
          <Text style={styles.actionText}>Statements</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="card-giftcard" size={24} color="#8E44AD" />
          <Text style={styles.actionText}>Rewards</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8E44AD" />
      {renderHeader()}
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderSummaryCards()}
        {renderQuickActions()}
        
        <View style={styles.cardsContainer}>
          <Text style={styles.sectionTitle}>Your Credit Cards</Text>
          {creditCards.map(renderCreditCardItem)}
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
    backgroundColor: '#8E44AD',
    borderBottomWidth: 1,
    borderBottomColor: '#7D3C98',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  utilizationCard: {
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
  utilizationLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  utilizationAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E74C3C',
    marginBottom: 4,
  },
  utilizationPercent: {
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
  cardsContainer: {
    paddingHorizontal: 20,
  },
  cardContainer: {
    marginBottom: 20,
  },
  creditCard: {
    padding: 20,
    borderRadius: 16,
    minHeight: 180,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardBrand: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardMiddle: {
    marginBottom: 20,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 8,
  },
  cardName: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.7,
    marginBottom: 4,
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardMoreButton: {
    padding: 4,
  },
  cardDetails: {
    backgroundColor: '#FFFFFF',
    padding: 16,
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
  utilizationContainer: {
    marginBottom: 16,
  },
  utilizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  utilizationTitle: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  utilizationValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666666',
  },
  utilizationBarContainer: {
    height: 6,
  },
  utilizationBarBackground: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },
  utilizationBar: {
    height: 6,
    borderRadius: 3,
  },
  paymentInfo: {
    marginBottom: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentDetail: {
    alignItems: 'center',
    flex: 1,
  },
  paymentLabel: {
    fontSize: 11,
    color: '#999999',
    marginBottom: 4,
  },
  paymentAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  dueSoon: {
    color: '#E74C3C',
  },
  rewardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  rewardText: {
    fontSize: 12,
    color: '#E65100',
    marginLeft: 6,
    fontWeight: '500',
  },
});

export default CreditCardsScreen;