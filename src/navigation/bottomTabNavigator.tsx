import React, { useState } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors, fontStyles } from '@/utils/appStyles';
import { StyleSheet, Text } from 'react-native';
import { HomeScreen, SettingsScreen } from '@/screens';
import { useAppSelector } from '@/reduxConfig/store';
import { screens } from '@/utils/constants';

export type BottomTabParamList = {
  Home: undefined;
  Settings: undefined;
};

const BottomTab = createMaterialBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  const [currentTab, setCurrentTab] = useState<keyof BottomTabParamList | ''>(
    '',
  );
  const theme = useAppSelector((state) => state.user.currentUser.theme);

  return (
    <BottomTab.Navigator
      activeColor={colors[theme].textColor}
      inactiveColor={colors[theme].greyColor}
      barStyle={{
        backgroundColor:
          currentTab === screens.Home
            ? colors[theme].lightLavenderColor
            : colors[theme].cardColor,
      }}
      initialRouteName={screens.Home}
    >
      <BottomTab.Screen
        name={screens.Home}
        listeners={{
          tabPress: () => setCurrentTab(screens.Home), // explicit type
        }}
        options={{
          tabBarLabel: <Text style={styles.tabLabel}>Home</Text>,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="home"
              color={
                focused ? colors[theme].primaryColor : colors[theme].greyColor
              }
              size={26}
            />
          ),
        }}
        component={HomeScreen}
      />
      <BottomTab.Screen
        name={screens.Settings}
        listeners={{
          tabPress: () => setCurrentTab(screens.Settings), // explicit type
        }}
        options={{
          tabBarLabel: <Text style={styles.tabLabel}>Settings</Text>,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="settings"
              color={
                focused ? colors[theme].primaryColor : colors[theme].greyColor
              }
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
