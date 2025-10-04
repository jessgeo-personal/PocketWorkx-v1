// src/types/finance.ts
export interface Currency {
  code: 'INR' | 'USD' | 'EUR' | 'AED' | 'GBP';
  symbol: string;
  name: string;
}

export interface Money {
  amount: number;
  currency: Currency['code'];
}

export interface Account {
  id: string;
  name: string;
  type: 'savings' | 'checking' | 'salary' | 'current';
  bank: string;
  accountNumber: string; // Last 4 digits for display
  balance: Money;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CashEntry {
  id: string;
  description: string;
  amount: Money;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CryptoAsset {
  id: string;
  symbol: string; // BTC, ETH, SOL
  name: string; // Bitcoin, Ethereum, Solana
  quantity: number;
  averagePurchasePrice: Money;
  currentPrice: Money;
  currentValue: Money;
  exchange?: string;
  walletAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Loan {
  id: string;
  type: 'home' | 'personal' | 'car' | 'education' | 'other';
  bank: string;
  accountNumber: string;
  principalAmount: Money;
  currentBalance: Money;
  interestRate: number;
  tenure: number; // months
  emi: Money;
  nextPaymentDate: Date;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditCard {
  id: string;
  bank: string;
  cardNumber: string; // Last 4 digits for display
  cardType: 'visa' | 'mastercard' | 'amex' | 'rupay';
  creditLimit: Money;
  currentBalance: Money;
  availableCredit: Money;
  minimumPayment: Money;
  paymentDueDate: Date;
  statementDate: Date;
  interestRate: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Investment {
  id: string;
  type: 'stocks' | 'mutual_funds' | 'fixed_deposit' | 'real_estate' | 'gold' | 'bonds' | 'other';
  name: string;
  description?: string;
  quantity: number;
  unitPrice: Money;
  currentValue: Money;
  maturityDate?: Date;
  interestRate?: number;
  location?: string; // For real estate
  weight?: number; // For gold in grams
  broker?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  description: string;
  amount: Money;
  fromAccount?: string; // Account ID
  toAccount?: string; // Account ID
  date: Date;
  location?: string;
  tags?: string[];
  attachments?: string[]; // File URLs
  source: 'manual' | 'sms' | 'email' | 'receipt' | 'statement';
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface NetWorthSummary {
  totalAssets: Money;
  totalLiabilities: Money;
  netWorth: Money;
  liquidCash: Money;
  accountsBalance: Money;
  cryptoValue: Money;
  investmentsValue: Money;
  totalDebt: Money;
  shortTermDebt: Money;
  longTermDebt: Money;
  asOfDate: Date;
}

export interface CashflowData {
  period: 'week' | 'month' | 'quarter' | 'year';
  income: Money[];
  expenses: Money[];
  netFlow: Money[];
  labels: string[];
}

export interface FinancialGoal {
  id: string;
  title: string;
  description: string;
  targetAmount: Money;
  currentAmount: Money;
  targetDate: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
  isAchieved: boolean;
  createdAt: Date;
  updatedAt: Date;
}