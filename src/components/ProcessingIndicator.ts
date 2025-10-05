// src/components/ProcessingIndicator.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProcessingProgress } from '../types/finance';

interface ProcessingIndicatorProps {
  progress: ProcessingProgress;
}

const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ progress }) => {
  const { stage, progress: percent, currentStep, totalSteps, currentStepIndex } = progress;

  return (
    <View style={styles.container}>
      <Text style={styles.stageText}>{stage.toUpperCase()}</Text>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${percent}%`}]} />
      </View>
      <Text style={styles.detailText}>{`${currentStepIndex}/${totalSteps}: ${currentStep}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    alignItems: 'center',
  },
  stageText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#357ABD',
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
});

export default ProcessingIndicator;
