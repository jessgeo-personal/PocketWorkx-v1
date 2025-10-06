// src/components/DocumentUploadModal.tsx

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
import { colors } from '../utils/theme';

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
  const [currentFileUri, setCurrentFileUri] = useState('');
  const [currentFileName, setCurrentFileName] = useState('');

  const fileProcessor = new FileProcessorService();
  const parserService = new StatementParserService();

  const handleDocumentPick = async () => {
    setParsing(true);
    setProgress({ ...progress, stage: 'uploading', progress: 10, currentStep: 'Opening file picker', currentStepIndex: 1 });

    try {
      const res = await fileProcessor.pickDocumentAsync();
      if (res.type !== 'success') {
        throw new Error('Document selection cancelled');
      }
      setCurrentFileUri(res.uri);
      setCurrentFileName(res.name || 'Unknown');
      await processDocument(res.uri, res.name);
    } catch (e: any) {
      setProgress({ ...progress, stage: 'error', progress: 100, currentStep: e.message, currentStepIndex: 5 });
      setParsing(false);
    }
  };

  const processDocument = async (fileUri: string, fileName?: string, password?: string) => {
    try {
      setProgress({ ...progress, stage: 'uploading', progress: 30, currentStep: 'Reading file', currentStepIndex: 2 });

      const options: DocumentParsingOptions = { format: 'pdf', ocrEnabled: true };

      setProgress({ ...progress, stage: 'parsing', progress: 50, currentStep: 'Checking for password protection', currentStepIndex: 3 });

      const result = await parserService.parseDocumentWithPassword(fileUri, options, password);

      if (!result.success && result.errors.some(e => e.message.includes('Password required'))) {
        setShowPasswordModal(true);
        return;
      }

      if (!result.success && result.errors.some(e => e.message.includes('Incorrect password'))) {
        setPasswordAttempt(prev => prev + 1);
        setShowPasswordModal(true);
        return;
      }

      setProgress({ ...progress, stage: 'parsing', progress: 80, currentStep: 'Extracting transactions', currentStepIndex: 4 });
      setProgress({ ...progress, stage: 'complete', progress: 100, currentStep: 'Done', currentStepIndex: 5 });

      onParsed(result);
      setParsing(false);
    } catch (e: any) {
      setProgress({ ...progress, stage: 'error', progress: 100, currentStep: e.message, currentStepIndex: 5 });
      setParsing(false);
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    setShowPasswordModal(false);
    setProgress({ ...progress, stage: 'parsing', progress: 60, currentStep: 'Unlocking PDF with password', currentStepIndex: 3 });
    await processDocument(currentFileUri, currentFileName, password);
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setPasswordAttempt(1);
    setParsing(false);
    setProgress({ ...progress, stage: 'uploading', progress: 0, currentStep: 'Cancelled', currentStepIndex: 0 });
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
      <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.textPrimary,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  uploadText: {
    color: colors.background,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
  },
  closeText: {
    color: colors.secondary,
    fontSize: 16,
  },
});

export default DocumentUploadModal;
