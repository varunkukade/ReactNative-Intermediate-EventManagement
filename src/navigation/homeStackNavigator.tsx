import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AddEventScreen, EventDetailsScreen, HomeScreen} from '../screens/index';
import {colors, fontStyles} from '../utils/appStyles';
import { EachEvent } from '../reduxConfig/slices/eventsSlice';

export type HomeStackParamList = {
  HomeScreen: undefined;
  AddEventScreen: undefined;
  EventDetailsScreen: { eventTitle: string };
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ animation:"slide_from_right", headerTintColor: colors.primaryColor}} initialRouteName="HomeScreen">
      <HomeStack.Screen
        options={{headerShown: false}}
        name="HomeScreen"
        component={HomeScreen}
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
            headerTitle: route.params.eventTitle,
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
    </HomeStack.Navigator>
  );
}

export default HomeStackNavigator;
