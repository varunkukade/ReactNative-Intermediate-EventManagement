import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeStackNavigator } from '.';
import AuthStackNavigator from './authStackNavigator';

export type RootStackParamList = {
  HomeStack: undefined;
  AuthStack: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

function RootStackNavigator() {
  return (
    <RootStack.Navigator initialRouteName='AuthStack' screenOptions={{ animation:"slide_from_right"}}>
      <RootStack.Screen
        options={{headerShown: false }}
        name="HomeStack"
        component={HomeStackNavigator}
      />
      <RootStack.Screen
        options={{headerShown: false }}
        name="AuthStack"
        component={AuthStackNavigator}
      />
    </RootStack.Navigator>
  );
}

export default RootStackNavigator;
