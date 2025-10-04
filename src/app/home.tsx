// src/app/home.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenLayout from '../components/ScreenLayout';

const HomeScreen: React.FC = () => {
  return (
    <ScreenLayout>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Welcome Header */}
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.welcomeText}>Welcome Home</Text>
              <Text style={styles.emailText}>Your financial overview</Text>
            </View>
          </View>

          {/* Quick Overview Card */}
          <LinearGradient
            colors={['#6C5CE7', '#A29BFE']}
            style={styles.overviewCard}
          >
            <Text style={styles.overviewLabel}>Financial Health Score</Text>
            <Text style={styles.overviewScore}>8.5/10</Text>
            <Text style={styles.overviewSubtext}>Excellent standing</Text>
          </LinearGradient>

          {/* Quick Access Grid */}
          <View style={styles.quickAccessContainer}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <View style={styles.quickAccessGrid}>
              <View style={styles.quickCard}>
                <Text style={styles.quickCardTitle}>Net Worth</Text>
                <Text style={styles.quickCardValue}>₹1.03 Cr</Text>
              </View>
              <View style={styles.quickCard}>
                <Text style={styles.quickCardTitle}>Monthly Income</Text>
                <Text style={styles.quickCardValue}>₹2.45 L</Text>
              </View>
              <View style={styles.quickCard}>
                <Text style={styles.quickCardTitle}>Monthly Expenses</Text>
                <Text style={styles.quickCardValue}>₹1.85 L</Text>
              </View>
              <View style={styles.quickCard}>
                <Text style={styles.quickCardTitle}>Savings Rate</Text>
                <Text style={styles.quickCardValue}>24.5%</Text>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.activityContainer}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>Added new investment - SBI Mutual Fund</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>Loan EMI payment processed - HDFC Home Loan</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>Credit card bill payment - ₹45,000</Text>
              <Text style={styles.activityTime}>3 days ago</Text>
            </View>
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
  overviewCard: {
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
  overviewLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  overviewScore: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  overviewSubtext: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  quickAccessContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickCard: {
    width: '48%',
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
  quickCardTitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  quickCardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  activityContainer: {
    paddingHorizontal: 20,
    marginBottom: 100, // Extra space for floating button
  },
  activityItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activityText: {
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#999999',
  },
});

export default HomeScreen;