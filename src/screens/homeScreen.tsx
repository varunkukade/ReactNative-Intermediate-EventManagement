import React, {ReactElement} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ImageComponent from '../reusables/imageComponent';
import TextComponent from '../reusables/textComponent';
import {colors, measureMents} from '../utils/appStyles';

const HomeScreen = (): ReactElement => {
  return (
    <View style={styles.wrapperComponent}>
      <View style={styles.welcomeComponent}>
        <View style={styles.welcomeHelloText}>
          <TextComponent weight="normal" style={{color: colors.primaryColor, fontSize: 20}}>Hello👋🏻</TextComponent>
          <TextComponent weight="bold" style={{color: colors.primaryColor, fontSize: 20}}>Varun Kukade</TextComponent>
        </View>
        <View style={styles.profilePicContainer}>
          <ImageComponent source={require('../../images/profilePic.jpg')} style={{ width: 60, height: 60, borderRadius: 30}}/>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  wrapperComponent: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: measureMents.leftPadding,
  },
  welcomeComponent: {
    flex: 0.1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeHelloText: {
    width: '70%',
  },
  profilePicContainer: {
    width: '30%',
    alignItems: "flex-end",
    height: "100%"
  },
  imageContainer: {
    width: "100%",
    height: "100%",
  }
});
