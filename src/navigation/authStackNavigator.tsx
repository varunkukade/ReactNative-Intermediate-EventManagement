import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SignupScreen , SigninScreen} from '../screens/index';
import {colors, fontStyles} from '../utils/appStyles';

export type AuthStackParamList = {
  SignupScreen: undefined;
  SigninScreen: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ animation:"slide_from_right", headerTintColor: colors.primaryColor}} initialRouteName="SignupScreen">
      <AuthStack.Screen
        options={{
          headerTitle: 'Setup Your Profile ✍🏻',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign:"center",
          headerBackVisible:true,
        }}
        name="SignupScreen"
        component={SignupScreen}
      />
      <AuthStack.Screen
        options={({route, navigation}) => (
          {
            headerTitle: "Event details",
            headerShadowVisible: false,
            headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
            headerTitleAlign:"center",
            headerBackVisible:true,
          }
        )
        }
        name="SigninScreen"
        component={SigninScreen}
      />
    </AuthStack.Navigator>
  );
}

export default AuthStackNavigator;
