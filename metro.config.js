// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver for src directory
config.resolver.alias = {
  '@': './src',
};

module.exports = config;