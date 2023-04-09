import React from 'react';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {SignupScreen, SigninScreen, ForgotPasswordScreen} from '../screens/index';
import {colors, fontStyles} from '../utils/appStyles';
import {TextComponent} from '../reusables';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export type AuthStackParamList = {
  SignupScreen: undefined;
  SigninScreen: undefined;
  ForgotPasswordScreen: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function AuthStackNavigator() {
  //navigation state
  const navigation: NativeStackNavigationProp<
    AuthStackParamList,
    'SignupScreen'
  > = useNavigation();

  const getSigninNavigator = () => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('SigninScreen')}
        style={{
          backgroundColor: colors.lavenderColor,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 15,
          paddingHorizontal: 15,
          paddingVertical: 10,
        }}>
        <TextComponent
          style={{fontSize: 16, color: colors.primaryColor}}
          weight="bold">
          {' '}
          Sign-In
        </TextComponent>
      </TouchableOpacity>
    );
  };
  return (
    <AuthStack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
        headerTintColor: colors.primaryColor,
      }}
      initialRouteName="SignupScreen">
      <AuthStack.Screen
        options={{
          headerTitle: 'Setup Your Profile ✍🏻',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign: 'left',
          headerBackVisible: true,
          headerRight: () => getSigninNavigator(),
          headerStyle:{backgroundColor: colors.primaryColor},
          headerTintColor: colors.whiteColor
        }}
        name="SignupScreen"
        component={SignupScreen}
      />
      <AuthStack.Screen
        options={({route, navigation}) => ({
            headerTitle: 'Forgot Password',
            headerShadowVisible: false,
            headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
            headerTitleAlign: 'center',
            headerBackVisible: true,
            headerStyle:{backgroundColor: colors.primaryColor},
            headerTintColor: colors.whiteColor
        })}
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
      <AuthStack.Screen
        options={({route, navigation}) => ({
          headerTitle: 'Login',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle:{backgroundColor: colors.primaryColor},
          headerTintColor: colors.whiteColor
        })}
        name="SigninScreen"
        component={SigninScreen}
      />
    </AuthStack.Navigator>
  );
}

export default AuthStackNavigator;
