import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


const HomeScreen = () => {
  return (
    <View style={styles.wrapperComponent}>
        <Text style={{color:"black"}}>In Home Component</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
    wrapperComponent: {
      flex: 1,
      alignItems: "center",
      backgroundColor: "grey",
      paddingTop: 70,
    }
})