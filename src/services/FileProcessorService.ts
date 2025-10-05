// src/services/FileProcessorService.ts - CORRECTED VERSION
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import { Buffer } from 'buffer';
import { ParsingConfig } from '../types/finance';

export class FileProcessorService {
  async getFileInfo(fileUri: string): Promise<{ size: number; type: string; name: string }> {
    try {
      const info = await FileSystem.getInfoAsync(fileUri);
      const name = fileUri.split('/').pop() || '';
      return { size: info.size || 0, type: info.mimeType || '', name };
    } catch (error) {
      throw new Error(`Failed to get file info: ${error}`);
    }
  }

  async readPDF(fileUri: string): Promise<string> {
    try {
      const b64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
      return b64;
    } catch (error) {
      throw new Error(`Failed to read PDF: ${error}`);
    }
  }

  async readExcel(fileUri: string): Promise<string[]> {
    try {
      const b64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
      const buffer = Buffer.from(b64, 'base64');
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
      
      return jsonData.map((row: any[]) => row.join('\t')); // Tab-separated for parsing
    } catch (error) {
      throw new Error(`Failed to read Excel: ${error}`);
    }
  }

  async readCSV(fileUri: string): Promise<string[]> {
    try {
      const content = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
      return content.split('\n');
    } catch (error) {
      throw new Error(`Failed to read CSV: ${error}`);
    }
  }

  async pickDocumentAsync(): Promise<DocumentPicker.DocumentResult> {
    try {
      return await DocumentPicker.getDocumentAsync({ 
        type: ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
        copyToCacheDirectory: true 
      });
    } catch (error) {
      throw new Error(`Failed to pick document: ${error}`);
    }
  }
}