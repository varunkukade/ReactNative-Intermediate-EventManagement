import React, {type PropsWithChildren} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { RootNavigator } from './src/navigation';

const App = () => {
  return (
    <RootNavigator/>
  );
};

const styles = StyleSheet.create({
});

export default App;
