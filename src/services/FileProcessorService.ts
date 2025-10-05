// src/services/FileProcessorService.ts - FIXED VERSION
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Xlsx from 'xlsx';
import { ParsingConfig } from '../types/finance';

export class FileProcessorService {
  async getFileInfo(fileUri: string): Promise<{ size: number; type: string; name: string }> {
    const info = await FileSystem.getInfoAsync(fileUri);
    const name = fileUri.split('/').pop() || '';
    return { size: info.size || 0, type: info.mimeType || '', name };
  }

  async readPDF(fileUri: string): Promise<string> {
    const b64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
    return b64;
  }

  async readExcel(fileUri: string): Promise<string[]> {
    const uri = FileSystem.documentDirectory + fileUri.split('/').pop();
    await FileSystem.copyAsync({ from: fileUri, to: uri });
    const buffer = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    const workbook = new Xlsx.Workbook();
    const buf = Buffer.from(buffer, 'base64');
    await workbook.xlsx.load(buf);
    const sheet = workbook.worksheets[0];
    const rows: string[] = [];
    sheet.eachRow((row) => {
      rows.push(row.values.slice(1).join(' '));
    });
    return rows;
  }

  async readCSV(fileUri: string): Promise<string[]> {
    const content = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
    return content.split('\n');
  }

  // FIXED: Handle new DocumentPicker API format
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