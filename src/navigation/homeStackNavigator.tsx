import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  AddEventScreen,
  AddPeopleScreen,
  CreateCommonList,
  DisplayCommonLists,
  EventDetailsScreen,
  UpdateProfileScreen,
  UpdateCommonListScreen,
  UpdateCommonListUsersScreen
} from '../screens/index';
import {colors, fontStyles} from '../utils/appStyles';
import EventJoinersTopTabs from './topTabsNavigator';
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
  EventJoinersTopTab: undefined;
  AddPeopleScreen: undefined | {longPressedUser: EachPerson};
  UpdateProfileScreen: undefined;
  CreateCommonList: undefined;
  DisplayCommonList: undefined;
  UpdateCommonListScreen: undefined;
  UpdateCommonListUsersScreen: undefined | {selectedCommonListId: string, selectedCommonListName: string};
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
          headerTitle: 'Event joiners',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: {backgroundColor: colors[theme].lightLavenderColor}
        })}
        name="EventJoinersTopTab"
        component={EventJoinersTopTabs}
      />
      <HomeStack.Screen
        options={({route, navigation}) => ({
          headerTitle: 'Add People to event',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: {backgroundColor: colors[theme].lightLavenderColor}
        })}
        name="AddPeopleScreen"
        component={AddPeopleScreen}
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
          headerTitle: 'Create Common List',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: {backgroundColor: colors[theme].lightLavenderColor}
        })}
        name="CreateCommonList"
        component={CreateCommonList}
      />
      <HomeStack.Screen
        options={({route, navigation}) => ({
          headerTitle: 'Common Lists',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: {backgroundColor: colors[theme].lightLavenderColor}
        })}
        name="DisplayCommonList"
        component={DisplayCommonLists}
      />
      <HomeStack.Screen
        options={({route, navigation}) => ({
          headerTitle: 'Update Common lists',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: {backgroundColor: colors[theme].lightLavenderColor}
        })}
        name="UpdateCommonListScreen"
        component={UpdateCommonListScreen}
      />
      <HomeStack.Screen
        options={({route, navigation}) => ({
          headerTitle: `Update ${route.params?.selectedCommonListName}`,
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: {backgroundColor: colors[theme].lightLavenderColor}
        })}
        name="UpdateCommonListUsersScreen"
        component={UpdateCommonListUsersScreen}
      />
    </HomeStack.Navigator>
  );
}

export default HomeStackNavigator;
