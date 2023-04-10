import React, {ReactElement, useState} from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageComponent from '../reusables/imageComponent';
import TextComponent from '../reusables/textComponent';
import {colors} from '../utils/appStyles';
import * as ImagePicker from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';

const WelcomeComponent = (): ReactElement => {
  const [uri, setUri] = useState('');
  const onProfilePictureClick = () => {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
      } else if (response.errorCode) {
        Alert.alert('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        auth()
          .currentUser?.updateProfile({
            photoURL: response.assets[0]?.uri || '',
          })
          .then(res => {
            if (response.assets && response.assets.length > 0)
              setUri(response.assets[0]?.uri || '');
            if (Platform.OS === 'android') {
              ToastAndroid.show(
                'Profile picture Updated successfully.',
                ToastAndroid.SHORT,
              );
            }
          })
          .catch(err => {
            if (Platform.OS === 'android') {
              ToastAndroid.show(
                'Failed to update Profile picture. Please try again later.',
                ToastAndroid.SHORT,
              );
            }
          });
      }
    });
  };
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
      <TouchableOpacity
        onPress={onProfilePictureClick}
        activeOpacity={0.6}
        style={styles.profilePicContainer}>
        <ImageComponent
          source={
            auth().currentUser?.photoURL
              ? {uri: auth().currentUser?.photoURL}
              : require('../../images/dummyPicture.png')
          }
          style={{width: 60, height: 60, borderRadius: 30}}
        />
        <TextComponent style={{color: colors.greyColor}} weight="extraBold">
          Update
        </TextComponent>
      </TouchableOpacity>
    </View>
  );
};

export const MemoizedWelcomeComponent = React.memo(WelcomeComponent);

const styles = StyleSheet.create({
  welcomeComponent: {
    flex: 0.15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeHelloText: {
    width: '70%',
  },
  profilePicContainer: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});
