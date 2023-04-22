import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {EventJoinersScreen} from '../screens';
import {colors, fontStyles} from '../utils/appStyles';
import { useAppSelector } from '../reduxConfig/store';


export type TopTabParamList = {
  All: undefined;
  Pending: undefined;
  Completed: undefined;
};

const TopTab = createMaterialTopTabNavigator<TopTabParamList>();

const EventJoinersTopTabs = () => {
  const theme = useAppSelector(state => state.user.currentUser.theme)

  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontSize: 13, fontFamily: fontStyles.semibold, color: colors[theme].textColor},
        tabBarAndroidRipple: {borderless: false},
        tabBarIndicatorStyle: { backgroundColor: colors[theme].greyColor},
        tabBarStyle: {backgroundColor:  colors[theme].lightLavenderColor},
        tabBarScrollEnabled: false,
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
