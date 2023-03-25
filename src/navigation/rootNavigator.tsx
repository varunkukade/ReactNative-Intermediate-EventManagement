import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {HomeStackNavigator, SettingsStackNavigator} from './index';
import {colors, fontStyles} from '../utils/appStyles';
import {StyleSheet, Text} from 'react-native';

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};

const RootTab = createMaterialBottomTabNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <RootTab.Navigator
        activeColor={colors.primaryColor}
        inactiveColor={colors.greyColor}
        barStyle={{backgroundColor: colors.whiteColor}}
        initialRouteName="Home">
        <RootTab.Screen
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
          component={HomeStackNavigator}
        />
        <RootTab.Screen
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
          component={SettingsStackNavigator}
        />
      </RootTab.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 12.5,
    textAlign: 'center',
    fontFamily: fontStyles.bold,
    fontWeight: 'bold',
  },
});
