// src/components/PasswordInputModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface PasswordInputModalProps {
  visible: boolean;
  onSubmit: (password: string) => void;
  onCancel: () => void;
  fileName?: string;
  attempt?: number;
}

const PasswordInputModal: React.FC<PasswordInputModalProps> = ({ 
  visible, 
  onSubmit, 
  onCancel, 
  fileName, 
  attempt = 1 
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }
    onSubmit(password);
    setPassword(''); // Clear for next attempt
  };

  const handleCancel = () => {
    setPassword('');
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <MaterialIcons name="lock" size={24} color="#E74C3C" />
            <Text style={styles.title}>Password Protected PDF</Text>
          </View>
          
          {attempt > 1 && (
            <Text style={styles.errorText}>
              Incorrect password. Please try again. (Attempt {attempt})
            </Text>
          )}
          
          <Text style={styles.message}>
            This PDF requires a password to access its content.
          </Text>
          
          {fileName && (
            <Text style={styles.fileName}>File: {fileName}</Text>
          )}
          
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter PDF password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons 
                name={showPassword ? "visibility-off" : "visibility"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Unlock PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '85%', backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '600', marginLeft: 8, color: '#1A1A1A' },
  errorText: { fontSize: 14, color: '#E74C3C', marginBottom: 12, textAlign: 'center' },
  message: { fontSize: 14, color: '#666666', marginBottom: 12, lineHeight: 20 },
  fileName: { fontSize: 12, color: '#999999', marginBottom: 16, fontStyle: 'italic' },
  passwordContainer: { 
    flexDirection: 'row', 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: 8, 
    marginBottom: 20,
    alignItems: 'center'
  },
  passwordInput: { 
    flex: 1, 
    paddingHorizontal: 12, 
    paddingVertical: 12, 
    fontSize: 16 
  },
  eyeButton: { padding: 12 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { 
    flex: 1, 
    paddingVertical: 12, 
    marginRight: 8, 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  submitButton: { 
    flex: 1, 
    paddingVertical: 12, 
    marginLeft: 8, 
    backgroundColor: '#4A90E2', 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  cancelText: { fontSize: 16, color: '#666666' },
  submitText: { fontSize: 16, color: '#FFFFFF', fontWeight: '500' },
});

export default PasswordInputModal;