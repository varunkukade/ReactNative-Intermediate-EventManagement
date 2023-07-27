import React from 'react';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {
  SignupScreen,
  SigninScreen,
  ForgotPasswordScreen,
  WelcomeScreen,
} from '@/screens/index';
import {colors, fontStyles} from '@/utils/appStyles';
import {TextComponent} from '@/reusables';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector} from '@/reduxConfig/store';

export type AuthStackParamList = {
  SignupScreen: undefined;
  SigninScreen: undefined;
  ForgotPasswordScreen: undefined | {isResetPassword: boolean};
  WelcomeScreen: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function AuthStackNavigator() {
  //navigation state
  const navigation: NativeStackNavigationProp<
    AuthStackParamList,
    'SignupScreen'
  > = useNavigation();
  const theme = useAppSelector(state => state.user.currentUser.theme);

  const getSigninNavigator = () => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('SigninScreen')}
        style={{
          backgroundColor: colors[theme].lavenderColor,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 15,
          paddingHorizontal: 13,
          paddingVertical: 8,
        }}>
        <TextComponent
          style={{fontSize: 14, color: colors[theme].textColor}}
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
        headerTintColor: colors[theme].primaryColor,
      }}
      initialRouteName="WelcomeScreen">
      <AuthStack.Screen
        options={({route, navigation}) => ({
          headerShown: false,
        })}
        name="WelcomeScreen"
        component={WelcomeScreen}
      />
      <AuthStack.Screen
        options={{
          headerTitle: 'Setup Your Profile ✍🏻',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 17},
          headerTitleAlign: 'left',
          headerBackVisible: true,
          headerRight: () => getSigninNavigator(),
          headerStyle: {backgroundColor: colors[theme].primaryColor},
          headerTintColor: colors[theme].whiteColor,
        }}
        name="SignupScreen"
        component={SignupScreen}
      />
      <AuthStack.Screen
        options={({route, navigation}) => ({
          headerTitle: route.params?.isResetPassword
            ? 'Reset Password'
            : 'Forgot Password',
          headerShadowVisible: false,
          headerTitleStyle: {fontFamily: fontStyles.bold, fontSize: 20},
          headerTitleAlign: 'center',
          headerBackVisible: true,
          headerStyle: {backgroundColor: colors[theme].primaryColor},
          headerTintColor: colors[theme].whiteColor,
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
          headerStyle: {backgroundColor: colors[theme].primaryColor},
          headerTintColor: colors[theme].whiteColor,
        })}
        name="SigninScreen"
        component={SigninScreen}
      />
    </AuthStack.Navigator>
  );
}

export default AuthStackNavigator;
