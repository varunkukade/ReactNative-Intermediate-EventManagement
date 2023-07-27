import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  AddEventScreen,
  AddGuestsScreen,
  CreateCommonGroup,
  DisplayCommonGroups,
  EventDetailsScreen,
  UpdateProfileScreen,
  UpdateCommonGroupsScreen,
  UpdateCommonGroupsUsersScreen,
  GuestListScreen,
  SelectContactScreen,
} from '@/screens/index';
import { colors, fontStyles } from '@/utils/appStyles';
import { BottomTabNavigator } from '.';
import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabParamList } from './bottomTabNavigator';
import { EachEvent } from '@/reduxConfig/slices/eventsSlice';
import { EachPerson } from '@/reduxConfig/slices/peopleSlice';
import { useAppSelector } from '@/reduxConfig/store';
import { screens } from '@/utils/constants';

export type HomeStackParamList = {
  BottomTabNavigator: undefined | NavigatorScreenParams<BottomTabParamList>;
  AddEventScreen: undefined | { longPressedEvent: EachEvent };
  EventDetailsScreen: undefined;
  GuestListScreen: undefined;
  AddGuestsScreen: undefined | { longPressedUser: EachPerson };
  UpdateProfileScreen: undefined;
  CreateCommonGroup: undefined;
  DisplayCommonGroups: undefined;
  UpdateCommonGroupsScreen: undefined;
  UpdateCommonGroupsUsersScreen:
    | undefined
    | { selectedCommonListId: string; selectedCommonListName: string };
  SelectContactScreen: undefined;
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
  const theme = useAppSelector((state) => state.user.currentUser.theme);

  return (
    <HomeStack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
        headerTintColor: colors[theme].textColor,
      }}
      initialRouteName={screens.BottomTabNavigator}
    >
      <HomeStack.Screen
        options={{ headerShown: false }}
        name={screens.BottomTabNavigator}
        component={BottomTabNavigator}
      />
      <HomeStack.Screen
        options={{
          headerTitle: 'Add New Event',
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: fontStyles.bold, fontSize: 20 },
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: { backgroundColor: colors[theme].lightLavenderColor },
        }}
        name={screens.AddEventScreen}
        component={AddEventScreen}
      />
      <HomeStack.Screen
        options={() => ({
          headerTitle: 'Event details',
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: fontStyles.bold, fontSize: 20 },
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: { backgroundColor: colors[theme].lightLavenderColor },
        })}
        name={screens.EventDetailsScreen}
        component={EventDetailsScreen}
      />
      <HomeStack.Screen
        options={() => ({
          headerTitle: 'Guest List',
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: fontStyles.bold, fontSize: 20 },
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: { backgroundColor: colors[theme].lightLavenderColor },
        })}
        name={screens.GuestListScreen}
        component={GuestListScreen}
      />
      <HomeStack.Screen
        options={() => ({
          headerTitle: 'Add Guests to event',
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: fontStyles.bold, fontSize: 20 },
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: { backgroundColor: colors[theme].lightLavenderColor },
        })}
        name={screens.AddGuestsScreen}
        component={AddGuestsScreen}
      />
      <HomeStack.Screen
        options={() => ({
          headerTitle: 'Update Profile',
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: fontStyles.bold, fontSize: 20 },
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: { backgroundColor: colors[theme].primaryColor },
          headerTintColor: colors[theme].whiteColor,
        })}
        name={screens.UpdateProfileScreen}
        component={UpdateProfileScreen}
      />
      <HomeStack.Screen
        options={() => ({
          headerTitle: 'Create Common Group',
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: fontStyles.bold, fontSize: 20 },
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: { backgroundColor: colors[theme].lightLavenderColor },
        })}
        name={screens.CreateCommonGroup}
        component={CreateCommonGroup}
      />
      <HomeStack.Screen
        options={() => ({
          headerTitle: 'Common Groups',
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: fontStyles.bold, fontSize: 20 },
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: { backgroundColor: colors[theme].lightLavenderColor },
        })}
        name={screens.DisplayCommonGroups}
        component={DisplayCommonGroups}
      />
      <HomeStack.Screen
        options={() => ({
          headerTitle: 'Update Common Groups',
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: fontStyles.bold, fontSize: 20 },
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: { backgroundColor: colors[theme].lightLavenderColor },
        })}
        name={screens.UpdateCommonGroupsScreen}
        component={UpdateCommonGroupsScreen}
      />
      <HomeStack.Screen
        options={() => ({
          headerTitle: '',
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: fontStyles.bold, fontSize: 20 },
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: { backgroundColor: colors[theme].lightLavenderColor },
        })}
        name={screens.UpdateCommonGroupsUsersScreen}
        component={UpdateCommonGroupsUsersScreen}
      />
      <HomeStack.Screen
        options={() => ({
          headerTitle: 'Contacts Selection',
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: fontStyles.bold, fontSize: 20 },
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: { backgroundColor: colors[theme].lightLavenderColor },
        })}
        name={screens.SelectContactScreen}
        component={SelectContactScreen}
      />
    </HomeStack.Navigator>
  );
}

export default HomeStackNavigator;
