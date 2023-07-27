import { AuthStackParamList } from '@/navigation/authStackNavigator';
import { BottomTabParamList } from '@/navigation/bottomTabNavigator';
import { HomeStackParamList } from '@/navigation/homeStackNavigator';
import { RootStackParamList } from '@/navigation/rootStackNavigator';

export const reduxToolkitStatuses = {
  fulfilled: 'fulfilled',
  rejected: 'rejected',
};

export const PAGINATION_CONSTANT = 10;
export const GOOGLE_CONST = 'google.com';
export const VERSION_CONST = 'Version 1.0.0';
export const MAX_BULK_ADDITION = 200;

interface ScreensType {
  HomeStack: keyof RootStackParamList;
  AuthStack: keyof RootStackParamList;
  BottomTabNavigator: keyof HomeStackParamList;
  AddEventScreen: keyof HomeStackParamList;
  EventDetailsScreen: keyof HomeStackParamList;
  GuestListScreen: keyof HomeStackParamList;
  AddGuestsScreen: keyof HomeStackParamList;
  UpdateProfileScreen: keyof HomeStackParamList;
  CreateCommonGroup: keyof HomeStackParamList;
  DisplayCommonGroups: keyof HomeStackParamList;
  UpdateCommonGroupsScreen: keyof HomeStackParamList;
  UpdateCommonGroupsUsersScreen: keyof HomeStackParamList;
  SelectContactScreen: keyof HomeStackParamList;
  Home: keyof BottomTabParamList;
  Settings: keyof BottomTabParamList;
  WelcomeScreen: keyof AuthStackParamList;
  SignupScreen: keyof AuthStackParamList;
  ForgotPasswordScreen: keyof AuthStackParamList;
  SigninScreen: keyof AuthStackParamList;
}

export const screens: ScreensType = {
  HomeStack: 'HomeStack',
  AuthStack: 'AuthStack',
  BottomTabNavigator: 'BottomTabNavigator',
  AddEventScreen: 'AddEventScreen',
  EventDetailsScreen: 'EventDetailsScreen',
  GuestListScreen: 'GuestListScreen',
  AddGuestsScreen: 'AddGuestsScreen',
  UpdateProfileScreen: 'UpdateProfileScreen',
  CreateCommonGroup: 'CreateCommonGroup',
  DisplayCommonGroups: 'DisplayCommonGroups',
  UpdateCommonGroupsScreen: 'UpdateCommonGroupsScreen',
  UpdateCommonGroupsUsersScreen: 'UpdateCommonGroupsUsersScreen',
  SelectContactScreen: 'SelectContactScreen',
  Home: 'Home',
  Settings: 'Settings',
  WelcomeScreen: 'WelcomeScreen',
  SignupScreen: 'SignupScreen',
  ForgotPasswordScreen: 'ForgotPasswordScreen',
  SigninScreen: 'SigninScreen',
};

export type WelcomeScreenState = {
  id: number;
  active: boolean;
  mainText: string;
};
export const initialWelcomeScreens: WelcomeScreenState[] = [
  {
    id: 1,
    active: true,
    mainText: 'Event Management Is Now More Simpler, Easier And Practical!',
  },
  {
    id: 2,
    active: false,
    mainText: 'Create Events, Create Common Guests, Add Guest To Event.',
  },
  {
    id: 3,
    active: false,
    mainText: 'Invite Users To App And They Can Stay Updated with New Events.',
  },
];
