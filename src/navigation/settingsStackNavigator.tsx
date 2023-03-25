import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SettingsScreen} from '../screens/index';

type SettingsStackParamList = {
    SettingsScreen: undefined;
};

const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

function SettingsStackNavigator () {
  return (
    <SettingsStack.Navigator screenOptions={{
      headerShown: false
    }} initialRouteName="SettingsScreen">
      <SettingsStack.Screen name="SettingsScreen" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
};

export default SettingsStackNavigator;
