import React, { useState } from 'react';
import {Platform, StyleSheet, ToastAndroid, TouchableOpacity, View} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import {TextComponent} from '../reusables';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { useAppDispatch } from '../reduxConfig/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/rootStackNavigator';
import { logoutAPICall } from '../reduxConfig/slices/userSlice';
import CenterPopupComponent, { popupData } from '../reusables/centerPopupComponent';
import { HomeStackParamList } from '../navigation/homeStackNavigator';
import { updateTheAsyncStorage } from '../utils/commonFunctions';

const SettingsScreen = () => {
  //dispatch and selectors
  const dispatch = useAppDispatch();

  //navigation state
  const rootNavigation: NativeStackNavigationProp<RootStackParamList, 'HomeStack'> =
    useNavigation();
    const homeStackNavigation: NativeStackNavigationProp<HomeStackParamList, 'BottomTabNavigator'> =
    useNavigation();
    //modal states
  const [isLogoutPopupVisible, setIsLogoutPopupVisible] = useState(false);

  const onCancelClick = () => {
    if (isLogoutPopupVisible) setIsLogoutPopupVisible(false);
  };
 

  const onLogoutpress = () => {
    setIsLogoutPopupVisible(false)
    dispatch(logoutAPICall()).then(res => {
      if (res.meta.requestStatus === 'fulfilled') {
        if (Platform.OS === 'android' && res.payload)
          ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
        //Navigation state object - https://reactnavigation.org/docs/rootNavigation-state/
        updateTheAsyncStorage()
        rootNavigation.reset({
          index: 0,
          routes: [
            {
              name: 'AuthStack',
              state: {
                index: 0,
                routes: [{name: 'SigninScreen'}],
              },
            },
          ],
        });
      } else {
        if (Platform.OS === 'android' && res.payload)
          ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
      }
    });
  };

  let logoutPopupData: popupData = {
    header: 'Logout',
    description: 'Are you sure you want to logout?',
    onCancelClick: onCancelClick,
    onConfirmClick: onLogoutpress,
  };
  
  let actions = [
    {
      label: 'Update Profile',
      icon: () => (
        <EntypoIcons
          size={30}
          color={colors.primaryColor}
          name="chevron-with-circle-right"
        />
      ),
      rightIcon: () => (
        <EntypoIcons
          size={35}
          color={colors.iconLightPinkColor}
          name="chevron-with-circle-right"
        />
      ),
      onPress: () => homeStackNavigation.navigate('UpdateProfileScreen'),
    },
    {
      label: 'Log-out',
      icon: () => (
        <EntypoIcons
          size={30}
          color={colors.primaryColor}
          name="chevron-with-circle-right"
        />
      ),
      rightIcon: () => (
        <EntypoIcons
          size={35}
          color={colors.iconLightPinkColor}
          name="chevron-with-circle-right"
        />
      ),
      onPress: () => setIsLogoutPopupVisible(true),
    },
  ];
  return (
    <View style={styles.wrapperComponent}>
      <View style={styles.welcomeMessage}>
        <TextComponent
          style={{fontSize: 20, color: colors.whiteColor}}
          weight="bold">
          Settings
        </TextComponent>
      </View>
      <View style={styles.mainContainer}>
        {actions.map((eachAction, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.5}
            onPress={eachAction.onPress}
            style={styles.eachAction}>
            <View style={styles.secondSection}>
              <TextComponent
                weight="semibold"
                style={{
                  color: colors.primaryColor,
                  fontSize: 16,
                }}>
                {eachAction.label}
              </TextComponent>
            </View>
            <View style={styles.thirdSection}>{eachAction.rightIcon()}</View>
          </TouchableOpacity>
        ))}
      </View>
      <CenterPopupComponent
        popupData={logoutPopupData}
        isModalVisible={isLogoutPopupVisible}
        setIsModalVisible={setIsLogoutPopupVisible}
      />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  wrapperComponent: {
    flex: 1,
    backgroundColor: colors.primaryColor,
  },
  welcomeMessage: {
    paddingTop: 30,
    paddingHorizontal: measureMents.leftPadding,
    paddingBottom: 40,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: measureMents.leftPadding,
  },
  eachAction: {
    backgroundColor: colors.lightLavenderColor,
    height: 90,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: measureMents.leftPadding,
    marginBottom: 20
  },
  secondSection: {
    width: '80%',
    height: '100%',
    justifyContent: 'space-evenly',
  },
  thirdSection: {
    width: '20%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
