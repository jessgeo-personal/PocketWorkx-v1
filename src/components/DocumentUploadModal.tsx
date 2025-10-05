// src/components/DocumentUploadModal.tsx - UPDATED WITH PASSWORD SUPPORT
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import ProcessingIndicator from './ProcessingIndicator';
import PasswordInputModal from './PasswordInputModal';
import { DocumentParsingOptions, ProcessingProgress, DocumentParsingResult } from '../types/finance';
import { StatementParserService } from '../services/StatementParserService';
import { FileProcessorService } from '../services/FileProcessorService';

interface DocumentUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onParsed: (result: DocumentParsingResult) => void;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ visible, onClose, onParsed }) => {
  const [progress, setProgress] = useState<ProcessingProgress>({
    stage: 'uploading',
    progress: 0,
    currentStep: 'Waiting to start',
    totalSteps: 5,
    currentStepIndex: 0,
  });
  const [parsing, setParsing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState(1);
  const [currentFileUri, setCurrentFileUri] = useState<string>('');
  const [currentFileName, setCurrentFileName] = useState<string>('');

  const fileProcessor = new FileProcessorService();
  const parserService = new StatementParserService();

  const handleDocumentPick = async () => {
    setParsing(true);
    setProgress({ stage: 'uploading', progress: 10, currentStep: 'Opening file picker', totalSteps: 5, currentStepIndex: 1 });
    
    try {
      const res = await fileProcessor.pickDocumentAsync();
      if (res.type !== 'success') {
        throw new Error('Document selection cancelled');
      }

      setCurrentFileUri(res.uri);
      setCurrentFileName(res.name || 'Unknown');
      
      await processDocument(res.uri, res.name);
    } catch (e: any) {
      setProgress({ stage: 'error', progress: 100, currentStep: e.message, totalSteps: 5, currentStepIndex: 5 });
      setParsing(false);
    }
  };

  const processDocument = async (fileUri: string, fileName?: string, password?: string) => {
    try {
      setProgress({ stage: 'uploading', progress: 30, currentStep: 'Reading file', totalSteps: 5, currentStepIndex: 2 });
      
      const options: DocumentParsingOptions = { format: 'pdf', ocrEnabled: true };
      
      setProgress({ stage: 'parsing', progress: 50, currentStep: 'Checking for password protection', totalSteps: 5, currentStepIndex: 3 });
      
      const result = await parserService.parseDocumentWithPassword(fileUri, options, password);
      
      // Check if password is required
      if (!result.success && result.errors.some(e => e.message.includes('Password required'))) {
        console.log('🔐 Password required, showing password modal');
        setShowPasswordModal(true);
        return; // Don't finish parsing, wait for password
      }
      
      // Check if password was incorrect
      if (!result.success && result.errors.some(e => e.message.includes('Incorrect password'))) {
        console.log('🔐 Incorrect password, showing modal again');
        setPasswordAttempt(prev => prev + 1);
        setShowPasswordModal(true);
        return; // Don't finish parsing, wait for correct password
      }

      setProgress({ stage: 'parsing', progress: 80, currentStep: 'Extracting transactions', totalSteps: 5, currentStepIndex: 4 });
      setProgress({ stage: 'complete', progress: 100, currentStep: 'Done', totalSteps: 5, currentStepIndex: 5 });
      
      onParsed(result);
      setParsing(false);
    } catch (e: any) {
      console.error('🔐 Document processing error:', e);
      setProgress({ stage: 'error', progress: 100, currentStep: e.message, totalSteps: 5, currentStepIndex: 5 });
      setParsing(false);
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    setShowPasswordModal(false);
    setProgress({ stage: 'parsing', progress: 60, currentStep: 'Unlocking PDF with password', totalSteps: 5, currentStepIndex: 3 });
    
    await processDocument(currentFileUri, currentFileName, password);
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setPasswordAttempt(1);
    setParsing(false);
    setProgress({ stage: 'uploading', progress: 0, currentStep: 'Cancelled', totalSteps: 5, currentStepIndex: 0 });
  };

  const handleClose = () => {
    setShowPasswordModal(false);
    setPasswordAttempt(1);
    setParsing(false);
    setCurrentFileUri('');
    setCurrentFileName('');
    onClose();
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Upload Statement</Text>
            {parsing ? (
              <ProcessingIndicator progress={progress} />
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={handleDocumentPick}>
                <Text style={styles.uploadText}>Select File</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <PasswordInputModal
        visible={showPasswordModal}
        onSubmit={handlePasswordSubmit}
        onCancel={handlePasswordCancel}
        fileName={currentFileName}
        attempt={passwordAttempt}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '80%', backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  uploadButton: { backgroundColor: '#357ABD', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  uploadText: { color: '#FFFFFF', fontSize: 16 },
  closeButton: { marginTop: 20 },
  closeText: { color: '#357ABD', fontSize: 16 },
});

export default DocumentUploadModal;