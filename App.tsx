import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {colors} from './src/utils/appStyles';
import {Provider} from 'react-redux';
import {store} from './src/reduxConfig/store';
import {NavigationContainer} from '@react-navigation/native';
import RootStackNavigator from './src/navigation/rootStackNavigator';
import {LoadingAnimation} from './src/reusables';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStackNavigator />
        <LoadingAnimation />
      </NavigationContainer>
      <StatusBar
        backgroundColor={colors.primaryColor}
        barStyle="light-content"
      />
    </Provider>
  );
};

const styles = StyleSheet.create({});

export default App;
