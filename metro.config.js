const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Allow Metro to bundle .wasm files (required by expo-sqlite on web)
config.resolver.assetExts.push('wasm');

// Stub native-only packages for web
const webStubs = {
  'react-native-worklets': path.resolve(__dirname, 'stubs/react-native-worklets.js'),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && webStubs[moduleName]) {
    return { filePath: webStubs[moduleName], type: 'sourceFile' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
