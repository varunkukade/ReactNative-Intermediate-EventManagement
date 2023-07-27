import React, { useEffect } from 'react';
import { Appearance } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackNavigator } from '.';
import AuthStackNavigator, { AuthStackParamList } from './authStackNavigator';
import { NavigatorScreenParams } from '@react-navigation/native';
import { useAppDispatch } from '@/reduxConfig/store';
import { getAsyncStorage } from '@/utils/commonFunctions';
import { setTheme } from '@/reduxConfig/slices/userSlice';
import { screens } from '@/utils/constants';

export type RootStackParamList = {
  HomeStack: undefined;
  AuthStack: undefined | NavigatorScreenParams<AuthStackParamList>;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

function RootStackNavigator() {
  const dispatch = useAppDispatch();
  const colorScheme = Appearance.getColorScheme();

  useEffect(() => {
    const updateTheme = () => {
      getAsyncStorage('theme')
        .then((res) => {
          if (res === 'dark') {
            dispatch(setTheme('dark'));
          } else if (res === 'light') {
            dispatch(setTheme('light'));
          } else {
            //if theme is not stored, fetch theme of system and apply that
            if (colorScheme === 'dark') {
              dispatch(setTheme('dark'));
            } else {
              dispatch(setTheme('light'));
            }
          }
        })
        .catch(() => {
          //if theme is not stored, fetch theme of system and apply that
          if (colorScheme === 'dark') {
            dispatch(setTheme('dark'));
          } else {
            dispatch(setTheme('light'));
          }
        });
    };

    updateTheme();
  }, []);

  return (
    <RootStack.Navigator
      initialRouteName={screens.AuthStack}
      screenOptions={{ animation: 'slide_from_right' }}
    >
      <RootStack.Screen
        options={{ headerShown: false }}
        name={screens.HomeStack}
        component={HomeStackNavigator}
      />
      <RootStack.Screen
        options={{ headerShown: false }}
        name={screens.AuthStack}
        component={AuthStackNavigator}
      />
    </RootStack.Navigator>
  );
}

export default RootStackNavigator;
