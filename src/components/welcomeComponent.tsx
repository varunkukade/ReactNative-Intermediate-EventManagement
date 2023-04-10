import React, {ReactElement, useState} from 'react';
import {
  Alert,
  Linking,
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
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const WelcomeComponent = (): ReactElement => {
  const [uri, setUri] = useState('');

  const displayAlert = () => {
    Alert.alert(
      'Permissions denied',
      'You need to give permissions to update the profile picture. You can give permission from settings',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Go to Settings',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          },
        },
      ],
    );
  };

  const updateProfilePicture = (response: ImagePicker.ImagePickerResponse) => {
    if (!(response.assets && response.assets.length > 0)) return;
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
  };

  const askPermissions = async (): Promise<void> => {
    await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ).then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          if (Platform.OS === 'android') {
            ToastAndroid.show(
              'This feature is not available on this device',
              ToastAndroid.SHORT,
            );
          }
          break;
        case RESULTS.DENIED:
          displayAlert();
          break;
        case RESULTS.GRANTED:
          ImagePicker.launchImageLibrary({mediaType: 'photo'}, response => {
            if (response.didCancel) {
            } else if (response.errorCode) {
              Alert.alert('ImagePicker Error: ', response.errorMessage);
            } else {
              updateProfilePicture(response);
            }
          });
          break;
        case RESULTS.BLOCKED:
          displayAlert();
          break;
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
        onPress={askPermissions}
        activeOpacity={0.6}
        style={styles.profilePicContainer}>
        <ImageComponent
          source={
            auth().currentUser?.photoURL !== ''
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
