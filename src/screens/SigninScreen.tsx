import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';

const SigninScreen = () => {
  return (
    <View style={styles.wrapperComponent}>
      <Text>In Signin Component</Text>
    </View>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({
  wrapperComponent: {
    flex: 1,
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: measureMents.leftPadding,
    backgroundColor: colors.whiteColor,
  },
});
