import React, {ReactElement, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MemoizedEventListComponent} from '../components/EventListComponent';
import {MemoizedWelcomeComponent} from '../components/welcomeComponent';
import {colors, measureMents} from '../utils/appStyles';
import EntypoIcons from 'react-native-vector-icons/Entypo';

const AddEventScreen = (): ReactElement => {
  return (
    <>
      <View style={styles.wrapperComponent}>
       <Text>Hey</Text>
      </View>
    </>
  );
};

export default AddEventScreen;

const styles = StyleSheet.create({
  wrapperComponent: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: measureMents.leftPadding,
  },
});
