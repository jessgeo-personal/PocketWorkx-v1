// src/components/DocumentUploadModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { FileProcessorService } from '../services/FileProcessorService';
const fileService = new FileProcessorService();
import { DocumentParsingOptions, ProcessingProgress, DocumentParsingResult } from '../types/finance';
import ProcessingIndicator from './ProcessingIndicator';

interface DocumentUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onParsed: (result: DocumentParsingResult) => void;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ visible, onClose, onParsed }) => {
  const [progress, setProgress] = useState<ProcessingProgress>({
    stage: 'uploading',
    progress: 0,
    currentStep: '',
    totalSteps: 1,
    currentStepIndex: 0,
  });
  const [parsing, setParsing] = useState(false);

  const handleDocumentPick = async () => {
    setParsing(true);
    try {
      setProgress({ stage: 'uploading', progress: 50, currentStep: 'Selecting file', totalSteps: 4, currentStepIndex: 1 });
      const fileService = new (await import('../services/FileProcessorService')).FileProcessorService();
      const res = await fileService.pickDocumentAsync();
      if (res.type !== 'success') throw new Error('Document selection cancelled');
      setProgress({ stage: 'parsing', progress: 75, currentStep: 'Parsing document', totalSteps: 4, currentStepIndex: 2 });
      // call parser service (to implement later)
      const options: DocumentParsingOptions = { format: 'pdf', ocrEnabled: true };
      const parser = new (await import('../services/StatementParserService')).StatementParserService();
      const result = await parser.parseDocument(res.uri, options);
      setProgress({ stage: 'complete', progress: 100, currentStep: 'Done', totalSteps: 4, currentStepIndex: 4 });
      onParsed(result);
    } catch (e: any) {
      setProgress({ stage: 'error', progress: 100, currentStep: e.message, totalSteps: 4, currentStepIndex: 4 });
    } finally {
      setParsing(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
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

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '80%', backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  uploadButton: { backgroundColor: '#357ABD', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  uploadText: { color: '#FFFFFF', fontSize: 16 },
  progressContainer: { alignItems: 'center' },
  progressText: { marginTop: 12, fontSize: 14, color: '#333333' },
  closeButton: { marginTop: 20 },
  closeText: { color: '#357ABD', fontSize: 16 }
});

export default DocumentUploadModal;
