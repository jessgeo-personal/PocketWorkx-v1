// src/app/analytics.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenLayout from '../components/ScreenLayout';

const AnalyticsScreen: React.FC = () => {
  const analyticsData = {
    monthlyIncome: 245000,
    monthlyExpenses: 185000,
    savingsRate: 24.5,
    netWorthGrowth: 8.3,
    expenseCategories: [
      { category: 'Housing', amount: 65000, percentage: 35 },
      { category: 'Food', amount: 28000, percentage: 15 },
      { category: 'Transportation', amount: 22000, percentage: 12 },
      { category: 'Utilities', amount: 18500, percentage: 10 },
      { category: 'Entertainment', amount: 16000, percentage: 8 },
      { category: 'Others', amount: 35500, percentage: 20 },
    ],
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Analytics</Text>
      <MaterialIcons name="analytics" size={24} color="#673AB7" />
    </View>
  );

  const renderKeyMetrics = () => (
    <View style={styles.metricsContainer}>
      <LinearGradient
        colors={['#673AB7', '#9C27B0']}
        style={styles.primaryMetricCard}
      >
        <Text style={styles.primaryMetricLabel}>Monthly Savings</Text>
        <Text style={styles.primaryMetricValue}>
          ₹{((analyticsData.monthlyIncome - analyticsData.monthlyExpenses) / 1000).toFixed(0)}K
        </Text>
        <Text style={styles.primaryMetricSubtext}>
          {analyticsData.savingsRate}% of income
        </Text>
      </LinearGradient>

      <View style={styles.secondaryMetrics}>
        <View style={styles.secondaryMetricCard}>
          <Text style={styles.secondaryMetricValue}>{analyticsData.netWorthGrowth}%</Text>
          <Text style={styles.secondaryMetricLabel}>Net Worth Growth</Text>
        </View>
        <View style={styles.secondaryMetricCard}>
          <Text style={styles.secondaryMetricValue}>
            ₹{(analyticsData.monthlyExpenses / 1000).toFixed(0)}K
          </Text>
          <Text style={styles.secondaryMetricLabel}>Monthly Expenses</Text>
        </View>
      </View>
    </View>
  );

  const renderExpenseBreakdown = () => (
    <View style={styles.expenseContainer}>
      <Text style={styles.sectionTitle}>Expense Analysis</Text>
      
      {analyticsData.expenseCategories.map((item, index) => (
        <View key={index} style={styles.expenseItem}>
          <View style={styles.expenseInfo}>
            <Text style={styles.expenseCategory}>{item.category}</Text>
            <Text style={styles.expenseAmount}>₹{(item.amount / 1000).toFixed(0)}K</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${item.percentage}%`,
                    backgroundColor: getProgressColor(item.percentage)
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{item.percentage}%</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const getProgressColor = (percentage: number) => {
    if (percentage > 30) return '#E74C3C';
    if (percentage > 15) return '#FF9800';
    return '#27AE60';
  };

  const renderInsights = () => (
    <View style={styles.insightsContainer}>
      <Text style={styles.sectionTitle}>Insights & Recommendations</Text>
      
      <View style={styles.insightCard}>
        <MaterialIcons name="trending-up" size={20} color="#27AE60" />
        <View style={styles.insightText}>
          <Text style={styles.insightTitle}>Great Savings Rate!</Text>
          <Text style={styles.insightDescription}>
            Your 24.5% savings rate is above average. Keep it up!
          </Text>
        </View>
      </View>

      <View style={styles.insightCard}>
        <MaterialIcons name="warning" size={20} color="#FF9800" />
        <View style={styles.insightText}>
          <Text style={styles.insightTitle}>Housing Costs High</Text>
          <Text style={styles.insightDescription}>
            35% on housing is high. Consider refinancing or downsizing.
          </Text>
        </View>
      </View>

      <View style={styles.insightCard}>
        <MaterialIcons name="lightbulb" size={20} color="#2196F3" />
        <View style={styles.insightText}>
          <Text style={styles.insightTitle}>Investment Opportunity</Text>
          <Text style={styles.insightDescription}>
            Consider investing surplus cash in diversified mutual funds.
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenLayout>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        {renderHeader()}
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {renderKeyMetrics()}
          {renderExpenseBreakdown()}
          {renderInsights()}
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
  metricsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  primaryMetricCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  primaryMetricLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  primaryMetricValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  primaryMetricSubtext: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  secondaryMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryMetricCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  secondaryMetricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#673AB7',
    marginBottom: 8,
  },
  secondaryMetricLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  expenseContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  expenseItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
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
  expenseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  expenseCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#673AB7',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    minWidth: 30,
  },
  insightsContainer: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
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
  insightText: {
    marginLeft: 12,
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
});

export default AnalyticsScreen;