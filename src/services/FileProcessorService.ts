// src/services/FileProcessorService.ts - FIXED VERSION with new FileSystem API
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Xlsx from 'xlsx';
import { ParsingConfig } from '../types/finance';

export class FileProcessorService {
  async getFileInfo(fileUri: string): Promise<{ size: number; type: string; name: string }> {
    try {
      // Use new FileSystem API
      const info = await FileSystem.getInfoAsync(fileUri);
      const name = fileUri.split('/').pop() || '';
      return { size: info.size || 0, type: info.mimeType || '', name };
    } catch (error) {
      console.warn('FileSystem getInfoAsync failed, using fallback:', error);
      // Fallback for content:// URIs
      const name = fileUri.split('/').pop() || 'unknown';
      return { size: 0, type: 'application/pdf', name };
    }
  }

  async readPDF(fileUri: string): Promise<string> {
    try {
      // For content:// URIs, we need to copy to cache first
      if (fileUri.startsWith('content://')) {
        const fileName = `temp_${Date.now()}.pdf`;
        const localUri = FileSystem.documentDirectory + fileName;
        await FileSystem.copyAsync({ from: fileUri, to: localUri });
        const b64 = await FileSystem.readAsStringAsync(localUri, { 
          encoding: FileSystem.EncodingType.Base64 
        });
        // Clean up temp file
        await FileSystem.deleteAsync(localUri, { idempotent: true });
        return b64;
      } else {
        const b64 = await FileSystem.readAsStringAsync(fileUri, { 
          encoding: FileSystem.EncodingType.Base64 
        });
        return b64;
      }
    } catch (error) {
      throw new Error(`Failed to read PDF: ${error}`);
    }
  }

  async readExcel(fileUri: string): Promise<string[]> {
    try {
      let workingUri = fileUri;
      
      // For content:// URIs, copy to cache first
      if (fileUri.startsWith('content://')) {
        const fileName = `temp_${Date.now()}.xlsx`;
        workingUri = FileSystem.documentDirectory + fileName;
        await FileSystem.copyAsync({ from: fileUri, to: workingUri });
      }

      const buffer = await FileSystem.readAsStringAsync(workingUri, { 
        encoding: FileSystem.EncodingType.Base64 
      });
      const workbook = Xlsx.read(buffer, { type: 'base64' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = Xlsx.utils.sheet_to_json(sheet, { header: 1, raw: false });
      
      // Clean up temp file if we created one
      if (fileUri.startsWith('content://')) {
        await FileSystem.deleteAsync(workingUri, { idempotent: true });
      }
      
      return rows.map(row => Array.isArray(row) ? row.join(' ') : String(row));
    } catch (error) {
      throw new Error(`Failed to read Excel: ${error}`);
    }
  }

  async readCSV(fileUri: string): Promise<string[]> {
    try {
      let workingUri = fileUri;
      
      // For content:// URIs, copy to cache first
      if (fileUri.startsWith('content://')) {
        const fileName = `temp_${Date.now()}.csv`;
        workingUri = FileSystem.documentDirectory + fileName;
        await FileSystem.copyAsync({ from: fileUri, to: workingUri });
      }

      const content = await FileSystem.readAsStringAsync(workingUri, { 
        encoding: FileSystem.EncodingType.UTF8 
      });
      
      // Clean up temp file if we created one
      if (fileUri.startsWith('content://')) {
        await FileSystem.deleteAsync(workingUri, { idempotent: true });
      }
      
      return content.split('\n');
    } catch (error) {
      throw new Error(`Failed to read CSV: ${error}`);
    }
  }

  async pickDocumentAsync(): Promise<{ type: string; uri: string; name?: string; size?: number }> {
    const result = await DocumentPicker.getDocumentAsync({ 
      type: '*/*', 
      copyToCacheDirectory: false 
    });

    // Handle new API format
    if (result.canceled) {
      return { type: 'cancel', uri: '' };
    }

    // New format has assets array
    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      return {
        type: 'success',
        uri: asset.uri,
        name: asset.name,
        size: asset.size
      };
    }

    // Fallback for old format (if still used)
    if ((result as any).type === 'success') {
      return result as any;
    }

    return { type: 'cancel', uri: '' };
  }
}