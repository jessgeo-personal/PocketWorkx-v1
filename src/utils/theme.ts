// src/utils/theme.ts
export const sectionColors = {
  netWorth:    '#ffcf54', // Example: gold for Net Worth
  cash:        '#27AE60', // Example: green for Cash & Accounts
  liabilities: '#E74C3C', // Example: red for Liabilities
  investments: '#4A90E2', // Example: blue for Investments & Receivables
  quickActions: '#795548',         // Brown for Quick Actions
  allOthers: '#F8F9FA',           // Neutral for everything else
};

export const colors = {
  primary: '#F8F9FA',        // Light grey for cards and panels 
  secondary: '#4A90E2',      // Mockup blue accent (e.g., in headers/buttons)
  background: '#ffd21f',        // Mockup yellow
  surface: '#FFFFFF',     // White for main screens
  textPrimary: '#545454',    // Dark text
  textSecondary: '#666666',  // Subdued text
  error: '#E74C3C',          // Error/alert
  ...sectionColors, // Spread section colors if needed elsewhere
};


