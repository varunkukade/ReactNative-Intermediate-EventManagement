import React from 'react';
import {
  StatusBar,
  StyleSheet,
} from 'react-native';
import { RootNavigator } from './src/navigation';
import { colors } from './src/utils/appStyles';
import { Provider } from 'react-redux'
import { store } from './src/reduxConfig/store';

const App = () => {
  return (
    <Provider store={store}>
    <RootNavigator/>
    <StatusBar backgroundColor={colors.primaryColor} />
    </Provider>
  );
};

const styles = StyleSheet.create({
});

export default App;
