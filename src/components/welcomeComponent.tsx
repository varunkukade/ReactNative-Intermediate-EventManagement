import React, {ReactElement, useEffect, useState} from 'react';
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
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {useAppDispatch} from '../reduxConfig/store';
import {
  getProfilePicture,
  uploadProfilePictureAPICall,
} from '../reduxConfig/slices/userSlice';

const PROFILE_PICTURE_SIZE = 60;

const WelcomeComponent = (): ReactElement => {
  //dispatch and selectors
  const dispatch = useAppDispatch();

  const [uri, setUri] = useState("")

  useEffect(() => {
    dispatch(
      getProfilePicture({imageName: 'profile-' + auth().currentUser?.email}),
    ).then((resp)=> {
      if (resp.payload) {
        if(Platform.OS === "android" && resp.meta.requestStatus === "fulfilled") {
          auth().currentUser?.updateProfile({
            photoURL: resp.payload.uri
          })
          .then((res)=> {
            setUri(auth().currentUser?.photoURL)
          })
        }
      }
    })
  }, []);

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

  const resizeProfilePicture = (response: ImagePicker.ImagePickerResponse) => {
    if (!(response.assets && response.assets.length > 0)) return;
    ImageResizer.createResizedImage(
      response.assets[0].uri,
      PROFILE_PICTURE_SIZE,
      PROFILE_PICTURE_SIZE,
      'PNG',
      100,
      0,
      null,
    )
      .then(response => {
        // response.uri is the URI of the new image that can now be uploaded to firebase storage...
        //resized image uri
        let uri = response.uri;
        //generating image name
        let imageName = 'profile-' + auth().currentUser?.email;
        //to resolve file path issue on different platforms
        let uploadUri =
          Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        //upload image to firebase storage
        return dispatch(uploadProfilePictureAPICall({imageName, uploadUri}));
      })
      .then(res => {
        if (res.meta.requestStatus === 'fulfilled') {
          if (Platform.OS === 'android' && res.payload)
            ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
          //Navigation state object - https://reactnavigation.org/docs/navigation-state/
        } else {
          if (Platform.OS === 'android' && res.payload)
            ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
        }
      })
      .catch(err => {
        if (Platform.OS === 'android') {
          ToastAndroid.show(
            'Oops, something went wrong. Failed to update Profile picture. Please try again later.',
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
              resizeProfilePicture(response);
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
            auth().currentUser?.photoURL !== null
              ? {uri: auth().currentUser?.photoURL}
              : require('../../images/dummyPicture.png')
          }
          style={{
            width: PROFILE_PICTURE_SIZE,
            height: PROFILE_PICTURE_SIZE,
            borderRadius: PROFILE_PICTURE_SIZE / 2,
          }}
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
