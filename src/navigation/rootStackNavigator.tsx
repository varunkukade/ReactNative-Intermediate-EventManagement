import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeStackNavigator } from '.';
import AuthStackNavigator from './authStackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RootStackParamList = {
  HomeStack: undefined;
  AuthStack: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

function RootStackNavigator() {
    const isAuthenticated = async (): Promise<boolean> => {
        try {
          const value = await AsyncStorage.getItem('isAuthenticated')
          if(value !== null) {
            // value previously stored
            if(value === "true") {
                return true
            }
          }return false
        } catch(e) {
          // error reading value
          return false
        }
      }
      
  return (
    <RootStack.Navigator initialRouteName={'AuthStack'} screenOptions={{ animation:"slide_from_right"}}>
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
