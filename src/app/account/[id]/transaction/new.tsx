// src/app/account/[id]/transaction/new.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import ScreenLayout from '../../../../components/ScreenLayout';
import { addTransaction } from '../../../../services/accountService';
import { colors } from '../../../../utils/theme';

const NewTransactionScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const accountId = params.id as string;

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'debit' | 'credit'>('debit');
  const [submitting, setSubmitting] = useState(false);

  const onChangeDate = (_: any, selected?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selected) setDate(selected);
  };

  const handleSubmit = async () => {
    if (!description.trim() || !amount.trim()) {
      Alert.alert('Error', 'Description and amount are required.');
      return;
    }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert('Error', 'Enter a valid positive amount.');
      return;
    }

    setSubmitting(true);
    try {
      await addTransaction(accountId, {
        date: date.toISOString(),
        description: description.trim(),
        amount: amt,
        currency: 'INR',
        type,
      });
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to add transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text style={styles.title}>New Transaction</Text>

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Text style={styles.input}>
            {date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="e.g., Grocery"
        />

        <Text style={styles.label}>Amount (₹)</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="0"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Type</Text>
        <View style={styles.typeRow}>
          {(['debit','credit'] as const).map(t => (
            <TouchableOpacity
              key={t}
              style={[
                styles.typeButton,
                type === t && styles.typeSelected
              ]}
              onPress={() => setType(t)}
            >
              <Text
                style={[
                  styles.typeText,
                  type === t && styles.typeTextSelected
                ]}
              >
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.disabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitText}>
            {submitting ? 'Saving...' : 'Add Transaction'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#F8F9FA' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 20, color: '#1A1A1A' },
  label: { fontSize: 14, color: '#333333', marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 12,
    marginTop: 4,
    backgroundColor: '#FFFFFF',
  },
  typeRow: { flexDirection: 'row', marginTop: 8 },
  typeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  typeSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeText: { color: '#333333', fontSize: 14 },
  typeTextSelected: { color: '#FFFFFF', fontWeight: '600' },
  submitButton: {
    marginTop: 24,
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  disabled: { opacity: 0.6 },
});

export default NewTransactionScreen;
