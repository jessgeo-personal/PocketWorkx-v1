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
    totalSteps: 4,
    currentStepIndex: 0,
  });
  const [parsing, setParsing] = useState(false);

  const fileProcessor = new FileProcessorService();
  const parserService = new StatementParserService();

  const handleDocumentPick = async () => {
    setParsing(true);
    setProgress({ stage: 'uploading', progress: 10, currentStep: 'Opening file picker', totalSteps: 4, currentStepIndex: 1 });
    try {
      const res = await new FileProcessorService().pickDocumentAsync();
      if (res.type !== 'success') {
        throw new Error('Document selection cancelled');
      }

      setProgress({ stage: 'uploading', progress: 30, currentStep: 'Reading file', totalSteps: 4, currentStepIndex: 2 });
      const options: DocumentParsingOptions = { format: 'pdf', ocrEnabled: true };
      
      setProgress({ stage: 'parsing', progress: 60, currentStep: 'Parsing document', totalSteps: 4, currentStepIndex: 3 });
      const result = await parserService.parseDocument(res.uri, options);

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
  closeButton: { marginTop: 20 },
  closeText: { color: '#357ABD', fontSize: 16 },
});

export default DocumentUploadModal;
