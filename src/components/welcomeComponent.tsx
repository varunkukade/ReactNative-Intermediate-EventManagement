import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import ImageComponent from '../reusables/imageComponent';
import TextComponent from '../reusables/textComponent';
import {colors} from '../utils/appStyles';

const WelcomeComponent = (): ReactElement => {
    console.log("in WelcomeComponent")
  return (
    <View style={styles.welcomeComponent}>
      <View style={styles.welcomeHelloText}>
        <TextComponent
          weight="normal"
          style={{color: colors.primaryColor, fontSize: 20}}>
          Hello👋🏻
        </TextComponent>
        <TextComponent
          weight="bold"
          style={{color: colors.primaryColor, fontSize: 20}}>
          Varun Kukade
        </TextComponent>
      </View>
      <View style={styles.profilePicContainer}>
        <ImageComponent
          source={require('../../images/profilePic.jpg')}
          style={{width: 60, height: 60, borderRadius: 30}}
        />
      </View>
    </View>
  );
};

export const MemoizedWelcomeComponent = React.memo(WelcomeComponent);

const styles = StyleSheet.create({
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
    alignItems: 'flex-end',
    height: '100%',
  },
});
