// src/app/account/[id]/edit.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenLayout from '../../../components/ScreenLayout';
import {
  fetchAccountById,
  updateAccount,
  Account,
} from '../../../services/accountService';
import { colors } from '../../../utils/theme';

const EditAccountScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id as string;

  const [account, setAccount] = useState<Account | null>(null);
  const [nickname, setNickname] = useState('');
  const [masked, setMasked] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAccountById(id).then(a => {
      setAccount(a);
      setNickname(a.nickname);
      setMasked(a.accountNumberMasked);
    });
  }, [id]);

  const handleSave = async () => {
    if (!account) return;
    if (!nickname.trim()) {
      Alert.alert('Error', 'Nickname is required.');
      return;
    }
    setSubmitting(true);
    try {
      await updateAccount(id, {
        nickname: nickname.trim(),
        accountNumberMasked: masked.trim() || account.accountNumberMasked,
      });
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to update account.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!account) return null;

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Edit Account</Text>

        <Text style={styles.label}>Nickname</Text>
        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
        />

        <Text style={styles.label}>Masked Number</Text>
        <TextInput
          style={styles.input}
          value={masked}
          onChangeText={setMasked}
        />

        <TouchableOpacity
          style={[styles.button, submitting && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F9FA' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 20, color: '#1A1A1A' },
  label: { fontSize: 14, color: '#333333', marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    marginTop: 4,
  },
  button: {
    marginTop: 32,
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default EditAccountScreen;
