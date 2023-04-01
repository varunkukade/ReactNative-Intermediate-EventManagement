import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {EventJoinersScreen} from '../screens';
import {fontStyles} from '../utils/appStyles';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from './homeStackNavigator';


const TopTab = createMaterialTopTabNavigator();

type EventJoinersTopTabsProps = {
  route: RouteProp<HomeStackParamList, 'EventJoinersTopTab'>
}

const EventJoinersTopTabs = ({route}: EventJoinersTopTabsProps) => {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontSize: 13, fontFamily: fontStyles.semibold},
        tabBarAndroidRipple: {borderless: false},
        lazy: false,
      }}>
      <TopTab.Screen name="All">
        {props => <EventJoinersScreen {...props} type={'all'} route={route} />}
      </TopTab.Screen>
      <TopTab.Screen name="Pending">
        {props => <EventJoinersScreen {...props} type={'pending'} route={route} />}
      </TopTab.Screen>
      <TopTab.Screen name="Completed">
        {props => <EventJoinersScreen {...props} type={'completed'} route={route} />}
      </TopTab.Screen>
    </TopTab.Navigator>
  );
};
export default EventJoinersTopTabs;
