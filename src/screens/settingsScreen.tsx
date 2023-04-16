import React, { useState, useCallback } from 'react';
import {
  Platform,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, measureMents } from '../utils/appStyles';
import { TextComponent } from '../reusables';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { useAppDispatch } from '../reduxConfig/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/rootStackNavigator';
import {
  logoutAPICall,
  resetUserState,
} from '../reduxConfig/slices/userSlice';
import CenterPopupComponent, {
  popupData,
} from '../reusables/centerPopup';
import { HomeStackParamList } from '../navigation/homeStackNavigator';
import { updateTheAsyncStorage } from '../utils/commonFunctions';
import {
  resetEventState,
} from '../reduxConfig/slices/eventsSlice';
import {
  resetPeopleState,
} from '../reduxConfig/slices/peopleSlice';

const SettingsScreen = () => {
  //dispatch and selectors
  const dispatch = useAppDispatch();

  //navigation state
  const rootNavigation = useNavigation<NativeStackNavigationProp<
    RootStackParamList,
    'HomeStack'
  >>();
  const homeStackNavigation = useNavigation<NativeStackNavigationProp<
    HomeStackParamList,
    'BottomTabNavigator'
  >>();

  //modal states
  const [isLogoutPopupVisible, setIsLogoutPopupVisible] = useState(false);

  const onCancelClick = useCallback(() => {
    setIsLogoutPopupVisible(false);
  }, []);

  const resetReduxState = useCallback(() => {
    dispatch(resetEventState());
    dispatch(resetPeopleState());
    dispatch(resetUserState());
  }, [dispatch]);

  const onLogoutpress = useCallback(() => {
    setIsLogoutPopupVisible(false);
    dispatch(logoutAPICall()).then(res => {
      if (res.meta.requestStatus === 'fulfilled') {
        if (Platform.OS === 'android' && res.payload)
          ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
        //Navigation state object - https://reactnavigation.org/docs/rootNavigation-state/
        resetReduxState();
        updateTheAsyncStorage('false');
        rootNavigation.reset({
          index: 0,
          routes: [
            {
              name: 'AuthStack',
              state: {
                index: 0,
                routes: [{ name: 'SigninScreen' }],
              },
            },
          ],
        });
      } else {
        if (Platform.OS === 'android' && res.payload)
          ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
      }
    });
  }, [dispatch, resetReduxState, rootNavigation]);

  const logoutPopupData = useCallback(
    (): popupData => ({
      header: 'Logout',
      description: 'Are you sure you want to logout?',
      onCancelClick,
      onConfirmClick: onLogoutpress,
    }),
    [onCancelClick, onLogoutpress],
  );

  const onUpdateProfilePress = useCallback(() => {
    homeStackNavigation.navigate('UpdateProfileScreen');
  }, [homeStackNavigation])

  const onResetPasswordPress = useCallback(() => {
   rootNavigation.navigate("AuthStack",{ screen: "ForgotPasswordScreen", params: {isResetPassword: true}} )
  }, [])

  let actions = [
    {
      label: 'Reset Password',
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
      onPress: onResetPasswordPress,
    },
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
      onPress: onUpdateProfilePress,
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
    marginBottom: 20,
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
