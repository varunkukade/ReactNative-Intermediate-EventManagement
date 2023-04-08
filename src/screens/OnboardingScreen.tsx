import React, { useState } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {measureMents} from '../utils/appStyles';
import { ImageComponent } from '../reusables';

const OnboardingScreen = () => {

  return (
    <>
    <View style={{flex: 1}}>
        <ImageComponent
          source={require('../../images/onboarding.jpg')}
          style={{width: measureMents.windowWidth, height: measureMents.windowHeight / 2}}
        />
    </View>
    <View style={styles.wrapperComponent}>
    
    </View>
    </>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  wrapperComponent: {
    position: 'absolute',
    top: 20,
    height: measureMents.windowHeight - 10 ,

  },
});
