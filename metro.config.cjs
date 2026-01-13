const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Handle SVG
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

// Add web extensions
config.resolver.sourceExts = [
    ...config.resolver.sourceExts,
    'web.js', 'web.jsx', 'web.ts', 'web.tsx'
];

module.exports = config;