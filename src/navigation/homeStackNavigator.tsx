import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  AddEventScreen,
  AddGuestsScreen,
  CreateCommonGroup,
  DisplayCommonGroups,
  EventDetailsScreen,
  UpdateProfileScreen,
  UpdateCommonGroupsScreen,
  UpdateCommonGroupsUsersScreen,
  GuestListScreen
} from '../screens/index';
import {colors, fontStyles} from '../utils/appStyles';
import {BottomTabNavigator} from '.';
import {NavigatorScreenParams} from '@react-navigation/native';
import {BottomTabParamList} from './bottomTabNavigator';
import {EachEvent} from '../reduxConfig/slices/eventsSlice';
import {EachPerson} from '../reduxConfig/slices/peopleSlice';
import { useAppSelector } from '../reduxConfig/store';

export type HomeStackParamList = {
  BottomTabNavigator: undefined | NavigatorScreenParams<BottomTabParamList>;
  AddEventScreen: undefined | {longPressedEvent: EachEvent};
  EventDetailsScreen: undefined;
  GuestListScreen: undefined;
  AddGuestsScreen: undefined | {longPressedUser: EachPerson};
  UpdateProfileScreen: undefined;
  CreateCommonGroup: undefined;
  DisplayCommonGroups: undefined;
  UpdateCommonGroupsScreen: undefined;
  UpdateCommonGroupsUsersScreen: undefined | {selectedCommonListId: string, selectedCommonListName: string};
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
  const theme = useAppSelector(state => state.user.currentUser.theme)

  return (
    <HomeStack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
        headerTintColor: colors[theme].textColor,
      }}
      initialRouteName="BottomTabNavigator">
      <HomeStack.Screen
        options={{headerShown: false}}
        name="BottomTabNavigator"
        component={BottomTabNavigator}
      />
      <HomeStack.Screen
        options={{
          headerTitle: 'Add New Event',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: {backgroundColor: colors[theme].lightLavenderColor}
        }}
        name="AddEventScreen"
        component={AddEventScreen}
      />
      <HomeStack.Screen
        options={({route, navigation}) => ({
          headerTitle: 'Event details',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: {backgroundColor: colors[theme].lightLavenderColor}
        })}
        name="EventDetailsScreen"
        component={EventDetailsScreen}
      />
      <HomeStack.Screen
        options={({route, navigation}) => ({
          headerTitle: 'Guest List',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: {backgroundColor: colors[theme].lightLavenderColor}
        })}
        name="GuestListScreen"
        component={GuestListScreen}
      />
      <HomeStack.Screen
        options={({route, navigation}) => ({
          headerTitle: 'Add Guests to event',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: {backgroundColor: colors[theme].lightLavenderColor}
        })}
        name="AddGuestsScreen"
        component={AddGuestsScreen}
      />
      <HomeStack.Screen
        options={({route, navigation}) => ({
          headerTitle: 'Update Profile',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: {backgroundColor: colors[theme].primaryColor},
          headerTintColor: colors[theme].whiteColor,
        })}
        name="UpdateProfileScreen"
        component={UpdateProfileScreen}
      />
      <HomeStack.Screen
        options={({route, navigation}) => ({
          headerTitle: 'Create Common Group',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: {backgroundColor: colors[theme].lightLavenderColor}
        })}
        name="CreateCommonGroup"
        component={CreateCommonGroup}
      />
      <HomeStack.Screen
        options={({route, navigation}) => ({
          headerTitle: 'Common Groups',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: {backgroundColor: colors[theme].lightLavenderColor}
        })}
        name="DisplayCommonGroups"
        component={DisplayCommonGroups}
      />
      <HomeStack.Screen
        options={({route, navigation}) => ({
          headerTitle: 'Update Common Groups',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: {backgroundColor: colors[theme].lightLavenderColor}
        })}
        name="UpdateCommonGroupsScreen"
        component={UpdateCommonGroupsScreen}
      />
      <HomeStack.Screen
        options={({route, navigation}) => ({
          headerTitle: '',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: {backgroundColor: colors[theme].lightLavenderColor},
        })}
        name="UpdateCommonGroupsUsersScreen"
        component={UpdateCommonGroupsUsersScreen}
      />
    </HomeStack.Navigator>
  );
}

export default HomeStackNavigator;
