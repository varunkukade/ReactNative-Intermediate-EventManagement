import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {HomeStackNavigator, SettingsStackNavigator} from './index';

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};

const RootTab = createMaterialBottomTabNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <RootTab.Navigator initialRouteName="Home">
        <RootTab.Screen
          name="Home"
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: () => (
              <MaterialIcons name="home" color={'black'} size={26} />
            ),
          }}
          component={HomeStackNavigator}
        />
        <RootTab.Screen
          name="Settings"
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: () => (
              <MaterialIcons name="settings" color={'black'} size={26} />
            ),
          }}
          component={SettingsStackNavigator}
        />
      </RootTab.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
