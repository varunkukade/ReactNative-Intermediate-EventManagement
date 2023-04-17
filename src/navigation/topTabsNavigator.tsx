import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {EventJoinersScreen} from '../screens';
import {colors, fontStyles} from '../utils/appStyles';


export type TopTabParamList = {
  All: undefined;
  Pending: undefined;
  Completed: undefined;
};

const TopTab = createMaterialTopTabNavigator<TopTabParamList>();

const EventJoinersTopTabs = () => {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontSize: 13, fontFamily: fontStyles.semibold},
        tabBarAndroidRipple: {borderless: false},
        tabBarIndicatorStyle: { backgroundColor: colors.primaryColor},
        lazy: false,
      }}>
      <TopTab.Screen name="All">
        {props => <EventJoinersScreen {...props} type={'all'} />}
      </TopTab.Screen>
      <TopTab.Screen name="Pending">
        {props => <EventJoinersScreen {...props} type={'pending'} />}
      </TopTab.Screen>
      <TopTab.Screen name="Completed">
        {props => <EventJoinersScreen {...props} type={'completed'} />}
      </TopTab.Screen>
    </TopTab.Navigator>
  );
};
export default EventJoinersTopTabs;
