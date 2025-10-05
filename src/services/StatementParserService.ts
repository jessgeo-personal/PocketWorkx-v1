// Add this method to StatementParserService.ts
import { PDFPasswordHandler, PDFPasswordResult } from './PDFPasswordHandler';

// Add this method to the StatementParserService class:
export class StatementParserService {
  processor = new FileProcessorService();
  passwordHandler = new PDFPasswordHandler();

  // New method with password support
  async parseDocumentWithPassword(
    fileUri: string, 
    options: DocumentParsingOptions, 
    password?: string
  ): Promise<DocumentParsingResult> {
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
      const info = await this.processor.getFileInfo(fileUri);
      result.metadata.fileSize = info.size;

      let rawContent: any;
      
      if (options.format === 'pdf') {
        // Use password handler for PDFs
        const pdfResult: PDFPasswordResult = await this.passwordHandler.readPDFWithPassword(fileUri, password);
        
        if (!pdfResult.success) {
          result.errors.push({ 
            message: pdfResult.error || 'Failed to read PDF', 
            severity: 'high' 
          });
          return result;
        }
        
        rawContent = pdfResult.content;
      } else if (options.format === 'excel') {
        rawContent = await this.processor.readExcel(fileUri);
      } else {
        rawContent = await this.processor.readCSV(fileUri);
      }

      if (options.ocrEnabled && options.format === 'pdf') {
        const ocr: OCRResult = await performOCR(fileUri);
        rawContent = typeof rawContent === 'string'
          ? rawContent + '\n' + ocr.text
          : [...rawContent, { data: ocr.text }];
      }

      const contentStr = Array.isArray(rawContent) 
        ? rawContent.map(r => typeof r === 'string' ? r : r.data).join('\n') 
        : rawContent;
        
      const format: BankStatementFormat | null = detectBankFormat(contentStr);
      if (!format) {
        result.errors.push({ message: 'Bank format not recognized', severity: 'high' });
        return result;
      }

      const rawLines = typeof rawContent === 'string' 
        ? rawContent.split('\n') 
        : rawContent.map((r: any) => r.data || '');
        
      const { transactions, errors: parseErrors } = extractTransactions(rawLines, format);
      result.transactions = transactions;
      result.errors.push(...parseErrors);
      result.metadata.totalTransactions = transactions.length;
      result.success = true;
      result.metadata.bankDetected = format.bankName;
    } catch (e: any) {
      result.errors.push({ message: e.message, severity: 'high' });
    }

    return result;
  }

  // Keep existing parseDocument method for backward compatibility
  async parseDocument(fileUri: string, options: DocumentParsingOptions): Promise<DocumentParsingResult> {
    return this.parseDocumentWithPassword(fileUri, options);
  }
}