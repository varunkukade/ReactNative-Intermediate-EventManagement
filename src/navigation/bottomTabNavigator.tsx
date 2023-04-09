import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors, fontStyles} from '../utils/appStyles';
import {StyleSheet, Text} from 'react-native';
import { HomeScreen, SettingsScreen } from '../screens';

export type BottomTabParamList = {
  Home: undefined;
  Settings: undefined;
};

const BottomTab = createMaterialBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  return (
      <BottomTab.Navigator
        activeColor={colors.primaryColor}
        inactiveColor={colors.greyColor}
        barStyle={{backgroundColor: colors.lightLavenderColor}}
        initialRouteName="Home">
        <BottomTab.Screen
          name="Home"
          options={{
            tabBarLabel: <Text style={styles.tabLabel}>Home</Text>,
            tabBarIcon: ({focused}) => (
              <MaterialIcons
                name="home"
                color={focused ? colors.primaryColor : colors.greyColor}
                size={26}
              />
            ),
          }}
          component={HomeScreen}
        />
        <BottomTab.Screen
          name="Settings"
          options={{
            tabBarLabel: <Text style={styles.tabLabel}>Settings</Text>,
            tabBarIcon: ({focused}) => (
              <MaterialIcons
                name="settings"
                color={focused ? colors.primaryColor : colors.greyColor}
                size={26}
              />
            ),
          }}
          component={SettingsScreen}
        />
      </BottomTab.Navigator>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 12.5,
    textAlign: 'center',
    fontFamily: fontStyles.bold,
    fontWeight: 'bold',
  },
});
