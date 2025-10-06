// src/services/accountService.ts

// Currency union type used by formatCompactCurrency
export type Currency = 'INR' | 'USD' | 'EUR' | 'AED' | 'GBP';

export interface Transaction {
  id: string;
  date: string;           // ISO string
  description: string;
  amount: number;
  currency: Currency;
  type: 'debit' | 'credit';
}

export interface Account {
  id: string;
  bankName: string;
  nickname: string;
  accountNumberMasked: string;
  type: string;
  balance: { amount: number; currency: Currency };
  lastSynced?: string;
  transactions: Transaction[];
}

// Mock data store
const mockAccounts: Record<string, Account> = {
  'a1': {
    id: 'a1',
    bankName: 'ICICI Bank',
    nickname: 'ICICI Savings',
    accountNumberMasked: '****1235',
    type: 'savings',
    balance: { amount: 10023550, currency: 'INR' },
    lastSynced: new Date().toISOString(),
    transactions: [
      {
        id: 't1',
        date: '2025-10-05T10:30:00Z',
        description: 'Grocery Store',
        amount: 2350,
        currency: 'INR',
        type: 'debit',
      },
      {
        id: 't2',
        date: '2025-10-03T14:00:00Z',
        description: 'Salary Credit',
        amount: 500000,
        currency: 'INR',
        type: 'credit',
      },
      {
        id: 't3',
        date: '2025-10-01T09:15:00Z',
        description: 'Electricity Bill',
        amount: 4500,
        currency: 'INR',
        type: 'debit',
      },
    ],
  },
  'a2': {
    id: 'a2',
    bankName: 'ICICI Bank',
    nickname: 'ICICI Salary',
    accountNumberMasked: '****3366',
    type: 'salary',
    balance: { amount: 329556, currency: 'INR' },
    lastSynced: new Date().toISOString(),
    transactions: [
      {
        id: 't4',
        date: '2025-10-04T16:00:00Z',
        description: 'ATM Withdrawal',
        amount: 5000,
        currency: 'INR',
        type: 'debit',
      },
    ],
  },
  'a3': {
    id: 'a3',
    bankName: 'HDFC Bank',
    nickname: 'HDFC Savings',
    accountNumberMasked: '****4353',
    type: 'savings',
    balance: { amount: 329556, currency: 'INR' },
    lastSynced: new Date().toISOString(),
    transactions: [],
  },
};

// Fetch one account by ID
export const fetchAccountById = async (id: string): Promise<Account> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const account = mockAccounts[id];
      if (account) {
        resolve(account);
      } else {
        reject(new Error('Account not found'));
      }
    }, 800);
  });
};

// Add a transaction to an account and update balance
export const addTransaction = async (
  accountId: string,
  transaction: Omit<Transaction, 'id'>
): Promise<Transaction> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const account = mockAccounts[accountId];
      if (!account) {
        reject(new Error('Account not found'));
        return;
      }

      const newTxn: Transaction = { ...transaction, id: `t${Date.now()}` };

      account.transactions.unshift(newTxn);
      if (transaction.type === 'credit') {
        account.balance.amount += transaction.amount;
      } else {
        account.balance.amount -= transaction.amount;
      }
      account.lastSynced = new Date().toISOString();

      resolve(newTxn);
    }, 500);
  });
};

// Update account details (e.g., nickname, masked number)
export const updateAccount = async (
  accountId: string,
  updates: Partial<Omit<Account, 'id' | 'transactions'>>
): Promise<Account> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const account = mockAccounts[accountId];
      if (!account) {
        reject(new Error('Account not found'));
        return;
      }
      Object.assign(account, updates);
      account.lastSynced = new Date().toISOString();
      resolve(account);
    }, 500);
  });
};

// Get all accounts
export const getAllAccounts = async (): Promise<Account[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Object.values(mockAccounts));
    }, 300);
  });
};
