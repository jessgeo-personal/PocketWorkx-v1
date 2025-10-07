// src/services/exportService.ts

import { getAllAccounts, exportData } from './accountService';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Papa from 'papaparse';

interface ExportResult {
  fileUri: string;
  success: boolean;
}

/**
 * Converts JSON data to CSV string.
 */
const jsonToCsv = (data: any[]): string => {
  return Papa.unparse(data, {
    quotes: false,
    delimiter: ',',
    header: true,
  });
};

/**
 * Writes CSV text to a temporary file and shares it.
 */
const writeAndShareCsv = async (
  fileName: string,
  csvText: string
): Promise<ExportResult> => {
  try {
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, csvText, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Prompt user to share or save
    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv',
      dialogTitle: 'Export PocketWorkx Data',
    });

    return { fileUri, success: true };
  } catch (error) {
    console.error('CSV export error:', error);
    return { fileUri: '', success: false };
  }
};

/**
 * Export all accounts as CSV.
 */
export const exportAccountsCsv = async (): Promise<ExportResult> => {
  // Fetch data
  const accounts = await getAllAccounts();
  // Convert to CSV
  const csvText = jsonToCsv(accounts);
  // Write & share
  return writeAndShareCsv('pocketworkx_accounts.csv', csvText);
};

/**
 * Export all transactions as CSV.
 */
export const exportTransactionsCsv = async (): Promise<ExportResult> => {
  const { transactions } = await exportData();
  const csvText = jsonToCsv(transactions);
  return writeAndShareCsv('pocketworkx_transactions.csv', csvText);
};
