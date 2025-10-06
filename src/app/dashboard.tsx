// src/app/dashboard.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NetWorthSummary, DocumentParsingResult } from '../types/finance';
import { formatCompactCurrency } from '../utils/currency';
import ScreenLayout from '../components/ScreenLayout';
import DocumentUploadModal from '../components/DocumentUploadModal';
import logo from '../assets/logo.png';
import { colors } from '../utils/theme';

const DashboardScreen: React.FC = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [parsedResult, setParsedResult] = useState<DocumentParsingResult | null>(null);

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
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="upload-file" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  const renderNetWorthCard = () => (
    <LinearGradient colors={[colors.secondary, colors.primary]} style={styles.netWorthCard}>
      <Text style={styles.netWorthLabel}>Your total net worth</Text>
      <Text style={styles.netWorthAmount}>
        {formatCompactCurrency(netWorthData.netWorth.amount, netWorthData.netWorth.currency)}
      </Text>
    </LinearGradient>
  );

  return (
    <ScreenLayout>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <ScrollView>
          {renderWelcomeHeader()}
          {renderNetWorthCard()}
        </ScrollView>
        <DocumentUploadModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onParsed={handleParsed}
        />
      </SafeAreaView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  logo: { width: 120, height: 40, marginBottom: 0 },
  menuButton: { padding: 8 },
  netWorthCard: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
  },
  netWorthLabel: {
    fontSize: 14,
    color: colors.background,
    marginBottom: 8,
  },
  netWorthAmount: {
    fontSize: 32,
    color: colors.background,
    fontWeight: '700',
  },
});

export default DashboardScreen;
