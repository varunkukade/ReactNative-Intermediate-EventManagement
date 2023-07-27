import React, {useState, useCallback} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Share
} from 'react-native';
import {colors, measureMents} from '@/utils/appStyles';
import {TextComponent} from '@/reusables';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppDispatch, useAppSelector} from '@/reduxConfig/store';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/rootStackNavigator';
import {
  logoutAPICall,
  resetUserState,
  setTheme,
} from '@/reduxConfig/slices/userSlice';
import CenterPopupComponent, {popupData} from '@/reusables/centerPopup';
import {HomeStackParamList} from '@/navigation/homeStackNavigator';
import {getInviteCode, setAsyncStorage} from '@/utils/commonFunctions';
import {resetEventState} from '@/reduxConfig/slices/eventsSlice';
import {resetPeopleState} from '@/reduxConfig/slices/peopleSlice';
import {ScreenWrapper} from '.';
import {VERSION_CONST} from '@/utils/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';

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
  const [isInvitePopupVisible, setInvitePopupVisible] = useState(false);

  //hooks
  const [ isCopied, setCopiedText ] = useCopyToClipboard(3000);
  const theme = useAppSelector(state => state.user.currentUser.theme);

  const onCancelClick = useCallback(() => {
    setIsLogoutPopupVisible(false);
  }, []);

  const onCancelInvitePopupClick = useCallback(() => {
    setInvitePopupVisible(false);
  }, [setInvitePopupVisible]);

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

  const onShareCodeClick = useCallback(async () => {
    try {
      const result = await Share.share({
        message:
          `Hi! I have been using this EventManagement app and you can join as guest. Install the app and join by entering this code : ${getInviteCode()}. See you in the app!`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      if (Platform.OS === 'android' && error?.message)
          ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  }, []);

  const logoutPopupData = useCallback(
    (): popupData => ({
      header: 'Logout',
      description: 'Are you sure you want to logout?',
      onCancelClick,
      onConfirmClick: onLogoutpress,
    }),
    [onCancelClick, onLogoutpress],
  );

  const invitePopupData = useCallback(
    (): popupData => ({
      header: 'Invite Guests',
      description:
        'Share this code with guests and guests will be able to join the app through your invite code',
      onCancelClick: onCancelInvitePopupClick,
      onConfirmClick: onShareCodeClick,
      confirmButtonText: 'Share',
      cancelButtonText: 'Cancel',
    }),
    [onCancelInvitePopupClick, onShareCodeClick],
  );

  const onUpdateProfilePress = useCallback(() => {
    homeStackNavigation.navigate('UpdateProfileScreen');
  }, [homeStackNavigation]);

  const onUpdateCommonListPress = useCallback(() => {
    homeStackNavigation.navigate('UpdateCommonGroupsScreen');
  }, [homeStackNavigation]);

  const onInviteUsersPress = useCallback(() => {
    setInvitePopupVisible(true);
  }, [setInvitePopupVisible]);

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

  const onCopyInviteCodeClick = () => {
    setCopiedText(getInviteCode() || "")
  };

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
      label: 'Update Common Groups',
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
      label: 'Invite Guests to app',
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
      onPress: onInviteUsersPress,
    },
    {
      id: 5,
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
      id: 6,
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
              {eachAction.id === 5 ? (
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
      <CenterPopupComponent
        popupData={invitePopupData}
        isModalVisible={isInvitePopupVisible}
        setIsModalVisible={setInvitePopupVisible}>
        <View style={styles.invitePopupContainer}>
          <TextComponent
            style={{
              color: colors[theme].textColor,
              textAlign: 'center',
              fontSize: 22,
              letterSpacing: 1.5,
            }}
            weight="semibold">
            {getInviteCode()}
          </TextComponent>
          <TouchableOpacity onPress={onCopyInviteCodeClick}>
            <Ionicons
              name={isCopied ? "checkmark" : "copy-outline"}
              color={colors[theme].iconLightPinkColor}
              size={isCopied  ? 30 : 22}
              style={{marginLeft: 15}}
            />
          </TouchableOpacity>
        </View>
      </CenterPopupComponent>
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
  invitePopupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
});
