import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {HomeStackNavigator} from './src/navigation';
import {colors} from './src/utils/appStyles';
import {Provider} from 'react-redux';
import {store} from './src/reduxConfig/store';
import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <HomeStackNavigator />
      </NavigationContainer>
      <StatusBar backgroundColor={colors.whiteColor} barStyle="dark-content" />
    </Provider>
  );
};

const styles = StyleSheet.create({});

export default App;
