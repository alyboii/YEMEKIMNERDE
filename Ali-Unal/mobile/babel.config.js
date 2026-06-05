module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@config': './src/config',
          '@services': './src/services',
          '@context': './src/context',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@theme': './src/theme',
        },
      },
    ],
  ],
};
