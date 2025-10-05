// src/services/FileProcessorService.ts
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { ParsingConfig } from '../types/finance';

export class FileProcessorService {
  async getFileInfo(fileUri: string): Promise<{ size: number; type: string; name: string }> {
    const info = await FileSystem.getInfoAsync(fileUri);
    const name = fileUri.split('/').pop() || '';
    return { size: info.size || 0, type: info.mimeType || '', name };
  }

  async readPDF(fileUri: string): Promise<string> {
    // Read PDF as base64 and return raw content for parsing
    const b64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
    return b64;
  }

  async readExcel(fileUri: string): Promise<any[]> {
    // Read excel file binary and parse later in parser
    const b64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
    return [{ data: b64 }];
  }

  async readCSV(fileUri: string): Promise<string[]> {
    const content = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
    return content.split('\n');
  }

  async pickDocumentAsync(): Promise<DocumentPicker.DocumentResult> {
    return await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: false });
  }
}
