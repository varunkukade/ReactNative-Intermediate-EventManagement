import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { EventJoinersScreen } from '../screens';

const TopTab = createMaterialTopTabNavigator();

const EventJoinersTopTabs = () => {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="All" component={EventJoinersScreen} />
      <TopTab.Screen name="Pending" component={EventJoinersScreen} />
      <TopTab.Screen name="Completed" component={EventJoinersScreen} />
    </TopTab.Navigator>
  );
}
export default EventJoinersTopTabs;