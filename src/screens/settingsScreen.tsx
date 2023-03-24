import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


const SettingsScreen = () => {
  return (
    <View style={styles.wrapperComponent}>
        <Text>In Settings Component</Text>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    wrapperComponent: {
        flex: 1,
        width: "100%",
        alignItems:"center",
        justifyContent:"center"
    }
})