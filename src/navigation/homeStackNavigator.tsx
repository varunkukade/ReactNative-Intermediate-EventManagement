import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AddEventScreen, AddPeopleScreen, EventDetailsScreen} from '../screens/index';
import {colors, fontStyles} from '../utils/appStyles';
import EventJoinersTopTabs from './topTabsNavigator';
import { BottomTabNavigator } from '.';

export type HomeStackParamList = {
  BottomTabNavigator: undefined;
  AddEventScreen: undefined;
  EventDetailsScreen: { eventId: string | number[] };
  EventJoinersTopTab: { eventId: string | number[] };
  AddPeopleScreen: { eventId: string | number[] };
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ animation:"slide_from_right", headerTintColor: colors.primaryColor}} initialRouteName="BottomTabNavigator">
      <HomeStack.Screen
        options={{headerShown: false }}
        name="BottomTabNavigator"
        component={BottomTabNavigator}
      />
      <HomeStack.Screen
        options={{
          headerTitle: 'Add New Event',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign:"center",
          headerBackVisible:true,
        }}
        name="AddEventScreen"
        component={AddEventScreen}
      />
      <HomeStack.Screen
        options={({route, navigation}) => (
          {
            headerTitle: "Event details",
            headerShadowVisible: false,
            headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
            headerTitleAlign:"center",
            headerBackVisible:true,
          }
        )
        }
        name="EventDetailsScreen"
        component={EventDetailsScreen}
      />
      <HomeStack.Screen
        options={({route, navigation}) => (
          {
            headerTitle: "Event joiners",
            headerShadowVisible: false,
            headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
            headerTitleAlign:"center",
            headerBackVisible:true,
          }
        )
        }
        name="EventJoinersTopTab"
        component={EventJoinersTopTabs}
      />
      <HomeStack.Screen
        options={({route, navigation}) => (
          {
            headerTitle: "Add People to event",
            headerShadowVisible: false,
            headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
            headerTitleAlign:"center",
            headerBackVisible:true,
          }
        )
        }
        name="AddPeopleScreen"
        component={AddPeopleScreen}
      />
    </HomeStack.Navigator>
  );
}

export default HomeStackNavigator;
