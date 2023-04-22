import React from 'react';
import {StyleSheet} from 'react-native';
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
    </Provider>
  );
};

const styles = StyleSheet.create({});

export default App;
