import {useRoute} from '@react-navigation/native';
import React, {ReactNode} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {colors} from '../utils/appStyles';
import { useAppSelector } from '../reduxConfig/store';

type ScreenWrapperProps = {
  children: ReactNode;
  currentTab?: 'Home' | 'Settings' | '';
};

const ScreenWrapper = ({children, currentTab}: ScreenWrapperProps) => {
  // we obtain the object that contains info about the current route
  const route = useRoute();
  const theme = useAppSelector(state => state.user.currentUser.theme)

  // for simplicity we will only modify the background color
  const getBackgroundColorBasedOnRoute = () => {
    switch (route.name) {
      case 'SignupScreen':
      case 'SigninScreen':
      case 'UpdateProfileScreen':
        return colors[theme].primaryColor;

      case 'Home':
      case 'EventDetailsScreen':
      case 'AddEventScreen':
      case 'All':
      case 'Pending':
      case 'Completed':
      case 'AddPeopleScreen':
      case 'CreateCommonList':
        return colors[theme].lightLavenderColor;

      default:
        return colors[theme].primaryColor;
    }
  };

  const getStatusBarStyle = () => {
    if (currentTab === 'Home') return 'dark-content';
    if (currentTab === 'Settings') return 'light-content';
    switch (route.name) {
      case 'SignupScreen':
      case 'SigninScreen':
      case 'UpdateProfileScreen':
        return 'light-content';

      case 'Home':
      case 'AddEventScreen':
      case 'EventDetailsScreen':
      case 'All':
      case 'Pending':
      case 'Completed':
      case 'AddPeopleScreen':
      case 'CreateCommonList':
        let content = theme === "dark" ? "light-content" : "dark-content"
        return content;

      default:
        return 'light-content';
    }
  };

  // we are applying the background color to the component itself
  return (
    <View
      style={{
        backgroundColor: getBackgroundColorBasedOnRoute(),
        flex: 1,
      }}>
      <StatusBar
        backgroundColor={getBackgroundColorBasedOnRoute()}
        barStyle={getStatusBarStyle()}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  customHeader: {},
});

export default ScreenWrapper;
