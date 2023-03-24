import React, {type PropsWithChildren} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';

const App = () => {
  return (
    <SafeAreaView>
      <StatusBar
        barStyle={'dark-content'}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
});

export default App;
