import React, {type PropsWithChildren} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { RootNavigator } from './src/navigation';
import { colors } from './src/utils/appStyles';

const App = () => {
  return (
    <>
    <RootNavigator/>
    <StatusBar backgroundColor={colors.primaryColor} />
    </>
  );
};

const styles = StyleSheet.create({
});

export default App;
