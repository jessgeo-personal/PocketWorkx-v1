// src/services/OCRService.ts
import TextRecognition from 'react-native-text-recognition';
import { OCRResult } from '../types/finance';

export async function performOCR(imageUri: string): Promise<OCRResult> {
  try {
    const resultLines: string[] = await TextRecognition.recognize(imageUri);
    const text = resultLines.join(' ');
    // Simple average confidence not supported by this library, set default
    return { text, confidence: 0.8 };
  } catch (error: any) {
    throw new Error(`OCR failed: ${error.message}`);
  }
}
