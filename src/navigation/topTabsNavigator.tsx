import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {EventJoinersScreen} from '../screens';
import {fontStyles} from '../utils/appStyles';

const TopTab = createMaterialTopTabNavigator();

const EventJoinersTopTabs = () => {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontSize: 13, fontFamily: fontStyles.semibold},
        tabBarAndroidRipple: {borderless: false},
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
