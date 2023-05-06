import React, {useState, useCallback} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import {TextComponent} from '../reusables';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppDispatch, useAppSelector} from '../reduxConfig/store';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/rootStackNavigator';
import {
  logoutAPICall,
  resetUserState,
  setTheme,
} from '../reduxConfig/slices/userSlice';
import CenterPopupComponent, {popupData} from '../reusables/centerPopup';
import {HomeStackParamList} from '../navigation/homeStackNavigator';
import {setAsyncStorage} from '../utils/commonFunctions';
import {resetEventState} from '../reduxConfig/slices/eventsSlice';
import {resetPeopleState} from '../reduxConfig/slices/peopleSlice';
import {ScreenWrapper} from '.';
import {VERSION_CONST} from '../utils/constants';

const SettingsScreen = () => {
  //dispatch and selectors
  const dispatch = useAppDispatch();

  //navigation state
  const rootNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'HomeStack'>>();
  const homeStackNavigation =
    useNavigation<
      NativeStackNavigationProp<HomeStackParamList, 'BottomTabNavigator'>
    >();

  //modal states
  const [isLogoutPopupVisible, setIsLogoutPopupVisible] = useState(false);

  const theme = useAppSelector(state => state.user.currentUser.theme);

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
        setAsyncStorage('isAuthenticated', 'false');
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
  }, [homeStackNavigation]);

  const onUpdateCommonListPress = useCallback(() => {
    homeStackNavigation.navigate('UpdateCommonListScreen');
  }, [homeStackNavigation]);

  const onResetPasswordPress = useCallback(() => {
    rootNavigation.navigate('AuthStack', {
      screen: 'ForgotPasswordScreen',
      params: {isResetPassword: true},
    });
  }, [rootNavigation]);

  const changeTheme = useCallback(() => {
    if (theme === 'light') {
      dispatch(setTheme('dark'));
    } else {
      dispatch(setTheme('light'));
    }
  }, [theme, dispatch]);

  let actions = [
    {
      id: 1,
      label: 'Reset Password',
      icon: () => (
        <EntypoIcons
          size={30}
          color={colors[theme].primaryColor}
          name="chevron-with-circle-right"
        />
      ),
      rightIcon: () => (
        <EntypoIcons
          size={35}
          color={colors[theme].iconLightPinkColor}
          name="chevron-with-circle-right"
        />
      ),
      onPress: onResetPasswordPress,
    },
    {
      id: 2,
      label: 'Update Profile',
      icon: () => (
        <EntypoIcons
          size={30}
          color={colors[theme].primaryColor}
          name="chevron-with-circle-right"
        />
      ),
      rightIcon: () => (
        <EntypoIcons
          size={35}
          color={colors[theme].iconLightPinkColor}
          name="chevron-with-circle-right"
        />
      ),
      onPress: onUpdateProfilePress,
    },
    {
      id: 3,
      label: 'Update Common Lists',
      icon: () => (
        <EntypoIcons
          size={30}
          color={colors[theme].primaryColor}
          name="chevron-with-circle-right"
        />
      ),
      rightIcon: () => (
        <EntypoIcons
          size={35}
          color={colors[theme].iconLightPinkColor}
          name="chevron-with-circle-right"
        />
      ),
      onPress: onUpdateCommonListPress,
    },
    {
      id: 4,
      label: 'Dark Mode',
      icon: () => (
        <EntypoIcons
          size={30}
          color={colors[theme].primaryColor}
          name="chevron-with-circle-right"
        />
      ),
      rightIcon: () => (
        <MaterialCommunityIcons
          size={40}
          color={colors[theme].iconLightPinkColor}
          name={
            theme === 'light'
              ? 'toggle-switch-off-outline'
              : 'toggle-switch-outline'
          }
        />
      ),
      onPress: () => changeTheme(),
    },
    {
      id: 5,
      label: 'Log-out',
      icon: () => (
        <EntypoIcons
          size={30}
          color={colors[theme].primaryColor}
          name="chevron-with-circle-right"
        />
      ),
      rightIcon: () => (
        <EntypoIcons
          size={35}
          color={colors[theme].iconLightPinkColor}
          name="chevron-with-circle-right"
        />
      ),
      onPress: () => setIsLogoutPopupVisible(true),
    },
  ];

  return (
    <ScreenWrapper>
        <View style={styles.welcomeMessage}>
          <TextComponent
            style={{fontSize: 20, color: colors[theme].whiteColor}}
            weight="bold">
            Settings
          </TextComponent>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.mainContainer,
            {backgroundColor: colors[theme].cardColor},
          ]}>
          {actions.map((eachAction, index) => (
            <View key={index}>
              {eachAction.id === 4 ? (
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={eachAction.onPress}>
                  <View
                    style={[
                      styles.eachAction,
                      {backgroundColor: colors[theme].lightLavenderColor},
                    ]}>
                    <View style={styles.secondSection}>
                      <TextComponent
                        weight="semibold"
                        style={{
                          color: colors[theme].textColor,
                          fontSize: 16,
                        }}>
                        {eachAction.label}
                      </TextComponent>
                    </View>
                    <View style={styles.thirdSection}>
                      <TextComponent
                        style={{color: colors[theme].textColor}}
                        weight="bold">
                        {theme === 'light' ? 'Off' : 'On'}
                      </TextComponent>
                      {eachAction.rightIcon()}
                    </View>
                  </View>
                </TouchableHighlight>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={eachAction.onPress}
                  style={[
                    styles.eachAction,
                    {backgroundColor: colors[theme].lightLavenderColor},
                  ]}>
                  <View style={styles.secondSection}>
                    <TextComponent
                      weight="semibold"
                      style={{
                        color: colors[theme].textColor,
                        fontSize: 16,
                      }}>
                      {eachAction.label}
                    </TextComponent>
                  </View>
                  <View style={styles.thirdSection}>
                    {eachAction.rightIcon()}
                  </View>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TextComponent
            style={{textAlign: 'center', color: colors[theme].textColor}}
            weight="bold">
            {VERSION_CONST}
          </TextComponent>
        </View>
      </ScrollView>
      <CenterPopupComponent
        popupData={logoutPopupData}
        isModalVisible={isLogoutPopupVisible}
        setIsModalVisible={setIsLogoutPopupVisible}
      />
    </ScreenWrapper>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  welcomeMessage: {
    paddingTop: 30,
    paddingHorizontal: measureMents.leftPadding,
    paddingBottom: 40,
  },
  mainContainer: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: measureMents.leftPadding,
  },
  eachAction: {
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
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: measureMents.leftPadding,
  },
  eachActionContainer: {
    width: 75,
    marginRight: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
});
