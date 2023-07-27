import { useRoute } from '@react-navigation/native';
import React, { ReactNode, useCallback } from 'react';
import { StatusBar, View } from 'react-native';
import { colors } from '@/utils/appStyles';
import { useAppSelector } from '@/reduxConfig/store';
import { screens } from '@/utils/constants';

type ScreenWrapperProps = {
  children: ReactNode;
  currentTab?: 'Home' | 'Settings' | '';
};

const ScreenWrapper = ({ children, currentTab }: ScreenWrapperProps) => {
  // we obtain the object that contains info about the current route
  const route = useRoute();
  const theme = useAppSelector((state) => state.user.currentUser.theme);

  // for simplicity we will only modify the background color
  const getBackgroundColorBasedOnRoute = useCallback(() => {
    switch (route.name) {
      case screens.SignupScreen:
      case screens.SigninScreen:
      case screens.UpdateProfileScreen:
        return colors[theme].primaryColor;

      case screens.Home:
      case screens.EventDetailsScreen:
      case screens.AddEventScreen:
      case screens.AddGuestsScreen:
      case screens.CreateCommonGroup:
      case screens.DisplayCommonGroups:
      case screens.UpdateCommonGroupsScreen:
      case screens.UpdateCommonGroupsUsersScreen:
      case screens.GuestListScreen:
      case screens.SelectContactScreen:
      case screens.WelcomeScreen:
        return colors[theme].lightLavenderColor;

      default:
        return colors[theme].primaryColor;
    }
  }, [route.name, theme]);

  const getStatusBarStyle = useCallback(() => {
    if (currentTab === screens.Home) return 'dark-content';
    if (currentTab === screens.Settings) return 'light-content';
    switch (route.name) {
      case screens.SignupScreen:
      case screens.SigninScreen:
      case screens.UpdateProfileScreen:
        return 'light-content';

      case screens.Home:
      case screens.AddEventScreen:
      case screens.EventDetailsScreen:
      case screens.AddGuestsScreen:
      case screens.CreateCommonGroup:
      case screens.DisplayCommonGroups:
      case screens.UpdateCommonGroupsScreen:
      case screens.UpdateCommonGroupsUsersScreen:
      case screens.GuestListScreen:
      case screens.SelectContactScreen:
      case screens.WelcomeScreen:
        return theme === 'dark' ? 'light-content' : 'dark-content';
      default:
        return 'light-content';
    }
  }, [currentTab, route.name, theme]);

  // we are applying the background color to the component itself
  return (
    <View
      style={{
        backgroundColor: getBackgroundColorBasedOnRoute(),
        flex: 1,
      }}
    >
      <StatusBar
        backgroundColor={getBackgroundColorBasedOnRoute()}
        barStyle={getStatusBarStyle()}
      />
      {children}
    </View>
  );
};

export default ScreenWrapper;
