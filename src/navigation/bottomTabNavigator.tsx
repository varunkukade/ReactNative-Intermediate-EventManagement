import React, { useState } from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors, fontStyles} from '../utils/appStyles';
import {StyleSheet, Text} from 'react-native';
import { HomeScreen, SettingsScreen } from '../screens';
import { useNavigation, useRoute } from '@react-navigation/native';

export type BottomTabParamList = {
  Home: undefined;
  Settings: undefined;
};

const BottomTab = createMaterialBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  const [currentTab, setCurrentTab] = useState<"Home" | "Settings" | "">("")

  return (
      <BottomTab.Navigator
        activeColor={colors.primaryColor}
        inactiveColor={colors.greyColor}
        barStyle={{backgroundColor: currentTab === "Home" ? colors.lightLavenderColor: colors.whiteColor}}
        initialRouteName="Home">
        <BottomTab.Screen
          name="Home"
          listeners={{
            tabPress: (e) => setCurrentTab("Home"), // explicit type
          }}
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
          listeners={{
            tabPress: (e) => setCurrentTab("Settings"), // explicit type
          }}
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
