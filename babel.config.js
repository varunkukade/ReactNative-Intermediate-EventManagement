/* eslint-disable no-undef */
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        alias: {
          '@': './src',
        },
      },
    ],
  ],
};
