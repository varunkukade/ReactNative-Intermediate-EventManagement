import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


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
        width: "100%",
        alignItems:"center",
        justifyContent:"center"
    }
})