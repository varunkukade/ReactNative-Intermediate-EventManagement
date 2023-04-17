import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {ReactNode} from 'react';
import {StatusBar, View} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import {BottomTabParamList} from '../navigation/bottomTabNavigator';

type ScreenWrapperProps = {
  children: ReactNode;
  currentTab?: 'Home' | 'Settings' | '';
};

const ScreenWrapper = ({children, currentTab}: ScreenWrapperProps) => {
  // we obtain the object that contains info about the current route
  const route = useRoute();
  console.log(route.name);

  // for simplicity we will only modify the background color
  const getBackgroundColorBasedOnRoute = () => {
    switch (route.name) {
      case 'SignupScreen':
      case 'SigninScreen':
      case 'UpdateProfileScreen':
        return colors.primaryColor;

      case 'Home':
      case 'EventDetailsScreen':
        return colors.lightLavenderColor;

      case 'AddEventScreen':
      case 'All':
      case 'Pending':
      case 'Completed':
      case 'AddPeopleScreen':
        return colors.whiteColor;

      default:
        return colors.primaryColor;
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
        return 'dark-content';

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

export default ScreenWrapper;
