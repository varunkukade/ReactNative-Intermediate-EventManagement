import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, measureMents, paddings } from '../utils/appStyles';


const HomeScreen = () => {
  return (
    <View style={styles.wrapperComponent}>
        <Text style={{color:"black", fontFamily: 'Nunito-ExtraBold'}}>Hello</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
    wrapperComponent: {
      flex: 1,
      paddingTop:30,
      paddingHorizontal: measureMents.leftPadding
    }
})