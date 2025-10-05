// src/services/StatementParserService.ts
import { DocumentParsingOptions, DocumentParsingResult, ParsedTransaction, ParseError, BankStatementFormat, OCRResult } from '../types/finance';
import { FileProcessorService } from './FileProcessorService';
import { detectBankFormat } from './BankFormatDetector';
import { performOCR } from './OCRService';

export class StatementParserService {
  processor = new FileProcessorService();

  async parseDocument(fileUri: string, options: DocumentParsingOptions): Promise<DocumentParsingResult> {
    const result: DocumentParsingResult = {
      success: false,
      transactions: [],
      metadata: {
        fileName: fileUri.split('/').pop() || '',
        fileSize: 0,
        totalTransactions: 0,
      },
      errors: [],
      warnings: []
    };

    try {
      // Get file info
      const info = await this.processor.getFileInfo(fileUri);
      result.metadata.fileSize = info.size;

      // Read content based on format
      let rawContent: any;
      if (options.format === 'pdf') {
        rawContent = await this.processor.readPDF(fileUri);
      } else if (options.format === 'excel') {
        rawContent = await this.processor.readExcel(fileUri);
      } else {
        rawContent = await this.processor.readCSV(fileUri);
      }

      // OCR for scanned docs
      if (options.ocrEnabled && options.format === 'pdf') {
        const ocr: OCRResult = await performOCR(fileUri);
        // Combine rawContent and OCR if needed
      }

      // Detect bank format
      const format: BankStatementFormat | null = detectBankFormat(rawContent.toString());
      if (!format) {
        result.errors.push({ message: 'Bank format not recognized', severity: 'high' });
        return result;
      }

      const rawLines = Array.isArray(rawContent) ? rawContent : rawContent.split('\n');
      const { transactions, errors: parseErrors } = extractTransactions(rawLines, format);
      result.transactions = transactions;
      result.errors.push(...parseErrors);
      result.metadata.totalTransactions = transactions.length;

      // Parse transactions
      // (Implement parse logic later)
      result.success = true;
      result.metadata.bankDetected = format.bankName;
    } catch (e: any) {
      result.errors.push({ message: e.message, severity: 'high' });
    }

    return result;
  }
}
