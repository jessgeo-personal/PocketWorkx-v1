// Quick fix for src/app/dashboard.tsx - ensure props are passed correctly
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
import { NetWorthSummary, Money, Transaction as FinanceTransaction } from '../types/finance';
import { formatCompactCurrency } from '../utils/currency';
import ScreenLayout from '../components/ScreenLayout';
import DocumentUploadModal from '../components/DocumentUploadModal';
import { DocumentParsingResult } from '../types/finance';
import { Image } from 'react-native';
import logo from '../assets/logo.png';


const DashboardScreen: React.FC = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [parsedResult, setParsedResult] = useState<DocumentParsingResult | null>(null);

  // ENSURE this function exists and is properly typed
  const handleParsed = (result: DocumentParsingResult) => {
    console.log('📄 Received parsed result:', result);
    setParsedResult(result);
    setModalVisible(false);
    // Show success message or navigate to results
  };

  const netWorthData: NetWorthSummary = {
    totalAssets: { amount: 17832550, currency: 'INR' },
    totalLiabilities: { amount: 7500550, currency: 'INR' },
    netWorth: { amount: 10332000, currency: 'INR' },
    liquidCash: { amount: 2345300, currency: 'INR' },
    accountsBalance: { amount: 8650000, currency: 'INR' },
    cryptoValue: { amount: 6016000, currency: 'INR' },
    investmentsValue: { amount: 920250, currency: 'INR' },
    realEstateValue: { amount: 0, currency: 'INR' },
    receivablesValue: { amount: 0, currency: 'INR' },
    totalDebt: { amount: 4225000, currency: 'INR' },
    shortTermDebt: { amount: 125000, currency: 'INR' },
    longTermDebt: { amount: 4100000, currency: 'INR' },
    asOfDate: new Date(),
  };

  const renderWelcomeHeader = () => (
    <View style={styles.headerContainer}>
      <Image
        source={logo}
        style={styles.logo}
        resizeMode="contain"
      />
      <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="upload-file" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const renderNetWorthCard = () => (
    <LinearGradient colors={['#4A90E2', '#357ABD']} style={styles.netWorthCard}>
      <Text style={styles.netWorthLabel}>Your total net worth</Text>
      <Text style={styles.netWorthAmount}>
        {formatCompactCurrency(netWorthData.netWorth.amount, netWorthData.netWorth.currency)}
      </Text>
    </LinearGradient>
  );

  return (
    <ScreenLayout>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ScrollView>
          {renderWelcomeHeader()}
          {renderNetWorthCard()}
        </ScrollView>
      </SafeAreaView>
      <DocumentUploadModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onParsed={handleParsed}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  welcomeText: { fontSize: 20, fontWeight: '600' },
  logo: {
    width: 120,          // adjust to fit your header height
    height: 40,          // keeps aspect ratio
    marginBottom: 8,     // space below logo
    backgroundColor: 'red'   // temporary debug color
  },
  menuButton: { padding: 8 },
  netWorthCard: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
  },
  netWorthLabel: { fontSize: 14, color: '#FFFFFF', marginBottom: 8 },
  netWorthAmount: { fontSize: 32, color: '#FFFFFF', fontWeight: '700' },
});

export default DashboardScreen;