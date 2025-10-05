// src/components/ParsedTransactionsView.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DocumentParsingResult, ParsedTransaction } from '../types/finance';

interface ParsedTransactionsViewProps {
  visible: boolean;
  result: DocumentParsingResult | null;
  onClose: () => void;
}

const ParsedTransactionsView: React.FC<ParsedTransactionsViewProps> = ({ visible, result, onClose }) => {
  if (!result) return null;

  const renderTransaction = (transaction: ParsedTransaction, index: number) => (
    <View key={index} style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionDate}>{transaction.rawDate}</Text>
        <Text style={styles.transactionAmount}>
          {transaction.debitAmount ? `-₹${transaction.debitAmount.toLocaleString()}` : 
           transaction.creditAmount ? `+₹${transaction.creditAmount.toLocaleString()}` : '₹0'}
        </Text>
      </View>
      <Text style={styles.transactionDescription}>{transaction.description}</Text>
      <Text style={styles.transactionBalance}>Balance: ₹{transaction.balance.toLocaleString()}</Text>
    </View>
  );

  const renderErrors = () => (
    result.errors.length > 0 && (
      <View style={styles.errorsSection}>
        <Text style={styles.sectionTitle}>Parsing Errors ({result.errors.length})</Text>
        {result.errors.map((error, index) => (
          <View key={index} style={styles.errorCard}>
            <Text style={styles.errorMessage}>{error.message}</Text>
            {error.line && <Text style={styles.errorLine}>Line: {error.line}</Text>}
          </View>
        ))}
      </View>
    )
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Parsed Transactions</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Parsing Summary</Text>
            <Text style={styles.summaryText}>File: {result.metadata.fileName}</Text>
            <Text style={styles.summaryText}>Size: {(result.metadata.fileSize / 1024).toFixed(1)} KB</Text>
            <Text style={styles.summaryText}>Transactions: {result.metadata.totalTransactions}</Text>
            <Text style={styles.summaryText}>Bank: {result.metadata.bankDetected || 'Unknown'}</Text>
            <Text style={[styles.summaryText, { color: result.success ? '#27AE60' : '#E74C3C' }]}>
              Status: {result.success ? 'Success' : 'Failed'}
            </Text>
          </View>

          {result.transactions.length > 0 && (
            <View style={styles.transactionsSection}>
              <Text style={styles.sectionTitle}>Transactions ({result.transactions.length})</Text>
              {result.transactions.map(renderTransaction)}
            </View>
          )}

          {renderErrors()}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#1A1A1A' },
  content: { flex: 1, padding: 16 },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  summaryTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#1A1A1A' },
  summaryText: { fontSize: 14, color: '#666666', marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#1A1A1A' },
  transactionsSection: { marginBottom: 16 },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  transactionDate: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  transactionAmount: { fontSize: 14, fontWeight: '600', color: '#4A90E2' },
  transactionDescription: { fontSize: 14, color: '#666666', marginBottom: 4 },
  transactionBalance: { fontSize: 12, color: '#999999' },
  errorsSection: { marginBottom: 16 },
  errorCard: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  errorMessage: { fontSize: 14, color: '#C62828' },
  errorLine: { fontSize: 12, color: '#E57373', marginTop: 4 },
});

export default ParsedTransactionsView;