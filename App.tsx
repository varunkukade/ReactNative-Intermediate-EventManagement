import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/reduxConfig/store';
import { NavigationContainer } from '@react-navigation/native';
import RootStackNavigator from '@/navigation/rootStackNavigator';
import { LoadingAnimation } from '@/reusables';

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

export default App;
