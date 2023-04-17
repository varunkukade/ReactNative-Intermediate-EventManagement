import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  AddEventScreen,
  AddPeopleScreen,
  EventDetailsScreen,
  UpdateProfileScreen,
} from '../screens/index';
import {colors, fontStyles} from '../utils/appStyles';
import EventJoinersTopTabs from './topTabsNavigator';
import {BottomTabNavigator} from '.';
import {NavigatorScreenParams} from '@react-navigation/native';
import {BottomTabParamList} from './bottomTabNavigator';
import {EachEvent} from '../reduxConfig/slices/eventsSlice';
import {EachPerson} from '../reduxConfig/slices/peopleSlice';

export type HomeStackParamList = {
  BottomTabNavigator: undefined | NavigatorScreenParams<BottomTabParamList>;
  AddEventScreen: undefined | {longPressedEvent: EachEvent};
  EventDetailsScreen: undefined;
  EventJoinersTopTab: undefined;
  AddPeopleScreen: undefined | {longPressedUser: EachPerson};
  UpdateProfileScreen: undefined;
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
        headerTintColor: colors.primaryColor,
        headerShown: false,
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
          headerStyle: {backgroundColor: colors.primaryColor},
          headerTintColor: colors.whiteColor,
        })}
        name="UpdateProfileScreen"
        component={UpdateProfileScreen}
      />
    </HomeStack.Navigator>
  );
}

export default HomeStackNavigator;
